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
    <div className="cms-contact-container">
      {/* ===== HEADER ===== */}
      <div className="cms-contact-header">
        <h1 className="cms-contact-title">
          {t("cms.contact.title")}
        </h1>
        <p className="cms-contact-subtitle">
          {t("cms.contact.subtitle")}
        </p>
      </div>

      {/* ===== TABS ===== */}
      <div className="cms-contact-tabs-card">
        <div className="cms-contact-tabs">
          <button
            className={`cms-contact-tab ${tab === "header" ? "active" : ""}`}
            onClick={() => setTab("header")}
          >
            {t("cms.contact.tabs.page_header")}
          </button>

          <button
            className={`cms-contact-tab ${tab === "cards" ? "active" : ""}`}
            onClick={() => setTab("cards")}
          >
            {t("cms.contact.tabs.contact_cards")}
          </button>

          <button
            className={`cms-contact-tab ${tab === "faq" ? "active" : ""}`}
            onClick={() => setTab("faq")}
          >
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