// src/pages/dashboard/CMS_Pages.jsx
import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_PAGE.css";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Swal from "sweetalert2";

export default function CMS_Pages() {
  const { t, i18n } = useTranslation();

  const {
    pages,
    loadingPages,
    fetchAdminPages,
    createPage,
    updatePage,
    deletePage,
  } = useCmsStore();

  const [edit, setEdit] = useState(null);

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    slug: "",
    content_ar: "",
    content_en: "",
    page_status: "active",
    is_published: true,
  });

  useEffect(() => {
    fetchAdminPages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEdit(null);
    setForm({
      title_ar: "",
      title_en: "",
      slug: "",
      content_ar: "",
      content_en: "",
      page_status: "active",
      is_published: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = edit
      ? await updatePage(edit.id, form)
      : await createPage(form);

    if (result.success) {
      toast.success(t("cms.pages.saved"));
      resetForm();
    } else {
      toast.error(t("cms.pages.save_failed"));
    }
  };

  const handleEdit = (p) => {
    setEdit(p);
    setForm({
      title_ar: p.title_ar,
      title_en: p.title_en,
      slug: p.slug,
      content_ar: p.content_ar,
      content_en: p.content_en,
      page_status: p.page_status || "active",
      is_published: p.is_published,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (pageId) => {
    const result = await Swal.fire({
      title: t("cms.pages.confirm_delete_title"),
      text: t("cms.pages.confirm_delete_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.pages.delete_button"),
      cancelButtonText: t("cms.pages.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      await deletePage(pageId);
      Swal.fire({
        title: t("cms.pages.deleted"),
        text: t("cms.pages.delete_success"),
        icon: 'success',
        confirmButtonColor: '#22c55e',
      });
    }
  };

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-page-header">
        <div className="dashboard-page-header-content">
          <h1 className="dashboard-page-title">{t("cms.pages.title")}</h1>
          <p className="dashboard-page-subtitle">{t("cms.pages.subtitle")}</p>
        </div>
      </div>

      {/* FORM */}
      <div className="dashboard-page-form-card">
        <div className="dashboard-page-form-header">
          <div className="dashboard-page-form-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" fill="currentColor"/>
              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>
              {edit
                ? t("cms.pages.form_title_edit")
                : t("cms.pages.form_title_create")}
            </h2>
          </div>
          {edit && (
            <button className="dashboard-page-btn-cancel" onClick={resetForm}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.pages.cancel")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="dashboard-page-form">
          {/* Basic Information */}
          <div className="dashboard-page-form-section">
            <h3 className="dashboard-page-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM9 13.5C8.175 13.5 7.5 12.825 7.5 12H10.5C10.5 12.825 9.825 13.5 9 13.5ZM12.75 11.25H5.25V10.5H6V7.5C6 5.9175 7.0575 4.575 8.625 4.2825V3.75C8.625 3.5175 8.8125 3.375 9 3.375C9.1875 3.375 9.375 3.5625 9.375 3.75V4.2825C10.9425 4.575 12 5.9175 12 7.5V10.5H12.75V11.25Z" fill="currentColor"/>
              </svg>
              {t("cms.pages.basic_info")}
            </h3>
            <div className="dashboard-page-form-grid-row">
              <div className="dashboard-page-form-group">
                <label className="dashboard-page-label">{t("cms.pages.title_ar")}</label>
                <input
                  className="dashboard-page-input"
                  name="title_ar"
                  placeholder={t("cms.pages.title_ar_placeholder")}
                  value={form.title_ar}
                  onChange={handleChange}
                  required
                  dir="rtl"
                />
              </div>

              <div className="dashboard-page-form-group">
                <label className="dashboard-page-label">{t("cms.pages.title_en")}</label>
                <input
                  className="dashboard-page-input"
                  name="title_en"
                  placeholder={t("cms.pages.title_en_placeholder")}
                  value={form.title_en}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dashboard-page-form-grid">
              <div className="dashboard-page-form-group">
                <label className="dashboard-page-label">{t("cms.pages.slug")}</label>
                <input
                  className="dashboard-page-input"
                  name="slug"
                  placeholder={t("cms.pages.slug_placeholder")}
                  value={form.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dashboard-page-form-group">
                <label className="dashboard-page-label">{t("cms.pages.page_status")}</label>
                <select
                  className="dashboard-page-select"
                  name="page_status"
                  value={form.page_status}
                  onChange={handleChange}
                >
                  <option value="active">{t("cms.pages.active")}</option>
                  <option value="coming_soon">{t("cms.pages.coming_soon")}</option>
                </select>
              </div>
            </div>

            <div className="dashboard-page-checkbox-group">
              <label className="dashboard-page-checkbox-label">
                <input
                  type="checkbox"
                  className="dashboard-page-checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                <span className="dashboard-page-checkbox-text">{t("cms.pages.published")}</span>
              </label>
            </div>
          </div>

          {/* Content Arabic */}
          <div className="dashboard-page-form-section">
            <h3 className="dashboard-page-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 2.25H3C2.175 2.25 1.5 2.925 1.5 3.75V14.25C1.5 15.075 2.175 15.75 3 15.75H15C15.825 15.75 16.5 15.075 16.5 14.25V3.75C16.5 2.925 15.825 2.25 15 2.25ZM15 14.25H3V6H15V14.25Z" fill="currentColor"/>
              </svg>
              {t("cms.pages.content_ar")}
            </h3>
            <div className="dashboard-page-editor-wrapper">
              <SunEditor
                setContents={form.content_ar}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, content_ar: content }))
                }
                setOptions={{
                  height: 400,
                  codeViewFilter: false,
                  fullPage: false,
                  addAttributes: { all: "class|id|data-*" },
                  pasteTagsWhitelist: ".*",
                  pasteAttributesWhitelist: ".*",
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "italic", "underline"],
                    ["fontSize", "formatBlock"],
                    ["align", "list"],
                    ["link"],
                    ["codeView"],
                  ],
                }}
              />
            </div>
          </div>

          {/* Content English */}
          <div className="dashboard-page-form-section">
            <h3 className="dashboard-page-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 2.25H3C2.175 2.25 1.5 2.925 1.5 3.75V14.25C1.5 15.075 2.175 15.75 3 15.75H15C15.825 15.75 16.5 15.075 16.5 14.25V3.75C16.5 2.925 15.825 2.25 15 2.25ZM15 14.25H3V6H15V14.25Z" fill="currentColor"/>
              </svg>
              {t("cms.pages.content_en")}
            </h3>
            <div className="dashboard-page-editor-wrapper">
              <SunEditor
                setContents={form.content_en}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, content_en: content }))
                }
                setOptions={{
                  height: 400,
                  codeViewFilter: false,
                  fullPage: false,
                  addAttributes: { all: "class|id|data-*" },
                  pasteTagsWhitelist: ".*",
                  pasteAttributesWhitelist: ".*",
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "italic", "underline"],
                    ["fontSize", "formatBlock"],
                    ["align", "list"],
                    ["link"],
                    ["codeView"],
                  ],
                }}
              />
            </div>
          </div>

          <div className="dashboard-page-form-actions">
            <button type="submit" className="dashboard-page-btn-primary" disabled={loadingPages}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {loadingPages
                ? t("cms.pages.saving")
                : edit
                ? t("cms.pages.update")
                : t("cms.pages.create")}
            </button>
            {edit && (
              <button type="button" className="dashboard-page-btn-secondary" onClick={resetForm}>
                {t("cms.pages.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="dashboard-page-list-card">
        <div className="dashboard-page-list-header">
          <div className="dashboard-page-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-page-list-title">{t("cms.pages.list_title")}</h2>
          </div>
          <span className="dashboard-page-count-badge">{pages.length}</span>
        </div>
        <div className="dashboard-page-table-wrapper">
          <table className="dashboard-page-table">
            <thead>
              <tr>
                <th>{t("cms.pages.table.id")}</th>
                <th>{t("cms.pages.slug")}</th>
                <th>{t("cms.pages.table.title")}</th>
                <th>{t("cms.pages.page_status")}</th>
                <th>{t("cms.pages.published")}</th>
                <th>{t("cms.pages.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="dashboard-page-table-id">#{p.id}</td>
                  <td className="dashboard-page-table-slug">{p.slug}</td>
                  <td className="dashboard-page-table-title">
                    {i18n.language === 'ar' ? p.title_ar : p.title_en}
                  </td>
                  <td>
                    <span className={`dashboard-page-status-badge ${p.page_status === 'coming_soon' ? 'dashboard-page-status-coming-soon' : 'dashboard-page-status-active'}`}>
                      {p.page_status === "coming_soon"
                        ? t("cms.pages.coming_soon")
                        : t("cms.pages.active")}
                    </span>
                  </td>
                  <td>
                    <span className={`dashboard-page-publish-badge ${p.is_published ? 'dashboard-page-published' : 'dashboard-page-unpublished'}`}>
                      {p.is_published ? t("cms.pages.yes") : t("cms.pages.no")}
                    </span>
                  </td>
                  <td className="dashboard-page-table-actions">
                    <button className="dashboard-page-btn-edit" onClick={() => handleEdit(p)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                      </svg>
                      {t("cms.pages.edit")}
                    </button>
                    <button
                      className="dashboard-page-btn-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                      </svg>
                      {t("cms.pages.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}