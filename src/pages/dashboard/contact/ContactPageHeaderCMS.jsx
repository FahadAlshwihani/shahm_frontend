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
    <div className="cms-contact-form-card">
      <div className="cms-contact-form-header">
        <h2>{t("cms.contact.page_header.title")}</h2>
      </div>

      <form onSubmit={submit}>
        <div className="cms-contact-form-grid">
          <div className="cms-contact-form-group">
            <label className="cms-contact-label">
              {t("cms.contact.page_header.fields.title_ar")}
            </label>
            <input
              className="cms-contact-input"
              placeholder={t("cms.contact.page_header.placeholders.title_ar")}
              value={form.title_ar}
              onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
            />
          </div>

          <div className="cms-contact-form-group">
            <label className="cms-contact-label">
              {t("cms.contact.page_header.fields.title_en")}
            </label>
            <input
              className="cms-contact-input"
              placeholder={t("cms.contact.page_header.placeholders.title_en")}
              value={form.title_en}
              onChange={(e) => setForm({ ...form, title_en: e.target.value })}
            />
          </div>

          <div className="cms-contact-form-group full-width">
            <label className="cms-contact-label">
              {t("cms.contact.page_header.fields.description_ar")}
            </label>
            <textarea
              className="cms-contact-textarea"
              placeholder={t("cms.contact.page_header.placeholders.description_ar")}
              value={form.description_ar}
              onChange={(e) =>
                setForm({ ...form, description_ar: e.target.value })
              }
            />
          </div>

          <div className="cms-contact-form-group full-width">
            <label className="cms-contact-label">
              {t("cms.contact.page_header.fields.description_en")}
            </label>
            <textarea
              className="cms-contact-textarea"
              placeholder={t("cms.contact.page_header.placeholders.description_en")}
              value={form.description_en}
              onChange={(e) =>
                setForm({ ...form, description_en: e.target.value })
              }
            />
          </div>
        </div>

        <div className="cms-contact-form-actions">
          <button type="submit" className="cms-contact-btn-primary">
            {t("cms.contact.page_header.actions.save")}
          </button>
        </div>
      </form>
    </div>
  );
}