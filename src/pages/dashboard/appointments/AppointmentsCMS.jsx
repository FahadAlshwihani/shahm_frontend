// src/pages/dashboard/appointment/AppointmentsCMS.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import AppointmentContent  from "./AppointmentContent";
import AppointmentSlots    from "./AppointmentSlots";
import AppointmentBookings from "./AppointmentBookings";
import "../../../styles/dashboard/appointments.css";

/* ── Tab icons ──────────────────────────────────────────────── */
const IcoContent = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M3 3h14v4H3V3zm0 6h14v4H3V9zm0 6h9v2H3v-2z" fill="currentColor"/>
  </svg>
);
const IcoSlots = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M5 3a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 4h12v10H5V7z" fill="currentColor"/>
  </svg>
);
const IcoBookings = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM9 16H7v-2h2v2zm0-3H7v-2h2v2zm0-3H7V8h2v2zm4 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V8h2v2z" fill="currentColor"/>
  </svg>
);
const IcoGear = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 9h20M9 9v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TABS = ["content", "slots", "bookings"];

export default function AppointmentsCMS() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("content");

  /* ── Sliding indicator — mirrors srv-panel / dash-modal pattern ── */
  const tabsBarRef = useRef(null);
  const tabRefs    = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const measureIndicator = useCallback(() => {
    const bar      = tabsBarRef.current;
    const activeIdx = TABS.indexOf(activeTab);
    const activeEl  = tabRefs.current[activeIdx];
    if (!bar || !activeEl) return;
    const barRect = bar.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();
    if (isRtl) {
      setIndicator({ left: "auto", right: barRect.right - tabRect.right, width: tabRect.width });
    } else {
      setIndicator({ left: tabRect.left - barRect.left, right: "auto", width: tabRect.width });
    }
  }, [activeTab, isRtl]);

  useEffect(() => {
    const id = requestAnimationFrame(measureIndicator);
    return () => cancelAnimationFrame(id);
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  const tabDefs = [
    { id: "content",  label: t("cms.appointments.tabs.content"),  Icon: IcoContent  },
    { id: "slots",    label: t("cms.appointments.tabs.slots"),    Icon: IcoSlots    },
    { id: "bookings", label: t("cms.appointments.tabs.bookings"), Icon: IcoBookings },
  ];

  return (
    <div className="appt-root" dir={isRtl ? "rtl" : "ltr"}>

      {/* ── PAGE HEADER ── */}
      <div className="appt-page-header">
        <div className="appt-page-header-left">
          <div className="appt-page-header-icon"><IcoGear /></div>
          <div>
            <h1 className="appt-page-title">{t("cms.appointments.title")}</h1>
            <p className="appt-page-subtitle">{t("cms.appointments.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* ── TABS — sliding underline indicator ── */}
      <div className="appt-tabs-wrapper">
        <div className="appt-tabs-bar" ref={tabsBarRef}>
          {tabDefs.map(({ id, label, Icon }, idx) => (
            <button
              key={id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              className={`appt-tab${activeTab === id ? " appt-tab--active" : ""}`}
              onClick={() => setActiveTab(id)}
              type="button"
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="appt-tabs-track">
          <div
            className="appt-tabs-indicator"
            style={{ left: indicator.left, right: indicator.right, width: indicator.width }}
          />
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="appt-tab-content">
        {activeTab === "content"  && <AppointmentContent  />}
        {activeTab === "slots"    && <AppointmentSlots    />}
        {activeTab === "bookings" && <AppointmentBookings />}
      </div>

    </div>
  );
}
