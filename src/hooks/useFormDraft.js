import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PREFIX = "shahm:draft:";

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, payload) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(payload));
  } catch {
    // A browser that refuses storage still keeps the values on screen.
  }
}

function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}

/**
 * Keeps an unsaved edit alive across a reload, a crashed tab, or a closed
 * laptop, and warns before the window is closed while an edit is pending.
 *
 * The draft is local to the editor's browser. It is not a save: `clear()` is
 * called once the record actually reaches the server.
 */
export function useFormDraft({ key, values, dirty, enabled = true }) {
  const [pending, setPending] = useState(() => (enabled && key ? read(key) : null));
  const valuesRef = useRef(values);

  valuesRef.current = values;

  const save = useMemo(
    () =>
      debounce((storageKey, payload) => {
        write(storageKey, { savedAt: new Date().toISOString(), values: payload });
      }, 600),
    []
  );

  useEffect(() => {
    if (!enabled || !key) return undefined;

    if (dirty) save(key, values);

    return () => save.cancel();
  }, [enabled, key, dirty, values, save]);

  useEffect(() => {
    if (!enabled || !dirty) return undefined;

    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [enabled, dirty]);

  const clear = useCallback(() => {
    save.cancel();
    if (key) remove(key);
    setPending(null);
  }, [key, save]);

  const discard = useCallback(() => {
    clear();
  }, [clear]);

  const restore = useCallback(() => {
    const draft = pending;
    setPending(null);
    return draft ? draft.values : null;
  }, [pending]);

  return {
    /** The draft found in storage when the screen opened, or null. */
    draft: pending,
    /** Returns the stored values once and stops offering them. */
    restore,
    /** Forgets the stored draft without using it. */
    discard,
    /** Called after a successful save. */
    clear,
  };
}

export default useFormDraft;
