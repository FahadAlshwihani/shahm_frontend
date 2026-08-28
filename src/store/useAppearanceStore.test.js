import { act } from "@testing-library/react";

import { useAppearanceStore } from "./useAppearanceStore";
import { DEFAULT_COLOURS } from "../utils/appearanceColors";

const style = () => document.documentElement.style;

describe("useAppearanceStore", () => {
  beforeEach(() => {
    act(() => useAppearanceStore.getState().resetColours());
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("style");
  });

  test("choosing the evening theme stamps the document and is remembered", () => {
    act(() => useAppearanceStore.getState().setTheme("dark"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("shahm:theme")).toBe("dark");
    expect(useAppearanceStore.getState().theme).toBe("dark");
  });

  test("following the system stamps nothing, so the media query decides", () => {
    act(() => useAppearanceStore.getState().setTheme("dark"));
    act(() => useAppearanceStore.getState().setTheme("system"));

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  test("the defaults are the colours that were asked for", () => {
    expect(DEFAULT_COLOURS.groundDark).toBe("#122d22");
    expect(DEFAULT_COLOURS.chromeDark).toBe("#10281c");
    expect(DEFAULT_COLOURS.sidebarDark).toBe("#16382a");
    expect(DEFAULT_COLOURS.marking).toBe("#ffffff");
    expect(style().getPropertyValue("--t-ground-night")).toBe("#122d22");
    expect(style().getPropertyValue("--t-chrome")).toBe("#10281c");
    expect(style().getPropertyValue("--t-sidebar")).toBe("#16382a");
    expect(style().getPropertyValue("--t-marking")).toBe("#ffffff");
  });

  test("the two bars are set apart from each other", () => {
    act(() => useAppearanceStore.getState().setColour("sidebarDark", "#203f31"));

    expect(style().getPropertyValue("--t-sidebar")).toBe("#203f31");
    expect(style().getPropertyValue("--t-sidebar-glass")).toContain("rgba");
    // Changing one bar leaves the other where it was.
    expect(style().getPropertyValue("--t-chrome")).toBe("#10281c");
  });

  test("a code sets the colour and the variants derived from it", () => {
    act(() => useAppearanceStore.getState().setColour("groundDark", "#204030"));

    expect(useAppearanceStore.getState().colours.groundDark).toBe("#204030");
    expect(style().getPropertyValue("--t-ground-night")).toBe("#204030");
    // The surfaces above the ground are lifted from it rather than asked for.
    expect(style().getPropertyValue("--t-surface-night")).not.toBe("#204030");
    expect(style().getPropertyValue("--t-glass-night")).toContain("rgba");
  });

  test("a short code and a bare code are both accepted", () => {
    act(() => useAppearanceStore.getState().setColour("accent", "#0af"));
    expect(useAppearanceStore.getState().colours.accent).toBe("#00aaff");

    act(() => useAppearanceStore.getState().setColour("accent", "112233"));
    expect(useAppearanceStore.getState().colours.accent).toBe("#112233");
  });

  test("a half-typed code leaves the page as it was", () => {
    const before = useAppearanceStore.getState().colours.accent;

    let accepted;
    act(() => {
      accepted = useAppearanceStore.getState().setColour("accent", "#12");
    });

    expect(accepted).toBe(false);
    expect(useAppearanceStore.getState().colours.accent).toBe(before);
  });

  test("the ink on a colour follows its brightness", () => {
    act(() => useAppearanceStore.getState().setColour("accent", "#ffd60a"));
    expect(style().getPropertyValue("--t-accent-ink-day")).toBe("#1d1d1f");

    act(() => useAppearanceStore.getState().setColour("accent", "#10281c"));
    expect(style().getPropertyValue("--t-accent-ink-day")).toBe("#ffffff");
  });

  test("the colours are remembered and restored together", () => {
    act(() => useAppearanceStore.getState().setColour("chromeDark", "#001122"));
    expect(JSON.parse(localStorage.getItem("shahm:colours")).chromeDark).toBe("#001122");

    act(() => useAppearanceStore.getState().resetColours());
    expect(useAppearanceStore.getState().colours).toEqual(DEFAULT_COLOURS);
  });
});
