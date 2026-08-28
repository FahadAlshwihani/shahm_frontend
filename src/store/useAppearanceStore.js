import { create } from "zustand";

import {
  DEFAULT_COLOURS,
  applyColours,
  normaliseHex,
  readColours,
  saveColours,
} from "../utils/appearanceColors";
import { applyTheme, readTheme, saveTheme } from "../utils/theme";

/**
 * One place holds the appearance, because more than one control changes it.
 *
 * The control in the chrome and the panel in settings both write the theme;
 * when each kept its own state the one that was not clicked went on showing
 * the previous choice.
 */
export const useAppearanceStore = create((set, get) => ({
  theme: readTheme(),
  colours: readColours(),

  setTheme: (theme) => {
    applyTheme(theme);
    saveTheme(theme);
    set({ theme });
  },

  /**
   * Sets one colour from a code. A code that is not a colour is ignored
   * rather than clearing the value, so a half-typed `#12` leaves the page
   * as it was until the code is complete.
   */
  setColour: (field, value) => {
    const hex = normaliseHex(value);

    if (!hex || !(field in DEFAULT_COLOURS)) return false;

    const colours = { ...get().colours, [field]: hex };

    applyColours(colours);
    saveColours(colours);
    set({ colours });

    return true;
  },

  resetColours: () => {
    const colours = { ...DEFAULT_COLOURS };

    applyColours(colours);
    saveColours(colours);
    set({ colours });
  },
}));
