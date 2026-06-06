// src/pages/dashboard/contact/CMS_Contact.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ContactPageHeaderCMS from "./ContactPageHeaderCMS";
import ContactCardsCMS      from "./ContactCardsCMS";
import ContactFAQPreview    from "./ContactFAQPreview";
import "../../../styles/CMS_CONTACT.css";

/* ── Tab icons ──────────────────────────────────────────────── */
const IcoHeader = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L2.5 6.5v6c0 2.85 2.35 5.6 7.5 6.5 5.15-.9 7.5-3.65 7.5-6.5v-6L10 2z" fill="currentColor"/>
  </svg>
);
const IcoCards = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" fill="currentColor"/>
  </svg>
);
const IcoFAQ = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H9v-2h2v2zm1.93-6.83l-.76.77C11.45 9.67 11 10.25 11 11.5H9V11c0-1.1.45-2.1 1.17-2.83l1.24-1.24c.37-.37.59-.87.59-1.43 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.17l-.14.17z" fill="currentColor"/>
  </svg>
);
const IcoGear = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 9h20M9 9v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TABS = ["header", "cards", "faq"];

export default function CMS_Contact() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [tab, setTab] = useState("header");

  /* ── Sliding indicator ── */
  const tabsBarRef = useRef(null);
  const tabRefs    = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, right: "auto", width: 0 });

  const measureIndicator = useCallback(() => {
    const bar      = tabsBarRef.current;
    const activeIdx = TABS.indexOf(tab);
    const activeEl  = tabRefs.current[activeIdx];
    if (!bar || !activeEl) return;
    const barRect = bar.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();
    if (isRtl) {
      setIndicator({ left: "auto", right: barRect.right - tabRect.right, width: tabRect.width });
    } else {
      setIndicator({ left: tabRect.left - barRect.left, right: "auto", width: tabRect.width });
    }
  }, [tab, isRtl]);

  useEffect(() => {
    const id = requestAnimationFrame(measureIndicator);
    return () => cancelAnimationFrame(id);
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  const tabDefs = [
    { id: "header", label: t("cms.contact.tabs.page_header"), Icon: IcoHeader },
    { id: "cards",  label: t("cms.contact.tabs.contact_cards"), Icon: IcoCards },
    { id: "faq",    label: t("cms.contact.tabs.faq_preview"),   Icon: IcoFAQ   },
  ];

  return (
    <div className="cnt-root" dir={isRtl ? "rtl" : "ltr"}>

      {/* ── PAGE HEADER ── */}
      <div className="cnt-page-header">
        <div className="cnt-page-header-left">
          <div className="cnt-page-header-icon"><IcoGear /></div>
          <div>
            <h1 className="cnt-page-title">{t("cms.contact.title")}</h1>
            <p className="cnt-page-subtitle">{t("cms.contact.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="cnt-tabs-wrapper">
        <div className="cnt-tabs-bar" ref={tabsBarRef}>
          {tabDefs.map(({ id, label, Icon }, idx) => (
            <button
              key={id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              className={`cnt-tab${tab === id ? " cnt-tab--active" : ""}`}
              onClick={() => setTab(id)}
              type="button"
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="cnt-tabs-track">
          <div
            className="cnt-tabs-indicator"
            style={{ left: indicator.left, right: indicator.right, width: indicator.width }}
          />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="cnt-tab-content">
        {tab === "header" && <ContactPageHeaderCMS />}
        {tab === "cards"  && <ContactCardsCMS />}
        {tab === "faq"    && <ContactFAQPreview />}
      </div>

    </div>
  );
}