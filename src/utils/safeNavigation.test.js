import {
  getSafeExternalUrl,
  navigateToConfiguredUrl,
  openExternalUrl,
} from "./safeNavigation";

describe("configured URL navigation", () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  test("rejects executable URL schemes", () => {
    expect(openExternalUrl(["java", "script:alert(1)"].join(""))).toBe(false);
    expect(window.open).not.toHaveBeenCalled();
  });

  test("normalizes safe CMS link values and rejects executable hrefs", () => {
    expect(getSafeExternalUrl("  https://example.org/profile  ")).toBe(
      "https://example.org/profile"
    );
    expect(getSafeExternalUrl(["java", "script:alert(1)"].join(""))).toBeNull();
    expect(getSafeExternalUrl("//evil.example/path")).toBeNull();
  });

  test("opens HTTPS URLs without exposing the opener", () => {
    expect(openExternalUrl("https://example.org/path")).toBe(true);
    expect(window.open).toHaveBeenCalledWith(
      "https://example.org/path",
      "_blank",
      "noopener,noreferrer"
    );
  });

  test("routes safe application paths through React Router", () => {
    const navigate = jest.fn();

    expect(navigateToConfiguredUrl("/about", navigate)).toBe(true);
    expect(navigate).toHaveBeenCalledWith("/about");
  });

  test("rejects protocol-relative and backslash paths", () => {
    const navigate = jest.fn();

    expect(navigateToConfiguredUrl("//evil.example", navigate)).toBe(false);
    expect(navigateToConfiguredUrl("\\evil.example", navigate)).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
