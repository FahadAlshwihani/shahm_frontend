import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

function SelectField({ field, value, error, onValueChange, isEn }) {
    const label = getText(field, "label", isEn);
  const placeholder = getText(field, "placeholder", isEn) || (isEn ? "Select..." : "اختر...");
  const help = getText(field, "help_text", isEn);

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setWasOpen(true);
        setTouched(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectedOption = (field.options || []).find((opt) => opt.value === value);
  const displayLabel = selectedOption
    ? getText(selectedOption, "label", isEn, selectedOption.value)
    : null;

  const [touched,  setTouched]  = useState(false);
  const [wasOpen,  setWasOpen]  = useState(false);
  const { t } = useTranslation();

  const hasValue  = !!value;
  // error only after: user opened the dropdown AND closed it AND made no selection
  const showError = wasOpen && !open && !hasValue && field.required;
  const showValid = hasValue && !error;

  const handleSelect = (optionValue) => {
    onValueChange(field.key, optionValue);
    setTouched(true);
    setOpen(false);
  };

  return (
    <div className="srm-form-field">
      <div className="srm-input-wrapper" style={{ paddingTop: "18px", minHeight: "68px", boxSizing: "border-box" }}>
        {label && (
          <label
            id={`${field.key}-label`}
            style={{
              position: "absolute",
              top: (displayLabel || showError) ? "0px" : "14px",
              left: 0,
              fontSize: (displayLabel || showError) ? "10px" : "12px",
              color: showError ? "#EF5D5F" : "#7C8D8D",
              fontFamily: "var(--font-content)",
              fontWeight: 400,
              lineHeight: "29px",
              pointerEvents: "none",
              transition: "top 0.2s ease, font-size 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {label}
            {field.required && <span aria-hidden="true"> *</span>}
          </label>
        )}
        <div
          className="srm-custom-select"
        ref={containerRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={`${field.key}-label`}
        aria-invalid={!!error}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`srm-custom-select-trigger${showError || error ? " error" : ""}`}
          style={showError ? { borderBottomColor: "#EF5D5F", color: "#EF5D5F" } : {}}
          onClick={() => {
            setTouched(true);
            if (!open) setWasOpen(true);
            setOpen((prev) => !prev);
          }}
          onBlur={() => setTouched(true)}
        >
          {/* value text or error placeholder */}
          <span
            className={!displayLabel ? "placeholder" : ""}
            style={{ flex: 1, ...(showError ? { color: "#EF5D5F" } : {}) }}
          >
            {showError
              ? t("forms.required_field_placeholder", "Required field")
              : displayLabel || ""}
          </span>

          {/* arrow only — no checkmark for select */}
          <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
            <svg
              className={`srm-dropdown-arrow${open ? " open" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 6L8 10L12 6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {open && (
          <ul
            className="srm-custom-select-dropdown"
            role="listbox"
            aria-labelledby={`${field.key}-label`}
          >
            {(field.options || []).map((option) => (
              <li
                key={option.id ?? option.value}
                className="srm-custom-select-option"
                role="option"
                aria-selected={value === option.value}
                style={value === option.value ? { fontWeight: 600, color: "#353C3C" } : {}}
                onClick={() => handleSelect(option.value)}
              >
                {getText(option, "label", isEn, option.value)}
              </li>
            ))}
          </ul>
        )}

      </div>
      </div>

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(SelectField);