import React, { useEffect, useState } from "react";
import { useEmailSettingsStore } from "../../../store/useEmailSettingsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSweetAlert } from "../../../components/common/SweetAlert";
import "../../../styles/dashboard/email-settings.css";

/* ══════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════ */
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconServer = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="2" width="13" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1.5" y="9.5" width="13" height="4.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12.5" cy="4.25" r=".75" fill="currentColor" />
    <circle cx="12.5" cy="11.75" r=".75" fill="currentColor" />
  </svg>
);
const IconAt = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10.5 8c0 1.38.62 2.5 2 2.5s2-1.12 2-2.5a6.5 6.5 0 10-2.5 5.1"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconTest = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M5 2h5M4 2v5L2 13h11L11 7V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconReset = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2.5 7.5A5 5 0 1 0 4 4M2.5 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2L3 4.5v3.75C3 11.08 5.14 13.5 8 14.5c2.86-1 5-3.42 5-6.25V4.5L8 2z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M5.5 8.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Spinner = () => (
  <span className="es-spinner" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

/* ══════════════════════════════════════════════════════
   SECTION DIVIDER
══════════════════════════════════════════════════════ */
function SectionDivider({ icon, label }) {
  return (
    <div className="es-divider">
      <span className="es-divider-icon">{icon}</span>
      <span className="es-divider-label">{label}</span>
      <div className="es-divider-line" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════════════════════════ */
function Toggle({ checked, onChange, label }) {
  return (
    <label className="es-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="es-toggle-track"><span className="es-toggle-thumb" /></span>
      <span className="es-toggle-label">{label}</span>
    </label>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function Email_Settings() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetAlertEl, show: showAlert } = useSweetAlert();

  const { settings, fetchSettings, saveSettings, testSMTP, resetDefaults } =
    useEmailSettingsStore();

  const [form, setForm]           = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  /* ── Loading state ── */
  if (!form) {
    return (
      <div className="es-root">
        <div className="es-loading">
          <Spinner />
          <span>{t("common.loading")}</span>
        </div>
      </div>
    );
  }

  /* ── Handlers — logic unchanged ── */
  const handleSave = async () => {
    setLoadingSave(true);
    const result = await saveSettings(form);
    setLoadingSave(false);
    result.success
      ? toast.success(t("cms.email.success.saved"))
      : toast.error(t("cms.email.errors.save_failed"));
  };

  const handleTestSMTP = async () => {
    setLoadingTest(true);
    const result = await testSMTP(form);
    setLoadingTest(false);
    result.success
      ? toast.success(t("cms.email.success.smtp_ok"))
      : toast.error(t("cms.email.errors.smtp_failed", { message: result.message }));
  };

  const handleReset = async () => {
    const confirmed = await showAlert({
      type: "confirm",
      title: t("cms.email.confirm_reset_title"),
      message: t("cms.email.confirm_reset"),
      confirmText: t("cms.email.actions.reset_confirm"),
      cancelText: t("cms.email.actions.cancel"),
      showCancel: true,
      isRtl,
    });
    if (!confirmed) return;
    await resetDefaults();
    toast.success(t("cms.email.success.reset"));
  };

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="es-root" dir={isRtl ? "rtl" : "ltr"}>
      {sweetAlertEl}

      {/* ── Page Header ── */}
      <div className="es-page-header">
        <div className="es-page-header-left">
          <div className="es-page-header-icon"><IconMail /></div>
          <div>
            <h1 className="es-page-title">{t("cms.email.title")}</h1>
            <p className="es-page-subtitle">{t("cms.email.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* ════════ SMTP CONFIGURATION CARD ════════ */}
      <div className="es-card">
        <div className="es-card-header">
          <div className="es-card-header-left">
            <span className="es-card-header-icon es-card-header-icon--blue"><IconServer /></span>
            <h2 className="es-card-title">{t("cms.email.sections.smtp")}</h2>
          </div>
        </div>

        <div className="es-form">
          <SectionDivider icon={<IconServer />} label={t("cms.email.sections.smtp_config")} />

          {/* Row 1: Host + Port */}
          <div className="es-form-row">
            <div className="es-form-group">
              <label className="es-label">{t("cms.email.fields.smtp_host")}</label>
              <input
                className="es-input" dir="ltr"
                value={form.smtp_host}
                onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
                placeholder={t("cms.email.placeholders.smtp_host")}
              />
            </div>
            <div className="es-form-group">
              <label className="es-label">{t("cms.email.fields.smtp_port")}</label>
              <input
                className="es-input" dir="ltr" type="number"
                value={form.smtp_port}
                onChange={(e) => setForm({ ...form, smtp_port: e.target.value })}
                placeholder={t("cms.email.placeholders.smtp_port")}
              />
            </div>
          </div>

          {/* Row 2: Username + Password */}
          <div className="es-form-row">
            <div className="es-form-group">
              <label className="es-label">{t("cms.email.fields.smtp_username")}</label>
              <input
                className="es-input" dir="ltr"
                value={form.smtp_username}
                onChange={(e) => setForm({ ...form, smtp_username: e.target.value })}
                placeholder={t("cms.email.placeholders.smtp_username")}
              />
            </div>
            <div className="es-form-group">
              <label className="es-label">{t("cms.email.fields.smtp_password")}</label>
              <input
                className="es-input" dir="ltr" type="password"
                value={form.smtp_password}
                onChange={(e) => setForm({ ...form, smtp_password: e.target.value })}
                placeholder={t("cms.email.placeholders.smtp_password")}
              />
            </div>
          </div>

          {/* Row 3: TLS + SSL toggles */}
          <SectionDivider icon={<IconShield />} label={t("cms.email.sections.security")} />
          <div className="es-form-row es-form-row--toggles">
            <Toggle
              checked={form.smtp_use_tls}
              onChange={(e) => setForm({ ...form, smtp_use_tls: e.target.checked })}
              label={t("cms.email.fields.use_tls")}
            />
            <Toggle
              checked={form.smtp_use_ssl}
              onChange={(e) => setForm({ ...form, smtp_use_ssl: e.target.checked })}
              label={t("cms.email.fields.use_ssl")}
            />
          </div>
        </div>
      </div>

      {/* ════════ SENDER EMAILS CARD ════════ */}
      <div className="es-card">
        <div className="es-card-header">
          <div className="es-card-header-left">
            <span className="es-card-header-icon es-card-header-icon--purple"><IconAt /></span>
            <h2 className="es-card-title">{t("cms.email.sections.sender")}</h2>
          </div>
        </div>

        <div className="es-form">
          <SectionDivider icon={<IconAt />} label={t("cms.email.sections.sender_config")} />

          {/* Row: Contact email + Auto-reply email */}
          <div className="es-form-row">
            <div className="es-form-group">
              <label className="es-label">{t("cms.email.fields.contact_email")}</label>
              <input
                className="es-input" dir="ltr" type="email"
                value={form.contact_receiver_email}
                onChange={(e) => setForm({ ...form, contact_receiver_email: e.target.value })}
                placeholder={t("cms.email.placeholders.contact_email")}
              />
            </div>
            <div className="es-form-group">
              <label className="es-label">{t("cms.email.fields.auto_reply_email")}</label>
              <input
                className="es-input" dir="ltr" type="email"
                value={form.auto_reply_email}
                onChange={(e) => setForm({ ...form, auto_reply_email: e.target.value })}
                placeholder={t("cms.email.placeholders.auto_reply_email")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ════════ ACTIONS ════════ */}
      <div className="es-actions-bar">
        <div className="es-actions-left">
          <button className="es-btn es-btn--test" onClick={handleTestSMTP} disabled={loadingTest}>
            {loadingTest ? <Spinner /> : <IconTest />}
            {loadingTest ? t("cms.email.actions.testing") : t("cms.email.actions.test")}
          </button>
          <button className="es-btn es-btn--reset" onClick={handleReset}>
            <IconReset />
            {t("cms.email.actions.reset")}
          </button>
        </div>
        <button className="es-btn es-btn--primary" onClick={handleSave} disabled={loadingSave}>
          {loadingSave ? <Spinner /> : <IconSave />}
          {loadingSave ? t("cms.email.actions.saving") : t("cms.email.actions.save")}
        </button>
      </div>
    </div>
  );
}
