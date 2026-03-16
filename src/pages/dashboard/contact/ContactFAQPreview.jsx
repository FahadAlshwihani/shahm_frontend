import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ContactFAQPreview() {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [selected, setSelected] = useState([]);

  const loadData = async () => {
    const res = await api.get("cms/admin/contact/faq-preview/");
    setFaqs(res.data?.all_faqs || []);
    setSelected(res.data?.selected_ids || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleFaq = async (id) => {
    await api.post("cms/admin/contact/faq-preview/toggle/", { faq_id: id });
    loadData();
    toast.success(t("cms.contact.faq.success.updated"));
  };

  return (
    <div className="dashboard-contact-form-card">
      <div className="dashboard-contact-form-header">
        <div className="dashboard-contact-form-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.contact.faq.title")}</h2>
        </div>
      </div>

      <p className="dashboard-contact-description">
        {t("cms.contact.faq.description")}
      </p>

      {faqs.length === 0 ? (
        <div className="dashboard-contact-empty">
          {t("cms.contact.faq.empty")}
        </div>
      ) : (
        <div className="dashboard-contact-faq-list">
          {faqs.map((f) => (
            <label key={f.id} className="dashboard-contact-checkbox-label">
              <input
                type="checkbox"
                className="dashboard-contact-checkbox"
                checked={selected.includes(f.id)}
                onChange={() => toggleFaq(f.id)}
              />
              <span className="dashboard-contact-checkbox-text">
                {i18n.language === 'ar' ? f.question_ar : f.question_en}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}