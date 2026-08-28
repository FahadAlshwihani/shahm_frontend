import { useAppearanceStore } from "../store/useAppearanceStore";

/** Reads and writes the four chosen colours from the shared store. */
export default function useColours() {
  const colours = useAppearanceStore((state) => state.colours);
  const setColour = useAppearanceStore((state) => state.setColour);
  const resetColours = useAppearanceStore((state) => state.resetColours);

  return { colours, setColour, resetColours };
}
