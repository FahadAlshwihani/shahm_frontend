import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

const LINE_HEIGHT = 29;   // must match CSS line-height on textarea
const PADDING_TOP = 52;   // must match CSS padding-top on textarea

// Measure text width using Canvas API — synchronous, no DOM paint needed
function measureTextWidth(text, font) {
  try {
    const canvas  = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
    const ctx     = canvas.getContext("2d");
    ctx.font      = font;
    return ctx.measureText(text).width;
  } catch {
    return 0;
  }
}

function TextareaField({ field, value, error, onValueChange, isEn }) {
  const { t } = useTranslation();
  const label     = getText(field, "label",     isEn);
  const help      = getText(field, "help_text", isEn);
  const maxLength = field.validation_rules?.max_length;

  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dotPos,  setDotPos]  = useState({ left: 0, top: PADDING_TOP });

  const textareaRef = useRef(null);

  const hasValue  = !!(value && value.toString().trim().length > 0);
  const showError = touched && !focused && field.required && !hasValue;
  const isTyping  = focused && hasValue;

  // ── measure dot position after every value change ─────────────────────────
  const updateDotPos = useCallback(() => {
    if (!textareaRef.current) return;

    const lines     = (value || "").split("\n");
    const lastLine  = lines[lines.length - 1] || "";
    const lineIndex = lines.length - 1;

    const computed  = window.getComputedStyle(textareaRef.current);
    const font      = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

    const textWidth = measureTextWidth(lastLine, font);
    const topPx     = PADDING_TOP + lineIndex * LINE_HEIGHT + (LINE_HEIGHT - 4) / 2;

    // RTL: anchor from right edge, LTR: anchor from left edge
    setDotPos({ textWidth, top: topPx });
  }, [value]);

  // useLayoutEffect fires after DOM mutations but before paint — dots never lag
  useLayoutEffect(() => {
    if (isTyping) updateDotPos();
  }, [isTyping, updateDotPos]);

  const wrapperClass = [
    "srm-textarea-wrapper",
    hasValue || focused ? "is-filled"  : "",
    focused             ? "is-focused" : "",
    showError           ? "is-error"   : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="srm-form-field">
      <div className={wrapperClass}>

        {/* floating label */}
        {label && (
          <span className="srm-float-label" style={showError ? { color: "#EF5D5F" } : {}}>
            {label}
            {field.required && <span aria-hidden="true"> *</span>}
          </span>
        )}

        <textarea
          ref={textareaRef}
          className={showError || error ? "error" : ""}
          rows={4}
          value={value || ""}
          placeholder=" "
          maxLength={maxLength}
          aria-required={field.required}
          aria-invalid={!!(showError || error)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); }}
          onChange={(e) => onValueChange(field.key, e.target.value)}
        />

        {/* typing dots — track last character position via Canvas measurement */}
        {isTyping && (
          <span
            className="srm-typing-dots"
            aria-hidden="true"
            style={{
              position: "absolute",
              ...(isEn
                ? { left: `${dotPos.textWidth + 6}px` }
                : { right: `${dotPos.textWidth + 6}px` }
              ),
              top:    `${dotPos.top}px`,
              bottom: "auto",
            }}
          >
            <span /><span /><span />
          </span>
        )}

        {/* required placeholder */}
        {showError && (
          <span
            className="srm-required-placeholder"
            aria-hidden="true"
            style={{ top: `${PADDING_TOP + 4}px`, bottom: "auto" }}
          >
            {t("forms.required_field_placeholder", "Required field")}
          </span>
        )}

        {/* no valid checkmark for textarea */}

      </div>

      {maxLength && (
        <p className="srm-char-counter">
          {(value || "").length} / {maxLength}
        </p>
      )}

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && !showError && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(TextareaField);
