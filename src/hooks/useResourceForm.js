import { useCallback, useMemo, useRef, useState } from "react";

import { firstErrorField, parseApiError } from "../utils/apiErrors";

function isEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== "object" || typeof b !== "object") return String(a) === String(b);
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Holds the state of one editable record: the values, which of them changed,
 * whether a save is running, and the errors the server sent back per field.
 *
 * Every CMS screen used to keep this in a dozen useState calls and throw the
 * server's field errors away in a bare `catch`.
 */
export function useResourceForm({ initialValues, onSubmit }) {
  const [baseline, setBaseline] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const submitRef = useRef(onSubmit);

  submitRef.current = onSubmit;

  const dirtyFields = useMemo(() => {
    const keys = Object.keys({ ...baseline, ...values });
    return keys.filter((key) => !isEqual(baseline[key], values[key]));
  }, [baseline, values]);

  const dirty = dirtyFields.length > 0;

  const setField = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  const replaceValues = useCallback((next, { asBaseline = true } = {}) => {
    setValues(next);
    if (asBaseline) setBaseline(next);
    setErrors({});
    setFormError("");
  }, []);

  const reset = useCallback((next) => {
    const target = next === undefined ? baseline : next;
    setValues(target);
    setBaseline(target);
    setErrors({});
    setFormError("");
  }, [baseline]);

  /**
   * Runs the save. Returns true when it succeeded, so the caller can decide
   * what to do next without inspecting exceptions.
   */
  const submit = useCallback(async (event) => {
    if (event && typeof event.preventDefault === "function") event.preventDefault();

    setSaving(true);
    setErrors({});
    setFormError("");

    try {
      const result = await submitRef.current(values);
      setBaseline(values);
      return result === undefined ? true : result;
    } catch (error) {
      const parsed = parseApiError(error);

      if (parsed.canceled) return false;

      setErrors(parsed.fields);
      setFormError(parsed.message);

      const focusTarget = firstErrorField(parsed.fields);
      if (focusTarget && typeof document !== "undefined") {
        const element = document.querySelector(`[data-field="${focusTarget}"]`);
        if (element && typeof element.focus === "function") element.focus();
      }

      return false;
    } finally {
      setSaving(false);
    }
  }, [values]);

  return {
    values,
    setField,
    setValues: replaceValues,
    reset,
    dirty,
    dirtyFields,
    saving,
    errors,
    formError,
    submit,
  };
}

export default useResourceForm;
