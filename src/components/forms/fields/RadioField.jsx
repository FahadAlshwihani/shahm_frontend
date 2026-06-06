import React from "react";

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

function RadioField({ field, value, error, onValueChange, isEn }) {
  const label = getText(field, "label", isEn);
  const help = getText(field, "help_text", isEn);

  return (
    <div className="srm-form-field">
      {label && (
        <label>
          {label}
          {field.required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <div
        role="radiogroup"
        aria-labelledby={`${field.key}-label`}
        style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px" }}
      >
        {(field.options || []).map((option) => (
          <label
            key={option.id ?? option.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontFamily: "var(--font-content)",
              fontSize: "14px",
              fontWeight: 300,
              color: "#353C3C",
            }}
          >
            <input
              type="radio"
              name={field.key}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onValueChange(field.key, e.target.value)}
              style={{ accentColor: "#353C3C", width: "16px", height: "16px", cursor: "pointer" }}
            />
            <span>{getText(option, "label", isEn, option.value)}</span>
          </label>
        ))}
      </div>

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(RadioField);