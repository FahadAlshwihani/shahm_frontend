import { useAppearanceStore } from "../store/useAppearanceStore";

/** Reads and writes the accent colour from the shared store. */
export default function useAccent() {
  const accent = useAppearanceStore((state) => state.accent);
  const setAccent = useAppearanceStore((state) => state.setAccent);

  return [accent, setAccent];
}
