import { firstErrorField, parseApiError } from "./apiErrors";

describe("parseApiError", () => {
  test("reads the backend envelope onto the fields", () => {
    const parsed = parseApiError({
      response: {
        status: 400,
        data: {
          success: false,
          message: "An error occurred.",
          errors: {
            title_ar: ["This field may not be blank."],
            order: ["A valid integer is required."],
          },
        },
      },
    });

    expect(parsed.status).toBe(400);
    expect(parsed.fields).toEqual({
      title_ar: "This field may not be blank.",
      order: "A valid integer is required.",
    });
    expect(parsed.message).toBe("An error occurred.");
  });

  test("reads a bare DRF serializer response", () => {
    const parsed = parseApiError({
      response: { status: 400, data: { role: ["You may not assign this role."] } },
    });

    expect(parsed.fields).toEqual({ role: "You may not assign this role." });
  });

  test("treats detail and non_field_errors as the form message", () => {
    const detail = parseApiError({
      response: { status: 429, data: { detail: "Request was throttled." } },
    });
    const nonField = parseApiError({
      response: { status: 400, data: { non_field_errors: ["Choose only one target."] } },
    });

    expect(detail.message).toBe("Request was throttled.");
    expect(detail.fields).toEqual({});
    expect(nonField.message).toBe("Choose only one target.");
  });

  test("flattens a nested error value", () => {
    const parsed = parseApiError({
      response: { status: 400, data: { errors: { media: { file: ["Unsupported file type."] } } } },
    });

    expect(parsed.fields.media).toBe("Unsupported file type.");
  });

  test("reports a cancelled request instead of an error", () => {
    const parsed = parseApiError({ code: "ERR_CANCELED", message: "canceled" });

    expect(parsed.canceled).toBe(true);
    expect(parsed.message).toBe("");
    expect(parsed.fields).toEqual({});
  });

  test("falls back to the transport message when there is no response", () => {
    const parsed = parseApiError({ message: "Network Error" });

    expect(parsed.message).toBe("Network Error");
    expect(parsed.status).toBeNull();
  });

  test("names the first rejected field", () => {
    expect(firstErrorField({ title_en: "required", order: "invalid" })).toBe("title_en");
    expect(firstErrorField({})).toBeNull();
  });
});
