// src/pages/dashboard/forms/validation/InfoModalsManager.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../../api/axiosClient";
import toast from "react-hot-toast";
import { useSweetAlert } from "../../../../components/common/SweetAlert";
import Editbtn from "../../../../components/common/dashboard/Editbtn";
import Deletebtn from "../../../../components/common/dashboard/Deletebtn";
import Pagination from "../../../../components/common/dashboard/Pagination";
import "../../../../styles/forms/dynamic-form.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Layers: () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l6 3-6 3-6-3 6-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M2 10l6 3 6-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 7.5l6 3 6-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 2.5L11 1H3a1.5 1.5 0 00-1.5 1.5v11A1.5 1.5 0 003 15h10a1.5 1.5 0 001.5-1.5V4.5l-1-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="4.5" y="1" width="5" height="4" rx=".5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="3" y="9" width="10" height="6" rx=".5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  Hash: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 5.5h9M2.5 8.5h9M5.5 2l-1 10M9.5 2l-1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8v5M9 6v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Text: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3h10M2 7h8M2 11h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.6 2.6l1 1M10.4 10.4l1 1M11.4 2.6l-1 1M3.6 10.4l-1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionDivider({ icon, label }) {
  return (
    <div className="dfi-form-section-divider">
      <span className="dfi-form-section-icon">{icon}</span>
      <span className="dfi-form-section-label">{label}</span>
      <div className="dfi-form-section-line" />
    </div>
  );
}

