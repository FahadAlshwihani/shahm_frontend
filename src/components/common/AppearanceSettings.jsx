import React from "react";
import { useTranslation } from "react-i18next";

import useAccent from "../../hooks/useAccent";
import useTheme from "../../hooks/useTheme";
import { ACCENT_NAMES, ACCENTS } from "../../utils/accent";
import "../../styles/common/appearance.css";

const THEME_OPTIONS = [
  { value: "light", labelKey: "theme.light", fallback: "نهار" },
  { value: "dark", labelKey: "theme.dark", fallback: "مساء" },
  { value: "system", labelKey: "theme.system", fallback: "النظام" },
];

/**
 * The appearance panel: the theme, and the one colour that is not neutral.
 *
 * Both are preferences of the person reading, not settings of the site, so
 * they are kept in this browser and never sent to the server. The panel says
 * so rather than leaving it to be guessed.
 */
export default function AppearanceSettings() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const [accent, setAccent] = useAccent();

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

      <div className="appearance__row">
        <span className="appearance__label">{t("theme.accent", "لون التمييز")}</span>
        <div className="appearance__swatches" role="radiogroup" aria-label={t("theme.accent", "لون التمييز")}>
          {ACCENT_NAMES.map((name) => {
            const label = t(`theme.accents.${name}`, name);

            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={accent === name}
                aria-label={label}
                title={label}
                className={`appearance__swatch${accent === name ? " appearance__swatch--on" : ""}`}
                style={{ "--swatch": ACCENTS[name].day }}
                onClick={() => setAccent(name)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
