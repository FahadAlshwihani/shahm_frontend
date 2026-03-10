import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFaqCmsStore } from "../../store/useFaqCmsStore";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "../../styles/CMS_FAQ.css";

export default function CMS_FAQ() {
  const { t, i18n } = useTranslation();
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (f) => {
    setEdit(f);
    setForm(f);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const result = await Swal.fire({
      title: t("cms.faq.confirm_delete_title"),
      text: t("cms.faq.confirm_delete_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.faq.delete_button"),
      cancelButtonText: t("cms.faq.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      const res = await deleteFaq(id);
      if (res.success) {
        Swal.fire({
          title: t("cms.faq.deleted_title"),
          text: t("cms.faq.success.deleted"),
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
      }
    }
  };

  return (
    <div className="dashboard-faq-container">
      {/* ===== HEADER ===== */}
      <div className="dashboard-faq-header">
        <div className="dashboard-faq-header-content">
          <h1 className="dashboard-faq-title">{t("cms.faq.title")}</h1>
          <p className="dashboard-faq-subtitle">{t("cms.faq.subtitle")}</p>
        </div>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="dashboard-faq-form-card">
        <div className="dashboard-faq-form-header">
          <div className="dashboard-faq-form-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor"/>
            </svg>
            <h2>{edit ? t("cms.faq.form_title_edit") : t("cms.faq.form_title_create")}</h2>
          </div>
          {edit && (
            <button className="dashboard-faq-btn-cancel" onClick={handleCancel}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.faq.actions.cancel")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dashboard-faq-form-section">
            <h3 className="dashboard-faq-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM10.5 13.5H7.5V12H10.5V13.5ZM10.5 10.5H7.5V4.5H10.5V10.5Z" fill="currentColor"/>
              </svg>
              {t("cms.faq.section_questions")}
            </h3>

            <div className="dashboard-faq-form-grid-row">
              <div className="dashboard-faq-form-group">
                <label className="dashboard-faq-label">{t("cms.faq.fields.question_ar")}</label>
                <input
                  className="dashboard-faq-input"
                  placeholder={t("cms.faq.placeholders.question_ar")}
                  value={form.question_ar}
                  onChange={(e) => setForm({ ...form, question_ar: e.target.value })}
                  required
                  dir="rtl"
                />
              </div>

              <div className="dashboard-faq-form-group">
                <label className="dashboard-faq-label">{t("cms.faq.fields.question_en")}</label>
                <input
                  className="dashboard-faq-input"
                  placeholder={t("cms.faq.placeholders.question_en")}
                  value={form.question_en}
                  onChange={(e) => setForm({ ...form, question_en: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="dashboard-faq-form-section">
            <h3 className="dashboard-faq-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 2.25H3C2.175 2.25 1.5 2.925 1.5 3.75V14.25C1.5 15.075 2.175 15.75 3 15.75H15C15.825 15.75 16.5 15.075 16.5 14.25V3.75C16.5 2.925 15.825 2.25 15 2.25ZM15 14.25H3V6H15V14.25Z" fill="currentColor"/>
              </svg>
              {t("cms.faq.section_answers")}
            </h3>

            <div className="dashboard-faq-form-grid-row">
              <div className="dashboard-faq-form-group">
                <label className="dashboard-faq-label">{t("cms.faq.fields.answer_ar")}</label>
                <textarea
                  className="dashboard-faq-textarea"
                  placeholder={t("cms.faq.placeholders.answer_ar")}
                  value={form.answer_ar}
                  onChange={(e) => setForm({ ...form, answer_ar: e.target.value })}
                  required
                  dir="rtl"
                />
              </div>

              <div className="dashboard-faq-form-group">
                <label className="dashboard-faq-label">{t("cms.faq.fields.answer_en")}</label>
                <textarea
                  className="dashboard-faq-textarea"
                  placeholder={t("cms.faq.placeholders.answer_en")}
                  value={form.answer_en}
                  onChange={(e) => setForm({ ...form, answer_en: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="dashboard-faq-form-section">
            <h3 className="dashboard-faq-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 2.25H4.5C3.675 2.25 3 2.925 3 3.75V14.25C3 15.075 3.675 15.75 4.5 15.75H13.5C14.325 15.75 15 15.075 15 14.25V3.75C15 2.925 14.325 2.25 13.5 2.25ZM13.5 14.25H4.5V3.75H13.5V14.25Z" fill="currentColor"/>
              </svg>
              {t("cms.faq.section_settings")}
            </h3>

            <div className="dashboard-faq-form-grid">
              <div className="dashboard-faq-form-group">
                <label className="dashboard-faq-label">{t("cms.faq.fields.order")}</label>
                <input
                  className="dashboard-faq-input"
                  type="number"
                  placeholder={t("cms.faq.placeholders.order")}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                />
              </div>

              <div className="dashboard-faq-form-group dashboard-faq-checkbox-wrapper">
                <label className="dashboard-faq-checkbox-label">
                  <input
                    type="checkbox"
                    className="dashboard-faq-checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <span className="dashboard-faq-checkbox-text">{t("cms.faq.fields.active")}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="dashboard-faq-form-actions">
            <button type="submit" className="dashboard-faq-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {edit ? t("cms.faq.actions.update") : t("cms.faq.actions.create")}
            </button>
            {edit && (
              <button type="button" className="dashboard-faq-btn-secondary" onClick={handleCancel}>
                {t("cms.faq.actions.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== LIST CARD ===== */}
      <div className="dashboard-faq-list-card">
        <div className="dashboard-faq-list-header">
          <div className="dashboard-faq-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-faq-list-title">{t("cms.faq.list_title")}</h2>
          </div>
          <span className="dashboard-faq-count-badge">{faqs.length}</span>
        </div>

        {faqs.length === 0 ? (
          <div className="dashboard-faq-empty">{t("cms.faq.empty")}</div>
        ) : (
          faqs.map((f) => (
            <div key={f.id} className="dashboard-faq-item">
              <div className="dashboard-faq-item-header">
                <div className="dashboard-faq-question">
                  {i18n.language === 'ar' ? f.question_ar : f.question_en}
                </div>
                <div className="dashboard-faq-item-actions">
                  <button className="dashboard-faq-btn-edit" onClick={() => handleEdit(f)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                    </svg>
                    {t("cms.faq.actions.edit")}
                  </button>
                  <button className="dashboard-faq-btn-delete" onClick={() => handleDelete(f.id)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                    </svg>
                    {t("cms.faq.actions.delete")}
                  </button>
                </div>
              </div>
              
              <div className="dashboard-faq-answer">
                {i18n.language === 'ar' ? f.answer_ar : f.answer_en}
              </div>
              
              <div className="dashboard-faq-meta">
                <span className="dashboard-faq-order">
                  {t("cms.faq.table.order")}: {f.order}
                </span>
                <span className={`dashboard-faq-status ${f.is_active ? 'dashboard-faq-status-active' : 'dashboard-faq-status-inactive'}`}>
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