function StatusBadge({ active, t }) {
  return (
    <span className={`dfi-badge ${active ? "dfi-badge--active" : "dfi-badge--inactive"}`}>
      <span className="dfi-badge-dot" />
      {active ? t("cms.info.status.active") : t("cms.info.status.inactive")}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="dfi-empty">
      <div className="dfi-empty-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity=".3" />
          <path d="M12 17a8 8 0 0116 0c0 5.33-8 6.67-8 13.33" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".4" />
          <circle cx="20" cy="33" r="2" fill="currentColor" opacity=".4" />
        </svg>
      </div>
      <p>{message}</p>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_MODAL = {
  slug: "", title_ar: "", title_en: "",
  subtitle_ar: "", subtitle_en: "",
  description_ar: "", description_en: "",
  is_active: true,
};

const EMPTY_SECTION = {
  title_ar: "", title_en: "",
  subtitle_ar: "", subtitle_en: "",
  body_ar: "", body_en: "",
  order: 0, is_active: true,
};

const ITEMS_PER_PAGE = 8;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InfoModalsManager() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert, show } = useSweetAlert();
  const formRef = useRef(null);

  const [modals, setModals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalForm, setModalForm] = useState(EMPTY_MODAL);
  const [editingModalId, setEditingModalId] = useState(null);

  const [sectionForms, setSectionForms] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // ── Data fetching ────────────────────────────────────────────────────────
  const loadModals = async () => {
    try {
      const res = await api.get("admin/info-modals/");
      setModals(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error(t("cms.info.error.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadModals(); }, []);

  // ── Modal CRUD ───────────────────────────────────────────────────────────
  const resetForm = () => {
    setModalForm(EMPTY_MODAL);
    setEditingModalId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.slug.trim())    { toast.error(t("cms.info.error.slug_required"));    return; }
    if (!modalForm.title_ar.trim()) { toast.error(t("cms.info.error.title_ar_required")); return; }

    setSaving(true);
    try {
      if (editingModalId) {
        await api.patch(`admin/info-modals/${editingModalId}/`, modalForm);
        toast.success(t("cms.info.success.updated"));
      } else {
        await api.post("admin/info-modals/", modalForm);
        toast.success(t("cms.info.success.created"));
      }
      resetForm();
      loadModals();
    } catch {
      toast.error(t("cms.info.error.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (modal) => {
    setEditingModalId(modal.id);
    setModalForm({
      slug:           modal.slug           || "",
      title_ar:       modal.title_ar       || "",
      title_en:       modal.title_en       || "",
      subtitle_ar:    modal.subtitle_ar    || "",
      subtitle_en:    modal.subtitle_en    || "",
      description_ar: modal.description_ar || "",
      description_en: modal.description_en || "",
      is_active: Boolean(modal.is_active),
    });
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const handleDelete = async (id) => {
    const confirmed = await show({
      type:        "confirm",
      title:       t("cms.info.confirm_delete_title"),
      message:     t("cms.info.confirm_delete_text"),
      confirmText: t("cms.info.delete_button"),
      cancelText:  t("cms.info.cancel_button"),
      showCancel:  true,
      isRtl,
    });
    if (!confirmed) return;
    try {
      await api.delete(`admin/info-modals/${id}/`);
      toast.success(t("cms.info.success.deleted"));
      loadModals();
    } catch {
      toast.error(t("cms.info.error.delete_failed"));
    }
  };

  // ── Section CRUD ─────────────────────────────────────────────────────────
  const updateSectionForm = (modalId, patch) =>
    setSectionForms((prev) => ({
      ...prev,
      [modalId]: { ...(prev[modalId] || EMPTY_SECTION), ...patch },
    }));

  const createSection = async (modalId) => {
    const payload = sectionForms[modalId] || EMPTY_SECTION;
    if (!payload.title_ar.trim()) { toast.error(t("cms.info.error.section_title_ar_required")); return; }
    if (!payload.body_ar.trim())  { toast.error(t("cms.info.error.section_body_ar_required"));  return; }
    try {
      await api.post(`admin/info-modals/${modalId}/sections/`, payload);
      toast.success(t("cms.info.success.section_created"));
      setSectionForms((prev) => ({ ...prev, [modalId]: EMPTY_SECTION }));
      loadModals();
    } catch {
      toast.error(t("cms.info.error.save_failed"));
    }
  };

  const updateSection = async (sectionId, field, value) => {
    try {
      await api.patch(`admin/info-modal-sections/${sectionId}/`, { [field]: value });
      loadModals();
    } catch {
      toast.error(t("cms.info.error.save_failed"));
    }
  };

  const deleteSection = async (sectionId) => {
    const confirmed = await show({
      type:        "confirm",
      title:       t("cms.info.confirm_delete_section_title"),
      message:     t("cms.info.confirm_delete_section_text"),
      confirmText: t("cms.info.delete_button"),
      cancelText:  t("cms.info.cancel_button"),
      showCancel:  true,
      isRtl,
    });
    if (!confirmed) return;
    try {
      await api.delete(`admin/info-modal-sections/${sectionId}/`);
      toast.success(t("cms.info.success.section_deleted"));
      loadModals();
    } catch {
      toast.error(t("cms.info.error.delete_failed"));
    }
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.ceil(modals.length / ITEMS_PER_PAGE);
  const paginatedModals = modals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const patchField = (field, value) => setModalForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      {alert}
      <div className="dfi-dashboard" dir={isRtl ? "rtl" : "ltr"}>

        {/* PAGE HEADER */}
        <div className="dfi-page-header">
          <div className="dfi-page-header-left">
            <div className="dfi-page-header-icon"><Icon.Info /></div>
            <div>
              <h1 className="dfi-page-title">{t("cms.info.title")}</h1>
              <p className="dfi-page-subtitle">{t("cms.info.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div className="dfi-card dfi-card--form" ref={formRef}>
          <div className="dfi-card-header">
            <div className="dfi-card-header-left">
              <span className="dfi-card-header-icon dfi-card-header-icon--blue"><Icon.Layers /></span>
              <h3 className="dfi-card-title">
                {editingModalId ? t("cms.info.form_title_edit") : t("cms.info.form_title_create")}
              </h3>
            </div>
            {editingModalId && (
              <button className="dfi-icon-btn dfi-icon-btn--ghost" onClick={resetForm} type="button">
                <Icon.X />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="dfi-form">

            {/* Titles row */}
            <SectionDivider icon={<Icon.Text />} label={t("cms.info.section_titles")} />
            <div className="dfi-form-row">
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.title_ar")}</label>
                <input className="dfi-input" dir="rtl"
                  placeholder={t("cms.info.placeholders.title_ar")}
                  value={modalForm.title_ar}
                  onChange={(e) => patchField("title_ar", e.target.value)} required />
              </div>
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.title_en")}</label>
                <input className="dfi-input" dir="ltr"
                  placeholder={t("cms.info.placeholders.title_en")}
                  value={modalForm.title_en}
                  onChange={(e) => patchField("title_en", e.target.value)} />
              </div>
            </div>

            {/* Subtitles row */}
            <div className="dfi-form-row">
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.subtitle_ar")}</label>
                <input className="dfi-input" dir="rtl"
                  placeholder={t("cms.info.placeholders.subtitle_ar")}
                  value={modalForm.subtitle_ar}
                  onChange={(e) => patchField("subtitle_ar", e.target.value)} />
              </div>
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.subtitle_en")}</label>
                <input className="dfi-input" dir="ltr"
                  placeholder={t("cms.info.placeholders.subtitle_en")}
                  value={modalForm.subtitle_en}
                  onChange={(e) => patchField("subtitle_en", e.target.value)} />
              </div>
            </div>

            {/* Descriptions row */}
            <SectionDivider icon={<Icon.Text />} label={t("cms.info.section_description")} />
            <div className="dfi-form-row">
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.description_ar")}</label>
                <textarea className="dfi-textarea" dir="rtl" rows={3}
                  placeholder={t("cms.info.placeholders.description_ar")}
                  value={modalForm.description_ar}
                  onChange={(e) => patchField("description_ar", e.target.value)} />
              </div>
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.description_en")}</label>
                <textarea className="dfi-textarea" dir="ltr" rows={3}
                  placeholder={t("cms.info.placeholders.description_en")}
                  value={modalForm.description_en}
                  onChange={(e) => patchField("description_en", e.target.value)} />
              </div>
            </div>

            {/* Settings row */}
            <SectionDivider icon={<Icon.Settings />} label={t("cms.info.section_settings")} />
            <div className="dfi-form-row">
              <div className="dfi-form-group">
                <label className="dfi-label">
                  {t("cms.info.fields.slug")}
                  <span className="dfi-label-hint">{t("cms.info.slug_hint")}</span>
                </label>
                <input className="dfi-input" dir="ltr"
                  placeholder={t("cms.info.placeholders.slug")}
                  value={modalForm.slug}
                  onChange={(e) => patchField("slug", e.target.value)} required />
              </div>
              <div className="dfi-form-group">
                <label className="dfi-label">{t("cms.info.fields.active")}</label>
                <label className="dfi-toggle">
                  <input type="checkbox" checked={modalForm.is_active}
                    onChange={(e) => patchField("is_active", e.target.checked)} />
                  <span className="dfi-toggle-track"><span className="dfi-toggle-thumb" /></span>
                  <span className="dfi-toggle-label">
                    {modalForm.is_active ? t("cms.info.status.active") : t("cms.info.status.inactive")}
                  </span>
                </label>
              </div>
            </div>

            <div className="dfi-form-actions">
              <button type="submit" className="dfi-btn dfi-btn--primary" disabled={saving}>
                {saving ? <span className="dfi-spinner" /> : <Icon.Save />}
                {editingModalId ? t("cms.info.actions.update") : t("cms.info.actions.create")}
              </button>
              {editingModalId && (
                <button type="button" className="dfi-btn dfi-btn--ghost" onClick={resetForm}>
                  <Icon.X />{t("cms.info.actions.cancel")}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── LIST CARD ── */}
        <div className="dfi-card">
          <div className="dfi-card-header">
            <div className="dfi-card-header-left">
              <span className="dfi-card-header-icon dfi-card-header-icon--purple"><Icon.Layers /></span>
              <h3 className="dfi-card-title">{t("cms.info.list_title")}</h3>
            </div>
            <span className="dfi-count-badge">{modals.length}</span>
          </div>

          {loading ? (
            <div className="dfi-skeleton-list">
              {[...Array(3)].map((_, i) => <div key={i} className="dfi-skeleton-item" />)}
            </div>
          ) : modals.length === 0 ? (
            <EmptyState message={t("cms.info.empty")} />
          ) : (
            <div className="dfi-modals-list">
              {paginatedModals.map((modal, mi) => (
                <div key={modal.id} className="dfi-modal-card" style={{ animationDelay: `${mi * 40}ms` }}>

                  {/* Modal card header */}
                  <div className="dfi-modal-card-header">
                    <div className="dfi-modal-card-header-left">
                      <div className="dfi-modal-card-icon dfi-modal-card-icon--blue">
                        <Icon.Info />
                      </div>
                      <div className="dfi-modal-card-meta">
                        <p className="dfi-modal-card-title">
                          {isRtl ? modal.title_ar : modal.title_en || modal.title_ar || "—"}
                        </p>
                        <code className="dfi-slug-code">{modal.slug}</code>
                      </div>
                    </div>
                    <div className="dfi-modal-card-actions">
                      <StatusBadge active={modal.is_active} t={t} />
                      <Editbtn onClick={() => handleEdit(modal)} />
                      <Deletebtn onConfirm={() => handleDelete(modal.id)} />
                    </div>
                  </div>

                  {/* Existing sections */}
                  {modal.sections?.length > 0 && (
                    <div className="dfi-sections-list">
                      <div className="dfi-sections-heading">
                        <Icon.Hash />
                        {t("cms.info.sections_label")} ({modal.sections.length})
                      </div>
                      {modal.sections.map((section, si) => (
                        <div key={section.id} className="dfi-section-row">
                          <div className="dfi-section-row-index">
                            {t("cms.info.section_number")} {si + 1}
                          </div>
                          <div className="dfi-form-row">
                            <div className="dfi-form-group">
                              <label className="dfi-label dfi-label--sm">{t("cms.info.fields.title_ar")}</label>
                              <input className="dfi-input dfi-input--sm" dir="rtl"
                                defaultValue={section.title_ar || ""}
                                onBlur={(e) => updateSection(section.id, "title_ar", e.target.value)} />
                            </div>
                            <div className="dfi-form-group">
                              <label className="dfi-label dfi-label--sm">{t("cms.info.fields.title_en")}</label>
                              <input className="dfi-input dfi-input--sm" dir="ltr"
                                defaultValue={section.title_en || ""}
                                onBlur={(e) => updateSection(section.id, "title_en", e.target.value)} />
                            </div>
                          </div>
                          <div className="dfi-form-row">
                            <div className="dfi-form-group">
                              <label className="dfi-label dfi-label--sm">{t("cms.info.fields.subtitle_ar")}</label>
                              <input className="dfi-input dfi-input--sm" dir="rtl"
                                defaultValue={section.subtitle_ar || ""}
                                onBlur={(e) => updateSection(section.id, "subtitle_ar", e.target.value)} />
                            </div>
                            <div className="dfi-form-group">
                              <label className="dfi-label dfi-label--sm">{t("cms.info.fields.subtitle_en")}</label>
                              <input className="dfi-input dfi-input--sm" dir="ltr"
                                defaultValue={section.subtitle_en || ""}
                                onBlur={(e) => updateSection(section.id, "subtitle_en", e.target.value)} />
                            </div>
                          </div>
                          <div className="dfi-form-row">
                            <div className="dfi-form-group">
                              <label className="dfi-label dfi-label--sm">{t("cms.info.fields.body_ar")}</label>
                              <textarea className="dfi-textarea dfi-textarea--sm" dir="rtl" rows={2}
                                defaultValue={section.body_ar || ""}
                                onBlur={(e) => updateSection(section.id, "body_ar", e.target.value)} />
                            </div>
                            <div className="dfi-form-group">
                              <label className="dfi-label dfi-label--sm">{t("cms.info.fields.body_en")}</label>
                              <textarea className="dfi-textarea dfi-textarea--sm" dir="ltr" rows={2}
                                defaultValue={section.body_en || ""}
                                onBlur={(e) => updateSection(section.id, "body_en", e.target.value)} />
                            </div>
                          </div>
                          <div className="dfi-section-row-footer">
                            <Deletebtn onConfirm={() => deleteSection(section.id)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new section */}
                  <div className="dfi-add-section">
                    <div className="dfi-add-section-heading">
                      <Icon.Plus />
                      {t("cms.info.add_section_label")}
                    </div>
                    <div className="dfi-form-row">
                      <div className="dfi-form-group">
                        <label className="dfi-label dfi-label--sm">{t("cms.info.fields.title_ar")}</label>
                        <input className="dfi-input dfi-input--sm" dir="rtl"
                          placeholder={t("cms.info.placeholders.section_title_ar")}
                          value={(sectionForms[modal.id] || EMPTY_SECTION).title_ar}
                          onChange={(e) => updateSectionForm(modal.id, { title_ar: e.target.value })} />
                      </div>
                      <div className="dfi-form-group">
                        <label className="dfi-label dfi-label--sm">{t("cms.info.fields.title_en")}</label>
                        <input className="dfi-input dfi-input--sm" dir="ltr"
                          placeholder={t("cms.info.placeholders.section_title_en")}
                          value={(sectionForms[modal.id] || EMPTY_SECTION).title_en}
                          onChange={(e) => updateSectionForm(modal.id, { title_en: e.target.value })} />
                      </div>
                    </div>
                    <div className="dfi-form-row">
                      <div className="dfi-form-group">
                        <label className="dfi-label dfi-label--sm">{t("cms.info.fields.subtitle_ar")}</label>
                        <input className="dfi-input dfi-input--sm" dir="rtl"
                          placeholder={t("cms.info.placeholders.subtitle_ar")}
                          value={(sectionForms[modal.id] || EMPTY_SECTION).subtitle_ar}
                          onChange={(e) => updateSectionForm(modal.id, { subtitle_ar: e.target.value })} />
                      </div>
                      <div className="dfi-form-group">
                        <label className="dfi-label dfi-label--sm">{t("cms.info.fields.subtitle_en")}</label>
                        <input className="dfi-input dfi-input--sm" dir="ltr"
                          placeholder={t("cms.info.placeholders.subtitle_en")}
                          value={(sectionForms[modal.id] || EMPTY_SECTION).subtitle_en}
                          onChange={(e) => updateSectionForm(modal.id, { subtitle_en: e.target.value })} />
                      </div>
                    </div>
                    <div className="dfi-form-row">
                      <div className="dfi-form-group">
                        <label className="dfi-label dfi-label--sm">{t("cms.info.fields.body_ar")}</label>
                        <textarea className="dfi-textarea dfi-textarea--sm" dir="rtl" rows={2}
                          placeholder={t("cms.info.placeholders.body_ar")}
                          value={(sectionForms[modal.id] || EMPTY_SECTION).body_ar}
                          onChange={(e) => updateSectionForm(modal.id, { body_ar: e.target.value })} />
                      </div>
                      <div className="dfi-form-group">
                        <label className="dfi-label dfi-label--sm">{t("cms.info.fields.body_en")}</label>
                        <textarea className="dfi-textarea dfi-textarea--sm" dir="ltr" rows={2}
                          placeholder={t("cms.info.placeholders.body_en")}
                          value={(sectionForms[modal.id] || EMPTY_SECTION).body_en}
                          onChange={(e) => updateSectionForm(modal.id, { body_en: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <button type="button" className="dfi-btn dfi-btn--primary dfi-btn--sm"
                        onClick={() => createSection(modal.id)}>
                        <Icon.Plus />
                        {t("cms.info.actions.add_section")}
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

      </div>
    </>
  );
}