import {
  DEFAULT_COLOURS,
  contrastRatio,
  inkOn,
  normaliseHex,
  readableOn,
  shade,
  withAlpha,
} from "./appearanceColors";

describe("colour codes", () => {
  test("a code is read in any of the forms it is written", () => {
    expect(normaliseHex("#0AF")).toBe("#00aaff");
    expect(normaliseHex("112233")).toBe("#112233");
    expect(normaliseHex("  #FFFFFF ")).toBe("#ffffff");
    expect(normaliseHex("#12")).toBeNull();
    expect(normaliseHex("green")).toBeNull();
    expect(normaliseHex(null)).toBeNull();
  });

  test("shading moves towards white and towards black", () => {
    expect(shade("#808080", 1)).toBe("#ffffff");
    expect(shade("#808080", -1)).toBe("#000000");
    expect(withAlpha("#122d22", 0.5)).toBe("rgba(18, 45, 34, 0.5)");
  });
});

describe("legibility", () => {
  test("the contrast formula matches its reference points", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });

  test("ink turns dark only where dark ink is actually readable", () => {
    // Yellow: white ink would fail, dark ink clears it comfortably.
    expect(inkOn("#ffd60a")).toBe("#1d1d1f");
    expect(contrastRatio("#ffd60a", "#1d1d1f")).toBeGreaterThanOrEqual(4.5);

    // A saturated mid-tone keeps white, as the convention has it: dark ink
    // measures marginally higher but clears nothing.
    expect(inkOn("#007aff")).toBe("#ffffff");
    expect(contrastRatio("#007aff", "#1d1d1f")).toBeLessThan(4.5);

    expect(inkOn(DEFAULT_COLOURS.chromeDark)).toBe("#ffffff");
  });

  test("ink is lifted until it clears the ratio it needs", () => {
    // A dim ink on a dim bar is raised rather than left illegible.
    const raised = readableOn("#16382a", "#2a4a3a", 4.5);

    expect(contrastRatio("#16382a", raised)).toBeGreaterThanOrEqual(4.5);
  });

  test("the chosen bars carry legible text at every level", () => {
    const bar = DEFAULT_COLOURS.sidebarDark;

    const primary = readableOn(bar, shade(bar, 0.9), 7);
    const secondary = readableOn(bar, shade(bar, 0.75), 4.5);
    const muted = readableOn(bar, shade(bar, 0.55), 3);

    expect(contrastRatio(bar, primary)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(bar, secondary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(bar, muted)).toBeGreaterThanOrEqual(3);
  });

  test("the marking colour reads on both bars", () => {
    expect(contrastRatio(DEFAULT_COLOURS.chromeDark, DEFAULT_COLOURS.marking))
      .toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(DEFAULT_COLOURS.sidebarDark, DEFAULT_COLOURS.marking))
      .toBeGreaterThanOrEqual(4.5);
  });

  test("the day and evening grounds both carry their ink", () => {
    // The day ground is tinted by the bars; the evening ground is chosen.
    expect(contrastRatio("#f4f6f5", "#1d1d1f")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(DEFAULT_COLOURS.groundDark, "#f5f5f7"))
      .toBeGreaterThanOrEqual(4.5);
  });

  test("all three day ink levels clear the ratio body text needs", () => {
    // A hint under a field is small type and gets no exemption.
    ["#1d1d1f", "#5b5b60", "#6e6e73"].forEach((ink) => {
      expect(contrastRatio("#f5f7f6", ink)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio("#ffffff", ink)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
