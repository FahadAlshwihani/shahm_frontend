// src/components/forms/PublicSuccessCard.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { openExternalUrl } from "../../utils/safeNavigation";

const IconCopy = () => (
  <svg width="11.5" height="13.5" viewBox="0 0 12 14" fill="none" aria-hidden="true">
    <rect x="3.5" y="3.5" width="7" height="9" rx="1"
      stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 10.5V1.5H8.5"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
    <path d="M1.5 5.5L5 9L11.5 1.5"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PublicSuccessCard({ data, onClose, isEn }) {
  const { i18n } = useTranslation();
  const lang = isEn !== undefined ? isEn : i18n.language === "en";
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const title       = lang ? data.title_en       : data.title_ar;
  const subtitle    = lang ? data.subtitle_en    : data.subtitle_ar;
  const description = lang ? data.description_en : data.description_ar;
  const btnLabel    = lang ? data.button_label_en : data.button_label_ar;

  const handleCopy = () => {
    if (!data.reference_number) return;
    navigator.clipboard.writeText(String(data.reference_number)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handleBtn = () => {
    if (data.button_action_type === "close") { onClose?.(); return; }
    if (data.button_action_type === "url" && data.button_url) {
      openExternalUrl(data.button_url);
    }
  };

  return (
    <div className="srm-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="psc-card">

        {data.logo_url && (
          <div className="psc-logo-wrap">
            <img src={data.logo_url} className="psc-logo" alt="" />
          </div>
        )}

        {title && (
          <h2 className="psc-title">{title}</h2>
        )}

        <div className="psc-text-block">
          {subtitle    && <p className="psc-subtitle">{subtitle}</p>}
          {description && <p className="psc-description">{description}</p>}
        </div>

        {data.show_reference_number && data.reference_number && (
          <div className="psc-ref-row">
            <span className="psc-ref-text">
              {lang ? "Request Number" : "رقم الطلب"}
              {": "}
              {data.reference_prefix || "#"}{data.reference_number}
            </span>
            <button
              type="button"
              className={`psc-copy-btn${copied ? " copied" : ""}`}
              onClick={handleCopy}
              aria-label={lang ? "Copy" : "نسخ"}
              title={copied ? (lang ? "Copied!" : "تم النسخ") : (lang ? "Copy" : "نسخ")}
            >
              {copied ? <IconCheck /> : <IconCopy />}
            </button>
          </div>
        )}

        {btnLabel && data.button_action_type !== "none" && (
          <button type="button" className="psc-btn" onClick={handleBtn}>
            <span className="psc-btn-text">{btnLabel}</span>
          </button>
        )}

      </div>
    </div>
  );
}
