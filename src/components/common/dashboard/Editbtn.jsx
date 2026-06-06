// src/components/common/dashboard/Editbtn.jsx
// ─── GLOBAL reusable Edit button ──────────────────────────────

import React from "react";
import { useTranslation } from "react-i18next";

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M13.26 3.75L16.5 7M2.25 21.75l1.4-5.07L15.53 4.79a1.5 1.5 0 012.12 0l2.13 2.13a1.5 1.5 0 010 2.12L7.32 20.35 2.25 21.75z"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

/**
 * Editbtn — global edit action button
 *
 * Props:
 *  onClick    {fn}
 *  label      {string}  optional text label
 *  title      {string}  tooltip override
 *  disabled   {bool}
 *  iconOnly   {bool}    default true
 *  className  {string}  override CSS class
 *  style      {object}
 */
export default function Editbtn({
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
  const resolvedTitle = title ?? t("common.edit", "Edit");

  return (
    <button
      type="button"
      className={resolvedClass}
      title={resolvedTitle}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      <IconEdit />
      {!iconOnly && <span>{label ?? resolvedTitle}</span>}
    </button>
  );
}