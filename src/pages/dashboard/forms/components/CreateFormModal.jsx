// src/pages/dashboard/forms/components/CreateFormModal.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const Spinner = () => (
  <span className="fb-spinner">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

const EMPTY_FORM = {
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  slug: "",
  context_type: "generic",
  form_type: "dynamic",
  submit_button_text_ar: "إرسال",
  submit_button_text_en: "Submit",
  success_message_ar: "تم إرسال النموذج بنجاح",
  success_message_en: "Form submitted successfully",
  is_active: true,
  requires_login: false,
  allow_multiple_submissions: true,
  terms_text_ar: "",
  terms_text_en: "",
  require_terms_approval: false,
};

export default function CreateFormModal({ onClose, onCreate, saving }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.title_ar.trim() && !form.title_en.trim()) {
      e.title_ar = t("cms.forms.errors.title_required");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    await onCreate(form);
  };

  return (
    <div className="fb-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fb-modal">

        {/* Header */}
        <div className="fb-modal-header">
          <h2 className="fb-modal-title">{t("cms.forms.modal.create_title")}</h2>
          <button className="fb-icon-btn fb-icon-btn--ghost" onClick={onClose} type="button">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="fb-modal-body">

          {/* Titles */}
          <div className="fb-form-row">
            <div className="fb-form-group">
              <label className="fb-label">
                {t("cms.forms.fields.title_ar")}
                <span className="fb-required-star">*</span>
              </label>
              <input className={`fb-input ${errors.title_ar ? "fb-input--error" : ""}`} dir="rtl"
                placeholder={t("cms.forms.placeholders.title_ar")}
                value={form.title_ar}
                onChange={(e) => set("title_ar", e.target.value)} />
              {errors.title_ar && <span className="fb-field-error">{errors.title_ar}</span>}
            </div>
            <div className="fb-form-group">
              <label className="fb-label">{t("cms.forms.fields.title_en")}</label>
              <input className="fb-input" dir="ltr"
                placeholder={t("cms.forms.placeholders.title_en")}
                value={form.title_en}
                onChange={(e) => set("title_en", e.target.value)} />
            </div>
          </div>

          {/* Descriptions */}
          <div className="fb-form-row">
            <div className="fb-form-group">
              <label className="fb-label">{t("cms.forms.fields.description_ar")}</label>
              <textarea className="fb-textarea" dir="rtl" rows={2}
                placeholder={t("cms.forms.placeholders.description_ar")}
                value={form.description_ar}
                onChange={(e) => set("description_ar", e.target.value)} />
            </div>
            <div className="fb-form-group">
              <label className="fb-label">{t("cms.forms.fields.description_en")}</label>
              <textarea className="fb-textarea" dir="ltr" rows={2}
                placeholder={t("cms.forms.placeholders.description_en")}
                value={form.description_en}
                onChange={(e) => set("description_en", e.target.value)} />
            </div>
          </div>

          {/* Slug + Context */}
          <div className="fb-form-row">
            <div className="fb-form-group">
              <label className="fb-label">
                {t("cms.forms.fields.slug")}
                <span className="fb-label-hint">{t("cms.forms.slug_hint")}</span>
              </label>
              <input className="fb-input" dir="ltr"
                placeholder={t("cms.forms.placeholders.slug")}
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div className="fb-form-group">
              <label className="fb-label">{t("cms.forms.fields.context_type")}</label>
              <select className="fb-select"
                value={form.context_type}
                onChange={(e) => set("context_type", e.target.value)}>
                <option value="generic">{t("cms.forms.context_types.generic")}</option>
                <option value="appointments">{t("cms.forms.context_types.appointments")}</option>
                <option value="services">{t("cms.forms.context_types.services")}</option>
                <option value="careers">{t("cms.forms.context_types.careers")}</option>
              </select>
            </div>
          </div>

          {/* Form type + Active */}
          <div className="fb-form-row">
            <div className="fb-form-group">
              <label className="fb-label">{t("cms.forms.fields.form_type")}</label>
              <select className="fb-select"
                value={form.form_type}
                onChange={(e) => set("form_type", e.target.value)}>
                <option value="dynamic">{t("cms.forms.form_types.dynamic")}</option>
                <option value="info">{t("cms.forms.form_types.info")}</option>
              </select>
            </div>
            <div className="fb-form-group fb-form-group--center">
              <label className="fb-label">{t("cms.forms.fields.is_active")}</label>
              <label className="fb-toggle">
                <input type="checkbox" checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)} />
                <span className="fb-toggle-track"><span className="fb-toggle-thumb" /></span>
                <span className="fb-toggle-label">
                  {form.is_active ? t("cms.forms.status.active") : t("cms.forms.status.inactive")}
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="fb-modal-footer">
            <button type="button" className="fb-btn fb-btn--ghost" onClick={onClose}>
              <IconX />
              {t("cms.forms.actions.cancel")}
            </button>
            <button type="submit" className="fb-btn fb-btn--primary" disabled={saving}>
              {saving ? <Spinner /> : <IconSave />}
              {t("cms.forms.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}