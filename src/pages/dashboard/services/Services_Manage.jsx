// src/pages/dashboard/services/Services_Manage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ServicesPageCMS from "./ServicesPageCMS";
import MainServices from "./MainServices";
import Services from "./Services";
import ServiceSections from "./ServiceSections";
import ServiceRequests from "./requests/ServiceRequests";
import ImportServices from "./ImportServices";
import "../../../styles/CMS_SERVICES.css";
import "../../../styles/dashboard/content/dashboard-common.css";

/* ── Tab icons ── */
const IconCMS = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1zM3 9h10M7 4v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconFolder = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1.5 3.5A1.5 1.5 0 013 2h3l1.5 2H13A1.5 1.5 0 0114.5 5.5v6A1.5 1.5 0 0113 13H3a1.5 1.5 0 01-1.5-1.5V3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
  </svg>
);
const IconServices = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);
const IconSections = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3h12M2 7h12M2 11h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconRequests = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 6l6.5 3.5L14.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconImport = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12v1.5A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5V12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconGear = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 8h18M8 8v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Services_Manage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("cms");

  const tabs = [
    { id: "cms",           label: t("cms.services.tabs.cms"),          icon: <IconCMS /> },
    { id: "main-services", label: t("cms.services.tabs.mainServices"),  icon: <IconFolder /> },
    { id: "services",      label: t("cms.services.tabs.services"),      icon: <IconServices /> },
    { id: "sections",      label: t("cms.services.tabs.sections"),      icon: <IconSections /> },
    { id: "requests",      label: t("cms.services.tabs.requests"),      icon: <IconRequests /> },
    { id: "import",        label: t("cms.services.tabs.import"),        icon: <IconImport /> },
  ];

  return (
    <div className="cms-services-root">

      {/* Page header */}
      <div className="cms-services-page-header">
        <div className="cms-services-page-header-left">
          <div className="cms-services-page-header-icon"><IconGear /></div>
          <div>
            <h1 className="cms-services-page-title">{t("cms.services.title")}</h1>
            <p className="cms-services-page-subtitle">{t("cms.services.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="cms-services-tabs-bar">
        <div className="cms-services-tabs-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`cms-services-tab-btn ${activeTab === tab.id ? "cms-services-tab-btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <span className="cms-services-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="cms-services-tab-content">
        {activeTab === "cms"           && <ServicesPageCMS />}
        {activeTab === "main-services" && <MainServices />}
        {activeTab === "services"      && <Services />}
        {activeTab === "sections"      && <ServiceSections />}
        {activeTab === "requests"      && <ServiceRequests />}
        {activeTab === "import"        && <ImportServices />}
      </div>
    </div>
  );
}