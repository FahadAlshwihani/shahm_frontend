import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { submitCareerApplication } from "../../api/careersApi";
import toast from "react-hot-toast";
import {
  NATIONALITIES,
  SAUDI_LOCATIONS,
  SOURCES
} from "../../constants/careerOptions";

export default function ApplyModal({ onClose, isEn, jobs }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    first_name_en: "",
    last_name_en: "",
    first_name_ar: "",
    last_name_ar: "",
    phone: "",
    email: "",
    nationality: "",
    gender: "",
    location: "",
    id_number: "",
    job_id: "",
    source: "",
    certifications: "",
    linkedin: "",
    cv: null,
    additional_files: null,
    notes: "",
    accept_terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (files ? files[0] : value)
    }));
  };

  const isFormValid = () => {
    return (
      form.first_name_en &&
      form.last_name_en &&
      form.first_name_ar &&
      form.last_name_ar &&
      form.phone &&
      form.email &&
      form.nationality &&
      form.gender &&
      form.location &&
      form.job_id &&
      form.cv &&
      form.accept_terms === true
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error(t("careers.fill_required_fields"));
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();

      /* ========= IMPORTANT MAPPING ========= */

      data.append("first_name", form.first_name_en);
      data.append("last_name", form.last_name_en);
      data.append("first_name_ar", form.first_name_ar);
      data.append("last_name_ar", form.last_name_ar);

      data.append("phone", form.phone);
      data.append("email", form.email);
      data.append("nationality", form.nationality);
      data.append("gender", form.gender);
      data.append("location", form.location);
      data.append("source", form.source);
      data.append("job_id", form.job_id);

      data.append("id_number", form.id_number);
      data.append("certifications", form.certifications);
      data.append("linkedin", form.linkedin);
      data.append("notes", form.notes);

      /* 🔥 IMPORTANT: backend expects cv_file not cv */
      if (form.cv) data.append("cv_file", form.cv);
      if (form.cover_letter) data.append("cover_letter", form.cover_letter);

      await submitCareerApplication(data);

      toast.success(t("careers.application_success"));
      onClose();

    } catch (error) {
      console.error(error);
      toast.error(t("careers.application_error"));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="career-modal-overlay modal-fade-in" onClick={onClose}>
      <div
        className="career-modal modal-slide-up"
        onClick={(e) => e.stopPropagation()}
        dir={isEn ? "ltr" : "rtl"}
      >
        {/* Close Button */}
        <button className="modal-close-icon" onClick={onClose}>
          ×
        </button>

        {/* Modal Header */}
        <div className="modal-header-career">
          <h2>{t("careers.modal_title")}</h2>
        </div>

        <form onSubmit={handleSubmit} className="career-modal-form">

          {/* First Name - Last Name (English) */}
          <div className="form-row">
            <input
              name="first_name_en"
              placeholder={t("careers.first_name_en")}
              value={form.first_name_en}
              onChange={handleChange}
              required
            />
            <input
              name="last_name_en"
              placeholder={t("careers.last_name_en")}
              value={form.last_name_en}
              onChange={handleChange}
              required
            />
          </div>

          {/* الاسم الأول - الاسم الأخير (Arabic) */}
          <div className="form-row">
            <input
              name="first_name_ar"
              placeholder={t("careers.first_name_ar")}
              value={form.first_name_ar}
              onChange={handleChange}
              required
            />
            <input
              name="last_name_ar"
              placeholder={t("careers.last_name_ar")}
              value={form.last_name_ar}
              onChange={handleChange}
              required
            />
          </div>

          {/* رقم الجوال - البريد الالكتروني */}
          <div className="form-row">
            <input
              name="phone"
              placeholder={t("careers.phone")}
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder={t("careers.email")}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* الجنسية - الجنس */}
          <div className="form-row">
            <select name="nationality" value={form.nationality} onChange={handleChange} required>
              <option value="">{t("careers.nationality")}</option>

              {NATIONALITIES.map(n => (
                <option key={n} value={n}>
                  {t(`nationalities.${n}`)}
                </option>
              ))}
            </select>



            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">{t("careers.gender")}</option>
              <option value="Male">{t("careers.gender_male")}</option>
              <option value="Female">{t("careers.gender_female")}</option>
            </select>
          </div>

          {/* الموقع - رقم الهوية/جواز السفر */}
          <div className="form-row">
            <select name="location" value={form.location} onChange={handleChange} required>
              <option value="">{t("careers.location")}</option>

              {SAUDI_LOCATIONS.map(l => (
                <option key={l} value={l}>
                  {t(`locations.${l}`)}
                </option>
              ))}
            </select>


            <input
              name="id_number"
              placeholder={t("careers.id_number")}
              value={form.id_number}
              onChange={handleChange}
            />
          </div>

          {/* المنصب الذي تقدم عليه - كيف عثرت على هذا الشاغر الوظيفي؟ */}
          <div className="form-row">
            <select
              name="job_id"
              value={form.job_id}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">{t("careers.job_position")}</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {isEn ? j.title_en : j.title_ar}
                </option>
              ))}
            </select>

            <select name="source" value={form.source} onChange={handleChange}>
              <option value="">{t("careers.how_found")}</option>

              {SOURCES.map(s => (
                <option key={s} value={s}>
                  {t(`sources.${s}`)}
                </option>
              ))}
            </select>


          </div>

          {/* الشهادات الاحترافية/ التدريب */}
          <input
            name="certifications"
            placeholder={t("careers.certifications")}
            value={form.certifications}
            onChange={handleChange}
            className="full-width-input"
          />

          {/* LinkedIn */}
          <input
            name="linkedin"
            placeholder={t("careers.linkedin")}
            value={form.linkedin}
            onChange={handleChange}
            className="full-width-input"
          />

          {/* رفع السيرة الذاتية (PDF Only) */}
          <div className="file-upload-section">
            <label className="field-label">{t("careers.cv_upload")}</label>
            <div className="file-input-wrapper">
              <label htmlFor="cv-upload" className="file-input-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{form.cv ? form.cv.name : t("careers.upload_file")}</span>
              </label>
              <input
                id="cv-upload"
                type="file"
                name="cv"
                accept=".pdf"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ملفات إضافية */}
          <div className="file-upload-section">
            <label className="field-label">{t("careers.additional_files")}</label>
            <div className="file-input-wrapper">
              <label htmlFor="additional-files-upload" className="file-input-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{form.additional_files ? form.additional_files.name : t("careers.upload_file")}</span>
              </label>
              <input
                id="additional-files-upload"
                type="file"
                name="cover_letter"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* أكتب رسالة لفريق الموارد البشرية */}
          <textarea
            name="notes"
            placeholder={t("careers.message_to_hr")}
            value={form.notes}
            onChange={handleChange}
            rows="4"
            className="full-width-textarea"
          />

          {/* من فضلك إقرا سياسة الشروط و الأحكام للمتابعة */}
          <div className="terms-section">
            <p className="terms-intro">
              {t("careers.please_read")}{" "}
              <a href="/terms" target="_blank" rel="noreferrer">
                {t("careers.terms_policy")}
              </a>{" "}
              {t("careers.to_continue")}
            </p>

            <label className="checkbox-container">
              <input
                type="checkbox"
                name="accept_terms"
                checked={form.accept_terms}
                onChange={handleChange}
                required
              />
              <span className="checkbox-label">
                {t("careers.accept_terms_text")}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`modal-submit-btn ${!isFormValid() || isSubmitting ? "disabled" : ""}`}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? t("careers.submitting") : t("careers.submit")}
          </button>

        </form>

        {/* Footer Note */}
        <p className="modal-footer-note">
          {t("careers.mandatory_fields_note")}
        </p>
      </div>
    </div>
  );
}