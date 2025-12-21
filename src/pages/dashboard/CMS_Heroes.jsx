import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_HERO.css";

export default function CMS_Heroes() {
  const { t } = useTranslation();

  const {
    heroes,
    loadingHeroes,
    fetchAdminHeroes,
    createHero,
    updateHero,
    deleteHero,

    heroMedia,
    fetchAdminHeroMedia,
    createHeroMedia,
    deleteHeroMedia,

    pages,
    fetchAdminPages,
  } = useCmsStore();

  /* =============================== HERO FORM =============================== */
  const emptyForm = {
    slug: "",
    is_active: true,
    order: 0,
    show_header: false,

    left_title_ar: "",
    left_title_en: "",
    left_button_text_ar: "",
    left_button_text_en: "",
    left_button_page: "",

    right_title_ar: "",
    right_title_en: "",
    right_button_text_ar: "",
    right_button_text_en: "",
    right_button_page: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

  /* =============================== MEDIA FORM =============================== */
  const [mediaForm, setMediaForm] = useState({
    media_type: "image",
    file: null,
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchAdminHeroes();
    fetchAdminPages();
  }, []);

  /* =============================== HANDLERS =============================== */
  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    if (type === "checkbox") value = checked;
    if (name === "order") value = parseInt(value || 0, 10);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditHero = (h) => {
    setEdit(h);
    setForm({
      slug: h.slug || "",
      is_active: h.is_active,
      order: h.order || 0,
      show_header: h.show_header ?? false,

      left_title_ar: h.left_title_ar || "",
      left_title_en: h.left_title_en || "",
      left_button_text_ar: h.left_button_text_ar || "",
      left_button_text_en: h.left_button_text_en || "",
      left_button_page: h.left_button_page || "",

      right_title_ar: h.right_title_ar || "",
      right_title_en: h.right_title_en || "",
      right_button_text_ar: h.right_button_text_ar || "",
      right_button_text_en: h.right_button_text_en || "",
      right_button_page: h.right_button_page || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEdit(null);
    setForm(emptyForm);
  };

  /* =============================== SUBMIT HERO =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      left_button_page: form.left_button_page
        ? parseInt(form.left_button_page, 10)
        : null,
      right_button_page: form.right_button_page
        ? parseInt(form.right_button_page, 10)
        : null,
    };

    const result = edit
      ? await updateHero(edit.id, payload)
      : await createHero(payload);

    if (result.success) {
      toast.success(t("cms.saved"));
      resetForm();
    } else {
      toast.error(t("cms.save_failed"));
    }
  };

  /* =============================== MEDIA =============================== */
  const openMediaForHero = (hero) => {
    setSelectedHero(hero);
    fetchAdminHeroMedia(hero.id);
  };

  const handleMediaChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setMediaForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(mediaForm).forEach(([k, v]) => fd.append(k, v));

    const result = await createHeroMedia(selectedHero.id, fd);
    if (result.success) {
      toast.success(t("cms.media_added"));
      fetchAdminHeroMedia(selectedHero.id);
      setMediaForm({
        media_type: "image",
        file: null,
        order: 0,
        is_active: true,
      });
    } else {
      toast.error(t("cms.media_failed"));
    }
  };

  /* =============================== RENDER =============================== */
  return (
    <div className="hero-cms-container">
      <div className="hero-cms-header">
        <h1 className="hero-cms-title">{t("cms.heroes.title")}</h1>
        <div className="hero-cms-subtitle">Manage hero sections and media</div>
      </div>

      {/* HERO FORM */}
      <div className="hero-form-card">
        <div className="hero-form-header">
          <h2>{edit ? t("cms.edit") : t("cms.create")}</h2>
          {edit && (
            <button className="hero-btn-cancel" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="hero-form">
          {/* Basic Settings */}
          <div className="hero-form-section">
            <h3 className="hero-section-title">Basic Settings</h3>
            <div className="hero-form-grid">
              <div className="hero-form-group">
                <label className="hero-label">{t("cms.slug")}</label>
                <input
                  className="hero-input"
                  name="slug"
                  placeholder="Enter slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.order")}</label>
                <input
                  className="hero-input"
                  name="order"
                  type="number"
                  placeholder="0"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="hero-checkbox-group">
              <label className="hero-checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span className="hero-checkbox-text">{t("cms.active")}</span>
              </label>


            </div>
          </div>

          {/* Left Side */}
          <div className="hero-form-section">
            <h3 className="hero-section-title">{t("cms.left_side")}</h3>
            <div className="hero-form-grid">
              <div className="hero-form-group">
                <label className="hero-label">{t("cms.title_ar")}</label>
                <input
                  className="hero-input"
                  name="left_title_ar"
                  placeholder="العنوان بالعربية"
                  value={form.left_title_ar}
                  onChange={handleChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.title_en")}</label>
                <input
                  className="hero-input"
                  name="left_title_en"
                  placeholder="Title in English"
                  value={form.left_title_en}
                  onChange={handleChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.button_ar")}</label>
                <input
                  className="hero-input"
                  name="left_button_text_ar"
                  placeholder="نص الزر بالعربية"
                  value={form.left_button_text_ar}
                  onChange={handleChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.button_en")}</label>
                <input
                  className="hero-input"
                  name="left_button_text_en"
                  placeholder="Button Text in English"
                  value={form.left_button_text_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="hero-form-group">
              <label className="hero-label">Button Page</label>
              <select
                className="hero-select"
                name="left_button_page"
                value={form.left_button_page}
                onChange={handleChange}
              >
                <option value="">{t("cms.none")}</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title_ar} ({p.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Side */}
          <div className="hero-form-section">
            <h3 className="hero-section-title">{t("cms.right_side")}</h3>
            <div className="hero-form-grid">
              <div className="hero-form-group">
                <label className="hero-label">{t("cms.title_ar")}</label>
                <input
                  className="hero-input"
                  name="right_title_ar"
                  placeholder="العنوان بالعربية"
                  value={form.right_title_ar}
                  onChange={handleChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.title_en")}</label>
                <input
                  className="hero-input"
                  name="right_title_en"
                  placeholder="Title in English"
                  value={form.right_title_en}
                  onChange={handleChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.button_ar")}</label>
                <input
                  className="hero-input"
                  name="right_button_text_ar"
                  placeholder="نص الزر بالعربية"
                  value={form.right_button_text_ar}
                  onChange={handleChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">{t("cms.button_en")}</label>
                <input
                  className="hero-input"
                  name="right_button_text_en"
                  placeholder="Button Text in English"
                  value={form.right_button_text_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="hero-form-group">
              <label className="hero-label">Button Page</label>
              <select
                className="hero-select"
                name="right_button_page"
                value={form.right_button_page}
                onChange={handleChange}
              >
                <option value="">{t("cms.none")}</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title_ar} ({p.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hero-form-actions">
            <button type="submit" className="hero-btn-primary" disabled={loadingHeroes}>
              {loadingHeroes ? t("cms.saving") : edit ? t("cms.update") : t("cms.create")}
            </button>
            {edit && (
              <button type="button" className="hero-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* HERO LIST */}
      <div className="hero-list-card">
        <h2 className="hero-list-title">Heroes List</h2>
        <div className="hero-table-wrapper">
          <table className="hero-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("cms.slug")}</th>
                <th>{t("cms.order")}</th>
                <th>Status</th>
                <th>{t("cms.media")}</th>
                <th>{t("cms.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {heroes.map((h) => (
                <tr key={h.id}>
                  <td className="hero-table-id">#{h.id}</td>
                  <td className="hero-table-slug">{h.slug}</td>
                  <td className="hero-table-order">{h.order}</td>
                  <td>
                    <span className={`hero-status-badge ${h.is_active ? 'active' : 'inactive'}`}>
                      {h.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="hero-btn-media"
                      onClick={() => openMediaForHero(h)}
                    >
                      {t("cms.media")}
                    </button>
                  </td>
                  <td className="hero-table-actions">
                    <button
                      className="hero-btn-edit"
                      onClick={() => handleEditHero(h)}
                    >
                      {t("cms.edit")}
                    </button>
                    <button
                      className="hero-btn-delete"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this hero?')) {
                          deleteHero(h.id);
                        }
                      }}
                    >
                      {t("cms.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MEDIA MANAGER */}
      {selectedHero && (
        <div className="hero-media-card">
          <div className="hero-media-header">
            <h2 className="hero-media-title">
              {t("cms.media_for")} <span className="hero-media-slug">{selectedHero.slug}</span>
            </h2>
            <button
              className="hero-btn-close"
              onClick={() => setSelectedHero(null)}
            >
              Close
            </button>
          </div>

          <form onSubmit={handleMediaSubmit} className="hero-media-form">
            <div className="hero-media-form-grid">
              <div className="hero-form-group">
                <label className="hero-label">Media Type</label>
                <select
                  className="hero-select"
                  name="media_type"
                  value={mediaForm.media_type}
                  onChange={handleMediaChange}
                >
                  <option value="logo_desktop">{t("cms.media_logo_desktop")}</option>
                  <option value="logo_mobile">{t("cms.media_logo_mobile")}</option>
                  <option value="image">{t("cms.media_image")}</option>
                  <option value="video">{t("cms.media_video")}</option>
                </select>
              </div>

              <div className="hero-form-group">
                <label className="hero-label">Order</label>
                <input
                  className="hero-input"
                  type="number"
                  name="order"
                  value={mediaForm.order}
                  onChange={handleMediaChange}
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-label">File</label>
                <input
                  className="hero-input-file"
                  type="file"
                  name="file"
                  onChange={handleMediaChange}
                  required
                />
              </div>

              <div className="hero-form-group">
                <label className="hero-checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={mediaForm.is_active}
                    onChange={handleMediaChange}
                  />
                  <span className="hero-checkbox-text">{t("cms.active")}</span>
                </label>
              </div>
            </div>

            <button type="submit" className="hero-btn-primary">
              {t("cms.add_media")}
            </button>
          </form>

          <div className="hero-media-grid">
            {heroMedia.map((m) => (
              <div key={m.id} className="hero-media-item">
                <div className="hero-media-preview">
                  {m.media_type !== "video" ? (
                    <img src={m.file_url} alt={m.media_type} />
                  ) : (
                    <video src={m.file_url} controls />
                  )}
                </div>
                <div className="hero-media-info">
                  <div className="hero-media-type">{m.media_type}</div>
                  <div className="hero-media-id">ID: {m.id}</div>
                </div>
                <button
                  className="hero-media-delete"
                  onClick={() => {
                    if (window.confirm('Delete this media?')) {
                      deleteHeroMedia(m.id, selectedHero.id);
                    }
                  }}
                >
                  {t("cms.delete")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}