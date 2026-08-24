import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

// ─── Custom Date Picker ───────────────────────────────────────────
const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_AR = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"];
const MONTHS_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(str, isEn) {
  const d = parseDate(str);
  if (!d) return "";
  const day   = d.getDate();
  const month = isEn ? MONTHS_EN[d.getMonth()] : MONTHS_AR[d.getMonth()];
  const year  = d.getFullYear();
  return isEn ? `${month} ${day}, ${year}` : `${day} ${month} ${year}`;
}

function DatePickerCalendar({ value, onChange, onClose, isEn }) {
  const today = new Date();
  const selected = parseDate(value);
  const [cursor, setCursor] = useState(
    selected ? new Date(selected.getFullYear(), selected.getMonth(), 1)
             : new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year  = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = (isEn ? MONTHS_EN : MONTHS_AR)[month] + " " + year;
  const weekdays   = isEn ? WEEKDAYS_EN : WEEKDAYS_AR;

  // first day of month, offset for Sunday-start grid
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDay = (day) => {
    if (!day) return;
    onChange(formatISO(new Date(year, month, day)));
    onClose();
  };

  const prev = () => setCursor(new Date(year, month - 1, 1));
  const next = () => setCursor(new Date(year, month + 1, 1));

  return (
    <div className="srm-date-calendar" dir={isEn ? "ltr" : "rtl"}>
      <div className="srm-date-nav">
        {/* Left visual button — always goes to previous month in LTR, next in RTL */}
        <button type="button" className="srm-date-nav-btn" onClick={prev} aria-label={isEn ? "Previous" : "التالي"}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="#343C3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="srm-date-nav-label">{monthLabel}</span>
        {/* Right visual button — always goes to next month in LTR, prev in RTL */}
        <button type="button" className="srm-date-nav-btn" onClick={next} aria-label={isEn ? "Next" : "السابق"}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#343C3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="srm-date-weekdays">
        {weekdays.map((w) => (
          <div key={w} className="srm-date-weekday">{w}</div>
        ))}
      </div>

      <div className="srm-date-days">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="srm-date-day empty" />;
          const thisDate  = new Date(year, month, day);
          const isSel     = selected && formatISO(thisDate) === value;
          const isToday   = formatISO(thisDate) === formatISO(today);
          return (
            <button
              key={day}
              type="button"
              className={[
                "srm-date-day",
                isSel    ? "selected"    : "",
                isToday  ? "today"       : "",
              ].filter(Boolean).join(" ")}
              onClick={() => handleDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

function TextField({ field, value, error, onValueChange, isEn }) {
  const { t } = useTranslation();
  const label       = getText(field, "label",       isEn);
  const help        = getText(field, "help_text",   isEn);

  const isDate = field.field_type === "date";

  const [touched,    setTouched]    = useState(false);
  const [focused,    setFocused]    = useState(false);
  const [textWidth,  setTextWidth]  = useState(0);
  const [calOpen,    setCalOpen]    = useState(false);
  const mirrorRef   = useRef(null);
  const inputRef    = useRef(null);
  const calWrapRef  = useRef(null);

  const hasValue     = !!(value && value.toString().trim().length > 0);
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const emailInvalid = field.field_type === "email" && hasValue && !isValidEmail(value);

  const showError      = touched && !focused && field.required && !hasValue;
  const showEmailError = touched && !focused && field.field_type === "email" && hasValue && emailInvalid;
  // no valid icon for date or select-like fields
  const showValid      = !isDate && touched && hasValue && !error && !emailInvalid;
  const isTyping       = !isDate && focused && hasValue;

  // close calendar on outside click
  useEffect(() => {
    if (!calOpen) return;
    function handler(e) {
      if (calWrapRef.current && !calWrapRef.current.contains(e.target)) {
        setCalOpen(false);
        setTouched(true);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calOpen]);

  useEffect(() => {
    if (mirrorRef.current && isTyping) {
      setTextWidth(mirrorRef.current.offsetWidth);
    }
  }, [value, isTyping]);

  const inputType =
    field.field_type === "email"  ? "email"  :
    field.field_type === "number" ? "number" :
    "text"; // date uses custom picker — never native date input

  // ── Date field: renders like a select trigger ──────────────────
  if (isDate) {
    const displayValue = formatDisplay(value, isEn);
    const labelFloated = !!(displayValue || showError);

    return (
      <div className="srm-form-field">
        <div
          className="srm-input-wrapper srm-date-picker"
          ref={calWrapRef}
          style={{ paddingTop: "18px", minHeight: "68px", boxSizing: "border-box", position: "relative" }}
        >
          {label && (
            <label
              style={{
                position: "absolute",
                top: labelFloated ? "0px" : "14px",
                left: 0,
                fontSize: labelFloated ? "10px" : "12px",
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

          {/* trigger — same look as srm-custom-select-trigger */}
          <div
            className={`srm-custom-select-trigger${showError || error ? " error" : ""}`}
            style={showError ? { borderBottomColor: "#EF5D5F" } : {}}
            onClick={() => { setCalOpen((p) => !p); setTouched(true); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCalOpen((p) => !p); }
              if (e.key === "Escape") setCalOpen(false);
            }}
          >
            <span style={{ flex: 1, color: showError ? "#EF5D5F" : displayValue ? "#343C3C" : "transparent" }}>
              {showError
                ? t("forms.required_field_placeholder", "Required field")
                : displayValue || "_"}
            </span>

            {/* calendar icon */}
            <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="2" width="14" height="13" rx="2" stroke="#7C8D8D" strokeWidth="1.3"/>
                <path d="M1 6h14" stroke="#7C8D8D" strokeWidth="1.3"/>
                <path d="M5 1v2M11 1v2" stroke="#7C8D8D" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </span>
          </div>

          {/* calendar dropdown */}
          {calOpen && (
            <DatePickerCalendar
              value={value}
              isEn={isEn}
              onChange={(v) => { onValueChange(field.key, v); setTouched(true); }}
              onClose={() => setCalOpen(false)}
            />
          )}
        </div>

        {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
        {error && !showError && <p className="srm-field-error">{String(error)}</p>}
      </div>
    );
  }

  // ── All other field types ────────────────────────────────────────
  return (
    <div className="srm-form-field">
      <div className="srm-input-wrapper" style={{ position: "relative" }}>
        <input
          ref={inputRef}
          className={showError || showEmailError || error ? "error" : ""}
          type={inputType}
          value={value || ""}
          placeholder=" "
          aria-required={field.required}
          aria-invalid={!!(showError || showEmailError || error)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          onChange={(e) => onValueChange(field.key, e.target.value)}
        />

        {label && (
          <label style={showError ? { color: "#EF5D5F" } : {}}>
            {label}
            {field.required && <span aria-hidden="true"> *</span>}
          </label>
        )}

        {isTyping && (
          <span
            ref={mirrorRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "pre",
              fontFamily: "var(--font-content)",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "29px",
              letterSpacing: "normal",
              pointerEvents: "none",
              bottom: 12,
              left: 0,
            }}
          >
            {value}
          </span>
        )}

        {isTyping && (
          <span
            className="srm-typing-dots"
            aria-hidden="true"
            style={{ "--text-width": `${textWidth}px` }}
          >
            <span /><span /><span />
          </span>
        )}

        {showValid && !focused && (
          <span className="srm-valid-icon" aria-hidden="true">
            <svg viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 5.5L5 9.5L13 1.5" />
            </svg>
          </span>
        )}

        {showError && (
          <span className="srm-required-placeholder" aria-hidden="true">
            {t("forms.required_field_placeholder", "Required field")}
          </span>
        )}
        {showEmailError && (
          <span className="srm-required-placeholder" aria-hidden="true">
            {t("forms.invalid_email", "Invalid email address")}
          </span>
        )}
      </div>

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && !showError && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(TextField);
