import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useColours from "../../hooks/useColours";
import useTheme from "../../hooks/useTheme";
import { COLOUR_FIELDS, normaliseHex } from "../../utils/appearanceColors";
import "../../styles/common/appearance.css";

const THEME_OPTIONS = [
  { value: "light", labelKey: "theme.light", fallback: "نهار" },
  { value: "dark", labelKey: "theme.dark", fallback: "مساء" },
  { value: "system", labelKey: "theme.system", fallback: "النظام" },
];

const COLOUR_LABELS = {
  accent: ["theme.colours.accent", "لون التمييز"],
  groundDark: ["theme.colours.ground_dark", "خلفية المساء"],
  chromeDark: ["theme.colours.chrome_dark", "الشريط العلوي"],
  sidebarDark: ["theme.colours.sidebar_dark", "الشريط الجانبي"],
  marking: ["theme.colours.marking", "التاشير على الازرار"],
};

/**
 * One colour, set by its code.
 *
 * The field holds what was typed rather than what was accepted, so a code can
 * be edited a character at a time; the page follows as soon as the code is a
 * colour, and the field says so when it is not.
 */
function ColourField({ field, value, label, onChange }) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const valid = Boolean(normaliseHex(draft));

  const commit = (next) => {
    setDraft(next);
    onChange(field, next);
  };

  return (
    <div className="appearance__colour">
      <label className="appearance__colour-label" htmlFor={`colour-${field}`}>
        {label}
      </label>

      <div className="appearance__colour-controls">
        <span className="appearance__chip" style={{ "--chip": value }}>
          <input
            type="color"
            className="appearance__picker"
            value={value}
            aria-label={label}
            onChange={(event) => commit(event.target.value)}
          />
        </span>

        <input
          id={`colour-${field}`}
          className={`appearance__code${valid ? "" : " appearance__code--invalid"}`}
          dir="ltr"
          spellCheck="false"
          autoComplete="off"
          value={draft}
          placeholder="#000000"
          aria-invalid={!valid}
          onChange={(event) => commit(event.target.value)}
          onBlur={() => setDraft(value)}
        />
      </div>

      {!valid && (
        <span className="appearance__colour-error" role="alert">
          {t("theme.colours.invalid", "الكود غير صحيح. اكتبه بصيغة ‎#RRGGBB")}
        </span>
      )}
    </div>
  );
}

/**
 * The appearance panel: the theme, and the four colours that are not
 * greyscale. Everything is a preference of the person reading, kept in this
 * browser and never sent to the server, and the panel says so.
 */
export default function AppearanceSettings() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const { colours, setColour, resetColours } = useColours();

  return (
    <section className="appearance" aria-labelledby="appearance-title">
      <header className="appearance__head">
        <h2 className="appearance__title" id="appearance-title">
          {t("theme.section_title", "المظهر")}
        </h2>
        <p className="appearance__note">
          {t("theme.section_note", "يحفظ في هذا المتصفح وحده، ولا يرسل الى الخادم.")}
        </p>
      </header>

      <div className="appearance__row">
        <span className="appearance__label">{t("theme.label", "المظهر")}</span>
        <div className="appearance__segmented" role="radiogroup" aria-label={t("theme.label", "المظهر")}>
          {THEME_OPTIONS.map(({ value, labelKey, fallback }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={theme === value}
              className={`appearance__segment${theme === value ? " appearance__segment--on" : ""}`}
              onClick={() => setTheme(value)}
            >
              {t(labelKey, fallback)}
            </button>
          ))}
        </div>
      </div>

      <div className="appearance__colours">
        {COLOUR_FIELDS.map((field) => {
          const [key, fallback] = COLOUR_LABELS[field];

          return (
            <ColourField
              key={field}
              field={field}
              value={colours[field]}
              label={t(key, fallback)}
              onChange={setColour}
            />
          );
        })}
      </div>

      <div className="appearance__actions">
        <button type="button" className="appearance__reset" onClick={resetColours}>
          {t("theme.colours.reset", "اعد الالوان الافتراضية")}
        </button>
      </div>
    </section>
  );
}
