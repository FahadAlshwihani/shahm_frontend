import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ContactPageHeaderCMS() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
  });

  const loadData = async () => {
    try {
      const res = await api.get("cms/admin/contact/page/");
      if (res.data) setForm(res.data);
    } catch {
      // First time empty
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("cms/admin/contact/page/", form);
    toast.success(t("cms.contact.page_header.success.saved"));
  };

  return (
    <div className="dashboard-contact-form-card">
      <div className="dashboard-contact-form-header">
        <div className="dashboard-contact-form-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7V12C3 16.42 6.42 20.42 12 21.5C17.58 20.42 21 16.42 21 12V7L12 2Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.contact.page_header.title")}</h2>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="dashboard-contact-form-section">
          <h3 className="dashboard-contact-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2.25 3H15.75V6H2.25V3ZM2.25 7.5H15.75V10.5H2.25V7.5ZM2.25 12H15.75V15H2.25V12Z" fill="currentColor"/>
            </svg>
            {t("cms.contact.page_header.section_title")}
          </h3>

          <div className="dashboard-contact-form-grid-row">
            <div className="dashboard-contact-form-group">
              <label className="dashboard-contact-label">
                {t("cms.contact.page_header.fields.title_ar")}
              </label>
              <input
                className="dashboard-contact-input"
                placeholder={t("cms.contact.page_header.placeholders.title_ar")}
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                dir="rtl"
              />
            </div>

            <div className="dashboard-contact-form-group">
              <label className="dashboard-contact-label">
                {t("cms.contact.page_header.fields.title_en")}
              </label>
              <input
                className="dashboard-contact-input"
                placeholder={t("cms.contact.page_header.placeholders.title_en")}
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              />
            </div>
          </div>

          <div className="dashboard-contact-form-grid-row">
            <div className="dashboard-contact-form-group">
              <label className="dashboard-contact-label">
                {t("cms.contact.page_header.fields.description_ar")}
              </label>
              <textarea
                className="dashboard-contact-textarea"
                placeholder={t("cms.contact.page_header.placeholders.description_ar")}
                value={form.description_ar}
                onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                dir="rtl"
              />
            </div>

            <div className="dashboard-contact-form-group">
              <label className="dashboard-contact-label">
                {t("cms.contact.page_header.fields.description_en")}
              </label>
              <textarea
                className="dashboard-contact-textarea"
                placeholder={t("cms.contact.page_header.placeholders.description_en")}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-contact-form-actions">
          <button type="submit" className="dashboard-contact-btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("cms.contact.page_header.actions.save")}
          </button>
        </div>
      </form>
    </div>
  );
}