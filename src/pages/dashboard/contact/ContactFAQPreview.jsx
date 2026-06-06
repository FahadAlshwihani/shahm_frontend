// src/pages/dashboard/contact/ContactFAQPreview.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

const IcoFAQ = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13H9v-2h2v2zm1.93-6.83l-.76.77C11.45 9.67 11 10.25 11 11.5H9V11c0-1.1.45-2.1 1.17-2.83l1.24-1.24c.37-.37.59-.87.59-1.43 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.17l-.14.17z" fill="currentColor"/>
  </svg>
);

export default function ContactFAQPreview() {
  const { t, i18n } = useTranslation();
  const [faqs,     setFaqs]     = useState([]);
  const [selected, setSelected] = useState([]);

  const loadData = async () => {
    try {
      const res = await api.get("cms/admin/contact/faq-preview/");
      setFaqs(res.data?.all_faqs || []);
      setSelected(res.data?.selected_ids || []);
    } catch { toast.error(t("cms.contact.error.load_failed")); }
  };

  useEffect(() => { loadData(); }, []);

  const toggleFaq = async (id) => {
    try {
      await api.post("cms/admin/contact/faq-preview/toggle/", { faq_id: id });
      loadData();
      toast.success(t("cms.contact.faq.success.updated"));
    } catch { toast.error(t("cms.contact.error.save_failed")); }
  };

  return (
    <div className="cnt-section-content">

      <div className="cnt-section-header">
        <span className="cnt-section-icon cnt-section-icon--amber"><IcoFAQ /></span>
        <div>
          <h2 className="cnt-section-title">{t("cms.contact.faq.title")}</h2>
          <p className="cnt-section-subtitle">{t("cms.contact.faq.description")}</p>
        </div>
      </div>

      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon cnt-card-icon--amber"><IcoFAQ /></span>
          <h3 className="cnt-card-title">{t("cms.contact.faq.select_title")}</h3>
          <span className="cnt-count-badge" style={{ marginInlineStart:"auto" }}>
            {selected.length} / {faqs.length}
          </span>
        </div>

        {faqs.length === 0 ? (
          <div className="cnt-empty">{t("cms.contact.faq.empty")}</div>
        ) : (
          <div className="cnt-faq-list">
            {faqs.map((f) => (
              <label key={f.id} className={`cnt-faq-item${selected.includes(f.id) ? " cnt-faq-item--checked" : ""}`}>
                <input
                  type="checkbox"
                  className="cnt-checkbox"
                  checked={selected.includes(f.id)}
                  onChange={() => toggleFaq(f.id)}
                />
                <span className="cnt-faq-question">
                  {i18n.language === "ar" ? f.question_ar : f.question_en}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}