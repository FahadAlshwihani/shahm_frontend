import { useAppearanceStore } from "../store/useAppearanceStore";

/** Reads and writes the appearance setting from the shared store. */
export default function useTheme() {
  const theme = useAppearanceStore((state) => state.theme);
  const setTheme = useAppearanceStore((state) => state.setTheme);

  return [theme, setTheme];
}
