import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ContactPageHeaderCMS from "./ContactPageHeaderCMS";
import ContactCardsCMS from "./ContactCardsCMS";
import ContactFAQPreview from "./ContactFAQPreview";
import "../../../styles/CMS_CONTACT.css";

export default function CMS_Contact() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("header");

  return (
    <div className="dashboard-contact-container">
      {/* ===== HEADER ===== */}
      <div className="dashboard-contact-header">
        <div className="dashboard-contact-header-content">
          <h1 className="dashboard-contact-title">{t("cms.contact.title")}</h1>
          <p className="dashboard-contact-subtitle">{t("cms.contact.subtitle")}</p>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="dashboard-contact-tabs-card">
        <div className="dashboard-contact-tabs">
          <button
            className={`dashboard-contact-tab ${tab === "header" ? "dashboard-contact-tab-active" : ""}`}
            onClick={() => setTab("header")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2.5 6.5V12.5C2.5 15.35 4.85 18.1 10 19C15.15 18.1 17.5 15.35 17.5 12.5V6.5L10 2Z" fill="currentColor"/>
            </svg>
            {t("cms.contact.tabs.page_header")}
          </button>

          <button
            className={`dashboard-contact-tab ${tab === "cards" ? "dashboard-contact-tab-active" : ""}`}
            onClick={() => setTab("cards")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H9V9H3V3ZM11 3H17V9H11V3ZM3 11H9V17H3V11ZM11 11H17V17H11V11Z" fill="currentColor"/>
            </svg>
            {t("cms.contact.tabs.contact_cards")}
          </button>

          <button
            className={`dashboard-contact-tab ${tab === "faq" ? "dashboard-contact-tab-active" : ""}`}
            onClick={() => setTab("faq")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C5.6 2 2 5.6 2 10C2 14.4 5.6 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2ZM11 15H9V13H11V15ZM12.93 9.17L12.17 9.94C11.45 10.67 11 11.25 11 12.5H9V12C9 10.9 9.45 9.9 10.17 9.17L11.41 7.93C11.78 7.56 12 7.06 12 6.5C12 5.4 11.1 4.5 10 4.5C8.9 4.5 8 5.4 8 6.5H6C6 4.29 7.79 2.5 10 2.5C12.21 2.5 14 4.29 14 6.5C14 7.38 13.64 8.17 13.07 8.75L12.93 9.17Z" fill="currentColor"/>
            </svg>
            {t("cms.contact.tabs.faq_preview")}
          </button>
        </div>
      </div>

      {/* ===== TAB CONTENT ===== */}
      {tab === "header" && <ContactPageHeaderCMS />}
      {tab === "cards" && <ContactCardsCMS />}
      {tab === "faq" && <ContactFAQPreview />}
    </div>
  );
}