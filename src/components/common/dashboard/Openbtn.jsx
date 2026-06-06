// src/components/common/dashboard/Openbtn.jsx
// ─── GLOBAL reusable Open/View button ─────────────────────────
// Works everywhere in the dashboard.
// Picks up styles from the parent page's CSS via the className prop.
// Default class: cms-services-icon-btn--edit (icon-only, matches services table)
// Override via className prop for any other context.

import React from "react";
import { useTranslation } from "react-i18next";
import "../../../styles/dashboard/content/dashboard-common.css"

const IconOpen = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 3.375C5.25 3.375 2.048 5.708.75 9c1.298 3.292 4.5 5.625 9.25 5.625S17.952 12.292 19.25 9C17.952 5.708 14.75 3.375 10 3.375Zm0 9.375c-2.07 0-3.75-1.68-3.75-3.75S7.93 5.25 10 5.25s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75Zm0-6A2.25 2.25 0 1 0 10 12a2.25 2.25 0 0 0 0-4.5Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Openbtn — global view/open action button
 *
 * Props:
 *  onClick    {fn}      required — what happens when clicked
 *  label      {string}  optional text label (hidden when iconOnly=true)
 *  title      {string}  tooltip override
 *  disabled   {bool}
 *  iconOnly   {bool}    default true — icon with no text (table rows)
 *  className  {string}  override CSS class entirely
 *  style      {object}  extra inline styles
 */
export default function Openbtn({
  onClick,
  label,
  title,
  disabled = false,
  iconOnly = true,
  className,
  style,
}) {
  const { t } = useTranslation();
  const resolvedClass = className ?? "cms-services-icon-btn cms-services-icon-btn--edit";
  const resolvedTitle = title ?? t("common.open", "Open");

  return (
    <button
      type="button"
      className={resolvedClass}
      title={resolvedTitle}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      <IconOpen />
      {!iconOnly && <span>{label ?? resolvedTitle}</span>}
    </button>
  );
}