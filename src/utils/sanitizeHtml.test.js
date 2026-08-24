import { sanitizeCmsHtml } from "./sanitizeHtml";

describe("sanitizeCmsHtml", () => {
  test("preserves supported rich-text formatting", () => {
    expect(sanitizeCmsHtml("<p><strong>Welcome</strong></p>"))
      .toBe("<p><strong>Welcome</strong></p>");
  });

  test("removes executable markup and unsafe URLs", () => {
    const dirty = '<p onclick="alert(1)">Text</p><script>alert(1)</script>'
      + '<a href="javascript:alert(1)">link</a>';
    const clean = sanitizeCmsHtml(dirty);

    expect(clean).not.toMatch(/script|onclick|javascript:/i);
    expect(clean).toContain("<p>Text</p>");
  });
});
