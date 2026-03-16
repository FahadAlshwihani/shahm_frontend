// src/pages/dashboard/CMS_Footer.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_FOOTER.css";

export default function CMS_Footer() {
  const { t, i18n } = useTranslation();

  const [columns, setColumns] = useState([]);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(null);

  const PROTECTED_COLUMNS = ["newsletter", "follow"];

  /* ================= Column Form ================= */
  const [colForm, setColForm] = useState({
    title_ar: "",
    title_en: "",
    order: 0,
    is_active: true,
  });
  const [editColumnId, setEditColumnId] = useState(null);

  /* ================= Link Form ================= */
  const [linkForm, setLinkForm] = useState({
    column: "",
    parent: "",
    label_ar: "",
    label_en: "",
    url: "",
    page: "",
    order: 0,
    is_active: true,
  });

  const [editLinkId, setEditLinkId] = useState(null);

  /* ================= Load Data ================= */
  const loadData = async () => {
    try {
      const colRes = await api.get("cms/admin/columns/");
      setColumns(colRes.data);

      const pagesRes = await api.get("cms/admin/pages/");
      setPages(pagesRes.data);

      const settingsRes = await api.get("public/settings/");
      setSettings(settingsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= Submit Column ================= */
  const submitColumn = async (e) => {
    e.preventDefault();

    if (PROTECTED_COLUMNS.includes(colForm.title_ar)) {
      return toast.error(t("cms.footer.protected_column"));
    }

    try {
      if (editColumnId) {
        await api.patch(`cms/admin/columns/${editColumnId}/`, colForm);
        toast.success(t("cms.footer.column_updated"));
      } else {
        await api.post("cms/admin/columns/", colForm);
        toast.success(t("cms.footer.column_created"));
      }

      resetColumnForm();
      loadData();
    } catch {
      toast.error(t("cms.footer.column_save_failed"));
    }
  };

  const resetColumnForm = () => {
    setColForm({
      title_ar: "",
      title_en: "",
      order: 0,
      is_active: true,
    });
    setEditColumnId(null);
  };

  const handleDeleteColumn = async (id) => {
    const result = await Swal.fire({
      title: t("cms.footer.confirm_delete_column_title"),
      text: t("cms.footer.confirm_delete_column_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.footer.delete_button"),
      cancelButtonText: t("cms.footer.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      await api.delete(`cms/admin/columns/${id}/`);
      Swal.fire({
        title: t("cms.footer.deleted_title"),
        text: t("cms.footer.column_deleted"),
        icon: 'success',
        confirmButtonColor: '#22c55e',
      });
      loadData();
    }
  };

  /* ================= Submit Link ================= */
  const submitLink = async (e) => {
    e.preventDefault();

    const columnObj = columns.find((c) => c.id == linkForm.column);
    if (!columnObj) return toast.error(t("cms.footer.select_column"));

    if (
      columnObj.title_ar === "عن شهم" &&
      ["فريق العمل", "المجالات والقطاعات"].includes(linkForm.label_ar) &&
      !linkForm.parent
    ) {
      return toast.error(t("cms.footer.parent_required"));
    }

    if (PROTECTED_COLUMNS.includes(columnObj.key)) {
      return toast.error(t("cms.footer.protected_column"));
    }

    if (linkForm.url && linkForm.page) {
      return toast.error(t("cms.footer.link_conflict"));
    }

    const fd = new FormData();

    Object.entries({
      ...linkForm,
      parent: linkForm.parent || "",
    }).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        fd.append(key, value);
      }
    });

    try {
      if (editLinkId) {
        await api.patch(
          `cms/admin/footer-links/${editLinkId}/`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(t("cms.footer.link_updated"));
      } else {
        await api.post(
          "cms/admin/footer-links/",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success(t("cms.footer.link_created"));
      }

      resetLinkForm();
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(t("cms.footer.link_save_failed"));
    }
  };

  const resetLinkForm = () => {
    setLinkForm({
      column: "",
      parent: "",
      label_ar: "",
      label_en: "",
      url: "",
      page: "",
      order: 0,
      is_active: true,
    });
    setEditLinkId(null);
  };

  const handleDeleteLink = async (id) => {
    const result = await Swal.fire({
      title: t("cms.footer.confirm_delete_link_title"),
      text: t("cms.footer.confirm_delete_link_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.footer.delete_button"),
      cancelButtonText: t("cms.footer.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      await api.delete(`cms/admin/footer-links/${id}/`);
      Swal.fire({
        title: t("cms.footer.deleted_title"),
        text: t("cms.footer.link_deleted"),
        icon: 'success',
        confirmButtonColor: '#22c55e',
      });
      loadData();
    }
  };

  const handleDeleteLogo = async (logoLink) => {
    const result = await Swal.fire({
      title: t("cms.footer.confirm_delete_logo_title"),
      text: t("cms.footer.confirm_delete_logo_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.footer.logo_delete_button"),
      cancelButtonText: t("cms.footer.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      await api.delete(`cms/admin/footer-links/${logoLink.id}/`);
      Swal.fire({
        title: t("cms.footer.deleted_title"),
        text: t("cms.footer.logo_deleted"),
        icon: 'success',
        confirmButtonColor: '#22c55e',
      });
      loadData();
    }
  };

  function TreeItem({ item }) {
    return (
      <li className="dashboard-footer-link-item">
        <div className="dashboard-footer-link-content">
          <span className="dashboard-footer-link-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8.5 1.5L14 4.5V11C14 12.6569 11.3137 14 8 14C4.68629 14 2 12.6569 2 11V4.5L7.5 1.5C7.81666 1.33333 8.18334 1.33333 8.5 1.5Z" fill="currentColor"/>
            </svg>
          </span>
          <span className="dashboard-footer-link-label">
            {i18n.language === 'ar' ? item.label_ar : item.label_en}
          </span>
          <input
            type="number"
            className="dashboard-footer-input-number"
            value={item.order}
            onChange={async (e) => {
              await api.patch(`cms/admin/footer-links/${item.id}/`, {
                order: e.target.value,
              });
              toast.success(t("cms.footer.order_updated"));
              loadData();
            }}
          />

          <button
            className="dashboard-footer-btn-delete"
            onClick={() => handleDeleteLink(item.id)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
            </svg>
            {t("cms.footer.delete")}
          </button>
        </div>

        {item.children?.length > 0 && (
          <ul className="dashboard-footer-links-list dashboard-footer-links-nested">
            {item.children.map((c) => (
              <TreeItem key={c.id} item={c} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  /* ================= Render ================= */
  return (
    <div className="dashboard-footer-container">
      <div className="dashboard-footer-header">
        <div className="dashboard-footer-header-content">
          <h1 className="dashboard-footer-title">{t("cms.footer.title")}</h1>
          <p className="dashboard-footer-subtitle">{t("cms.footer.subtitle")}</p>
        </div>
      </div>

      {/* ================= Column Form ================= */}
      <div className="dashboard-footer-form-card">
        <div className="dashboard-footer-form-header">
          <div className="dashboard-footer-form-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H9V21H3V3ZM11 3H21V9H11V3ZM11 11H21V21H11V11Z" fill="currentColor"/>
            </svg>
            <h3>
              {editColumnId
                ? t("cms.footer.edit_column")
                : t("cms.footer.create_column")}
            </h3>
          </div>
          {editColumnId && (
            <button className="dashboard-footer-btn-cancel" onClick={resetColumnForm}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.footer.cancel")}
            </button>
          )}
        </div>

        <form onSubmit={submitColumn}>
          <div className="dashboard-footer-form-section">
            <div className="dashboard-footer-form-grid-row">
              <div className="dashboard-footer-form-group">
                <label className="dashboard-footer-label">
                  {t("cms.footer.title_ar")}
                </label>
                <input
                  className="dashboard-footer-input"
                  placeholder={t("cms.footer.title_ar_placeholder")}
                  value={colForm.title_ar}
                  onChange={(e) =>
                    setColForm({ ...colForm, title_ar: e.target.value })
                  }
                  dir="rtl"
                />
              </div>

              <div className="dashboard-footer-form-group">
                <label className="dashboard-footer-label">
                  {t("cms.footer.title_en")}
                </label>
                <input
                  className="dashboard-footer-input"
                  placeholder={t("cms.footer.title_en_placeholder")}
                  value={colForm.title_en}
                  onChange={(e) =>
                    setColForm({ ...colForm, title_en: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="dashboard-footer-form-grid">
              <div className="dashboard-footer-form-group">
                <label className="dashboard-footer-label">{t("cms.footer.order")}</label>
                <input
                  className="dashboard-footer-input"
                  type="number"
                  placeholder="0"
                  value={colForm.order}
                  onChange={(e) =>
                    setColForm({ ...colForm, order: e.target.value })
                  }
                />
              </div>

              <div className="dashboard-footer-form-group dashboard-footer-checkbox-wrapper">
                <label className="dashboard-footer-checkbox-label">
                  <input
                    type="checkbox"
                    className="dashboard-footer-checkbox"
                    checked={colForm.is_active}
                    onChange={(e) =>
                      setColForm({ ...colForm, is_active: e.target.checked })
                    }
                  />
                  <span className="dashboard-footer-checkbox-text">{t("cms.footer.active")}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="dashboard-footer-form-actions">
            <button type="submit" className="dashboard-footer-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {editColumnId ? t("cms.footer.update") : t("cms.footer.create")}
            </button>
            {editColumnId && (
              <button type="button" className="dashboard-footer-btn-secondary" onClick={resetColumnForm}>
                {t("cms.footer.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= Columns ================= */}
      {columns.map((col) => (
        <div key={col.id} className="dashboard-footer-column-card">
          <div className="dashboard-footer-column-header">
            <div className="dashboard-footer-column-title-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
              </svg>
              <h3 className="dashboard-footer-column-title">
                {i18n.language === 'ar' ? col.title_ar : col.title_en}
              </h3>
            </div>

            <div className="dashboard-footer-column-actions">
              <label className="dashboard-footer-order-label">{t("cms.footer.order")}</label>
              <input
                type="number"
                className="dashboard-footer-input-number"
                value={col.order}
                onChange={async (e) => {
                  await api.patch(`cms/admin/columns/${col.id}/`, {
                    order: e.target.value,
                  });
                  toast.success(t("cms.footer.order_updated"));
                  loadData();
                }}
              />

              {!PROTECTED_COLUMNS.includes(col.key) && (
                <>
                  <button
                    className="dashboard-footer-btn-edit"
                    onClick={() => {
                      setEditColumnId(col.id);
                      setColForm({
                        title_ar: col.title_ar,
                        title_en: col.title_en,
                        order: col.order,
                        is_active: col.is_active,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                    </svg>
                    {t("cms.footer.edit")}
                  </button>

                  <button
                    className="dashboard-footer-btn-delete"
                    onClick={() => handleDeleteColumn(col.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                    </svg>
                    {t("cms.footer.delete")}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ================= Column Links ================= */}
          {col.title_ar === "تابعنا" ? (
            <>
              {/* Logo Upload Section */}
              <div className="dashboard-footer-logo-upload-section">
                <h4 className="dashboard-footer-add-link-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15 2.25H3C2.175 2.25 1.5 2.925 1.5 3.75V14.25C1.5 15.075 2.175 15.75 3 15.75H15C15.825 15.75 16.5 15.075 16.5 14.25V3.75C16.5 2.925 15.825 2.25 15 2.25ZM15 14.25H3V3.75H15V14.25Z" fill="currentColor"/>
                  </svg>
                  {t("cms.footer.footer_logo")}
                </h4>

                {col.links?.find((l) => l.media_type === "footer_logo") ? (
                  <div className="dashboard-footer-logo-preview">
                    <div className="dashboard-footer-logo-image-wrapper">
                      <img
                        src={col.links.find((l) => l.media_type === "footer_logo").file_url}
                        alt="Footer Logo"
                      />
                    </div>
                    <button
                      className="dashboard-footer-btn-delete-logo"
                      onClick={() => handleDeleteLogo(col.links.find((l) => l.media_type === "footer_logo"))}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                      </svg>
                      {t("cms.footer.delete")}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fileInput = e.target.querySelector('input[type="file"]');
                      if (!fileInput.files[0]) {
                        toast.error(t("cms.footer.file_required"));
                        return;
                      }

                      const fd = new FormData();
                      fd.append("column", col.id);
                      fd.append("media_type", "footer_logo");
                      fd.append("file", fileInput.files[0]);
                      fd.append("label_ar", "شعار الفوتر");
                      fd.append("label_en", "Footer Logo");
                      fd.append("order", 0);
                      fd.append("is_active", true);

                      try {
                        await api.post("cms/admin/footer-links/", fd, {
                          headers: { "Content-Type": "multipart/form-data" },
                        });
                        toast.success(t("cms.footer.logo_uploaded"));
                        loadData();
                      } catch {
                        toast.error(t("cms.footer.logo_upload_failed"));
                      }
                    }}
                    className="dashboard-footer-logo-upload-form"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="dashboard-footer-input-file"
                      required
                    />
                    <button type="submit" className="dashboard-footer-btn-upload">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M13.5 6.75L9 2.25L4.5 6.75H7.5V11.25H10.5V6.75H13.5ZM3 12.75H15V15.75H3V12.75Z" fill="currentColor"/>
                      </svg>
                      {t("cms.footer.upload_logo")}
                    </button>
                  </form>
                )}
              </div>

              {/* Social Media Links */}
              <ul className="dashboard-footer-links-list">
                {settings?.linkedin_url && (
                  <li className="dashboard-footer-link-item dashboard-footer-link-auto">
                    <span className="dashboard-footer-link-icon">🔗</span>
                    <span className="dashboard-footer-link-label">LinkedIn</span>
                    <span className="dashboard-footer-link-auto-badge">
                      {t("cms.footer.auto_from_settings")}
                    </span>
                  </li>
                )}
                {settings?.x_url && (
                  <li className="dashboard-footer-link-item dashboard-footer-link-auto">
                    <span className="dashboard-footer-link-icon">🔗</span>
                    <span className="dashboard-footer-link-label">X</span>
                    <span className="dashboard-footer-link-auto-badge">
                      {t("cms.footer.auto_from_settings")}
                    </span>
                  </li>
                )}
                {settings?.instagram_url && (
                  <li className="dashboard-footer-link-item dashboard-footer-link-auto">
                    <span className="dashboard-footer-link-icon">🔗</span>
                    <span className="dashboard-footer-link-label">Instagram</span>
                    <span className="dashboard-footer-link-auto-badge">
                      {t("cms.footer.auto_from_settings")}
                    </span>
                  </li>
                )}

                <div className="dashboard-footer-info-box dashboard-footer-protected">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 11C7.45 11 7 10.55 7 10C7 9.45 7.45 9 8 9C8.55 9 9 9.45 9 10C9 10.55 8.55 11 8 11ZM9 7C9 7.55 8.55 8 8 8C7.45 8 7 7.55 7 7V5C7 4.45 7.45 4 8 4C8.55 4 9 4.45 9 5V7Z" fill="currentColor"/>
                  </svg>
                  {t("cms.footer.edit_in_settings")}
                </div>
              </ul>
            </>
          ) : col.title_ar === "خريطة الموقع" ? (
            <ul className="dashboard-footer-links-list">
              {pages
                .filter(
                  (p) =>
                    p.status === "published" ||
                    p.is_active === true ||
                    p.is_published === true
                )
                .map((p) => (
                  <li key={p.id} className="dashboard-footer-link-item dashboard-footer-link-auto">
                    <span className="dashboard-footer-link-icon">📄</span>
                    <span className="dashboard-footer-link-label">
                      {i18n.language === "en" ? p.title_en || p.title_ar : p.title_ar}
                    </span>
                    <span className="dashboard-footer-link-auto-badge">
                      {t("cms.footer.automatic")}
                    </span>

                    <a
                      href={`/page/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="dashboard-footer-link-url"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11 11H3V3H7V1.5H3C2.175 1.5 1.5 2.175 1.5 3V11C1.5 11.825 2.175 12.5 3 12.5H11C11.825 12.5 12.5 11.825 12.5 11V7H11V11ZM8.5 1.5V3H10.44L4.72 8.72L5.78 9.78L11.5 4.06V6H13V1.5H8.5Z" fill="currentColor"/>
                      </svg>
                      {t("cms.footer.open")}
                    </a>
                  </li>
                ))}
            </ul>
          ) : (
            <ul className="dashboard-footer-links-list">
              {col.links?.map((l) => (
                <TreeItem key={l.id} item={l} />
              ))}
            </ul>
          )}

          {/* ================= Add Link ================= */}
          {!PROTECTED_COLUMNS.includes(col.key) && (
            <div className="dashboard-footer-add-link-section">
              <h4 className="dashboard-footer-add-link-title">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M14.25 9.75H9.75V14.25H8.25V9.75H3.75V8.25H8.25V3.75H9.75V8.25H14.25V9.75Z" fill="currentColor"/>
                </svg>
                {t("cms.footer.add_link")}
              </h4>

              <form onSubmit={submitLink}>
                <div className="dashboard-footer-form-grid-row">
                  <div className="dashboard-footer-form-group">
                    <label className="dashboard-footer-label">
                      {t("cms.footer.link_label_ar")}
                    </label>
                    <input
                      className="dashboard-footer-input"
                      placeholder={t("cms.footer.link_label_ar_placeholder")}
                      value={linkForm.label_ar}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, label_ar: e.target.value })
                      }
                      dir="rtl"
                    />
                  </div>

                  <div className="dashboard-footer-form-group">
                    <label className="dashboard-footer-label">
                      {t("cms.footer.link_label_en")}
                    </label>
                    <input
                      className="dashboard-footer-input"
                      placeholder={t("cms.footer.link_label_en_placeholder")}
                      value={linkForm.label_en}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, label_en: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="dashboard-footer-form-grid">
                  <div className="dashboard-footer-form-group">
                    <label className="dashboard-footer-label">
                      {t("cms.footer.parent_link")}
                    </label>
                    <select
                      className="dashboard-footer-select"
                      value={linkForm.parent}
                      onChange={(e) =>
                        setLinkForm({ ...linkForm, parent: e.target.value })
                      }
                    >
                      <option value="">{t("cms.footer.no_parent")}</option>
                      {col.links
                        ?.filter((l) => !l.parent)
                        .map((l) => (
                          <option key={l.id} value={l.id}>
                            {i18n.language === 'ar' ? l.label_ar : l.label_en}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="dashboard-footer-form-group">
                    <label className="dashboard-footer-label">
                      {t("cms.footer.select_page")}
                    </label>
                    <select
                      className="dashboard-footer-select"
                      value={linkForm.page}
                      onChange={(e) =>
                        setLinkForm({
                          ...linkForm,
                          page: e.target.value,
                          url: "",
                        })
                      }
                    >
                      <option value="">
                        {t("cms.footer.select_page_option")}
                      </option>
                      {pages.map((p) => (
                        <option key={p.id} value={p.id}>
                          {i18n.language === 'ar' ? p.title_ar : p.title_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="dashboard-footer-btn-primary"
                  onClick={() => setLinkForm({ ...linkForm, column: col.id })}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t("cms.footer.save_link")}
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}