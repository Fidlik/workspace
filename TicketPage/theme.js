const THEME_KEY = "cinedesk-theme";

function readSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
}

function preferredTheme() {
  const saved = readSavedTheme();
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore storage failures
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    btn.textContent = nextTheme === "dark" ? "Dark" : "Light";
    btn.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    btn.setAttribute("title", `Switch to ${nextTheme} theme`);
  }
}

(function initThemeEarly() {
  const theme = preferredTheme();
  applyTheme(theme);
})();

window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    persistTheme(next);
    applyTheme(next);
  });
});