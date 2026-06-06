// src/pages/dashboard/services/_shared.jsx
// Shared micro-components used by all services sub-pages
import React from "react";
import { useTranslation } from "react-i18next";

/* ── Icons ─────────────────────────────────────────────────────────────────── */
export const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13.26 3.75L16.5 7M2.25 21.75l1.4-5.07L15.53 4.79a1.5 1.5 0 012.12 0l2.13 2.13a1.5 1.5 0 010 2.12L7.32 20.35 2.25 21.75z"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" fill="currentColor">
    <path d="M20 2C18.355 2 17 3.355 17 5v2H4a1 1 0 100 2h13.832a1 1 0 00.326 0h11.674a1 1 0 00.326 0H44a1 1 0 100-2H31V5c0-1.645-1.355-3-3-3h-8zm0 2h8c.565 0 1 .435 1 1v2H19V5c0-.565.435-1 1-1zM6.98 10.986a1 1 0 00-.986 1.108l2.67 28.369C8.9 43.03 11.061 45 13.64 45h20.72c2.579 0 4.74-1.97 4.976-4.538l2.67-28.369a1 1 0 10-1.992-.187L37.344 40.28C37.2 41.851 35.94 43 34.36 43H13.64c-1.58 0-2.84-1.149-2.984-2.72L7.986 11.906a1 1 0 00-1.006-.92z" />
  </svg>
);
export const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M11.5 1.5L1.5 11.5M1.5 1.5L11.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const IconToggle = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="4" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="10" cy="7" r="2" fill="currentColor" />
  </svg>
);
export const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="5.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 10.5l4-3.5 3 2.5 2.5-2 3 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
export const IconUpload = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 10V2M4.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11v1.5A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const IconInfo = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7.5 5v-.5M7.5 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L1.5 15h15L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9 7v4M9 12.5v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/* ── Spinner ────────────────────────────────────────────────────────────────── */
export const SvcSpinner = () => (
  <span className="cms-services-spinner">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

/* ── Section Divider ────────────────────────────────────────────────────────── */
export function SvcDivider({ icon, label }) {
  return (
    <div className="cms-services-divider">
      <span className="cms-services-divider-icon">{icon}</span>
      <span className="cms-services-divider-label">{label}</span>
      <div className="cms-services-divider-line" />
    </div>
  );
}

/* ── Toggle Switch ──────────────────────────────────────────────────────────── */
export function SvcToggle({ checked, onChange, label }) {
  return (
    <label className="cms-services-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="cms-services-toggle-track">
        <span className="cms-services-toggle-thumb" />
      </span>
      <span className="cms-services-toggle-label">{label}</span>
    </label>
  );
}

/* ── Status Badge ───────────────────────────────────────────────────────────── */
export function SvcStatusBadge({ active }) {
  const { t } = useTranslation();
  return (
    <span className={`cms-services-status-badge ${active ? "cms-services-status-badge--active" : "cms-services-status-badge--inactive"}`}>
      <span className="cms-services-status-dot" />
      {active ? t("cms.services.status.active") : t("cms.services.status.inactive")}
    </span>
  );
}

/* ── Content Header ─────────────────────────────────────────────────────────── */
export function SvcContentHeader({ icon, title, subtitle }) {
  return (
    <div className="cms-services-content-header">
      <div className="cms-services-content-header-left">
        <span className="cms-services-content-header-icon">{icon}</span>
        <div>
          <h2 className="cms-services-content-title">{title}</h2>
          {subtitle && <p className="cms-services-content-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

/* ── Card Header ────────────────────────────────────────────────────────────── */
export function SvcCardHeader({ icon, title, accent = "blue", right }) {
  return (
    <div className="cms-services-card-header">
      <div className="cms-services-card-header-left">
        <span className={`cms-services-card-icon cms-services-card-icon--${accent}`}>{icon}</span>
        <h3 className="cms-services-card-title">{title}</h3>
      </div>
      {right && <div className="cms-services-card-header-right">{right}</div>}
    </div>
  );
}

/* ── Empty State ────────────────────────────────────────────────────────────── */
export function SvcEmpty({ message }) {
  return (
    <div className="cms-services-empty">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" opacity=".25" />
        <path d="M13 20h14M20 13v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".35" />
      </svg>
      <p>{message}</p>
    </div>
  );
}

/* ── Loading state ──────────────────────────────────────────────────────────── */
export function SvcLoading() {
  const { t } = useTranslation();
  return (
    <div className="cms-services-loading">
      <SvcSpinner />
      <span>{t("cms.services.loading")}</span>
    </div>
  );
}

/* ── Code chip ──────────────────────────────────────────────────────────────── */
export function SvcCode({ children }) {
  return <code className="cms-services-code-chip">{children}</code>;
}

/* ── Count badge ────────────────────────────────────────────────────────────── */
export function SvcCountBadge({ count }) {
  return <span className="cms-services-count-badge">{count}</span>;
}