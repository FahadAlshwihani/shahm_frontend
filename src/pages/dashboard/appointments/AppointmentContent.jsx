// src/pages/dashboard/appointment/AppointmentContent.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  getAdminAppointmentPage,
  updateAdminAppointmentPage,
  getAdminAppointmentSettings,
  updateAdminAppointmentSettings,
} from "../../../api/appointmentsApi";

/* ── Icons ──────────────────────────────────────────────────── */
const IcoPage = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V5.83L14 2zm0 2.41L15.59 6H14V4.41zM6 4h6v4h4v10H6V4z" fill="currentColor"/>
  </svg>
);
const IcoSettings = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M8.7 2l-.3 1.9a7 7 0 00-1.8.75L4.9 3.4 3.4 4.9l1.25 1.7A7 7 0 003.9 8.4L2 8.7v2.6l1.9.3c.17.64.43 1.25.75 1.8L3.4 15.1l1.5 1.5 1.7-1.25c.55.32 1.16.58 1.8.75L8.7 18h2.6l.3-1.9a7 7 0 001.8-.75l1.7 1.25 1.5-1.5-1.25-1.7c.32-.55.58-1.16.75-1.8L18 11.3V8.7l-1.9-.3a7 7 0 00-.75-1.8L16.6 4.9 15.1 3.4l-1.7 1.25A7 7 0 0011.6 3.9L11.3 2H8.7zM10 7a3 3 0 110 6 3 3 0 010-6z" fill="currentColor"/>
  </svg>
);
const IcoSave = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M15.75 8.063v7.124a.938.938 0 01-.938.938H3.188a.938.938 0 01-.938-.938V3.563c0-.25.1-.488.255-.663A.937.937 0 013.188 2.5h7.124"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m13.5 1.5 3 3-8.25 8.25H5.25V9.75L13.5 1.5Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="appt-spin">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8"
      strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round"/>
  </svg>
);

export default function AppointmentContent() {
  const { t } = useTranslation();
  const [loading, setLoading]   = useState(true);
  const [savingP, setSavingP]   = useState(false);
  const [savingS, setSavingS]   = useState(false);
  const [page,     setPage]     = useState({ title_ar:"", title_en:"", description_ar:"", description_en:"" });
  const [settings, setSettings] = useState({ default_price:"", slot_duration:"60" });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- local loader is intentionally mount-only.
  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pageRes, settingsRes] = await Promise.all([
        getAdminAppointmentPage(),
        getAdminAppointmentSettings(),
      ]);
      setPage(pageRes.data || {});
      setSettings(settingsRes.data || {});
    } catch { toast.error(t("cms.appointments.error.load_failed")); }
    finally  { setLoading(false); }
  };

  const savePage = async () => {
    setSavingP(true);
    try {
      await updateAdminAppointmentPage(page);
      toast.success(t("cms.appointments.content.success.page_saved"));
    } catch { toast.error(t("cms.appointments.error.save_failed")); }
    finally  { setSavingP(false); }
  };

  const saveSettings = async () => {
    setSavingS(true);
    try {
      await updateAdminAppointmentSettings(settings);
      toast.success(t("cms.appointments.content.success.settings_saved"));
    } catch { toast.error(t("cms.appointments.error.save_failed")); }
    finally  { setSavingS(false); }
  };

  if (loading) return (
    <div className="appt-loading">
      <IcoSpinner />
      <span>{t("cms.appointments.loading")}</span>
    </div>
  );

  return (
    <div className="appt-section-content">

      {/* ── Section header ── */}
      <div className="appt-section-header">
        <span className="appt-section-icon appt-section-icon--blue"><IcoPage /></span>
        <div>
          <h2 className="appt-section-title">{t("cms.appointments.content.title")}</h2>
          <p className="appt-section-subtitle">{t("cms.appointments.content.subtitle")}</p>
        </div>
      </div>

      {/* ── PAGE CONTENT CARD ── */}
      <div className="appt-card">
        <div className="appt-card-header">
          <span className="appt-card-icon appt-card-icon--blue"><IcoPage /></span>
          <h3 className="appt-card-title">{t("cms.appointments.content.section_page")}</h3>
        </div>
        <div className="appt-form">
          <div className="appt-form-row appt-form-row--2col">
            <div className="appt-form-group">
              <label className="appt-label">{t("cms.appointments.content.title_ar")}</label>
              <input className="appt-input" dir="rtl"
                placeholder={t("cms.appointments.content.placeholder_title_ar")}
                value={page.title_ar || ""}
                onChange={(e) => setPage({ ...page, title_ar: e.target.value })} />
            </div>
            <div className="appt-form-group">
              <label className="appt-label">{t("cms.appointments.content.title_en")}</label>
              <input className="appt-input" dir="ltr"
                placeholder={t("cms.appointments.content.placeholder_title_en")}
                value={page.title_en || ""}
                onChange={(e) => setPage({ ...page, title_en: e.target.value })} />
            </div>
          </div>
          <div className="appt-form-row appt-form-row--2col">
            <div className="appt-form-group">
              <label className="appt-label">{t("cms.appointments.content.description_ar")}</label>
              <textarea className="appt-textarea" rows={4} dir="rtl"
                placeholder={t("cms.appointments.content.placeholder_description_ar")}
                value={page.description_ar || ""}
                onChange={(e) => setPage({ ...page, description_ar: e.target.value })} />
            </div>
            <div className="appt-form-group">
              <label className="appt-label">{t("cms.appointments.content.description_en")}</label>
              <textarea className="appt-textarea" rows={4} dir="ltr"
                placeholder={t("cms.appointments.content.placeholder_description_en")}
                value={page.description_en || ""}
                onChange={(e) => setPage({ ...page, description_en: e.target.value })} />
            </div>
          </div>
          <div className="appt-form-actions">
            <button className="appt-btn appt-btn--primary" onClick={savePage} disabled={savingP}>
              {savingP ? <IcoSpinner /> : <IcoSave />}
              {savingP ? t("cms.appointments.actions.saving") : t("cms.appointments.actions.save")}
            </button>
          </div>
        </div>
      </div>

      {/* ── SETTINGS CARD ── */}
      <div className="appt-card">
        <div className="appt-card-header">
          <span className="appt-card-icon appt-card-icon--purple"><IcoSettings /></span>
          <h3 className="appt-card-title">{t("cms.appointments.content.section_settings")}</h3>
        </div>
        <div className="appt-form">
          <div className="appt-form-row appt-form-row--2col">
            <div className="appt-form-group">
              <label className="appt-label">{t("cms.appointments.content.default_price")}</label>
              <input className="appt-input" type="number"
                placeholder={t("cms.appointments.content.placeholder_price")}
                value={settings.default_price || ""}
                onChange={(e) => setSettings({ ...settings, default_price: e.target.value })} />
            </div>
            <div className="appt-form-group">
              <label className="appt-label">{t("cms.appointments.content.slot_duration")}</label>
              <select className="appt-input appt-select"
                value={settings.slot_duration || "60"}
                onChange={(e) => setSettings({ ...settings, slot_duration: e.target.value })}>
                {[30,45,60,90,120].map((m) => (
                  <option key={m} value={String(m)}>{m} {t("cms.appointments.content.minutes")}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="appt-form-actions">
            <button className="appt-btn appt-btn--primary" onClick={saveSettings} disabled={savingS}>
              {savingS ? <IcoSpinner /> : <IcoSave />}
              {savingS ? t("cms.appointments.actions.saving") : t("cms.appointments.actions.save_settings")}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
