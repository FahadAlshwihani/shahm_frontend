import React from "react";
import { useTranslation } from "react-i18next";

import useTheme from "../../hooks/useTheme";
import "../../styles/common/theme-toggle.css";

const IconDay = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconEvening = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M13.2 9.6A5.6 5.6 0 016.4 2.8a5.6 5.6 0 106.8 6.8z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const IconSystem = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.8" y="2.6" width="12.4" height="8.6" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.6 13.8h4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const OPTIONS = [
  { value: "light", labelKey: "theme.light", fallback: "نهار", Icon: IconDay },
  { value: "dark", labelKey: "theme.dark", fallback: "مساء", Icon: IconEvening },
  { value: "system", labelKey: "theme.system", fallback: "النظام", Icon: IconSystem },
];

/**
 * The appearance control. Three states rather than a switch, because
 * following the system is a real answer and a switch cannot express it.
 */
export default function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();

  return (
    <div
      className="theme-toggle"
      role="radiogroup"
      aria-label={t("theme.label", "المظهر")}
    >
      {OPTIONS.map(({ value, labelKey, fallback, Icon }) => {
        const label = t(labelKey, fallback);
        const selected = theme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            title={label}
            className={`theme-toggle__option${selected ? " theme-toggle__option--on" : ""}`}
            onClick={() => setTheme(value)}
          >
            <Icon />
            <span className="theme-toggle__label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
