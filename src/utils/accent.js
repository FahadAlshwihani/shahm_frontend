/**
 * The one colour on the dashboard that is not neutral.
 *
 * Everything else is the system greyscale; this is the single hue the reader
 * chooses, the way macOS offers an accent colour. The choice is written onto
 * <html> as custom properties, so no component needs to know about it: the
 * theme reads --t-accent-*-day by day and --t-accent-*-night in the evening.
 */

const STORAGE_KEY = "shahm:accent";

export const DEFAULT_ACCENT = "blue";

/**
 * Day and evening values per accent, following the system palette. `ink` is
 * the text colour that sits on top of the accent — yellow needs dark text.
 */
export const ACCENTS = {
  blue:     { day: "#007aff", night: "#0a84ff", hoverDay: "#0062d6", hoverNight: "#409cff", ink: "#ffffff" },
  purple:   { day: "#af52de", night: "#bf5af2", hoverDay: "#9740c0", hoverNight: "#cf7cf5", ink: "#ffffff" },
  pink:     { day: "#ff2d55", night: "#ff375f", hoverDay: "#e01c43", hoverNight: "#ff5c7e", ink: "#ffffff" },
  red:      { day: "#ff3b30", night: "#ff453a", hoverDay: "#dc2b21", hoverNight: "#ff6961", ink: "#ffffff" },
  orange:   { day: "#ff9500", night: "#ff9f0a", hoverDay: "#db8000", hoverNight: "#ffb340", ink: "#ffffff" },
  yellow:   { day: "#ffcc00", night: "#ffd60a", hoverDay: "#e0b400", hoverNight: "#ffe14d", ink: "#1d1d1f" },
  green:    { day: "#34c759", night: "#30d158", hoverDay: "#28a748", hoverNight: "#5ede7f", ink: "#ffffff" },
  graphite: { day: "#6e6e73", night: "#98989d", hoverDay: "#5a5a5f", hoverNight: "#b0b0b5", ink: "#ffffff" },
};

export const ACCENT_NAMES = Object.keys(ACCENTS);

function softened(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function readAccent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ACCENT_NAMES.includes(stored) ? stored : DEFAULT_ACCENT;
  } catch {
    return DEFAULT_ACCENT;
  }
}

export function saveAccent(name) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // A browser that refuses storage still honours the choice for this tab.
  }
}

export function applyAccent(name) {
  const accent = ACCENTS[name] || ACCENTS[DEFAULT_ACCENT];
  const root = document.documentElement;

  root.style.setProperty("--t-accent-day", accent.day);
  root.style.setProperty("--t-accent-night", accent.night);
  root.style.setProperty("--t-accent-hover-day", accent.hoverDay);
  root.style.setProperty("--t-accent-hover-night", accent.hoverNight);
  root.style.setProperty("--t-accent-soft-day", softened(accent.day, 0.12));
  root.style.setProperty("--t-accent-soft-night", softened(accent.night, 0.22));
  root.style.setProperty("--t-accent-ink-day", accent.ink);
  root.style.setProperty("--t-accent-ink-night", accent.ink);
}

export function initAccent() {
  const name = readAccent();
  applyAccent(name);
  return name;
}
