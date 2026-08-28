import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * One field that holds both languages.
 *
 * CMS screens rendered an Arabic input and an English input side by side for
 * every translated value, so a page with six translated values carried twelve
 * controls and twelve labels. This is one labelled field with a language
 * switch, and it says plainly when the other language is still empty.
 */
export default function BilingualField({
  label,
  name,
  values,
  onChange,
  as = "input",
  rows = 3,
  placeholder,
  placeholderEn,
  hint,
  errors = {},
  required = false,
  disabled = false,
}) {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("ar");
  const generatedId = useId();

  const arabicName = `${name}_ar`;
  const englishName = `${name}_en`;
  const activeName = language === "ar" ? arabicName : englishName;
  const activeValue = values[activeName] || "";
  const fieldId = `${generatedId}-${activeName}`;

  // The server rejects one language at a time, so the tab of the language that
  // was refused is marked; otherwise an editor reads "required" on a field
  // that looks filled in the language they happen to be viewing.
  const error = errors[activeName];
  const arabicRejected = Boolean(errors[arabicName]);
  const englishRejected = Boolean(errors[englishName]);

  const arabicFilled = Boolean((values[arabicName] || "").trim());
  const englishFilled = Boolean((values[englishName] || "").trim());
  const missingEnglish = arabicFilled && !englishFilled;

  const Control = as === "textarea" ? "textarea" : "input";

  const copyFromArabic = () => {
    onChange(englishName, values[arabicName] || "");
    setLanguage("en");
  };

  return (
    <div className={`sf-field${error ? " sf-field--invalid" : ""}`}>
      <div className="sf-field__head">
        <label className="sf-field__label" htmlFor={fieldId}>
          {label}
          {required && <span className="sf-field__required" aria-hidden="true">*</span>}
        </label>

        <div className="sf-tabs" role="tablist" aria-label={label}>
          <button
            type="button"
            role="tab"
            aria-selected={language === "ar"}
            className={`sf-tab${language === "ar" ? " sf-tab--active" : ""}${
              arabicRejected ? " sf-tab--rejected" : ""
            }`}
            onClick={() => setLanguage("ar")}
          >
            {t("form_layer.arabic", "عربي")}
            {arabicRejected && (
              <span
                className="sf-tab__dot sf-tab__dot--error"
                title={t("form_layer.rejected", "رفضه الخادم")}
              />
            )}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={language === "en"}
            className={`sf-tab${language === "en" ? " sf-tab--active" : ""}${
              englishRejected ? " sf-tab--rejected" : ""
            }`}
            onClick={() => setLanguage("en")}
          >
            {t("form_layer.english", "English")}
            {englishRejected ? (
              <span
                className="sf-tab__dot sf-tab__dot--error"
                title={t("form_layer.rejected", "رفضه الخادم")}
              />
            ) : (
              missingEnglish && (
                <span className="sf-tab__dot" title={t("form_layer.missing", "لم تعبأ بعد")} />
              )
            )}
          </button>
        </div>
      </div>

      <Control
        id={fieldId}
        data-field={activeName}
        className={as === "textarea" ? "sf-control sf-control--area" : "sf-control"}
        dir={language === "ar" ? "rtl" : "ltr"}
        lang={language}
        rows={as === "textarea" ? rows : undefined}
        value={activeValue}
        disabled={disabled}
        placeholder={language === "ar" ? placeholder : placeholderEn || placeholder}
        onChange={(event) => onChange(activeName, event.target.value)}
      />

      <div className="sf-field__foot">
        {error ? (
          <span className="sf-field__error" role="alert">{error}</span>
        ) : (
          hint && <span className="sf-field__hint">{hint}</span>
        )}

        {language === "en" && arabicFilled && !englishFilled && !disabled && (
          <button type="button" className="sf-field__action" onClick={copyFromArabic}>
            {t("form_layer.copy_from_arabic", "انسخ النص العربي")}
          </button>
        )}
      </div>
    </div>
  );
}
