import React, { useEffect, useState } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSweetAlert } from "../../components/common/SweetAlert";
import "../../styles/CMS_HERO.css";

/* ══════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════ */
const IconHero = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 11h8M6 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M9 4h5M9 8h4M9 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="9" y="1" width="6" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 4h5M2 8h6M2 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconMedia = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="5.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1 10.5l4-3.5 3 2.5 2-1.5 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13.26 3.75L16.5 7M2.25 21.75l1.4-5.07L15.53 4.79a1.5 1.5 0 012.12 0l2.13 2.13a1.5 1.5 0 010 2.12L7.32 20.35 2.25 21.75z"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" fill="currentColor">
    <path d="M20 2C18.355 2 17 3.355 17 5v2H4a1 1 0 100 2h13.832a1 1 0 00.326 0h11.674a1 1 0 00.326 0H44a1 1 0 100-2H31V5c0-1.645-1.355-3-3-3h-8zm0 2h8c.565 0 1 .435 1 1v2H19V5c0-.565.435-1 1-1zM6.98 10.986a1 1 0 00-.986 1.108l2.67 28.369C8.9 43.03 11.061 45 13.64 45h20.72c2.579 0 4.74-1.97 4.976-4.538l2.67-28.369a1 1 0 10-1.992-.187L37.344 40.28C37.2 41.851 35.94 43 34.36 43H13.64c-1.58 0-2.84-1.149-2.984-2.72L7.986 11.906a1 1 0 00-1.006-.92z" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M11.5 1.5L1.5 11.5M1.5 1.5L11.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const CmsHeroSpinner = () => (
  <span className="cms-hero-spinner">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

/* ══════════════════════════════════════════════════════
   SECTION DIVIDER
══════════════════════════════════════════════════════ */
function CmsHeroDivider({ icon, label }) {
  return (
    <div className="cms-hero-divider">
      <span className="cms-hero-divider-icon">{icon}</span>
      <span className="cms-hero-divider-label">{label}</span>
      <div className="cms-hero-divider-line" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TOGGLE
══════════════════════════════════════════════════════ */
function CmsHeroToggle({ checked, onChange, label }) {
  return (
    <label className="cms-hero-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="cms-hero-toggle-track">
        <span className="cms-hero-toggle-thumb" />
      </span>
      <span className="cms-hero-toggle-label">{label}</span>
    </label>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CMS_Heroes() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetAlertEl, show: showAlert } = useSweetAlert();

  const {
    heroes, loadingHeroes,
    fetchAdminHeroes, createHero, updateHero, deleteHero,
    heroMedia, fetchAdminHeroMedia, createHeroMedia, deleteHeroMedia,
    pages, fetchAdminPages,
  } = useCmsStore();

  /* ── Hero form ── */
  const emptyForm = {
    slug: "", is_active: true, order: 0, show_header: false,

    left_title_ar: "",
    left_title_en: "",
    left_button_text_ar: "",
    left_button_text_en: "",
    left_button_page: "",
    left_button_slug: "",

    right_title_ar: "",
    right_title_en: "",
    right_button_text_ar: "",
    right_button_text_en: "",
    right_button_page: "",
    right_button_slug: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

  /* ── Media form ── */
  const [mediaForm, setMediaForm] = useState({ media_type: "image", file: null, order: 0, is_active: true });
  const [mediaSaving, setMediaSaving] = useState(false);

  useEffect(() => {
    fetchAdminHeroes();
    fetchAdminPages();
  }, []);

  /* ── Handlers — logic unchanged ── */
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
      left_button_slug: h.left_button_slug || "",

      right_title_ar: h.right_title_ar || "",
      right_title_en: h.right_title_en || "",
      right_button_text_ar: h.right_button_text_ar || "",
      right_button_text_en: h.right_button_text_en || "",
      right_button_page: h.right_button_page || "",
      right_button_slug: h.right_button_slug || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resetForm = () => { setEdit(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,

      left_button_page:
        form.left_button_slug?.trim()
          ? null
          : form.left_button_page
            ? parseInt(form.left_button_page, 10)
            : null,

      right_button_page:
        form.right_button_slug?.trim()
          ? null
          : form.right_button_page
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

  const handleDeleteHero = async (id) => {
    const confirmed = await showAlert({
      type: "confirm",
      title: t("cms.heroes.confirm_delete_title"),
      message: t("cms.heroes.confirm_delete"),
      confirmText: t("cms.heroes.delete_button"),
      cancelText: t("cms.heroes.cancel_button"),
      showCancel: true, isRtl,
    });
    if (confirmed) {
      const result = await deleteHero(id);
      if (result?.success !== false) toast.success(t("cms.heroes.success.deleted"));
    }
  };

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
    setMediaSaving(true);
    const fd = new FormData();
    Object.entries(mediaForm).forEach(([k, v]) => fd.append(k, v));
    const result = await createHeroMedia(selectedHero.id, fd);
    setMediaSaving(false);
    if (result.success) {
      toast.success(t("cms.media_added"));
      fetchAdminHeroMedia(selectedHero.id);
      setMediaForm({ media_type: "image", file: null, order: 0, is_active: true });
    } else {
      toast.error(t("cms.media_failed"));
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    const confirmed = await showAlert({
      type: "confirm",
      title: t("cms.heroes.confirm_delete_media_title"),
      message: t("cms.heroes.confirm_delete_media"),
      confirmText: t("cms.heroes.delete_button"),
      cancelText: t("cms.heroes.cancel_button"),
      showCancel: true, isRtl,
    });
    if (confirmed) {
      await deleteHeroMedia(mediaId, selectedHero.id);
      toast.success(t("cms.heroes.success.media_deleted"));
    }
  };

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="cms-hero-root" dir={isRtl ? "rtl" : "ltr"}>
      {sweetAlertEl}

      {/* ── Page Header ── */}
      <div className="cms-hero-page-header">
        <div className="cms-hero-page-header-left">
          <div className="cms-hero-page-header-icon"><IconHero /></div>
          <div>
            <h1 className="cms-hero-page-title">{t("cms.heroes.title")}</h1>
            <p className="cms-hero-page-subtitle">{t("cms.heroes.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* ════════ HERO FORM CARD ════════ */}
      <div className="cms-hero-card">
        <div className="cms-hero-card-header">
          <div className="cms-hero-card-header-left">
            <span className="cms-hero-card-header-icon cms-hero-card-header-icon--blue"><IconHero /></span>
            <h2 className="cms-hero-card-title">
              {edit ? t("cms.heroes.form_title_edit") : t("cms.heroes.form_title_create")}
            </h2>
          </div>
          {edit && (
            <button className="cms-hero-icon-btn cms-hero-icon-btn--ghost" onClick={resetForm} type="button">
              <IconX />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="cms-hero-form">

          {/* Basic Settings */}
          <CmsHeroDivider icon={<IconSettings />} label={t("cms.heroes.basic_settings")} />
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.slug")}</label>
              <input className="cms-hero-input" dir="ltr" name="slug"
                placeholder={t("cms.heroes.slug_placeholder")}
                value={form.slug} onChange={handleChange} required />
            </div>
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.order")}</label>
              <input className="cms-hero-input" type="number" name="order"
                placeholder="0" value={form.order} onChange={handleChange} />
            </div>
          </div>
          <div className="cms-hero-form-row">
            <CmsHeroToggle
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              label={t("cms.active")}
            />
            <CmsHeroToggle
              checked={form.show_header}
              onChange={(e) => setForm((p) => ({ ...p, show_header: e.target.checked }))}
              label={t("cms.heroes.show_header")}
            />
          </div>

          {/* Left Side */}
          <CmsHeroDivider icon={<IconLeft />} label={t("cms.left_side")} />
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.title_ar")}</label>
              <input className="cms-hero-input" dir="rtl" name="left_title_ar"
                placeholder={t("cms.heroes.title_ar_placeholder")}
                value={form.left_title_ar} onChange={handleChange} />
            </div>
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.title_en")}</label>
              <input className="cms-hero-input" dir="ltr" name="left_title_en"
                placeholder={t("cms.heroes.title_en_placeholder")}
                value={form.left_title_en} onChange={handleChange} />
            </div>
          </div>
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.button_ar")}</label>
              <input className="cms-hero-input" dir="rtl" name="left_button_text_ar"
                placeholder={t("cms.heroes.button_ar_placeholder")}
                value={form.left_button_text_ar} onChange={handleChange} />
            </div>
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.button_en")}</label>
              <input className="cms-hero-input" dir="ltr" name="left_button_text_en"
                placeholder={t("cms.heroes.button_en_placeholder")}
                value={form.left_button_text_en} onChange={handleChange} />
            </div>
          </div>
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.heroes.button_page")}</label>
              {/* <select className="cms-hero-select" name="left_button_page"
                value={form.left_button_page} onChange={handleChange}>
                <option value="">{t("cms.none")}</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isRtl ? p.title_ar : p.title_en} ({p.slug})
                  </option>
                ))}
              </select> */}
              <div className="cms-hero-form-group">
                <label className="cms-hero-label">
                  Internal Route
                </label>

                <input
                  className="cms-hero-input"
                  dir="ltr"
                  name="left_button_slug"
                  placeholder="/contact"
                  value={form.left_button_slug}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="cms-hero-form-spacer" aria-hidden="true" />
          </div>

          {/* Right Side */}
          <CmsHeroDivider icon={<IconRight />} label={t("cms.right_side")} />
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.title_ar")}</label>
              <input className="cms-hero-input" dir="rtl" name="right_title_ar"
                placeholder={t("cms.heroes.title_ar_placeholder")}
                value={form.right_title_ar} onChange={handleChange} />
            </div>
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.title_en")}</label>
              <input className="cms-hero-input" dir="ltr" name="right_title_en"
                placeholder={t("cms.heroes.title_en_placeholder")}
                value={form.right_title_en} onChange={handleChange} />
            </div>
          </div>
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.button_ar")}</label>
              <input className="cms-hero-input" dir="rtl" name="right_button_text_ar"
                placeholder={t("cms.heroes.button_ar_placeholder")}
                value={form.right_button_text_ar} onChange={handleChange} />
            </div>
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.button_en")}</label>
              <input className="cms-hero-input" dir="ltr" name="right_button_text_en"
                placeholder={t("cms.heroes.button_en_placeholder")}
                value={form.right_button_text_en} onChange={handleChange} />
            </div>
          </div>
          <div className="cms-hero-form-row">
            <div className="cms-hero-form-group">
              <label className="cms-hero-label">{t("cms.heroes.button_page")}</label>
              {/* <select className="cms-hero-select" name="right_button_page"
                value={form.right_button_page} onChange={handleChange}>
                <option value="">{t("cms.none")}</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isRtl ? p.title_ar : p.title_en} ({p.slug})
                  </option>
                ))}
              </select> */}
              <div className="cms-hero-form-group">
                <label className="cms-hero-label">
                  Internal Route
                </label>

                <input
                  className="cms-hero-input"
                  dir="ltr"
                  name="right_button_slug"
                  placeholder="/contact"
                  value={form.right_button_slug}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="cms-hero-form-spacer" aria-hidden="true" />
          </div>

          {/* Actions */}
          <div className="cms-hero-form-actions">
            <button type="submit" className="cms-hero-btn cms-hero-btn--primary" disabled={loadingHeroes}>
              {loadingHeroes ? <CmsHeroSpinner /> : <IconSave />}
              {loadingHeroes ? t("cms.saving") : edit ? t("cms.update") : t("cms.create")}
            </button>
            {edit && (
              <button type="button" className="cms-hero-btn cms-hero-btn--ghost" onClick={resetForm}>
                <IconX />
                {t("cms.actions.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ════════ HEROES LIST CARD ════════ */}
      <div className="cms-hero-card">
        <div className="cms-hero-card-header">
          <div className="cms-hero-card-header-left">
            <span className="cms-hero-card-header-icon cms-hero-card-header-icon--purple"><IconHero /></span>
            <h2 className="cms-hero-card-title">{t("cms.heroes.list_title")}</h2>
          </div>
          <span className="cms-hero-count-badge">{heroes.length}</span>
        </div>

        {heroes.length === 0 ? (
          <div className="cms-hero-empty">
            <IconHero />
            <p>{t("cms.heroes.empty")}</p>
          </div>
        ) : (
          <div className="cms-hero-table-wrapper">
            <table className="cms-hero-table">
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
                  <tr key={h.id} className="cms-hero-table-row">
                    <td><span className="cms-hero-id-chip">#{h.id}</span></td>
                    <td><code className="cms-hero-slug-code">{h.slug}</code></td>
                    <td><span className="cms-hero-order-chip">{h.order}</span></td>
                    <td>
                      <span className={`cms-hero-status-badge ${h.is_active ? "cms-hero-status-badge--active" : "cms-hero-status-badge--inactive"}`}>
                        <span className="cms-hero-status-dot" />
                        {h.is_active ? t("cms.heroes.status.active") : t("cms.heroes.status.inactive")}
                      </span>
                    </td>
                    <td>
                      <button className="cms-hero-icon-btn cms-hero-icon-btn--media"
                        onClick={() => openMediaForHero(h)} title={t("cms.media")}>
                        <IconMedia />
                      </button>
                    </td>
                    <td>
                      <div className="cms-hero-actions-cell">
                        <button className="cms-hero-icon-btn cms-hero-icon-btn--edit"
                          onClick={() => handleEditHero(h)} title={t("cms.edit")}>
                          <IconEdit />
                        </button>
                        <button className="cms-hero-icon-btn cms-hero-icon-btn--delete"
                          onClick={() => handleDeleteHero(h.id)} title={t("cms.delete")}>
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════ MEDIA MANAGER CARD ════════ */}
      {selectedHero && (
        <div className="cms-hero-card cms-hero-card--media">
          <div className="cms-hero-card-header">
            <div className="cms-hero-card-header-left">
              <span className="cms-hero-card-header-icon cms-hero-card-header-icon--amber"><IconMedia /></span>
              <div>
                <h2 className="cms-hero-card-title">{t("cms.media_for")}</h2>
                <code className="cms-hero-slug-code cms-hero-slug-code--sm">{selectedHero.slug}</code>
              </div>
            </div>
            <button className="cms-hero-btn cms-hero-btn--ghost cms-hero-btn--sm"
              onClick={() => setSelectedHero(null)} type="button">
              <IconX />
              {t("cms.heroes.close")}
            </button>
          </div>

          {/* Media upload form */}
          <form onSubmit={handleMediaSubmit} className="cms-hero-media-form">
            <CmsHeroDivider icon={<IconPlus />} label={t("cms.heroes.add_media_label")} />
            <div className="cms-hero-form-row">
              <div className="cms-hero-form-group">
                <label className="cms-hero-label">{t("cms.heroes.media_type")}</label>
                <select className="cms-hero-select" name="media_type"
                  value={mediaForm.media_type} onChange={handleMediaChange}>
                  <option value="logo_desktop">{t("cms.media_logo_desktop")}</option>
                  <option value="logo_mobile">{t("cms.media_logo_mobile")}</option>
                  <option value="image">{t("cms.media_image")}</option>
                  <option value="video">{t("cms.media_video")}</option>
                </select>
              </div>
              <div className="cms-hero-form-group">
                <label className="cms-hero-label">{t("cms.order")}</label>
                <input className="cms-hero-input" type="number" name="order"
                  value={mediaForm.order} onChange={handleMediaChange} />
              </div>
            </div>
            <div className="cms-hero-form-row">
              <div className="cms-hero-form-group">
                <label className="cms-hero-label">{t("cms.heroes.file")}</label>
                <input className="cms-hero-input-file" type="file" name="file"
                  onChange={handleMediaChange} required />
              </div>
              <div className="cms-hero-form-group cms-hero-form-group--center">
                <label className="cms-hero-label">{t("cms.active")}</label>
                <CmsHeroToggle
                  checked={mediaForm.is_active}
                  onChange={(e) => setMediaForm((p) => ({ ...p, is_active: e.target.checked }))}
                  label={mediaForm.is_active ? t("cms.heroes.status.active") : t("cms.heroes.status.inactive")}
                />
              </div>
            </div>
            <div className="cms-hero-form-actions">
              <button type="submit" className="cms-hero-btn cms-hero-btn--primary" disabled={mediaSaving}>
                {mediaSaving ? <CmsHeroSpinner /> : <IconPlus />}
                {t("cms.add_media")}
              </button>
            </div>
          </form>

          {/* Media grid */}
          {heroMedia.length > 0 ? (
            <div className="cms-hero-media-grid">
              {heroMedia.map((m) => (
                <div key={m.id} className="cms-hero-media-item">
                  <div className="cms-hero-media-preview">
                    {m.media_type !== "video" ? (
                      <img src={m.file_url} alt={m.media_type} />
                    ) : (
                      <video src={m.file_url} controls />
                    )}
                    <span className="cms-hero-media-type-badge">{m.media_type}</span>
                  </div>
                  <div className="cms-hero-media-footer">
                    <div className="cms-hero-media-meta">
                      <span>#{m.id}</span>
                      <span>{t("cms.heroes.media_order")}: {m.order}</span>
                    </div>
                    <span className={`cms-hero-status-badge cms-hero-status-badge--sm ${m.is_active ? "cms-hero-status-badge--active" : "cms-hero-status-badge--inactive"}`}>
                      <span className="cms-hero-status-dot" />
                      {m.is_active ? t("cms.heroes.status.active") : t("cms.heroes.status.inactive")}
                    </span>
                  </div>
                  <button className="cms-hero-media-delete-btn"
                    onClick={() => handleDeleteMedia(m.id)} type="button">
                    <IconTrash />
                    {t("cms.delete")}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="cms-hero-empty cms-hero-empty--sm">
              <IconMedia />
              <p>{t("cms.heroes.no_media")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}