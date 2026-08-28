import { create } from "zustand";

import { applyAccent, readAccent, saveAccent } from "../utils/accent";
import { applyTheme, readTheme, saveTheme } from "../utils/theme";

/**
 * One place holds the appearance, because more than one control changes it.
 *
 * The control in the chrome and the panel in settings both write the theme;
 * when each kept its own state the one that was not clicked went on showing
 * the previous choice.
 */
export const useAppearanceStore = create((set) => ({
  theme: readTheme(),
  accent: readAccent(),

  setTheme: (theme) => {
    applyTheme(theme);
    saveTheme(theme);
    set({ theme });
  },

  setAccent: (accent) => {
    applyAccent(accent);
    saveAccent(accent);
    set({ accent });
  },
}));
