// src/pages/dashboard/contact/ContactPageHeaderCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

const IcoPage = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L2.5 6.5v6c0 2.85 2.35 5.6 7.5 6.5 5.15-.9 7.5-3.65 7.5-6.5v-6L10 2z" fill="currentColor"/>
  </svg>
);
const IcoFields = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M2 3h14v2H2V3zm0 4h14v2H2V7zm0 4h14v2H2v-2zm0 4h9v2H2v-2z" fill="currentColor"/>
  </svg>
);
const IcoSave = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M15.75 8.063v7.124a.938.938 0 01-.938.938H3.188a.938.938 0 01-.938-.938V3.563c0-.25.1-.488.255-.663A.938.938 0 013.188 2.5h7.124"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m13.5 1.5 3 3-8.25 8.25H5.25V9.75L13.5 1.5Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="cnt-spin">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8"
      strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round"/>
  </svg>
);

export default function ContactPageHeaderCMS() {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_ar: "", title_en: "", description_ar: "", description_en: "",
  });

  useEffect(() => {
    api.get("cms/admin/contact/page/")
      .then((res) => { if (res.data) setForm(res.data); })
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("cms/admin/contact/page/", form);
      toast.success(t("cms.contact.page_header.success.saved"));
    } catch {
      toast.error(t("cms.contact.error.save_failed"));
    } finally { setSaving(false); }
  };

  return (
    <div className="cnt-section-content">

      <div className="cnt-section-header">
        <span className="cnt-section-icon cnt-section-icon--blue"><IcoPage /></span>
        <div>
          <h2 className="cnt-section-title">{t("cms.contact.page_header.title")}</h2>
          <p className="cnt-section-subtitle">{t("cms.contact.page_header.subtitle")}</p>
        </div>
      </div>

      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon cnt-card-icon--blue"><IcoFields /></span>
          <h3 className="cnt-card-title">{t("cms.contact.page_header.section_title")}</h3>
        </div>
        <form onSubmit={submit} className="cnt-form">
          <div className="cnt-form-row cnt-form-row--2col">
            <div className="cnt-form-group">
              <label className="cnt-label">{t("cms.contact.page_header.fields.title_ar")}</label>
              <input className="cnt-input" dir="rtl"
                placeholder={t("cms.contact.page_header.placeholders.title_ar")}
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
            </div>
            <div className="cnt-form-group">
              <label className="cnt-label">{t("cms.contact.page_header.fields.title_en")}</label>
              <input className="cnt-input" dir="ltr"
                placeholder={t("cms.contact.page_header.placeholders.title_en")}
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
            </div>
          </div>
          <div className="cnt-form-row cnt-form-row--2col">
            <div className="cnt-form-group">
              <label className="cnt-label">{t("cms.contact.page_header.fields.description_ar")}</label>
              <textarea className="cnt-textarea" dir="rtl" rows={4}
                placeholder={t("cms.contact.page_header.placeholders.description_ar")}
                value={form.description_ar}
                onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
            </div>
            <div className="cnt-form-group">
              <label className="cnt-label">{t("cms.contact.page_header.fields.description_en")}</label>
              <textarea className="cnt-textarea" dir="ltr" rows={4}
                placeholder={t("cms.contact.page_header.placeholders.description_en")}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
            </div>
          </div>
          <div className="cnt-form-actions">
            <button type="submit" className="cnt-btn cnt-btn--primary" disabled={saving}>
              {saving ? <IcoSpinner /> : <IcoSave />}
              {saving ? t("cms.contact.actions.saving") : t("cms.contact.page_header.actions.save")}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}