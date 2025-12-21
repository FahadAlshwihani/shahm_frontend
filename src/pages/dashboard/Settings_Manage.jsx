import React, { useEffect, useState } from "react";
import { useEmailSettingsStore } from "../../store/useEmailSettingsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_EMAILSETTINGS.css";

export default function Email_Settings() {
  const { t } = useTranslation();

  const {
    settings,
    fetchSettings,
    saveSettings,
    testSMTP,
    resetDefaults,
  } = useEmailSettingsStore();

  const [form, setForm] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) {
    return (
      <div className="email-settings-container">
        <div className="email-settings-loading">
          {t("common.loading")}
        </div>
      </div>
    );
  }

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
      : toast.error(
          t("cms.email.errors.smtp_failed", { message: result.message })
        );
  };

  const handleReset = async () => {
    if (window.confirm(t("cms.email.confirm_reset"))) {
      await resetDefaults();
      toast.success(t("cms.email.success.reset"));
    }
  };

  return (
    <div className="email-settings-container">
      <div className="email-settings-header">
        <h1 className="email-settings-title">{t("cms.email.title")}</h1>
        <div className="email-settings-subtitle">{t("cms.email.subtitle")}</div>
      </div>

      {/* ================= SMTP CONFIGURATION ================= */}
      <div className="email-settings-card">
        <div className="email-settings-card-header">
          <h2>{t("cms.email.sections.smtp")}</h2>
        </div>

        <div className="email-settings-section">
          <h3 className="email-settings-section-title">{t("cms.email.sections.smtp_config")}</h3>
          <div className="email-settings-grid">
            <div className="email-settings-group">
              <label className="email-settings-label">{t("cms.email.fields.smtp_host")}</label>
              <input
                className="email-settings-input"
                value={form.smtp_host}
                onChange={(e) =>
                  setForm({ ...form, smtp_host: e.target.value })
                }
                placeholder={t("cms.email.placeholders.smtp_host")}
              />
            </div>

            <div className="email-settings-group">
              <label className="email-settings-label">{t("cms.email.fields.smtp_port")}</label>
              <input
                className="email-settings-input"
                type="number"
                value={form.smtp_port}
                onChange={(e) =>
                  setForm({ ...form, smtp_port: e.target.value })
                }
                placeholder={t("cms.email.placeholders.smtp_port")}
              />
            </div>

            <div className="email-settings-group">
              <label className="email-settings-label">{t("cms.email.fields.smtp_username")}</label>
              <input
                className="email-settings-input"
                value={form.smtp_username}
                onChange={(e) =>
                  setForm({ ...form, smtp_username: e.target.value })
                }
                placeholder={t("cms.email.placeholders.smtp_username")}
              />
            </div>

            <div className="email-settings-group">
              <label className="email-settings-label">{t("cms.email.fields.smtp_password")}</label>
              <input
                className="email-settings-input"
                type="password"
                value={form.smtp_password}
                onChange={(e) =>
                  setForm({ ...form, smtp_password: e.target.value })
                }
                placeholder={t("cms.email.placeholders.smtp_password")}
              />
            </div>
          </div>

          <div className="email-settings-checkbox-group">
            <label className="email-settings-checkbox-label">
              <input
                type="checkbox"
                checked={form.smtp_use_tls}
                onChange={(e) =>
                  setForm({ ...form, smtp_use_tls: e.target.checked })
                }
              />
              <span className="email-settings-checkbox-text">{t("cms.email.fields.use_tls")}</span>
            </label>

            <label className="email-settings-checkbox-label">
              <input
                type="checkbox"
                checked={form.smtp_use_ssl}
                onChange={(e) =>
                  setForm({ ...form, smtp_use_ssl: e.target.checked })
                }
              />
              <span className="email-settings-checkbox-text">{t("cms.email.fields.use_ssl")}</span>
            </label>
          </div>
        </div>
      </div>

      {/* ================= SENDER EMAILS ================= */}
      <div className="email-settings-card">
        <div className="email-settings-card-header">
          <h2>{t("cms.email.sections.sender")}</h2>
        </div>

        <div className="email-settings-section">
          <h3 className="email-settings-section-title">{t("cms.email.sections.sender_config")}</h3>
          <div className="email-settings-grid">
            <div className="email-settings-group">
              <label className="email-settings-label">{t("cms.email.fields.contact_email")}</label>
              <input
                className="email-settings-input"
                type="email"
                value={form.contact_receiver_email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact_receiver_email: e.target.value,
                  })
                }
                placeholder={t("cms.email.placeholders.contact_email")}
              />
            </div>

            <div className="email-settings-group">
              <label className="email-settings-label">{t("cms.email.fields.auto_reply_email")}</label>
              <input
                className="email-settings-input"
                type="email"
                value={form.auto_reply_email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    auto_reply_email: e.target.value,
                  })
                }
                placeholder={t("cms.email.placeholders.auto_reply_email")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="email-settings-actions">
        <button 
          className="email-settings-btn-test" 
          onClick={handleTestSMTP} 
          disabled={loadingTest}
        >
          {loadingTest
            ? t("cms.email.actions.testing")
            : t("cms.email.actions.test")}
        </button>

        <button 
          className="email-settings-btn-reset" 
          onClick={handleReset}
        >
          {t("cms.email.actions.reset")}
        </button>

        <button 
          className="email-settings-btn-primary" 
          onClick={handleSave} 
          disabled={loadingSave}
        >
          {loadingSave
            ? t("cms.email.actions.saving")
            : t("cms.email.actions.save")}
        </button>
      </div>
    </div>
  );
}