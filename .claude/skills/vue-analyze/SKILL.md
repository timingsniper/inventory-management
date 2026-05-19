---
name: vue-analyze
description: Analyzes Vue 3 component structure and suggests optimizations for performance and code reuse. Use when reviewing .vue files for quality, extracting composables, or identifying anti-patterns.
---

# Vue Component Structure Analyzer

This skill provides a systematic process for analyzing Vue 3 components in `client/src/views/` and `client/src/components/` for performance issues and code reuse opportunities. It produces a prioritized, actionable report with file:line references.

## Analysis Process

Run through each phase in order, then compile findings into the output format below.

---

## Phase 1: Inventory Components

1. List all `.vue` files in `client/src/`:
   ```bash
   find client/src -name "*.vue" | sort
   ```
2. For each file, note its line count (`wc -l`). Files over **300 lines** are candidates for decomposition; over **500 lines** are high-priority.
3. Read each file fully before analyzing — grep alone misses context.

---

## Phase 2: Performance Anti-Patterns

Check every component for these issues. Flag each with severity: **HIGH / MEDIUM / LOW**.

### 2a. Methods used where `computed` should be

A function that derives a value from reactive state and is called in the template **must** be `computed`, not a method. Methods re-run on every render; `computed` caches until dependencies change.

**Detect**: grep for `methods:` (Options API) or functions defined in `<script setup>` that are called in the template without arguments and whose body only reads reactive refs/props.

**Bad:**

```js
function totalRevenue() {
  return orders.value.reduce((s, o) => s + o.total_value, 0);
}
```

**Good:**

```js
const totalRevenue = computed(() =>
  orders.value.reduce((s, o) => s + o.total_value, 0),
);
```

### 2b. Expensive operations inside `v-for` templates

Any method call, filter, or sort inside a `v-for` expression runs on every render for every item.

**Detect**: grep for `v-for=".*in .*filter\|v-for=".*in .*sort\|v-for=".*in .*map`.

**Fix**: Move the derived array into a `computed` ref.

### 2c. Missing or non-unique `v-for` keys

`:key="index"` defeats Vue's virtual DOM reconciliation, causing unnecessary re-renders and broken animations.

**Detect**: grep for `:key="index"` or `key="index"`.

**Fix**: Use a stable unique identifier from the item (e.g., `:key="item.sku"`, `:key="order.id"`).

Per CLAUDE.md: "Use unique keys in v-for (not `index`) — use `sku`, `month`, etc."

### 2d. `v-if` + `v-for` on the same element

Vue evaluates `v-if` after `v-for`, meaning the entire list is iterated before items are filtered out.

**Detect**: grep for lines where both `v-if` and `v-for` appear on the same element tag.

**Fix**: Wrap the `v-for` in a `<template>` tag and put `v-if` on that, or pre-filter in a `computed`.

### 2e. Unnecessary `deep: true` watchers

`watch(ref, cb, { deep: true })` recursively traverses the entire object on every change. Use it only when you genuinely need to react to nested mutations.

**Detect**: grep for `deep: true`.

**Review each occurrence**: Does the watcher actually need to observe nested property changes, or would `watchEffect` or watching a specific nested ref suffice?

### 2f. Missing watcher cleanup / `onUnmounted`

Event listeners, intervals, or external subscriptions set up in `onMounted` must be torn down in `onUnmounted` or via the cleanup callback of `watchEffect`.

**Detect**: grep for `addEventListener\|setInterval\|setTimeout` without a paired `removeEventListener\|clearInterval\|clearTimeout`.

### 2g. `shallowRef` opportunity for large non-reactive objects

Large arrays/objects where only the reference changes (replaced wholesale after an API call) should use `shallowRef` instead of `ref` to avoid deep reactivity tracking overhead.

**Detect**: Look for `ref([])` or `ref({})` that are only ever replaced (`.value = newData`), never mutated in-place.

**Fix**: `const items = shallowRef([])` — safe when you always do `items.value = response` rather than `items.value.push(...)`.

---

## Phase 3: Code Reuse Opportunities

### 3a. Identify composable extraction candidates

A composable is a function in `client/src/composables/` that encapsulates a reusable reactive concern (naming convention: `use<Name>.js`).

**Extract when** you see the same pattern in ≥2 components:

| Pattern                                                                                       | Composable name            |
| --------------------------------------------------------------------------------------------- | -------------------------- |
| `loading = ref(true)`, `error = ref(null)`, try/catch fetch, `onMounted` call                 | `useFetch` or `useApiData` |
| Filter state (`selectedPeriod`, `selectedWarehouse`, `selectedCategory`) + `watch` to refetch | `useFilters`               |
| Currency formatting function defined inline                                                   | `useCurrency`              |
| Date formatting / month parsing                                                               | `useDate`                  |
| Modal open/close state + selected item ref                                                    | `useModal`                 |

