// src/pages/dashboard/CMS_Header.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import "../../styles/CMS_HEADER.css";

export default function CMS_Header() {
  const { t, i18n } = useTranslation();

  const [links, setLinks] = useState([]);
  const [pages, setPages] = useState([]);
  const [parents, setParents] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logo, setLogo] = useState(null);

  const [form, setForm] = useState({
    type: "link",
    label_ar: "",
    label_en: "",
    url: "",
    page: "",
    parent: "",
    order: 0,
    is_active: true,
  });

  const [editId, setEditId] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const res = await api.get("cms/admin/header/");

      const logoItem = res.data.find((l) => l.type === "logo");
      const linksOnly = res.data.filter((l) => l.type !== "logo");

      setLogo(logoItem || null);
      setLinks(buildTree(linksOnly));
      setParents(linksOnly);

      const p = await api.get("cms/admin/pages/");
      setPages(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= TREE ================= */
  const buildTree = (flat) => {
    const map = {};
    const roots = [];

    flat.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    flat.forEach((item) => {
      if (item.parent) {
        map[item.parent]?.children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "url" && form.page) {
      toast.error(t("cms.header.url_page_conflict"));
      return;
    }
    if (name === "page" && form.url) {
      toast.error(t("cms.header.page_url_conflict"));
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectPage = (e) => {
    const pageId = e.target.value;

    if (!pageId) {
      return setForm({ ...form, page: "", url: "" });
    }

    const page = pages.find((p) => p.id == pageId);

    if (page) {
      setForm({
        ...form,
        page: pageId,
        url: `/page/${page.slug}`,
      });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val !== "") fd.append(key, val);
    });

    try {
      if (editId) {
        await api.patch(`cms/admin/header/${editId}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(t("cms.header.success.updated"));
      } else {
        await api.post("cms/admin/header/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(t("cms.header.success.created"));
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(t("cms.header.save_failed"));
    }
  };

  const resetForm = () => {
    setForm({
      type: "link",
      label_ar: "",
      label_en: "",
      url: "",
      page: "",
      parent: "",
      order: 0,
      is_active: true,
    });
    setEditId(null);
  };

  /* ================= EDIT / DELETE ================= */
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      type: "link",
      label_ar: item.label_ar,
      label_en: item.label_en,
      url: item.url || "",
      page: item.page || "",
      parent: item.parent || "",
      order: item.order,
      is_active: item.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("cms.header.confirm_delete_title"),
      text: t("cms.header.confirm_delete_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.header.delete_button"),
      cancelButtonText: t("cms.header.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`cms/admin/header/${id}/`);
        Swal.fire({
          title: t("cms.header.deleted_title"),
          text: t("cms.header.success.deleted"),
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
        loadData();
      } catch (err) {
        console.error(err);
        toast.error(t("cms.header.delete_failed"));
      }
    }
  };

  const handleDeleteLogo = async () => {
    const result = await Swal.fire({
      title: t("cms.header.logo.confirm_delete_title"),
      text: t("cms.header.logo.confirm_delete_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.header.logo.delete_button"),
      cancelButtonText: t("cms.header.logo.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      await api.delete(`cms/admin/header/${logo.id}/`);
      Swal.fire({
        title: t("cms.header.logo.deleted_title"),
        text: t("cms.header.logo.success.deleted"),
        icon: 'success',
        confirmButtonColor: '#22c55e',
      });
      loadData();
    }
  };

  /* ================= TREE RENDER ================= */
  const renderTree = (items, level = 0) =>
    items.map((item) => (
      <div key={item.id} className={`dashboard-header-tree-item dashboard-header-tree-level-${level}`}>
        <div className="dashboard-header-tree-content">
          <div className="dashboard-header-tree-order">
            <label className="dashboard-header-tree-order-label">{t("cms.header.order")}</label>
            <input
              type="number"
              className="dashboard-header-tree-order-input"
              value={item.order}
              onChange={async (e) => {
                await api.patch(`cms/admin/header/${item.id}/`, {
                  order: e.target.value,
                });
                toast.success(t("cms.header.success.order_updated"));
                loadData();
              }}
            />
          </div>

          <div className="dashboard-header-tree-info">
            <div className="dashboard-header-tree-title">
              {i18n.language === 'ar' ? item.label_ar : item.label_en}
              {!item.is_active && (
                <span className="dashboard-header-tree-inactive-badge">
                  {t("cms.header.inactive")}
                </span>
              )}
            </div>
            <div className="dashboard-header-tree-url">
              {item.url || t("cms.header.cms_page")}
            </div>
          </div>

          <div className="dashboard-header-tree-actions">
            <button className="dashboard-header-btn-edit-tree" onClick={() => handleEdit(item)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
              </svg>
              {t("cms.header.edit")}
            </button>
            <button className="dashboard-header-btn-delete-tree" onClick={() => handleDelete(item.id)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
              </svg>
              {t("cms.header.delete")}
            </button>
          </div>
        </div>

        {item.children?.length > 0 && (
          <div className="dashboard-header-tree-children">
            {renderTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <div className="dashboard-header-container">
      <div className="dashboard-header-header">
        <div className="dashboard-header-header-content">
          <h1 className="dashboard-header-title">{t("cms.header.title")}</h1>
          <p className="dashboard-header-subtitle">{t("cms.header.subtitle")}</p>
        </div>
      </div>

      {/* ================= HEADER LOGO ================= */}
      <div className="dashboard-header-logo-card">
        <div className="dashboard-header-logo-header">
          <div className="dashboard-header-logo-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="currentColor"/>
              <path d="M12 6.5C10.07 6.5 8.5 8.07 8.5 10C8.5 11.93 10.07 13.5 12 13.5C13.93 13.5 15.5 11.93 15.5 10C15.5 8.07 13.93 6.5 12 6.5Z" fill="currentColor"/>
            </svg>
            <h2>{t("cms.header.logo.title")}</h2>
          </div>
        </div>

        {logo ? (
          <div className="dashboard-header-logo-preview">
            <div className="dashboard-header-logo-image-wrapper">
              <img src={logo.logo_url} alt="Header Logo" />
            </div>
            <button className="dashboard-header-btn-delete-logo" onClick={handleDeleteLogo}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
              </svg>
              {t("cms.header.logo.delete")}
            </button>
          </div>
        ) : (
          <form
            className="dashboard-header-logo-upload-form"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!logoFile) {
                toast.error(t("cms.header.logo.file_required"));
                return;
              }

              const fd = new FormData();
              fd.append("type", "logo");
              fd.append("logo", logoFile);
              fd.append("order", 0);
              fd.append("is_active", true);

              await api.post("cms/admin/header/", fd, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              toast.success(t("cms.header.logo.success.uploaded"));
              setLogoFile(null);
              loadData();
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="dashboard-header-logo-file-input"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
            <button type="submit" className="dashboard-header-btn-upload">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 6.75L9 2.25L4.5 6.75H7.5V11.25H10.5V6.75H13.5ZM3 12.75H15V15.75H3V12.75Z" fill="currentColor"/>
              </svg>
              {t("cms.header.logo.upload")}
            </button>
          </form>
        )}
      </div>

      {/* FORM */}
      <div className="dashboard-header-form-card">
        <div className="dashboard-header-form-header">
          <div className="dashboard-header-form-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
            </svg>
            <h2>
              {editId ? t("cms.header.form_edit") : t("cms.header.form_create")}
            </h2>
          </div>
          {editId && (
            <button className="dashboard-header-btn-cancel" onClick={resetForm}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.header.cancel")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="dashboard-header-form">
          {/* Basic Information */}
          <div className="dashboard-header-form-section">
            <h3 className="dashboard-header-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM10.5 13.5H7.5V12H10.5V13.5ZM10.5 10.5H7.5V4.5H10.5V10.5Z" fill="currentColor"/>
              </svg>
              {t("cms.header.section_basic")}
            </h3>
            <div className="dashboard-header-form-grid-row">
              <div className="dashboard-header-form-group">
                <label className="dashboard-header-label">{t("cms.header.label_ar")}</label>
                <input
                  className="dashboard-header-input"
                  name="label_ar"
                  placeholder={t("cms.header.placeholder_label_ar")}
                  value={form.label_ar}
                  onChange={handleChange}
                  required
                  dir="rtl"
                />
              </div>

              <div className="dashboard-header-form-group">
                <label className="dashboard-header-label">{t("cms.header.label_en")}</label>
                <input
                  className="dashboard-header-input"
                  name="label_en"
                  placeholder={t("cms.header.placeholder_label_en")}
                  value={form.label_en}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dashboard-header-form-grid">
              <div className="dashboard-header-form-group">
                <label className="dashboard-header-label">{t("cms.header.custom_url")}</label>
                <input
                  className="dashboard-header-input"
                  name="url"
                  placeholder={t("cms.header.placeholder_url")}
                  value={form.url}
                  onChange={handleChange}
                />
              </div>

              <div className="dashboard-header-form-group">
                <label className="dashboard-header-label">{t("cms.header.select_page")}</label>
                <select className="dashboard-header-select" value={form.page} onChange={handleSelectPage}>
                  <option value="">{t("cms.header.select_page")}</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {i18n.language === 'ar' ? p.title_ar : p.title_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hierarchy & Order */}
          <div className="dashboard-header-form-section">
            <h3 className="dashboard-header-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 2.25H4.5C3.675 2.25 3 2.925 3 3.75V14.25C3 15.075 3.675 15.75 4.5 15.75H13.5C14.325 15.75 15 15.075 15 14.25V3.75C15 2.925 14.325 2.25 13.5 2.25ZM13.5 14.25H4.5V3.75H13.5V14.25Z" fill="currentColor"/>
              </svg>
              {t("cms.header.section_hierarchy")}
            </h3>
            <div className="dashboard-header-form-grid">
              <div className="dashboard-header-form-group">
                <label className="dashboard-header-label">{t("cms.header.parent")}</label>
                <select className="dashboard-header-select" name="parent" value={form.parent} onChange={handleChange}>
                  <option value="">{t("cms.header.root_item")}</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {i18n.language === 'ar' ? p.label_ar : p.label_en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dashboard-header-form-group">
                <label className="dashboard-header-label">{t("cms.header.order")}</label>
                <input
                  className="dashboard-header-input"
                  type="number"
                  name="order"
                  placeholder="0"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dashboard-header-checkbox-wrapper">
              <label className="dashboard-header-checkbox-label">
                <input
                  type="checkbox"
                  className="dashboard-header-checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span className="dashboard-header-checkbox-text">{t("cms.header.active")}</span>
              </label>
            </div>
          </div>

          <div className="dashboard-header-form-actions">
            <button type="submit" className="dashboard-header-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {editId ? t("cms.header.update") : t("cms.header.create")}
            </button>
            {editId && (
              <button type="button" className="dashboard-header-btn-secondary" onClick={resetForm}>
                {t("cms.header.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TREE */}
      <div className="dashboard-header-tree-card">
        <div className="dashboard-header-tree-header">
          <div className="dashboard-header-tree-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-header-tree-title">{t("cms.header.current_menu")}</h2>
          </div>
          <span className="dashboard-header-count-badge">{parents.length}</span>
        </div>
        <div className="dashboard-header-tree-list">
          {links.length > 0 ? (
            renderTree(links)
          ) : (
            <div className="dashboard-header-empty">{t("cms.header.empty")}</div>
          )}
        </div>
      </div>
    </div>
  );
}