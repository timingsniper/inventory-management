<template>
  <button
    class="dark-mode-toggle"
    @click="toggleDark"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon: shown when dark mode is active -->
    <svg
      v-if="isDark"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="1.5" />
      <line
        x1="10"
        y1="1.5"
        x2="10"
        y2="3.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="10"
        y1="16.5"
        x2="10"
        y2="18.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="1.5"
        y1="10"
        x2="3.5"
        y2="10"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="16.5"
        y1="10"
        x2="18.5"
        y2="10"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="4.1"
        y1="4.1"
        x2="5.5"
        y2="5.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="14.5"
        y1="14.5"
        x2="15.9"
        y2="15.9"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="14.5"
        y1="5.5"
        x2="15.9"
        y2="4.1"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <line
        x1="4.1"
        y1="15.9"
        x2="5.5"
        y2="14.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
    <!-- Moon icon: shown when light mode is active -->
    <svg
      v-else
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 12.2A7 7 0 0 1 7.8 3a7.1 7.1 0 1 0 9.2 9.2z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script setup>
import { useDarkMode } from "../composables/useDarkMode";

const { isDark, toggleDark } = useDarkMode();
</script>

<style scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.dark-mode-toggle:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Dark mode styles applied when html.dark is present */
:global(html.dark) .dark-mode-toggle {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

:global(html.dark) .dark-mode-toggle:hover {
  background: #263044;
}
</style>
