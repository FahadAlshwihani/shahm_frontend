import React, { useEffect, useState } from "react";
import {
  getDefaultSEO,
  adminSEOList,
  adminCreateSEO,
  adminUpdateSEO,
  adminDeleteSEO,
  adminAllPages,
} from "../../api/seoApi";

import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_SEO.css";

export default function SEO_Settings() {
  const { t } = useTranslation();

  const [defaultSEO, setDefaultSEO] = useState(null);
  const [allPages, setAllPages] = useState([]);
  const [seoPages, setSEOPages] = useState([]);

  const [selectedSlug, setSelectedSlug] = useState("");
  const [editingSEO, setEditingSEO] = useState(null);

  const [form, setForm] = useState({
    slug: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: null,
    canonical_url: "",
  });

  useEffect(() => {
    loadDefaultSEO();
    loadAllPages();
    loadSEOPages();
  }, []);

  const loadDefaultSEO = async () => {
    const res = await getDefaultSEO();
    setDefaultSEO(res.data);
  };

  const loadAllPages = async () => {
    const res = await adminAllPages();
    setAllPages(res.data);
  };

  const loadSEOPages = async () => {
    const res = await adminSEOList();
    setSEOPages(res.data);
  };

  /* ================= DEFAULT SEO ================= */

  const handleDefaultChange = (e) => {
    const { name, value } = e.target;
    setDefaultSEO((prev) => ({ ...prev, [name]: value }));
  };

  const handleDefaultSave = async () => {
    const res = await fetch("/api/seo/admin/default/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(defaultSEO),
    });

    if (res.ok) toast.success(t("cms.seo.success.default_updated"));
    else toast.error(t("cms.seo.errors.default_failed"));
  };

  /* ================= PAGE SEO ================= */

  const handleSelectPage = (slug) => {
    setSelectedSlug(slug);

    const found = seoPages.find((p) => p.slug === slug);

    if (found) {
      setEditingSEO(found);
      setForm({
        slug: found.slug,
        meta_title: found.meta_title || "",
        meta_description: found.meta_description || "",
        keywords: found.keywords || "",
        og_title: found.og_title || "",
        og_description: found.og_description || "",
        og_image: null,
        canonical_url: found.canonical_url || "",
      });
    } else {
      setEditingSEO(null);
      setForm({
        slug,
        meta_title: "",
        meta_description: "",
        keywords: "",
        og_title: "",
        og_description: "",
        og_image: null,
        canonical_url: "",
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handlePageSEOSave = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) fd.append(key, form[key]);
    });

    let res;

    if (editingSEO) {
      res = await adminUpdateSEO(editingSEO.id, fd);
    } else {
      res = await adminCreateSEO(fd);
    }

    if (res.success !== false) {
      toast.success(
        editingSEO
          ? t("cms.seo.success.page_updated")
          : t("cms.seo.success.page_created")
      );
      loadSEOPages();
    } else {
      toast.error(t("cms.seo.errors.page_failed"));
    }
  };

  const handleDeletePageSEO = async () => {
    if (!editingSEO) return;

    if (!window.confirm(t("cms.seo.confirm_delete"))) return;

    await adminDeleteSEO(editingSEO.id);

    toast.success(t("cms.seo.success.page_deleted"));
    loadSEOPages();
    setEditingSEO(null);
    setSelectedSlug("");
  };

  return (
    <div className="seo-cms-container">
      <div className="seo-cms-header">
        <h1 className="seo-cms-title">{t("cms.seo.title")}</h1>
        <div className="seo-cms-subtitle">{t("cms.seo.subtitle")}</div>
      </div>

      {/* DEFAULT SEO */}
      {defaultSEO && (
        <div className="seo-default-card">
          <div className="seo-card-header">
            <h2>{t("cms.seo.default_title")}</h2>
          </div>

                      <div className="seo-form-section">
            <h3 className="seo-section-title">{t("cms.seo.sections.site_info")}</h3>
            <div className="seo-form-grid">
              <div className="seo-form-group">
                <label className="seo-label">{t("cms.seo.fields.site_title")}</label>
                <input
                  className="seo-input"
                  name="site_title"
                  value={defaultSEO.site_title}
                  onChange={handleDefaultChange}
                  placeholder={t("cms.seo.placeholders.site_title")}
                />
              </div>

              <div className="seo-form-group">
                <label className="seo-label">{t("cms.seo.fields.keywords")}</label>
                <input
                  className="seo-input"
                  name="keywords"
                  value={defaultSEO.keywords}
                  onChange={handleDefaultChange}
                  placeholder={t("cms.seo.placeholders.keywords")}
                />
              </div>

              <div className="seo-form-group seo-full-width">
                <label className="seo-label">{t("cms.seo.fields.site_description")}</label>
                <textarea
                  className="seo-textarea"
                  name="site_description"
                  value={defaultSEO.site_description}
                  onChange={handleDefaultChange}
                  placeholder={t("cms.seo.placeholders.site_description")}
                  rows="4"
                />
              </div>
            </div>

            <button className="seo-btn-primary" onClick={handleDefaultSave}>
              {t("cms.seo.actions.save_default")}
            </button>
          </div>
        </div>
      )}

      {/* PAGE SEO */}
      <div className="seo-page-card">
        <div className="seo-card-header">
          <h2>{t("cms.seo.page_title")}</h2>
        </div>

        <div className="seo-page-selector">
          <label className="seo-label">{t("cms.seo.select_page")}</label>
          <select
            className="seo-select"
            value={selectedSlug}
            onChange={(e) => handleSelectPage(e.target.value)}
          >
            <option value="">{t("cms.seo.select_page")}</option>
            {allPages.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title} {p.has_seo ? "✔" : ""}
              </option>
            ))}
          </select>
        </div>

        {!selectedSlug && (
          <div className="seo-empty-state">
            <p>{t("cms.seo.select_page_hint")}</p>
          </div>
        )}

        {selectedSlug && (
          <>
            {/* Meta Tags */}
            <div className="seo-form-section">
              <h3 className="seo-section-title">{t("cms.seo.sections.meta_tags")}</h3>
              <div className="seo-form-grid">
                <div className="seo-form-group">
                  <label className="seo-label">{t("cms.seo.fields.meta_title")}</label>
                  <input
                    className="seo-input"
                    name="meta_title"
                    value={form.meta_title}
                    onChange={handleFormChange}
                    placeholder={t("cms.seo.placeholders.meta_title")}
                  />
                </div>

                <div className="seo-form-group">
                  <label className="seo-label">{t("cms.seo.fields.keywords")}</label>
                  <input
                    className="seo-input"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleFormChange}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="seo-form-group seo-full-width">
                  <label className="seo-label">{t("cms.seo.fields.meta_description")}</label>
                  <textarea
                    className="seo-textarea"
                    name="meta_description"
                    value={form.meta_description}
                    onChange={handleFormChange}
                    placeholder={t("cms.seo.placeholders.meta_description")}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Open Graph */}
            <div className="seo-form-section">
              <h3 className="seo-section-title">{t("cms.seo.sections.open_graph")}</h3>
              <div className="seo-form-grid">
                <div className="seo-form-group">
                  <label className="seo-label">{t("cms.seo.fields.og_title")}</label>
                  <input
                    className="seo-input"
                    name="og_title"
                    value={form.og_title}
                    onChange={handleFormChange}
                    placeholder={t("cms.seo.placeholders.og_title")}
                  />
                </div>

                <div className="seo-form-group">
                  <label className="seo-label">{t("cms.seo.fields.og_image")}</label>
                  <input
                    className="seo-input-file"
                    type="file"
                    name="og_image"
                    onChange={handleFormChange}
                    accept="image/*"
                  />
                </div>

                <div className="seo-form-group seo-full-width">
                  <label className="seo-label">{t("cms.seo.fields.og_description")}</label>
                  <textarea
                    className="seo-textarea"
                    name="og_description"
                    value={form.og_description}
                    onChange={handleFormChange}
                    placeholder={t("cms.seo.placeholders.og_description")}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Advanced */}
            <div className="seo-form-section">
              <h3 className="seo-section-title">{t("cms.seo.sections.advanced")}</h3>
              <div className="seo-form-group">
                <label className="seo-label">{t("cms.seo.fields.canonical_url")}</label>
                <input
                  className="seo-input"
                  name="canonical_url"
                  value={form.canonical_url}
                  onChange={handleFormChange}
                  placeholder={t("cms.seo.placeholders.canonical_url")}
                />
              </div>
            </div>

            <div className="seo-form-actions">
              <button className="seo-btn-primary" onClick={handlePageSEOSave}>
                {editingSEO
                  ? t("cms.seo.actions.update_page")
                  : t("cms.seo.actions.create_page")}
              </button>

              {editingSEO && (
                <button className="seo-btn-delete" onClick={handleDeletePageSEO}>
                  {t("cms.seo.actions.delete")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}