// src/pages/dashboard/Services_Manage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import ServiceAdvisoryCMS from "./ServiceAdvisoryCMS";
import ServiceAdvisoryRequests from "./ServiceAdvisoryRequests";
import ServiceAdvisoryServices from "./ServiceAdvisoryServices";
import ServicePracticeAreas from "./ServicePracticeAreas";

import "../../../styles/CMS_SERVICE_ADVISORY.css";

export default function Services_Manage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "content", label: t("cms.services.tabs.content"), icon: "📝" },
    { id: "areas", label: t("cms.services.tabs.areas"), icon: "📂" },
    { id: "services", label: t("cms.services.tabs.services"), icon: "⚙️" },
    { id: "requests", label: t("cms.services.tabs.requests"), icon: "📩" },
  ];

  return (
    <div className="dashboard-services-container">
      {/* ===== PAGE HEADER ===== */}
      <div className="dashboard-services-header">
        <div className="dashboard-services-header-content">
          <h1 className="dashboard-services-title">
            {t("cms.services.title")}
          </h1>
          <p className="dashboard-services-subtitle">
            {t("cms.services.subtitle")}
          </p>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="dashboard-services-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dashboard-services-tab ${
              activeTab === tab.id ? "dashboard-services-tab-active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {tab.id === "content" && (
                <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H12V17H3V15Z" fill="currentColor"/>
              )}
              {tab.id === "areas" && (
                <path d="M10 4H4C2.9 4 2 4.9 2 6V14C2 15.1 2.9 16 4 16H16C17.1 16 18 15.1 18 14V8C18 6.9 17.1 6 16 6H12L10 4Z" fill="currentColor"/>
              )}
              {tab.id === "services" && (
                <path d="M12.5 6.9C12.99 6.9 13.39 7.29 13.39 7.79V14.79C13.39 15.29 12.99 15.69 12.5 15.69C12.01 15.69 11.61 15.29 11.61 14.79V7.79C11.61 7.29 12.01 6.9 12.5 6.9ZM7.5 10C7.99 10 8.39 10.4 8.39 10.89V14.79C8.39 15.29 7.99 15.69 7.5 15.69C7.01 15.69 6.61 15.29 6.61 14.79V10.89C6.61 10.4 7.01 10 7.5 10ZM17.5 4C17.99 4 18.39 4.4 18.39 4.89V14.79C18.39 15.29 17.99 15.69 17.5 15.69C17.01 15.69 16.61 15.29 16.61 14.79V4.89C16.61 4.4 17.01 4 17.5 4ZM2.5 13C2.99 13 3.39 13.4 3.39 13.89V14.79C3.39 15.29 2.99 15.69 2.5 15.69C2.01 15.69 1.61 15.29 1.61 14.79V13.89C1.61 13.4 2.01 13 2.5 13Z" fill="currentColor"/>
              )}
              {tab.id === "requests" && (
                <path d="M4 4H16C17.1 4 18 4.9 18 6V14C18 15.1 17.1 16 16 16H4C2.9 16 2 15.1 2 14V6C2 4.9 2.9 4 4 4ZM4 8L10 11L16 8V6L10 9L4 6V8Z" fill="currentColor"/>
              )}
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="dashboard-services-tab-content">
        {activeTab === "content" && <ServiceAdvisoryCMS />}
        {activeTab === "areas" && <ServicePracticeAreas />}
        {activeTab === "services" && <ServiceAdvisoryServices />}
        {activeTab === "requests" && <ServiceAdvisoryRequests />}
      </div>
    </div>
  );
}