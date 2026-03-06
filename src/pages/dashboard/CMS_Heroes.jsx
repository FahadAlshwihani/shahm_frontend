import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_HERO.css";

export default function CMS_Heroes() {
  const { t, i18n } = useTranslation();

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
    <div className="dashboard-hero-container">
      <div className="dashboard-hero-header">
        <div className="dashboard-hero-header-content">
          <h1 className="dashboard-hero-title">{t("cms.heroes.title")}</h1>
          <p className="dashboard-hero-subtitle">{t("cms.heroes.subtitle")}</p>
        </div>
      </div>

      {/* HERO FORM */}
      <div className="dashboard-hero-form-card">
        <div className="dashboard-hero-form-header">
          <div className="dashboard-hero-form-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
              <path d="M7 10H17V12H7V10ZM7 14H14V16H7V14Z" fill="currentColor"/>
            </svg>
            <h2>{edit ? t("cms.edit") : t("cms.create")}</h2>
          </div>
          {edit && (
            <button className="dashboard-hero-btn-cancel" onClick={resetForm}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.actions.cancel")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="dashboard-hero-form">
          {/* Basic Settings */}
          <div className="dashboard-hero-form-section">
            <h3 className="dashboard-hero-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L2.25 5.25V10.5C2.25 13.8825 4.8825 17.0625 9 18C13.1175 17.0625 15.75 13.8825 15.75 10.5V5.25L9 1.5Z" fill="currentColor"/>
              </svg>
              {t("cms.heroes.basic_settings")}
            </h3>
            <div className="dashboard-hero-form-grid">
              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.slug")}</label>
                <input
                  className="dashboard-hero-input"
                  name="slug"
                  placeholder={t("cms.heroes.slug_placeholder")}
                  value={form.slug}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.order")}</label>
                <input
                  className="dashboard-hero-input"
                  name="order"
                  type="number"
                  placeholder="0"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dashboard-hero-checkbox-group">
              <label className="dashboard-hero-checkbox-label">
                <input
                  type="checkbox"
                  className="dashboard-hero-checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <span className="dashboard-hero-checkbox-text">{t("cms.active")}</span>
              </label>
            </div>
          </div>

          {/* Left Side */}
          <div className="dashboard-hero-form-section">
            <h3 className="dashboard-hero-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2.25 2.25H8.25V8.25H2.25V2.25ZM9.75 2.25H15.75V8.25H9.75V2.25ZM2.25 9.75H8.25V15.75H2.25V9.75Z" fill="currentColor"/>
              </svg>
              {t("cms.left_side")}
            </h3>
            <div className="dashboard-hero-form-grid-row">
              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.title_ar")}</label>
                <input
                  className="dashboard-hero-input"
                  name="left_title_ar"
                  placeholder={t("cms.heroes.title_ar_placeholder")}
                  value={form.left_title_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.title_en")}</label>
                <input
                  className="dashboard-hero-input"
                  name="left_title_en"
                  placeholder={t("cms.heroes.title_en_placeholder")}
                  value={form.left_title_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dashboard-hero-form-grid-row">
              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.button_ar")}</label>
                <input
                  className="dashboard-hero-input"
                  name="left_button_text_ar"
                  placeholder={t("cms.heroes.button_ar_placeholder")}
                  value={form.left_button_text_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.button_en")}</label>
                <input
                  className="dashboard-hero-input"
                  name="left_button_text_en"
                  placeholder={t("cms.heroes.button_en_placeholder")}
                  value={form.left_button_text_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dashboard-hero-form-group">
              <label className="dashboard-hero-label">{t("cms.heroes.button_page")}</label>
              <select
                className="dashboard-hero-select"
                name="left_button_page"
                value={form.left_button_page}
                onChange={handleChange}
              >
                <option value="">{t("cms.none")}</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {i18n.language === 'ar' ? p.title_ar : p.title_en} ({p.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Side */}
          <div className="dashboard-hero-form-section">
            <h3 className="dashboard-hero-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9.75 9.75H15.75V15.75H9.75V9.75ZM2.25 2.25H8.25V8.25H2.25V2.25ZM9.75 2.25H15.75V8.25H9.75V2.25Z" fill="currentColor"/>
              </svg>
              {t("cms.right_side")}
            </h3>
            <div className="dashboard-hero-form-grid-row">
              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.title_ar")}</label>
                <input
                  className="dashboard-hero-input"
                  name="right_title_ar"
                  placeholder={t("cms.heroes.title_ar_placeholder")}
                  value={form.right_title_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.title_en")}</label>
                <input
                  className="dashboard-hero-input"
                  name="right_title_en"
                  placeholder={t("cms.heroes.title_en_placeholder")}
                  value={form.right_title_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dashboard-hero-form-grid-row">
              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.button_ar")}</label>
                <input
                  className="dashboard-hero-input"
                  name="right_button_text_ar"
                  placeholder={t("cms.heroes.button_ar_placeholder")}
                  value={form.right_button_text_ar}
                  onChange={handleChange}
                  dir="rtl"
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.button_en")}</label>
                <input
                  className="dashboard-hero-input"
                  name="right_button_text_en"
                  placeholder={t("cms.heroes.button_en_placeholder")}
                  value={form.right_button_text_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="dashboard-hero-form-group">
              <label className="dashboard-hero-label">{t("cms.heroes.button_page")}</label>
              <select
                className="dashboard-hero-select"
                name="right_button_page"
                value={form.right_button_page}
                onChange={handleChange}
              >
                <option value="">{t("cms.none")}</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {i18n.language === 'ar' ? p.title_ar : p.title_en} ({p.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="dashboard-hero-form-actions">
            <button type="submit" className="dashboard-hero-btn-primary" disabled={loadingHeroes}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {loadingHeroes ? t("cms.saving") : edit ? t("cms.update") : t("cms.create")}
            </button>
            {edit && (
              <button type="button" className="dashboard-hero-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* HERO LIST */}
      <div className="dashboard-hero-list-card">
        <div className="dashboard-hero-list-header">
          <div className="dashboard-hero-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-hero-list-title">{t("cms.heroes.list_title")}</h2>
          </div>
          <span className="dashboard-hero-count-badge">{heroes.length}</span>
        </div>
        <div className="dashboard-hero-table-wrapper">
          <table className="dashboard-hero-table">
            <thead>
              <tr>
                <th>{t("cms.heroes.table.id")}</th>
                <th>{t("cms.slug")}</th>
                <th>{t("cms.order")}</th>
                <th>{t("cms.heroes.table.status")}</th>
                <th>{t("cms.media")}</th>
                <th>{t("cms.actions.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {heroes.map((h) => (
                <tr key={h.id}>
                  <td className="dashboard-hero-table-id">#{h.id}</td>
                  <td className="dashboard-hero-table-slug">{h.slug}</td>
                  <td className="dashboard-hero-table-order">{h.order}</td>
                  <td>
                    <span className={`dashboard-hero-status-badge ${h.is_active ? 'dashboard-hero-status-active' : 'dashboard-hero-status-inactive'}`}>
                      {h.is_active ? t("cms.heroes.status.active") : t("cms.heroes.status.inactive")}
                    </span>
                  </td>
                  <td>
                    <button
                      className="dashboard-hero-btn-media"
                      onClick={() => openMediaForHero(h)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 2H2C1.46957 2 0.960859 2.21071 0.585786 2.58579C0.210714 2.96086 0 3.46957 0 4V12C0 12.5304 0.210714 13.0391 0.585786 13.4142C0.960859 13.7893 1.46957 14 2 14H14C14.5304 14 15.0391 13.7893 15.4142 13.4142C15.7893 13.0391 16 12.5304 16 12V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2ZM5 10L7 8L9 10.5L12 7L14 10V12H2V10Z" fill="currentColor"/>
                      </svg>
                      {t("cms.media")}
                    </button>
                  </td>
                  <td className="dashboard-hero-table-actions">
                    <button
                      className="dashboard-hero-btn-edit"
                      onClick={() => handleEditHero(h)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                      </svg>
                      {t("cms.edit")}
                    </button>
                    <button
                      className="dashboard-hero-btn-delete"
                      onClick={() => {
                        if (window.confirm(t("cms.heroes.confirm_delete"))) {
                          deleteHero(h.id);
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                      </svg>
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
        <div className="dashboard-hero-media-card">
          <div className="dashboard-hero-media-header">
            <div className="dashboard-hero-media-title-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 3H3C1.89 3 1 3.9 1 5V19C1 20.1 1.89 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
              </svg>
              <h2 className="dashboard-hero-media-title">
                {t("cms.media_for")} <span className="dashboard-hero-media-slug">{selectedHero.slug}</span>
              </h2>
            </div>
            <button
              className="dashboard-hero-btn-close"
              onClick={() => setSelectedHero(null)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.heroes.close")}
            </button>
          </div>

          <form onSubmit={handleMediaSubmit} className="dashboard-hero-media-form">
            <div className="dashboard-hero-media-form-grid">
              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.heroes.media_type")}</label>
                <select
                  className="dashboard-hero-select"
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

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.order")}</label>
                <input
                  className="dashboard-hero-input"
                  type="number"
                  name="order"
                  value={mediaForm.order}
                  onChange={handleMediaChange}
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-label">{t("cms.heroes.file")}</label>
                <input
                  className="dashboard-hero-input-file"
                  type="file"
                  name="file"
                  onChange={handleMediaChange}
                  required
                />
              </div>

              <div className="dashboard-hero-form-group">
                <label className="dashboard-hero-checkbox-label">
                  <input
                    type="checkbox"
                    className="dashboard-hero-checkbox-v2"
                    name="is_active"
                    checked={mediaForm.is_active}
                    onChange={handleMediaChange}
                  />
                  <span className="dashboard-hero-checkbox-text">{t("cms.active")}</span>
                </label>
              </div>
            </div>

            <button type="submit" className="dashboard-hero-btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.add_media")}
            </button>
          </form>

          <div className="dashboard-hero-media-grid">
            {heroMedia.map((m) => (
              <div key={m.id} className="dashboard-hero-media-item">
                <div className="dashboard-hero-media-preview">
                  {m.media_type !== "video" ? (
                    <img src={m.file_url} alt={m.media_type} />
                  ) : (
                    <video src={m.file_url} controls />
                  )}
                  <div className="dashboard-hero-media-overlay">
                    <span className="dashboard-hero-media-type-badge">{m.media_type}</span>
                  </div>
                </div>
                <div className="dashboard-hero-media-info">
                  <div className="dashboard-hero-media-details">
                    <span className="dashboard-hero-media-id">{t("cms.heroes.media_id")}: {m.id}</span>
                    <span className="dashboard-hero-media-order">{t("cms.heroes.media_order")}: {m.order}</span>
                  </div>
                  <span className={`dashboard-hero-media-status ${m.is_active ? 'active' : 'inactive'}`}>
                    {m.is_active ? t("cms.heroes.status.active") : t("cms.heroes.status.inactive")}
                  </span>
                </div>
                <button
                  className="dashboard-hero-media-delete"
                  onClick={() => {
                    if (window.confirm(t("cms.heroes.confirm_delete_media"))) {
                      deleteHeroMedia(m.id, selectedHero.id);
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                  </svg>
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