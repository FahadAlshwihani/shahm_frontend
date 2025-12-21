// src/pages/dashboard/CMS_Header.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_HEADER.css";

export default function CMS_Header() {
  const { t } = useTranslation();

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
      return alert(t("cms.header.url_page_conflict"));
    }
    if (name === "page" && form.url) {
      return alert(t("cms.header.page_url_conflict"));
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
      } else {
        await api.post("cms/admin/header/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
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
    if (!window.confirm(t("cms.header.confirm_delete"))) return;

    try {
      await api.delete(`cms/admin/header/${id}/`);
      loadData();
    } catch (err) {
      console.error(err);
      alert(t("cms.header.delete_failed"));
    }
  };

  /* ================= TREE RENDER ================= */
  const renderTree = (items, level = 0) =>
    items.map((item) => (
      <div key={item.id} className={`header-tree-item level-${level}`}>
        <div className="header-tree-content">
          <div className="header-tree-order">
            <label className="header-tree-order-label">Order</label>
            <input
              type="number"
              className="header-tree-order-input"
              value={item.order}
              onChange={async (e) => {
                await api.patch(`cms/admin/header/${item.id}/`, {
                  order: e.target.value,
                });
                loadData();
              }}
            />
          </div>

          <div className="header-tree-info">
            <div className="header-tree-title">
              {item.label_ar}
              {!item.is_active && (
                <span className="header-tree-inactive-badge">
                  {t("cms.header.inactive")}
                </span>
              )}
            </div>
            <div className="header-tree-url">
              {item.url || t("cms.header.cms_page")}
            </div>
          </div>

          <div className="header-tree-actions">
            <button className="header-btn-edit-tree" onClick={() => handleEdit(item)}>
              {t("cms.header.edit")}
            </button>
            <button className="header-btn-delete-tree" onClick={() => handleDelete(item.id)}>
              {t("cms.header.delete")}
            </button>
          </div>
        </div>

        {item.children?.length > 0 && (
          <div className="header-tree-children">
            {renderTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));

  return (
    <div className="header-cms-container">
      <div className="header-cms-header">
        <h1 className="header-cms-title">{t("cms.header.title")}</h1>
        <div className="header-cms-subtitle">Manage header logo and navigation menu</div>
      </div>

      {/* ================= HEADER LOGO ================= */}
      <div className="header-logo-card">
        <h2 className="header-logo-title">شعار الهيدر</h2>

        {logo ? (
          <div className="header-logo-preview">
            <div className="header-logo-image-wrapper">
              <img src={logo.logo_url} alt="Header Logo" />
            </div>
            <button
              className="header-btn-delete-logo"
              onClick={async () => {
                if (!window.confirm("حذف شعار الهيدر؟")) return;
                await api.delete(`cms/admin/header/${logo.id}/`);
                loadData();
              }}
            >
              حذف الشعار
            </button>
          </div>
        ) : (
          <form
            className="header-logo-upload-form"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!logoFile) return;

              const fd = new FormData();
              fd.append("type", "logo");
              fd.append("logo", logoFile);
              fd.append("order", 0);
              fd.append("is_active", true);

              await api.post("cms/admin/header/", fd, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              setLogoFile(null);
              loadData();
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="header-logo-file-input"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
            <button type="submit" className="header-btn-upload">
              رفع الشعار
            </button>
          </form>
        )}
      </div>

      {/* FORM */}
      <div className="header-form-card">
        <div className="header-form-header">
          <h2>
            {editId ? t("cms.header.form_edit") : t("cms.header.form_create")}
          </h2>
          {editId && (
            <button className="header-btn-cancel" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="header-form">
          {/* Basic Information */}
          <div className="header-form-section">
            <h3 className="header-section-title">Basic Information</h3>
            <div className="header-form-grid">
              <div className="header-form-group">
                <label className="header-label">{t("cms.header.label_ar")}</label>
                <input
                  className="header-input"
                  name="label_ar"
                  placeholder="النص بالعربية"
                  value={form.label_ar}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="header-form-group">
                <label className="header-label">{t("cms.header.label_en")}</label>
                <input
                  className="header-input"
                  name="label_en"
                  placeholder="Text in English"
                  value={form.label_en}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="header-form-group">
                <label className="header-label">{t("cms.header.custom_url")}</label>
                <input
                  className="header-input"
                  name="url"
                  placeholder="/custom-url"
                  value={form.url}
                  onChange={handleChange}
                />
              </div>

              <div className="header-form-group">
                <label className="header-label">{t("cms.header.select_page")}</label>
                <select className="header-select" value={form.page} onChange={handleSelectPage}>
                  <option value="">{t("cms.header.select_page")}</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title_ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hierarchy & Order */}
          <div className="header-form-section">
            <h3 className="header-section-title">Hierarchy & Order</h3>
            <div className="header-form-grid">
              <div className="header-form-group">
                <label className="header-label">{t("cms.header.root_item")}</label>
                <select className="header-select" name="parent" value={form.parent} onChange={handleChange}>
                  <option value="">{t("cms.header.root_item")}</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="header-form-group">
                <label className="header-label">{t("cms.header.order")}</label>
                <input
                  className="header-input"
                  type="number"
                  name="order"
                  placeholder="0"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="header-checkbox-group">
              <label className="header-checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span className="header-checkbox-text">{t("cms.header.active")}</span>
              </label>
            </div>
          </div>

          <div className="header-form-actions">
            <button type="submit" className="header-btn-primary">
              {editId ? t("cms.header.update") : t("cms.header.create")}
            </button>
            {editId && (
              <button type="button" className="header-btn-secondary" onClick={resetForm}>
                {t("cms.header.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TREE */}
      <div className="header-tree-card">
        <h2 className="header-tree-title">{t("cms.header.current_menu")}</h2>
        <div className="header-tree-list">
          {links.length > 0 ? (
            renderTree(links)
          ) : (
            <div className="header-tree-empty">No menu items yet</div>
          )}
        </div>
      </div>
    </div>
  );
}