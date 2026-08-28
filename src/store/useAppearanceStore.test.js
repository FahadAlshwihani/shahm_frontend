import { act } from "@testing-library/react";

import { useAppearanceStore } from "./useAppearanceStore";

describe("useAppearanceStore", () => {
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
    expect(useAppearanceStore.getState().theme).toBe("system");
  });

  test("the accent is written as day and evening values", () => {
    act(() => useAppearanceStore.getState().setAccent("green"));

    const style = document.documentElement.style;

    expect(style.getPropertyValue("--t-accent-day")).toBe("#34c759");
    expect(style.getPropertyValue("--t-accent-night")).toBe("#30d158");
    expect(style.getPropertyValue("--t-accent-soft-day")).toBe("rgba(52, 199, 89, 0.12)");
    expect(localStorage.getItem("shahm:accent")).toBe("green");
  });

  test("an unknown accent falls back rather than clearing the colour", () => {
    act(() => useAppearanceStore.getState().setAccent("chartreuse"));

    expect(document.documentElement.style.getPropertyValue("--t-accent-day")).toBe("#007aff");
  });

  test("both controls read the same value", () => {
    act(() => useAppearanceStore.getState().setTheme("light"));

    // Two subscribers, one source: what one control writes, the other reads.
    const first = useAppearanceStore.getState().theme;
    act(() => useAppearanceStore.getState().setTheme("dark"));
    const second = useAppearanceStore.getState().theme;

    expect(first).toBe("light");
    expect(second).toBe("dark");
  });
});
