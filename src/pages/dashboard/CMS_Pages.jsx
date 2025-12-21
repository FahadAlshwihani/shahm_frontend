// src/pages/dashboard/CMS_Pages.jsx
import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_PAGE.css";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function CMS_Pages() {
  const { t } = useTranslation();

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

  return (
    <div className="page-cms-container">
      <div className="page-cms-header">
        <h1 className="page-cms-title">{t("cms.pages.title")}</h1>
        <div className="page-cms-subtitle">Manage website pages and content</div>
      </div>

      {/* FORM */}
      <div className="page-form-card">
        <div className="page-form-header">
          <h2>
            {edit
              ? t("cms.pages.form_title_edit")
              : t("cms.pages.form_title_create")}
          </h2>
          {edit && (
            <button className="page-btn-cancel" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="page-form">
          {/* Basic Information */}
          <div className="page-form-section">
            <h3 className="page-section-title">Basic Information</h3>
            <div className="page-form-grid">
              <div className="page-form-group">
                <label className="page-label">{t("cms.pages.title_ar")}</label>
                <input
                  className="page-input"
                  name="title_ar"
                  placeholder="العنوان بالعربية"
                  value={form.title_ar}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="page-form-group">
                <label className="page-label">{t("cms.pages.title_en")}</label>
                <input
                  className="page-input"
                  name="title_en"
                  placeholder="Title in English"
                  value={form.title_en}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="page-form-group">
                <label className="page-label">{t("cms.pages.slug")}</label>
                <input
                  className="page-input"
                  name="slug"
                  placeholder="page-slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="page-form-group">
                <label className="page-label">{t("cms.pages.page_status")}</label>
                <select
                  className="page-select"
                  name="page_status"
                  value={form.page_status}
                  onChange={handleChange}
                >
                  <option value="active">{t("cms.pages.active")}</option>
                  <option value="coming_soon">{t("cms.pages.coming_soon")}</option>
                </select>
              </div>
            </div>

            <div className="page-checkbox-group">
              <label className="page-checkbox-label">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                />
                <span className="page-checkbox-text">{t("cms.pages.published")}</span>
              </label>
            </div>
          </div>

          {/* Content Arabic */}
          <div className="page-form-section">
            <h3 className="page-section-title">{t("cms.pages.content_ar")}</h3>
            <div className="page-editor-wrapper">
              <SunEditor
                setContents={form.content_ar}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, content_ar: content }))
                }
                setOptions={{
                  height: 300,
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
          <div className="page-form-section">
            <h3 className="page-section-title">{t("cms.pages.content_en")}</h3>
            <div className="page-editor-wrapper">
              <SunEditor
                setContents={form.content_en}
                onChange={(content) =>
                  setForm((prev) => ({ ...prev, content_en: content }))
                }
                setOptions={{
                  height: 300,
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

          <div className="page-form-actions">
            <button type="submit" className="page-btn-primary" disabled={loadingPages}>
              {loadingPages
                ? t("cms.pages.saving")
                : edit
                ? t("cms.pages.update")
                : t("cms.pages.create")}
            </button>
            {edit && (
              <button type="button" className="page-btn-secondary" onClick={resetForm}>
                {t("cms.pages.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="page-list-card">
        <h2 className="page-list-title">Pages List</h2>
        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("cms.pages.slug")}</th>
                <th>{t("cms.pages.title_ar")}</th>
                <th>{t("cms.pages.page_status")}</th>
                <th>{t("cms.pages.published")}</th>
                <th>{t("cms.pages.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="page-table-id">#{p.id}</td>
                  <td className="page-table-slug">{p.slug}</td>
                  <td className="page-table-title">{p.title_ar}</td>
                  <td>
                    <span className={`page-status-badge ${p.page_status === 'coming_soon' ? 'coming-soon' : 'active'}`}>
                      {p.page_status === "coming_soon"
                        ? t("cms.pages.coming_soon")
                        : t("cms.pages.active")}
                    </span>
                  </td>
                  <td>
                    <span className={`page-publish-badge ${p.is_published ? 'published' : 'unpublished'}`}>
                      {p.is_published ? t("cms.pages.yes") : t("cms.pages.no")}
                    </span>
                  </td>
                  <td className="page-table-actions">
                    <button className="page-btn-edit" onClick={() => handleEdit(p)}>
                      {t("cms.pages.edit")}
                    </button>
                    <button
                      className="page-btn-delete"
                      onClick={() =>
                        window.confirm(t("cms.pages.confirm_delete")) &&
                        deletePage(p.id)
                      }
                    >
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