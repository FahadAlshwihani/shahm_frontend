// src/pages/dashboard/AppointmentsCMS.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import AppointmentContent from "./AppointmentContent";
import AppointmentSlots from "./AppointmentSlots";
import AppointmentBookings from "./AppointmentBookings";

import "../../../styles/CMS_Appointments.css";

export default function AppointmentsCMS() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("content");

  const tabs = [
    { id: "content", label: t("cms.appointments.tabs.content"), icon: "📝" },
    { id: "slots", label: t("cms.appointments.tabs.slots"), icon: "📅" },
    { id: "bookings", label: t("cms.appointments.tabs.bookings"), icon: "📋" },
  ];

  return (
    <div className="dashboard-appointments-container">
      {/* ===== PAGE HEADER ===== */}
      <div className="dashboard-appointments-header">
        <div className="dashboard-appointments-header-content">
          <h1 className="dashboard-appointments-title">
            {t("cms.appointments.title")}
          </h1>
          <p className="dashboard-appointments-subtitle">
            {t("cms.appointments.subtitle")}
          </p>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="dashboard-appointments-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dashboard-appointments-tab ${
              activeTab === tab.id ? "dashboard-appointments-tab-active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {tab.id === "content" && (
                <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H12V17H3V15Z" fill="currentColor"/>
              )}
              {tab.id === "slots" && (
                <path d="M5 3C3.9 3 3 3.9 3 5V17C3 18.1 3.9 19 5 19H17C18.1 19 19 18.1 19 17V5C19 3.9 18.1 3 17 3H5ZM5 7H17V17H5V7Z" fill="currentColor"/>
              )}
              {tab.id === "bookings" && (
                <path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2ZM9 16H7V14H9V16ZM9 13H7V11H9V13ZM9 10H7V8H9V10ZM13 16H11V14H13V16ZM13 13H11V11H13V13ZM13 10H11V8H13V10Z" fill="currentColor"/>
              )}
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="dashboard-appointments-tab-content">
        {activeTab === "content" && <AppointmentContent />}
        {activeTab === "slots" && <AppointmentSlots />}
        {activeTab === "bookings" && <AppointmentBookings />}
      </div>
    </div>
  );
}