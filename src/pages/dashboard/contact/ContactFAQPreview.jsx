import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ContactFAQPreview() {
  const { t } = useTranslation();
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
    <div className="cms-contact-form-card">
      <div className="cms-contact-form-header">
        <h2>{t("cms.contact.faq.title")}</h2>
      </div>

      <p style={{ color: "#b3b3b3", marginBottom: "24px", fontSize: "14px" }}>
        {t("cms.contact.faq.description")}
      </p>

      {faqs.map((f) => (
        <label key={f.id} className="cms-contact-checkbox-label">
          <input
            type="checkbox"
            checked={selected.includes(f.id)}
            onChange={() => toggleFaq(f.id)}
          />
          <span className="cms-contact-checkbox-text">{f.question_ar}</span>
        </label>
      ))}

      {faqs.length === 0 && (
        <p style={{ textAlign: "center", color: "#666666", padding: "40px" }}>
          {t("cms.contact.faq.empty")}
        </p>
      )}
    </div>
  );
}