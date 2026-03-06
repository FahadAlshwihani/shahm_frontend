// src/pages/dashboard/Settings_Manage.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_SITESETTINGS.css";

export default function Settings_Manage() {
  const { t } = useTranslation();
  const { settings, fetchSettings, saveSettings, loading } = useSettingsStore();

  const [form, setForm] = useState({
    site_name_ar: "",
    site_name_en: "",
    contact_receiver_email: "",
    auto_reply_email: "",
    phone_number: "",
    whatsapp_number: "",
    address: "",
    map_embed: "",
    linkedin_url: "",
    x_url: "",
    instagram_url: "",
    country: "",
    locale: "",
    logo_light: null,
    logo_dark: null,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setForm({
        site_name_ar: settings.site_name_ar || "",
        site_name_en: settings.site_name_en || "",
        contact_receiver_email: settings.contact_receiver_email || "",
        auto_reply_email: settings.auto_reply_email || "",
        phone_number: settings.phone_number || "",
        whatsapp_number: settings.whatsapp_number || "",
        address: settings.address || "",
        map_embed: settings.map_embed || "",
        linkedin_url: settings.linkedin_url || "",
        x_url: settings.x_url || "",
        instagram_url: settings.instagram_url || "",
        country: settings.country || "",
        locale: settings.locale || "ar",
        logo_light: null,
        logo_dark: null,
      });
    }
  }, [settings]);

  const updateField = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined) {
        fd.append(key, form[key]);
      }
    }

    const res = await saveSettings(fd);

    if (res.success) {
      toast.success(t("cms.settings.success.updated"));
    } else {
      toast.error(t("cms.settings.errors.failed"));
    }
  };

  if (!settings) {
    return (
      <div className="settings-cms-container">
        <div className="settings-loading">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="settings-cms-container">
      <div className="settings-cms-header">
        <h1 className="settings-cms-title">{t("cms.settings.title")}</h1>
        <div className="settings-cms-subtitle">{t("cms.settings.subtitle")}</div>
      </div>

      <form onSubmit={submitHandler} className="settings-form">
        {/* ================= SITE INFO ================= */}
        <div className="settings-form-card">
          <div className="settings-card-header">
            <h2>{t("cms.settings.sections.site")}</h2>
          </div>

          <div className="settings-form-section">
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.site_name_ar")}</label>
                <input
                  className="settings-input"
                  name="site_name_ar"
                  value={form.site_name_ar}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.site_name_ar")}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.site_name_en")}</label>
                <input
                  className="settings-input"
                  name="site_name_en"
                  value={form.site_name_en}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.site_name_en")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= EMAIL ================= */}
        <div className="settings-form-card">
          <div className="settings-card-header">
            <h2>{t("cms.settings.sections.email")}</h2>
          </div>

          <div className="settings-form-section">
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.contact_email")}</label>
                <input
                  className="settings-input"
                  name="contact_receiver_email"
                  type="email"
                  value={form.contact_receiver_email}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.contact_email")}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.auto_reply_email")}</label>
                <input
                  className="settings-input"
                  name="auto_reply_email"
                  type="email"
                  value={form.auto_reply_email}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.auto_reply_email")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTACT ================= */}
        <div className="settings-form-card">
          <div className="settings-card-header">
            <h2>{t("cms.settings.sections.contact")}</h2>
          </div>

          <div className="settings-form-section">
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.phone")}</label>
                <input
                  className="settings-input"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.phone")}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.whatsapp")}</label>
                <input
                  className="settings-input"
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.whatsapp")}
                />
              </div>

              <div className="settings-form-group settings-full-width">
                <label className="settings-label">{t("cms.settings.fields.address")}</label>
                <input
                  className="settings-input"
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.address")}
                />
              </div>

              <div className="settings-form-group settings-full-width">
                <label className="settings-label">{t("cms.settings.fields.map")}</label>
                <textarea
                  className="settings-textarea"
                  name="map_embed"
                  value={form.map_embed}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.map")}
                  rows="4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SOCIAL ================= */}
        <div className="settings-form-card">
          <div className="settings-card-header">
            <h2>{t("cms.settings.sections.social")}</h2>
          </div>

          <div className="settings-form-section">
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">LinkedIn</label>
                <input
                  className="settings-input"
                  name="linkedin_url"
                  value={form.linkedin_url}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.linkedin")}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">X (Twitter)</label>
                <input
                  className="settings-input"
                  name="x_url"
                  value={form.x_url}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.x")}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Instagram</label>
                <input
                  className="settings-input"
                  name="instagram_url"
                  value={form.instagram_url}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.instagram")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOCALE ================= */}
        <div className="settings-form-card">
          <div className="settings-card-header">
            <h2>{t("cms.settings.sections.locale")}</h2>
          </div>

          <div className="settings-form-section">
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.country")}</label>
                <input
                  className="settings-input"
                  name="country"
                  value={form.country}
                  onChange={updateField}
                  placeholder={t("cms.settings.placeholders.country")}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">{t("cms.settings.fields.locale")}</label>
                <select
                  className="settings-select"
                  name="locale"
                  value={form.locale}
                  onChange={updateField}
                >
                  <option value="ar">{t("cms.settings.locales.arabic")}</option>
                  <option value="en">{t("cms.settings.locales.english")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOGOS ================= */}
        <div className="settings-form-card">
          <div className="settings-card-header">
            <h2>{t("cms.settings.sections.logo")}</h2>
          </div>

          <div className="settings-form-section">
            <div className="settings-logo-grid">
              <div className="settings-logo-group">
                <label className="settings-label">{t("cms.settings.fields.logo_light")}</label>
                <div className="settings-logo-preview">
                  {settings.logo_light_url && (
                    <img src={settings.logo_light_url} alt="Light Logo" />
                  )}
                </div>
                <input
                  className="settings-input-file"
                  type="file"
                  name="logo_light"
                  onChange={updateField}
                  accept="image/*"
                />
              </div>

              <div className="settings-logo-group">
                <label className="settings-label">{t("cms.settings.fields.logo_dark")}</label>
                <div className="settings-logo-preview">
                  {settings.logo_dark_url && (
                    <img src={settings.logo_dark_url} alt="Dark Logo" />
                  )}
                </div>
                <input
                  className="settings-input-file"
                  type="file"
                  name="logo_dark"
                  onChange={updateField}
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SUBMIT ================= */}
        <div className="settings-form-actions">
          <button type="submit" className="settings-btn-primary" disabled={loading}>
            {loading ? t("common.loading") : t("cms.settings.actions.save")}
          </button>
        </div>
      </form>
    </div>
  );
}