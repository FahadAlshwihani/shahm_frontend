import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

const DEFAULT_CODES = [
  { label_ar: "السعودية +966", label_en: "Saudi Arabia +966", value: "+966" },
  { label_ar: "الإمارات +971", label_en: "UAE +971",          value: "+971" },
  { label_ar: "الكويت +965",   label_en: "Kuwait +965",       value: "+965" },
  { label_ar: "قطر +974",      label_en: "Qatar +974",        value: "+974" },
  { label_ar: "البحرين +973",  label_en: "Bahrain +973",      value: "+973" },
  { label_ar: "عمان +968",     label_en: "Oman +968",         value: "+968" },
];

function PhoneField({ field, value, error, onValueChange, isEn }) {
  const { t } = useTranslation();
  const label  = getText(field, "label",     isEn);
  const help   = getText(field, "help_text", isEn);

  const phoneValue = value || { country_code: "", number: "" };
  const options    = field.options?.length ? field.options : DEFAULT_CODES;

  const [codeOpen,   setCodeOpen]   = useState(false);
  const [touched,    setTouched]    = useState(false);
  const [numFocused, setNumFocused] = useState(false);
  const [codeFocused,setCodeFocused]= useState(false);
  const codeRef = useRef(null);

  const hasCode   = !!phoneValue.country_code;
  const hasNumber = !!phoneValue.number?.trim();
  const hasValue  = hasCode && hasNumber;

  const showError = touched && !numFocused && field.required && !hasValue;
  const showValid = touched && hasValue && !error;

  useEffect(() => {
    function handleClickOutside(e) {
      if (codeRef.current && !codeRef.current.contains(e.target)) {
        setCodeOpen(false);
        setCodeFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updatePhone = (patch) =>
    onValueChange(field.key, { ...phoneValue, ...patch });

  /* ── column state classes ── */
  const codeColClass = [
    "srm-phone-code-col",
    hasCode || codeFocused ? "is-filled" : "",
    showError && !hasCode  ? "is-error"  : "",
  ].filter(Boolean).join(" ");

  const numColClass = [
    "srm-phone-number-col",
    hasNumber || numFocused ? "is-filled" : "",
    showError && !hasNumber ? "is-error"  : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="srm-form-field">

      {/* Phone row — direction set by page, internals always LTR */}
      <div className="srm-phone-row">

        {/* ── Code column ── */}
        <div className={codeColClass} ref={codeRef} style={{ direction: "ltr" }}>

          {/* floating label — always LTR anchor */}
          <span className="srm-float-label">
            {isEn ? "Code" : "الرمز"}
            {field.required && <span aria-hidden="true"> *</span>}
          </span>

          <div
            className="srm-custom-select"
            role="combobox"
            aria-expanded={codeOpen}
            aria-haspopup="listbox"
            aria-controls={`${field.key}-country-code-options`}
            tabIndex={0}
            onFocus={() => setCodeFocused(true)}
            onBlur={() => { if (!codeOpen) setCodeFocused(false); setTouched(true); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCodeOpen((p) => !p); }
              if (e.key === "Escape") setCodeOpen(false);
            }}
          >
            <div
              className={`srm-custom-select-trigger${showError && !hasCode ? " error" : ""}`}
              style={showError && !hasCode ? { borderBottomColor: "#EF5D5F" } : {}}
              onClick={() => { setCodeOpen((p) => !p); setCodeFocused(true); setTouched(true); }}
            >
              <span style={!hasCode ? { color: "transparent" } : { fontWeight: 500, fontSize: "14px", color: "#343C3C" }}>
                {hasCode ? phoneValue.country_code : "_"}
              </span>
              <svg
                className={`srm-dropdown-arrow${codeOpen ? " open" : ""}`}
                width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
              >
                <path d="M4 6L8 10L12 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {codeOpen && (
              <ul
                id={`${field.key}-country-code-options`}
                className="srm-custom-select-dropdown"
                role="listbox"
              >
                <li
                  className="srm-custom-select-option"
                  role="option"
                  aria-selected={!hasCode}
                  onClick={() => { updatePhone({ country_code: "" }); setCodeOpen(false); }}
                >
                  {isEn ? "Code" : "الرمز"}
                </li>
                {options.map((opt, idx) => (
                  <li
                    key={opt.id ?? idx}
                    className="srm-custom-select-option"
                    role="option"
                    aria-selected={phoneValue.country_code === opt.value}
                    style={phoneValue.country_code === opt.value ? { fontWeight: 600, color: "#353C3C" } : {}}
                    onClick={() => { updatePhone({ country_code: opt.value }); setCodeOpen(false); setTouched(true); }}
                  >
                    {getText(opt, "label", isEn, opt.value)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Number column — always LTR internally ── */}
        <div className={numColClass} style={{ direction: "ltr" }}>

          {/* floating label */}
          <span className="srm-float-label">
            {label || (isEn ? "Phone Number" : "رقم الجوال")}
            {field.required && <span aria-hidden="true"> *</span>}
          </span>

          <div className="srm-input-wrapper">
            <input
              type="tel"
              className={showError && !hasNumber ? "error" : ""}
              value={phoneValue.number || ""}
              placeholder=" "
              style={showError && !hasNumber ? { color: "#EF5D5F" } : {}}
              aria-required={field.required}
              aria-invalid={!!(showError && !hasNumber)}
              onFocus={() => setNumFocused(true)}
              onBlur={() => { setNumFocused(false); setTouched(true); }}
              onChange={(e) => { updatePhone({ number: e.target.value }); setTouched(true); }}
            />

            {showError && !hasNumber && (
              <span
                className="srm-required-placeholder"
                aria-hidden="true"
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  left: 0,
                  right: "auto",
                }}
              >
                {t("forms.required_field_placeholder", "Required field")}
              </span>
            )}

            {showValid && !numFocused && (
              <span className="srm-valid-icon" aria-hidden="true">
                <svg viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 5.5L5 9.5L13 1.5" />
                </svg>
              </span>
            )}
          </div>
        </div>

      </div>

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && !showError && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(PhoneField);
