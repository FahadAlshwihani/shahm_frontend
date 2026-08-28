import React from "react";

/**
 * A single labelled control that is not translated: a number, a select, a URL.
 * It exists so an error message renders in the same place on every screen.
 */
export default function FieldRow({ label, htmlFor, hint, error, children, required = false }) {
  return (
    <div className={`sf-field${error ? " sf-field--invalid" : ""}`}>
      <div className="sf-field__head">
        <label className="sf-field__label" htmlFor={htmlFor}>
          {label}
          {required && <span className="sf-field__required" aria-hidden="true">*</span>}
        </label>
      </div>

      {children}

      <div className="sf-field__foot">
        {error ? (
          <span className="sf-field__error" role="alert">{error}</span>
        ) : (
          hint && <span className="sf-field__hint">{hint}</span>
        )}
      </div>
    </div>
  );
}