**How to find duplicates:**

```bash
# Find similar ref patterns across files
grep -rn "const loading = ref\|const error = ref" client/src/views/
grep -rn "selectedPeriod\|selectedWarehouse\|selectedCategory" client/src/views/
grep -rn "formatCurrency\|formatDate\|formatNumber" client/src/views/
```

### 3b. Identify sub-component extraction candidates

A section of a template is a sub-component candidate when it:

- Has its own local state or computed values
- Appears in multiple places (even slightly varied)
- Exceeds ~50 lines of template HTML
- Is a self-contained UI unit (a card, a chart, a table)

Look at the largest files first (Dashboard.vue at 1273 lines is a strong candidate). Identify named sections in the template by their wrapping `<div class="...">` or comment headers.

### 3c. Inline logic in templates

Business logic (conditionals, calculations) embedded in template expressions should be moved to `computed` or helper functions.

**Detect**: Template expressions longer than ~30 characters, ternary chains, or arithmetic in `:style`/`:class` bindings.

**Example** (from this codebase — look for patterns like this):

```html
<!-- BAD: inline arithmetic in template -->
:style="{ width: (cat.value / maxCategoryValue * 100) + '%' }"

<!-- GOOD: computed property -->
const barWidth = computed(() => (cat.value / maxCategoryValue * 100)) :style="{
width: barWidth + '%' }"
```

---

## Phase 4: Vue 3 Best Practices Check

### 4a. `<script setup>` usage

All components should use `<script setup>` (Composition API syntactic sugar). Flag any component still using Options API (`export default { data(), methods: {} }`).

### 4b. Props definition

In `<script setup>`, props should be defined with `defineProps()`. Check that all props are explicitly typed.

### 4c. Emits definition

Custom events should be declared with `defineEmits()` for IDE support and documentation.

### 4d. Async component loading

Components that are expensive and not needed on initial render should use `defineAsyncComponent`:

```js
const HeavyChart = defineAsyncComponent(() => import("./HeavyChart.vue"));
```

---

## Output Format

Structure your findings as follows:

````
## Vue Component Analysis Report

### Summary
- Files analyzed: N
- High-severity findings: N
- Medium-severity findings: N
- Low-severity findings: N
- Composable extraction opportunities: N
- Sub-component extraction opportunities: N

---

### HIGH Priority

#### [File] `client/src/views/ComponentName.vue`
**Issue**: [Anti-pattern name]
**Location**: Line N–M
**Problem**: [One sentence explaining why this hurts performance or maintainability]
**Fix**:
```js
// Before
...
// After
...
````

---

### MEDIUM Priority

[Same format]

---

### LOW Priority

[Same format]

---

### Composable Extraction Opportunities

#### `useFilters` composable

**Affects**: Dashboard.vue, Spending.vue, Orders.vue (and N others)
**Current duplication**: [Describe what's repeated]
**Proposed composable**:

```js
// client/src/composables/useFilters.js
export function useFilters() {
  const selectedPeriod = ref("all");
  const selectedWarehouse = ref("All");
  const selectedCategory = ref("All");
  // ... watch + emit pattern
  return { selectedPeriod, selectedWarehouse, selectedCategory };
}
```

---

### Sub-Component Extraction Opportunities

#### `<MetricCard>` component

**In**: Dashboard.vue lines N–M (repeated N times)
**Rationale**: [Why it makes sense as a component]
**Proposed interface**:

```vue
<MetricCard :title="'Revenue'" :value="totalRevenue" :trend="+5.2" />
```

---

### Quick Wins (can be applied immediately without refactoring)

1. Replace `:key="index"` with `:key="item.sku"` in `Dashboard.vue:147`
2. ...

```

---

## Working Principles

1. **Always provide file:line references** — vague suggestions are not actionable.
2. **Check before assuming** — read the actual file before flagging an issue; grep output can be misleading.
3. **Prioritize by impact** — a 1273-line monolith with duplicated API-fetch logic is more important than a minor template expression.
4. **Respect existing patterns** — if a pattern is consistent and intentional (e.g., all views define their own filter state), suggest a composable rather than demanding an immediate rewrite.
5. **Quick wins first** — always end with a list of fixes that take <5 minutes and require no architectural decisions.
6. **Delegate to vue-expert** — per CLAUDE.md rules, any actual `.vue` file edits must be delegated to the `vue-expert` subagent. This skill produces the analysis report; vue-expert implements the fixes.
```
