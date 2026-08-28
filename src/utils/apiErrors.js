/**
 * Turns an API failure into something a form can show on its fields.
 *
 * The backend answers a rejected write with
 * `{ success: false, message, errors: { field: ["..."] } }`, and DRF answers
 * some failures with `{ detail: "..." }`. Screens used to discard all of it and
 * show one generic "save failed" toast, so an editor never learned which field
 * the server refused.
 */

const NON_FIELD_KEYS = ["non_field_errors", "detail", "error"];

function firstMessage(value) {
  if (Array.isArray(value)) return value.length ? firstMessage(value[0]) : "";
  if (value && typeof value === "object") {
    var nested = Object.values(value)[0];
    return nested === undefined ? "" : firstMessage(nested);
  }
  return value === undefined || value === null ? "" : String(value);
}

/**
 * @returns {{ message: string, fields: Object<string, string>, canceled: boolean, status: number|null }}
 */
export function parseApiError(error) {
  const canceled =
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError";

  const result = { message: "", fields: {}, canceled, status: null };

  if (canceled) return result;

  const response = error?.response;

  if (!response) {
    result.message = error?.message || "";
    return result;
  }

  result.status = response.status ?? null;

  const data = response.data;

  if (typeof data === "string") {
    result.message = data;
    return result;
  }

  if (!data || typeof data !== "object") return result;

  const envelope =
    data.errors && typeof data.errors === "object" ? data.errors : data;

  Object.keys(envelope).forEach((key) => {
    if (NON_FIELD_KEYS.indexOf(key) !== -1) {
      if (!result.message) result.message = firstMessage(envelope[key]);
      return;
    }

    if (key === "success" || key === "message") return;

    const message = firstMessage(envelope[key]);
    if (message) result.fields[key] = message;
  });

  if (!result.message && typeof data.message === "string") {
    result.message = data.message;
  }

  return result;
}

/**
 * Names the first field the server rejected, so the form can focus it.
 */
export function firstErrorField(fields) {
  const names = Object.keys(fields || {});
  return names.length ? names[0] : null;
}
