/**
 * The appearance setting: day, evening, or follow the system.
 *
 * "system" is the default and stamps nothing on the document, so the CSS
 * falls through to prefers-color-scheme. An explicit choice stamps
 * data-theme on <html>, which beats the system preference in both
 * directions.
 */

const STORAGE_KEY = "shahm:theme";

export const THEMES = ["system", "light", "dark"];

export function readTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // A browser that refuses storage still honours the choice for this tab.
  }
}

export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark" || theme === "light") root.setAttribute("data-theme", theme);
  else root.removeAttribute("data-theme");
}

/**
 * Called before the first render so the page never paints the wrong theme
 * and then corrects itself.
 */
export function initTheme() {
  const theme = readTheme();
  applyTheme(theme);
  return theme;
}
