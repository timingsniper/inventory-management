import { ref, watch } from "vue";

const STORAGE_KEY = "darkMode";

// Read initial value: localStorage first, then system preference as fallback
function getInitialDark() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === "true";
  }
  // Fall back to OS-level preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const isDark = ref(getInitialDark());

// Apply or remove the 'dark' class on <html> whenever isDark changes
watch(
  isDark,
  (dark) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, String(dark));
  },
  { immediate: true },
);

function toggleDark() {
  isDark.value = !isDark.value;
}

export function useDarkMode() {
  return { isDark, toggleDark };
}
