/**
 * The colours of the dashboard that the reader sets by code.
 *
 * Five values are open: the accent, the ground the evening theme sits on,
 * the top bar, the side bar, and the colour that marks a button as chosen.
 * Everything else on the page is the system greyscale and is not up for
 * choosing.
 *
 * Each is written onto <html> as custom properties, together with the
 * variants derived from it — a hover step, a soft wash, the ink that reads on
 * top of it, and, for the ground, the surfaces that sit above it. Deriving
 * them here rather than asking for six more codes keeps the evening theme
 * coherent whatever ground is chosen.
 */

const STORAGE_KEY = "shahm:colours";

export const DEFAULT_COLOURS = {
  accent: "#007aff",
  groundDark: "#122d22",
  chromeDark: "#10281c",
  sidebarDark: "#16382a",
  marking: "#ffffff",
};

export const COLOUR_FIELDS = [
  "accent",
  "groundDark",
  "chromeDark",
  "sidebarDark",
  "marking",
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Accepts #abc and #aabbcc, with or without the hash, in any case. */
export function normaliseHex(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (!HEX.test(withHash)) return null;

  const body = withHash.slice(1);
  const full =
    body.length === 3
      ? body.split("").map((character) => character + character).join("")
      : body;

  return `#${full.toLowerCase()}`;
}

function channels(hex) {
  const body = normaliseHex(hex).slice(1);
  return [
    parseInt(body.slice(0, 2), 16),
    parseInt(body.slice(2, 4), 16),
    parseInt(body.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]) {
  const pair = (value) => Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, "0");
  return `#${pair(r)}${pair(g)}${pair(b)}`;
}

/** Moves a colour towards white (ratio > 0) or black (ratio < 0). */
export function shade(hex, ratio) {
  const target = ratio >= 0 ? 255 : 0;
  const amount = Math.abs(ratio);
  return toHex(channels(hex).map((value) => value + (target - value) * amount));
}

export function withAlpha(hex, alpha) {
  const [r, g, b] = channels(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Perceived brightness, used for a quick light-or-dark decision. */
export function luminance(hex) {
  const [r, g, b] = channels(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Relative luminance as the contrast formula defines it. */
function relativeLuminance(hex) {
  const [r, g, b] = channels(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The contrast between two colours, 1 for identical and 21 for black on
 * white. Text needs 4.5, large text and controls need 3.
 */
export function contrastRatio(a, b) {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The ink that goes on a colour.
 *
 * White unless dark ink actually clears the ratio text needs, which keeps the
 * convention for a saturated mid-tone — white on blue — while still turning
 * dark on yellow, where white would be unreadable.
 */
export function inkOn(hex) {
  const dark = contrastRatio(hex, "#1d1d1f");
  const light = contrastRatio(hex, "#ffffff");

  return dark >= 4.5 && dark > light ? "#1d1d1f" : "#ffffff";
}

/**
 * Lightens or darkens `ink` against `ground` until it clears `target`.
 *
 * A colour code chosen by hand is not obliged to be legible; this is what
 * keeps a dim bar from taking dim text with it. It stops at pure white or
 * pure black, so it always terminates.
 */
export function readableOn(ground, ink, target) {
  const towardsLight = luminance(ground) < 0.5;
  let candidate = ink;

  for (let step = 0; step < 24; step += 1) {
    if (contrastRatio(ground, candidate) >= target) return candidate;
    candidate = shade(candidate, towardsLight ? 0.06 : -0.06);
  }

  return towardsLight ? "#ffffff" : "#000000";
}

/** Hue and saturation of a colour, used to tint the day neutrals. */
function hue(hex) {
  const [r, g, b] = channels(hex).map((value) => value / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return 0;

  let value;
  if (max === r) value = ((g - b) / delta) % 6;
  else if (max === g) value = (b - r) / delta + 2;
  else value = (r - g) / delta + 4;

  return (value * 60 + 360) % 360;
}

/** A colour at a given hue, kept close to grey. */
function tinted(hueDegrees, saturation, lightness) {
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((hueDegrees / 60) % 2) - 1));
  const m = lightness - c / 2;
  const [r, g, b] =
    hueDegrees < 60 ? [c, x, 0] :
    hueDegrees < 120 ? [x, c, 0] :
    hueDegrees < 180 ? [0, c, x] :
    hueDegrees < 240 ? [0, x, c] :
    hueDegrees < 300 ? [x, 0, c] : [c, 0, x];

  return toHex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

export function readColours() {
  let stored = {};

  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    stored = {};
  }

  const colours = { ...DEFAULT_COLOURS };

  COLOUR_FIELDS.forEach((field) => {
    const value = normaliseHex(stored[field]);
    if (value) colours[field] = value;
  });

  return colours;
}

export function saveColours(colours) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colours));
  } catch {
    // A browser that refuses storage still honours the choice for this tab.
  }
}

export function applyColours(colours) {
  const { accent, groundDark, chromeDark, sidebarDark, marking } = {
    ...DEFAULT_COLOURS,
    ...colours,
  };
  const root = document.documentElement;
  const set = (name, value) => root.style.setProperty(name, value);

  // ── the day neutrals, tinted by the bars ────────────────────────────────
  // A pure grey page under a green bar reads as two designs. The day
  // greyscale takes the hue of the side bar at a saturation low enough to
  // still be grey, which is what makes the two ends belong together.
  const barHue = hue(sidebarDark);

  set("--t-ground-day", tinted(barHue, 0.10, 0.965));
  set("--t-ground-deep-day", tinted(barHue, 0.10, 0.93));
  set("--t-surface-sunk-day", tinted(barHue, 0.09, 0.975));
  set("--t-border-day", withAlpha(tinted(barHue, 0.16, 0.35), 0.14));
  set("--t-border-strong-day", withAlpha(tinted(barHue, 0.16, 0.3), 0.26));
  set("--t-divider-day", withAlpha(tinted(barHue, 0.16, 0.35), 0.10));
  set("--t-hover-day", withAlpha(tinted(barHue, 0.2, 0.28), 0.05));
  set("--t-active-day", withAlpha(tinted(barHue, 0.2, 0.28), 0.09));

  // ── the accent, day and evening ──────────────────────────────────────────
  set("--t-accent-day", accent);
  set("--t-accent-night", shade(accent, 0.18));
  set("--t-accent-hover-day", shade(accent, -0.14));
  set("--t-accent-hover-night", shade(accent, 0.34));
  set("--t-accent-soft-day", withAlpha(accent, 0.12));
  set("--t-accent-soft-night", withAlpha(shade(accent, 0.18), 0.22));
  set("--t-accent-ink-day", inkOn(accent));
  set("--t-accent-ink-night", inkOn(shade(accent, 0.18)));

  // ── the evening ground, and the surfaces derived from it ─────────────────
  set("--t-ground-night", groundDark);
  set("--t-ground-deep-night", shade(groundDark, -0.4));
  set("--t-surface-night", shade(groundDark, 0.07));
  set("--t-surface-sunk-night", shade(groundDark, -0.18));
  set("--t-surface-raised-night", shade(groundDark, 0.14));
  // Glass inside the page, as opposed to the chrome's own glass below.
  set("--t-glass-night", withAlpha(shade(groundDark, 0.07), 0.72));
  set("--t-glass-strong-night", withAlpha(groundDark, 0.9));
  // ── the chrome: the top bar, the sidebar and the footer ─────────────────
  // The chrome keeps its own colour in both appearances. It is the frame the
  // page floats in, and the marking colour is chosen to read on it, so it does
  // not turn white by day.
  set("--t-chrome", chromeDark);
  set("--t-chrome-glass", withAlpha(chromeDark, 0.82));
  set("--t-chrome-glass-strong", withAlpha(chromeDark, 0.94));
  set("--t-chrome-border", withAlpha(shade(chromeDark, 0.65), 0.20));
  set("--t-chrome-hover", withAlpha(shade(chromeDark, 0.9), 0.09));
  // Ink on the bars is lifted until it actually clears the contrast it needs
  // against the darker of the two, whatever codes were entered.
  const barGround = luminance(chromeDark) < luminance(sidebarDark) ? chromeDark : sidebarDark;

  set("--t-chrome-ink", readableOn(barGround, shade(barGround, 0.9), 7));
  set("--t-chrome-ink-secondary", readableOn(barGround, shade(barGround, 0.75), 4.5));
  set("--t-chrome-ink-muted", readableOn(barGround, shade(barGround, 0.55), 3));
  set("--t-chrome-active", withAlpha(shade(chromeDark, 0.95), 0.12));
  set("--t-chrome-border-strong", withAlpha(shade(chromeDark, 0.7), 0.34));

  // ── the side bar, which carries its own colour ──────────────────────────
  set("--t-sidebar", sidebarDark);
  set("--t-sidebar-glass", withAlpha(sidebarDark, 0.82));

  // ── the colour that marks a control as chosen ────────────────────────────
  set("--t-marking", marking);
  set("--t-marking-soft", withAlpha(marking, 0.16));
  set("--t-marking-ink", inkOn(marking));
}

export function initColours() {
  const colours = readColours();
  applyColours(colours);
  return colours;
}
