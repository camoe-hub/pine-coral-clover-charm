const KEY = "rivetcare-theme";

export type ThemeChoice = "light" | "dark" | "system";

export function themeChoice(): ThemeChoice {
  try {
    const value = localStorage.getItem(KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* private mode can block storage */
  }
  return "system";
}

export function appearanceDark(choice: ThemeChoice = themeChoice()) {
  if (choice === "dark") return true;
  if (choice === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(choice: ThemeChoice = themeChoice()) {
  const dark = appearanceDark(choice);
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#152A6A");
  return dark;
}

const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function setTheme(choice: "light" | "dark") {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    /* the class still changes for this visit */
  }
  applyTheme(choice);
  notify();
}

export function toggleTheme() {
  setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
}
