import React from "react";

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

function CheckboxField({ field, value, error, onValueChange, isEn }) {
  const label = getText(field, "label", isEn);
  const help = getText(field, "help_text", isEn);

  const options = field.options || [];
  const isMulti = options.length > 0;

  const toggleValue = (optionValue) => {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(optionValue)) {
      onValueChange(field.key, current.filter((v) => v !== optionValue));
    } else {
      onValueChange(field.key, [...current, optionValue]);
    }
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontFamily: "var(--font-content)",
    fontSize: "14px",
    fontWeight: 300,
    color: "#353C3C",
  };

  const checkboxStyle = {
    accentColor: "#353C3C",
    width: "16px",
    height: "16px",
    cursor: "pointer",
    flexShrink: 0,
  };

  return (
    <div className="srm-form-field">
      {label && !isMulti && (
        /* Single checkbox — label IS the clickable row */
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            style={checkboxStyle}
            onChange={(e) => onValueChange(field.key, e.target.checked)}
          />
          <span>
            {label}
            {field.required && <span aria-hidden="true"> *</span>}
          </span>
        </label>
      )}

      {isMulti && (
        <>
          {label && (
            <label>
              {label}
              {field.required && <span aria-hidden="true"> *</span>}
            </label>
          )}

          <div
            role="group"
            aria-labelledby={`${field.key}-label`}
            style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px" }}
          >
            {options.map((option) => (
              <label
                key={option.id ?? option.value}
                style={checkboxLabelStyle}
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  style={checkboxStyle}
                  onChange={() => toggleValue(option.value)}
                />
                <span>{getText(option, "label", isEn, option.value)}</span>
              </label>
            ))}
          </div>
        </>
      )}

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(CheckboxField);