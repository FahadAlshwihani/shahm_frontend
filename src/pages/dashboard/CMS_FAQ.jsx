import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFaqCmsStore } from "../../store/useFaqCmsStore";
import toast from "react-hot-toast";
import "../../styles/CMS_FAQ.css"
export default function CMS_FAQ() {
  const { t } = useTranslation();
  const { faqs, fetchFaqs, createFaq, updateFaq, deleteFaq } = useFaqCmsStore();

  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    question_ar: "",
    question_en: "",
    answer_ar: "",
    answer_en: "",
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = edit
      ? await updateFaq(edit.id, form)
      : await createFaq(form);

    if (res.success) {
      toast.success(t("cms.faq.success.saved"));
      setEdit(null);
      setForm({
        question_ar: "",
        question_en: "",
        answer_ar: "",
        answer_en: "",
        order: 0,
        is_active: true,
      });
    }
  };

  const handleEdit = (f) => {
    setEdit(f);
    setForm(f);
  };

  const handleCancel = () => {
    setEdit(null);
    setForm({
      question_ar: "",
      question_en: "",
      answer_ar: "",
      answer_en: "",
      order: 0,
      is_active: true,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("cms.faq.confirm_delete"))) {
      const res = await deleteFaq(id);
      if (res.success) {
        toast.success(t("cms.faq.success.deleted"));
      }
    }
  };

  return (
    <div className="cms-faq-container">
      {/* ===== HEADER ===== */}
      <div className="cms-faq-header">
        <h1 className="cms-faq-title">
          {t("cms.faq.title")}
        </h1>
        <p className="cms-faq-subtitle">
          {t("cms.faq.subtitle")}
        </p>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="cms-faq-form-card">
        <div className="cms-faq-form-header">
          <h2>{edit ? t("cms.faq.form_title_edit") : t("cms.faq.form_title_create")}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cms-faq-form-grid">
            <div className="cms-faq-form-group">
              <label className="cms-faq-label">{t("cms.faq.fields.question_ar")}</label>
              <input
                className="cms-faq-input"
                placeholder={t("cms.faq.placeholders.question_ar")}
                value={form.question_ar}
                onChange={(e) =>
                  setForm({ ...form, question_ar: e.target.value })
                }
                required
              />
            </div>

            <div className="cms-faq-form-group">
              <label className="cms-faq-label">{t("cms.faq.fields.question_en")}</label>
              <input
                className="cms-faq-input"
                placeholder={t("cms.faq.placeholders.question_en")}
                value={form.question_en}
                onChange={(e) =>
                  setForm({ ...form, question_en: e.target.value })
                }
                required
              />
            </div>

            <div className="cms-faq-form-group full-width">
              <label className="cms-faq-label">{t("cms.faq.fields.answer_ar")}</label>
              <textarea
                className="cms-faq-textarea"
                placeholder={t("cms.faq.placeholders.answer_ar")}
                value={form.answer_ar}
                onChange={(e) =>
                  setForm({ ...form, answer_ar: e.target.value })
                }
                required
              />
            </div>

            <div className="cms-faq-form-group full-width">
              <label className="cms-faq-label">{t("cms.faq.fields.answer_en")}</label>
              <textarea
                className="cms-faq-textarea"
                placeholder={t("cms.faq.placeholders.answer_en")}
                value={form.answer_en}
                onChange={(e) =>
                  setForm({ ...form, answer_en: e.target.value })
                }
                required
              />
            </div>

            <div className="cms-faq-form-group">
              <label className="cms-faq-label">{t("cms.faq.fields.order")}</label>
              <input
                className="cms-faq-input"
                type="number"
                placeholder={t("cms.faq.placeholders.order")}
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: e.target.value })
                }
              />
            </div>

            <div className="cms-faq-form-group">
              <label className="cms-faq-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                <span className="cms-faq-checkbox-text">{t("cms.faq.fields.active")}</span>
              </label>
            </div>
          </div>

          <div className="cms-faq-form-actions">
            <button type="submit" className="cms-faq-btn-primary">
              {edit ? t("cms.faq.actions.update") : t("cms.faq.actions.create")}
            </button>
            {edit && (
              <button type="button" className="cms-faq-btn-cancel" onClick={handleCancel}>
                {t("cms.faq.actions.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== LIST CARD ===== */}
      <div className="cms-faq-list-card">
        <h2 className="cms-faq-list-title">{t("cms.faq.list_title")}</h2>

        {faqs.length === 0 ? (
          <div className="cms-faq-empty">{t("cms.faq.empty")}</div>
        ) : (
          faqs.map((f) => (
            <div key={f.id} className="cms-faq-item">
              <div className="cms-faq-item-header">
                <div className="cms-faq-question">{f.question_ar}</div>
                <div className="cms-faq-item-actions">
                  <button className="cms-faq-btn-edit" onClick={() => handleEdit(f)}>
                    {t("cms.faq.actions.edit")}
                  </button>
                  <button className="cms-faq-btn-delete" onClick={() => handleDelete(f.id)}>
                    {t("cms.faq.actions.delete")}
                  </button>
                </div>
              </div>
              
              <div className="cms-faq-answer">{f.answer_ar}</div>
              
              <div className="cms-faq-meta">
                <span className="cms-faq-order">
                  {t("cms.faq.table.order")}: {f.order}
                </span>
                <span className={`cms-faq-status ${f.is_active ? 'active' : 'inactive'}`}>
                  {f.is_active ? t("cms.faq.status.active") : t("cms.faq.status.inactive")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}