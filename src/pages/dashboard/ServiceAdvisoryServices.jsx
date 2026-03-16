// src/pages/dashboard/ServiceAdvisoryServices.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ServiceAdvisoryServices() {
  const { t, i18n } = useTranslation();

  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const emptyForm = {
    practice_area: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    serial_number: "",
    icon: "",
    cover_image: null,
    is_featured: false,
    is_most_requested: false,
    overview_ar: "",
    overview_en: "",
    who_for_ar: "",
    who_for_en: "",
    scope_ar: "",
    scope_en: "",
    deliverables_ar: "",
    deliverables_en: "",
    how_it_works_ar: "",
    how_it_works_en: "",
    faqs: [],
  };

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      const res = await api.get("services/admin/items/");
      const areasRes = await api.get("services/admin/areas/");
      const faqRes = await api.get("cms/admin/faq/");
      setFaqs(faqRes.data || []);
      setServices(res.data || []);
      setAreas(areasRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "faqs") {
        form[key].forEach((faq) => formData.append("faqs", faq));
      } else if (key === "cover_image") {
        if (form.cover_image) {
          formData.append("cover_image", form.cover_image);
        }
      } else if (typeof form[key] === "boolean") {
        formData.append(key, form[key] ? "true" : "false");
      } else if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editing) {
        await api.patch(
          `services/admin/items/${editing.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(t("cms.services.services.success.updated"));
      } else {
        await api.post("services/admin/items/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(t("cms.services.services.success.created"));
      }

      setForm(emptyForm);
      setEditing(null);
      setImagePreview(null);
      load();
    } catch (err) {
      toast.error(t("cms.services.services.error.save_failed"));
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("cms.services.services.confirm_delete_title"),
      text: t("cms.services.services.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.services.services.delete_button"),
      cancelButtonText: t("cms.services.services.cancel_button"),
      reverseButtons: i18n.language === "ar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`services/admin/items/${id}/`);
        Swal.fire({
          title: t("cms.services.services.deleted_title"),
          text: t("cms.services.services.success.deleted"),
          icon: "success",
          confirmButtonColor: "#22c55e",
        });
        load();
      } catch (err) {
        toast.error(t("cms.services.services.error.delete_failed"));
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const toggleData = new FormData();
      toggleData.append("is_active", !currentStatus);

      await api.patch(`services/admin/items/${id}/`, toggleData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t("cms.services.services.success.toggled"));
      load();
    } catch (err) {
      toast.error(t("cms.services.services.error.toggle_failed"));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, cover_image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="dashboard-services-content">
      <div className="dashboard-services-content-header">
        <div className="dashboard-services-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7V17.5C2 21 8.5 23.5 12 24C15.5 23.5 22 21 22 17.5V7L12 2Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.services.services.title")}</h2>
        </div>
        <p className="dashboard-services-content-subtitle">
          {t("cms.services.services.subtitle")}
        </p>
      </div>

      {/* FORM */}
      <form className="dashboard-services-form-card" onSubmit={submit}>
        <div className="dashboard-services-form-header">
          <div className="dashboard-services-form-header-left">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2Z" fill="currentColor"/>
            </svg>
            <h3>
              {editing
                ? t("cms.services.services.form_edit")
                : t("cms.services.services.form_create")}
            </h3>
          </div>
          {editing && (
            <button
              type="button"
              className="dashboard-services-btn-cancel"
              onClick={() => {
                setForm(emptyForm);
                setEditing(null);
                setImagePreview(null);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.services.actions.cancel")}
            </button>
          )}
        </div>

        {/* Basic Info */}
        <div className="dashboard-services-form-section">
          <h3 className="dashboard-services-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5Z" fill="currentColor"/>
            </svg>
            {t("cms.services.services.section_basic")}
          </h3>

          <div className="dashboard-services-form-group">
            <label className="dashboard-services-label">
              {t("cms.services.services.practice_area")}
            </label>
            <select
              className="dashboard-services-select"
              value={form.practice_area}
              onChange={(e) => setForm({ ...form, practice_area: e.target.value })}
              required
            >
              <option value="">{t("cms.services.services.select_area")}</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {i18n.language === 'ar' ? a.name_ar : a.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.title_ar")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.services.placeholder_title_ar")}
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                required
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.title_en")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.services.placeholder_title_en")}
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.description_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_description_ar")}
                value={form.description_ar}
                onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                rows="3"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.description_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_description_en")}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                rows="3"
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.serial_number")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.services.placeholder_serial")}
                value={form.serial_number}
                onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.icon")}
              </label>
              <select
                className="dashboard-services-select"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                <option value="">{t("cms.services.services.select_icon")}</option>
                <option value="gavel">⚖️ Gavel</option>
                <option value="scale">⚖️ Scale of Justice</option>
                <option value="briefcase">💼 Briefcase</option>
                <option value="contract">📋 Contract</option>
                <option value="shield">🛡️ Shield</option>
                <option value="court">🏛️ Court</option>
                <option value="document">📄 Document</option>
                <option value="pen">✒️ Pen</option>
              </select>
            </div>
          </div>

          <div className="dashboard-services-form-group">
            <label className="dashboard-services-label">
              {t("cms.services.services.cover_image")}
            </label>
            <input
              type="file"
              accept="image/*"
              className="dashboard-services-input-file"
              onChange={handleImageChange}
            />
            {(imagePreview || (editing && editing.cover_image)) && (
              <div className="dashboard-services-image-preview">
                <img
                  src={imagePreview || editing.cover_image}
                  alt="Preview"
                />
              </div>
            )}
          </div>

          <div className="dashboard-services-checkboxes-row">
            <label className="dashboard-services-checkbox-label">
              <input
                type="checkbox"
                className="dashboard-services-checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              <span className="dashboard-services-checkbox-text">
                {t("cms.services.services.featured")}
              </span>
            </label>

            <label className="dashboard-services-checkbox-label">
              <input
                type="checkbox"
                className="dashboard-services-checkbox"
                checked={form.is_most_requested}
                onChange={(e) => setForm({ ...form, is_most_requested: e.target.checked })}
              />
              <span className="dashboard-services-checkbox-text">
                {t("cms.services.services.most_requested")}
              </span>
            </label>
          </div>
        </div>

        {/* Details */}
        <div className="dashboard-services-form-section">
          <h3 className="dashboard-services-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3H15V15H3V3ZM5 5V13H13V5H5Z" fill="currentColor"/>
            </svg>
            {t("cms.services.services.section_details")}
          </h3>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.overview_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_overview_ar")}
                value={form.overview_ar}
                onChange={(e) => setForm({ ...form, overview_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.overview_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_overview_en")}
                value={form.overview_en}
                onChange={(e) => setForm({ ...form, overview_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.who_for_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_who_for_ar")}
                value={form.who_for_ar}
                onChange={(e) => setForm({ ...form, who_for_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.who_for_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_who_for_en")}
                value={form.who_for_en}
                onChange={(e) => setForm({ ...form, who_for_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.scope_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_scope_ar")}
                value={form.scope_ar}
                onChange={(e) => setForm({ ...form, scope_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.scope_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_scope_en")}
                value={form.scope_en}
                onChange={(e) => setForm({ ...form, scope_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.deliverables_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_deliverables_ar")}
                value={form.deliverables_ar}
                onChange={(e) => setForm({ ...form, deliverables_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.deliverables_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_deliverables_en")}
                value={form.deliverables_en}
                onChange={(e) => setForm({ ...form, deliverables_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.how_it_works_ar")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_how_it_works_ar")}
                value={form.how_it_works_ar}
                onChange={(e) => setForm({ ...form, how_it_works_ar: e.target.value })}
                rows="4"
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.services.how_it_works_en")}
              </label>
              <textarea
                className="dashboard-services-textarea"
                placeholder={t("cms.services.services.placeholder_how_it_works_en")}
                value={form.how_it_works_en}
                onChange={(e) => setForm({ ...form, how_it_works_en: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          <div className="dashboard-services-form-group">
            <label className="dashboard-services-label">
              {t("cms.services.services.faqs")}
            </label>
            <select
              className="dashboard-services-select-multiple"
              multiple
              value={form.faqs}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => Number(option.value)
                );
                setForm({ ...form, faqs: values });
              }}
            >
              {faqs.map((f) => (
                <option key={f.id} value={f.id}>
                  {i18n.language === 'ar' ? f.question_ar : f.question_en}
                </option>
              ))}
            </select>
            <p className="dashboard-services-help-text">
              {t("cms.services.services.faqs_help")}
            </p>
          </div>
        </div>

        <div className="dashboard-services-form-actions">
          <button type="submit" className="dashboard-services-btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {editing ? t("cms.services.actions.update") : t("cms.services.actions.create")}
          </button>
          {editing && (
            <button
              type="button"
              className="dashboard-services-btn-secondary"
              onClick={() => {
                setForm(emptyForm);
                setEditing(null);
                setImagePreview(null);
              }}
            >
              {t("cms.services.actions.cancel")}
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="dashboard-services-list-card">
        <div className="dashboard-services-list-header">
          <div className="dashboard-services-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h3>{t("cms.services.services.list_title")}</h3>
          </div>
          <span className="dashboard-services-count-badge">{services.length}</span>
        </div>

        {services.length > 0 ? (
          <div className="dashboard-services-table-wrapper">
            <table className="dashboard-services-table">
              <thead>
                <tr>
                  <th>{t("cms.services.table.id")}</th>
                  <th>{t("cms.services.table.title")}</th>
                  <th>{t("cms.services.table.area")}</th>
                  <th>{t("cms.services.table.status")}</th>
                  <th>{t("cms.services.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td className="dashboard-services-table-name">
                      {i18n.language === 'ar' ? s.title_ar : s.title_en}
                    </td>
                    <td>{i18n.language === 'ar' ? s.area_data?.name_ar : s.area_data?.name_en}</td>
                    <td>
                      <span
                        className={`dashboard-services-status-badge ${
                          s.is_active
                            ? "dashboard-services-status-active"
                            : "dashboard-services-status-inactive"
                        }`}
                      >
                        {s.is_active
                          ? t("cms.services.status.active")
                          : t("cms.services.status.inactive")}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-services-table-actions">
                        <button
                          className="dashboard-services-btn-edit"
                          onClick={() => {
                            setEditing(s);
                            setForm({
                              ...emptyForm,
                              ...s,
                              practice_area: s.practice_area || "",
                              faqs: s.faq_data ? s.faq_data.map((f) => f.id) : [],
                              cover_image: null,
                            });
                            setImagePreview(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                          </svg>
                          {t("cms.services.actions.edit")}
                        </button>

                        <button
                          className="dashboard-services-btn-toggle"
                          onClick={() => handleToggle(s.id, s.is_active)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2Z" fill="currentColor"/>
                          </svg>
                          {s.is_active
                            ? t("cms.services.actions.deactivate")
                            : t("cms.services.actions.activate")}
                        </button>

                        <button
                          className="dashboard-services-btn-delete"
                          onClick={() => handleDelete(s.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                          </svg>
                          {t("cms.services.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-services-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4Z" fill="currentColor"/>
            </svg>
            <p>{t("cms.services.services.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}