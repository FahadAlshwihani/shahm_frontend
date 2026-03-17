// src/pages/dashboard/ServiceAdvisoryCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ServiceAdvisoryCMS() {
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    title_top_ar: "",
    title_top_en: "",
    description_top_ar: "",
    description_top_en: "",
    title_bottom_ar: "",
    title_bottom_en: "",
    description_bottom_ar: "",
    description_bottom_en: "",
  });

  const loadData = async () => {
    try {
      const res = await api.get("services/admin/service-advisory/");
      if (res.data) setForm(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("services/admin/service-advisory/", form);
      toast.success(t("cms.services.success.content_saved"));
    } catch (err) {
      toast.error(t("cms.services.error.save_failed"));
    }
  };

  return (
    <div className="dashboard-services-content">
      <div className="dashboard-services-content-header">
        <div className="dashboard-services-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.services.content.title")}</h2>
        </div>
        <p className="dashboard-services-content-subtitle">
          {t("cms.services.content.subtitle")}
        </p>
      </div>

      <form onSubmit={submit} className="dashboard-services-form-card">
        {/* Top Section */}
        <div className="dashboard-services-form-section">
          <h3 className="dashboard-services-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5L14.25 4.5V9C14.25 13.05 11.43 16.77 9 17.25C6.57 16.77 3.75 13.05 3.75 9V4.5L9 1.5Z" fill="currentColor"/>
            </svg>
            {t("cms.services.content.section_top")}
          </h3>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.title_top_ar")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.content.placeholder_title_top_ar")}
                value={form.title_top_ar}
                onChange={(e) => setForm({ ...form, title_top_ar: e.target.value })}
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.title_top_en")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.content.placeholder_title_top_en")}
                value={form.title_top_en}
                onChange={(e) => setForm({ ...form, title_top_en: e.target.value })}
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.description_top_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.content.placeholder_description_top_ar")}
                value={form.description_top_ar}
                onChange={(e) => setForm({ ...form, description_top_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.description_top_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.content.placeholder_description_top_en")}
                value={form.description_top_en}
                onChange={(e) => setForm({ ...form, description_top_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="dashboard-services-form-section">
          <h3 className="dashboard-services-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 16.5L3.75 13.5V9L9 12L14.25 9V13.5L9 16.5Z" fill="currentColor"/>
            </svg>
            {t("cms.services.content.section_bottom")}
          </h3>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.title_bottom_ar")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.content.placeholder_title_bottom_ar")}
                value={form.title_bottom_ar}
                onChange={(e) => setForm({ ...form, title_bottom_ar: e.target.value })}
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.title_bottom_en")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.content.placeholder_title_bottom_en")}
                value={form.title_bottom_en}
                onChange={(e) => setForm({ ...form, title_bottom_en: e.target.value })}
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.description_bottom_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.content.placeholder_description_bottom_ar")}
                value={form.description_bottom_ar}
                onChange={(e) => setForm({ ...form, description_bottom_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.content.description_bottom_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.content.placeholder_description_bottom_en")}
                value={form.description_bottom_en}
                onChange={(e) => setForm({ ...form, description_bottom_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>
        </div>

        <div className="dashboard-services-form-actions">
          <button type="submit" className="dashboard-services-btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("cms.services.actions.save")}
          </button>
        </div>
      </form>
    </div>
  );
}