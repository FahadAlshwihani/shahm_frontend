// src/pages/dashboard/AppointmentContent.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  getAdminAppointmentPage,
  updateAdminAppointmentPage,
  getAdminAppointmentSettings,
  updateAdminAppointmentSettings,
} from "../../../api/appointmentsApi";

export default function AppointmentContent() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
  });

  const [settings, setSettings] = useState({
    price_in_person: "",
    price_online: "",
    slot_duration: "60",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pageRes, settingsRes] = await Promise.all([
        getAdminAppointmentPage(),
        getAdminAppointmentSettings(),
      ]);

      setPage(pageRes.data || {});
      setSettings(settingsRes.data || {});
    } catch (err) {
      console.error(err);
      toast.error(t("cms.appointments.error.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  const savePage = async () => {
    try {
      await updateAdminAppointmentPage(page);
      toast.success(t("cms.appointments.content.success.page_saved"));
    } catch {
      toast.error(t("cms.appointments.error.save_failed"));
    }
  };

  const saveSettings = async () => {
    try {
      await updateAdminAppointmentSettings(settings);
      toast.success(t("cms.appointments.content.success.settings_saved"));
    } catch (err) {
      console.error(err);
      toast.error(t("cms.appointments.error.save_failed"));
    }
  };

  if (loading) return null;

  return (
    <div className="dashboard-appointments-content">
      {/* PAGE CONTENT */}
      <div className="dashboard-appointments-content-header">
        <div className="dashboard-appointments-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.appointments.content.title")}</h2>
        </div>
        <p className="dashboard-appointments-content-subtitle">
          {t("cms.appointments.content.subtitle")}
        </p>
      </div>

      <div className="dashboard-appointments-form-card">
        <div className="dashboard-appointments-form-section">
          <h3 className="dashboard-appointments-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5Z" fill="currentColor"/>
            </svg>
            {t("cms.appointments.content.section_page")}
          </h3>

          <div className="dashboard-appointments-form-grid-row">
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.title_ar")}
              </label>
              <input
                className="dashboard-appointments-input"
                placeholder={t("cms.appointments.content.placeholder_title_ar")}
                value={page.title_ar || ""}
                onChange={(e) => setPage({ ...page, title_ar: e.target.value })}
                dir="rtl"
              />
            </div>

            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.title_en")}
              </label>
              <input
                className="dashboard-appointments-input"
                placeholder={t("cms.appointments.content.placeholder_title_en")}
                value={page.title_en || ""}
                onChange={(e) => setPage({ ...page, title_en: e.target.value })}
              />
            </div>
          </div>

          <div className="dashboard-appointments-form-grid-row">
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.description_ar")}
              </label>
              <textarea
                className="dashboard-appointments-textarea"
                placeholder={t("cms.appointments.content.placeholder_description_ar")}
                value={page.description_ar || ""}
                onChange={(e) => setPage({ ...page, description_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.description_en")}
              </label>
              <textarea
                className="dashboard-appointments-textarea"
                placeholder={t("cms.appointments.content.placeholder_description_en")}
                value={page.description_en || ""}
                onChange={(e) => setPage({ ...page, description_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <div className="dashboard-appointments-form-actions">
            <button onClick={savePage} className="dashboard-appointments-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {t("cms.appointments.actions.save")}
            </button>
          </div>
        </div>

        {/* SETTINGS */}
        <div className="dashboard-appointments-form-section">
          <h3 className="dashboard-appointments-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.19 9C15.19 9.12 15.18 9.24 15.17 9.36L16.82 10.63C16.96 10.74 17 10.93 16.92 11.09L15.35 13.91C15.27 14.07 15.09 14.13 14.92 14.07L13.01 13.34C12.62 13.65 12.2 13.92 11.74 14.13L11.46 16.18C11.44 16.36 11.29 16.5 11.11 16.5H7.97C7.79 16.5 7.64 16.36 7.62 16.18L7.34 14.13C6.88 13.92 6.46 13.65 6.07 13.34L4.16 14.07C3.99 14.13 3.81 14.07 3.73 13.91L2.16 11.09C2.08 10.93 2.12 10.74 2.26 10.63L3.91 9.36C3.9 9.24 3.89 9.12 3.89 9C3.89 8.88 3.9 8.76 3.91 8.64L2.26 7.37C2.12 7.26 2.08 7.07 2.16 6.91L3.73 4.09C3.81 3.93 3.99 3.87 4.16 3.93L6.07 4.66C6.46 4.35 6.88 4.08 7.34 3.87L7.62 1.82C7.64 1.64 7.79 1.5 7.97 1.5H11.11C11.29 1.5 11.44 1.64 11.46 1.82L11.74 3.87C12.2 4.08 12.62 4.35 13.01 4.66L14.92 3.93C15.09 3.87 15.27 3.93 15.35 4.09L16.92 6.91C17 7.07 16.96 7.26 16.82 7.37L15.17 8.64C15.18 8.76 15.19 8.88 15.19 9ZM9.54 6C7.84 6 6.46 7.38 6.46 9.08C6.46 10.78 7.84 12.16 9.54 12.16C11.24 12.16 12.62 10.78 12.62 9.08C12.62 7.38 11.24 6 9.54 6Z" fill="currentColor"/>
            </svg>
            {t("cms.appointments.content.section_settings")}
          </h3>

          <div className="dashboard-appointments-form-grid">
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.price_in_person")}
              </label>
              <input
                className="dashboard-appointments-input"
                type="number"
                placeholder={t("cms.appointments.content.placeholder_price")}
                value={settings.price_in_person || ""}
                onChange={(e) =>
                  setSettings({ ...settings, price_in_person: e.target.value })
                }
              />
            </div>

            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.price_online")}
              </label>
              <input
                className="dashboard-appointments-input"
                type="number"
                placeholder={t("cms.appointments.content.placeholder_price")}
                value={settings.price_online || ""}
                onChange={(e) =>
                  setSettings({ ...settings, price_online: e.target.value })
                }
              />
            </div>

            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.content.slot_duration")}
              </label>
              <select
                className="dashboard-appointments-select"
                value={settings.slot_duration || "60"}
                onChange={(e) =>
                  setSettings({ ...settings, slot_duration: e.target.value })
                }
              >
                <option value="30">30 {t("cms.appointments.content.minutes")}</option>
                <option value="45">45 {t("cms.appointments.content.minutes")}</option>
                <option value="60">60 {t("cms.appointments.content.minutes")}</option>
                <option value="90">90 {t("cms.appointments.content.minutes")}</option>
                <option value="120">120 {t("cms.appointments.content.minutes")}</option>
              </select>
            </div>
          </div>

          <div className="dashboard-appointments-form-actions">
            <button onClick={saveSettings} className="dashboard-appointments-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {t("cms.appointments.actions.save_settings")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}