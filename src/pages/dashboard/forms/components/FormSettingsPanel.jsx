// src/pages/dashboard/forms/components/FormSettingsPanel.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SectionDivider = ({ icon, label }) => (
  <div className="fb-divider">
    <span className="fb-divider-icon">{icon}</span>
    <span className="fb-divider-label">{label}</span>
    <div className="fb-divider-line" />
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="fb-toggle">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="fb-toggle-track"><span className="fb-toggle-thumb" /></span>
    <span className="fb-toggle-label">{label}</span>
  </label>
);

const IconDoc = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M9 2H4a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 004 14h8a1.5 1.5 0 001.5-1.5V6.5L9 2z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M9 2v4.5H13.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const IconSettings = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.5 6l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L3 4.5v3.75C3 11.08 5.14 13.5 8 14.5c2.86-1 5-3.42 5-6.25V4.5L8 2z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export default function FormSettingsPanel({ data, onChange, successResponses }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("basic");

  const set = (field, value) => onChange({ ...data, [field]: value });

  const tabs = [
    { key: "basic", label: t("cms.forms.settings.tab_basic") },
    { key: "messages", label: t("cms.forms.settings.tab_messages") },
    { key: "behavior", label: t("cms.forms.settings.tab_behavior") },
    { key: "terms", label: t("cms.forms.settings.tab_terms") },
  ];

  return (
    <div className="fb-settings-panel">
      {/* Inner tabs */}
      <div className="fb-settings-tabs">
        {tabs.map((tab) => (
          <button key={tab.key} type="button"
            className={`fb-settings-tab ${activeTab === tab.key ? "fb-settings-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="fb-settings-body">

        {/* ── Basic ── */}
        {activeTab === "basic" && (
          <div className="fb-settings-section">
            <SectionDivider icon={<IconDoc />} label={t("cms.forms.settings.section_titles")} />
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.title_ar")}</label>
                <input className="fb-input" dir="rtl"
                  placeholder={t("cms.forms.placeholders.title_ar")}
                  value={data.title_ar || ""}
                  onChange={(e) => set("title_ar", e.target.value)} />
              </div>
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.title_en")}</label>
                <input className="fb-input" dir="ltr"
                  placeholder={t("cms.forms.placeholders.title_en")}
                  value={data.title_en || ""}
                  onChange={(e) => set("title_en", e.target.value)} />
              </div>
            </div>
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.description_ar")}</label>
                <textarea className="fb-textarea" dir="rtl" rows={3}
                  placeholder={t("cms.forms.placeholders.description_ar")}
                  value={data.description_ar || ""}
                  onChange={(e) => set("description_ar", e.target.value)} />
              </div>
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.description_en")}</label>
                <textarea className="fb-textarea" dir="ltr" rows={3}
                  placeholder={t("cms.forms.placeholders.description_en")}
                  value={data.description_en || ""}
                  onChange={(e) => set("description_en", e.target.value)} />
              </div>
            </div>

            <SectionDivider icon={<IconSettings />} label={t("cms.forms.settings.section_slug")} />
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">
                  {t("cms.forms.fields.slug")}
                  <span className="fb-label-hint">{t("cms.forms.slug_hint")}</span>
                </label>
                <input className="fb-input" dir="ltr"
                  placeholder={t("cms.forms.placeholders.slug")}
                  value={data.slug || ""}
                  onChange={(e) => set("slug", e.target.value)} />
              </div>
              <div className="fb-form-group fb-form-group--center">
                <label className="fb-label">{t("cms.forms.fields.is_active")}</label>
                <Toggle
                  checked={!!data.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  label={data.is_active ? t("cms.forms.status.active") : t("cms.forms.status.inactive")}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        {activeTab === "messages" && (
          <div className="fb-settings-section">
            <SectionDivider icon={<IconMail />} label={t("cms.forms.settings.section_response")} />
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.success_response")}</label>
                <select className="fb-select"
                  value={
                    data.success_response_id ||
                    data.success_response?.id ||
                    ""
                  }
                  onChange={(e) => set("success_response_id", e.target.value ? parseInt(e.target.value, 10) : null)}>
                  <option value="">{t("cms.forms.success_responses.default_option")}</option>
                  {successResponses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title_ar || item.title_en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fb-form-spacer" />
            </div>

            <SectionDivider icon={<IconMail />} label={t("cms.forms.settings.section_button")} />
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.submit_button_ar")}</label>
                <input className="fb-input" dir="rtl"
                  value={data.submit_button_text_ar || ""}
                  onChange={(e) => set("submit_button_text_ar", e.target.value)}
                  placeholder={t("cms.forms.placeholders.submit_button_ar")} />
              </div>
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.submit_button_en")}</label>
                <input className="fb-input" dir="ltr"
                  value={data.submit_button_text_en || ""}
                  onChange={(e) => set("submit_button_text_en", e.target.value)}
                  placeholder={t("cms.forms.placeholders.submit_button_en")} />
              </div>
            </div>
          </div>
        )}

        {/* ── Behavior ── */}
        {activeTab === "behavior" && (
          <div className="fb-settings-section">
            <SectionDivider icon={<IconSettings />} label={t("cms.forms.settings.section_context")} />
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.context_type")}</label>
                <select className="fb-select"
                  value={data.context_type || "generic"}
                  onChange={(e) => set("context_type", e.target.value)}>
                  <option value="generic">{t("cms.forms.context_types.generic")}</option>
                  <option value="appointments">{t("cms.forms.context_types.appointments")}</option>
                  <option value="services">{t("cms.forms.context_types.services")}</option>
                  <option value="careers">{t("cms.forms.context_types.careers")}</option>
                </select>
              </div>
              <div className="fb-form-spacer" />
            </div>

            <SectionDivider icon={<IconSettings />} label={t("cms.forms.settings.section_behavior")} />
            <div className="fb-toggles-list">
              <Toggle
                checked={!!data.requires_login}
                onChange={(e) => set("requires_login", e.target.checked)}
                label={t("cms.forms.fields.requires_login")}
              />
              <Toggle
                checked={!!data.requires_verification}
                onChange={(e) => set("requires_verification", e.target.checked)}
                label={t("cms.forms.fields.requires_verification")}
              />
              <Toggle
                checked={!!data.allow_multiple_submissions}
                onChange={(e) => set("allow_multiple_submissions", e.target.checked)}
                label={t("cms.forms.fields.allow_multiple")}
              />
            </div>
          </div>
        )}

        {/* ── Terms ── */}
        {activeTab === "terms" && (
          <div className="fb-settings-section">
            <SectionDivider icon={<IconShield />} label={t("cms.forms.settings.section_terms")} />
            <div className="fb-form-row">
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.terms_ar")}</label>
                <textarea className="fb-textarea" dir="rtl" rows={5}
                  value={data.terms_text_ar || ""}
                  onChange={(e) => set("terms_text_ar", e.target.value)}
                  placeholder={t("cms.forms.placeholders.terms_ar")} />
              </div>
              <div className="fb-form-group">
                <label className="fb-label">{t("cms.forms.fields.terms_en")}</label>
                <textarea className="fb-textarea" dir="ltr" rows={5}
                  value={data.terms_text_en || ""}
                  onChange={(e) => set("terms_text_en", e.target.value)}
                  placeholder={t("cms.forms.placeholders.terms_en")} />
              </div>
            </div>
            <div className="fb-toggles-list">
              <Toggle
                checked={!!data.require_terms_approval}
                onChange={(e) => set("require_terms_approval", e.target.checked)}
                label={t("cms.forms.fields.require_terms")}
              />
            </div>
            {data.require_terms_approval && (
              <div className="fb-terms-preview">
                <div className="fb-terms-preview-header">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  {t("cms.forms.terms_preview_label")}
                </div>
                <div className="fb-terms-preview-content">
                  <div className="fb-terms-checkbox-row">
                    <input type="checkbox" disabled />
                    <span>{data.terms_text_ar || t("cms.forms.placeholders.terms_ar")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}