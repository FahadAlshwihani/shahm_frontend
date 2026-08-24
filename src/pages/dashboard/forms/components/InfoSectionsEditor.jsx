// src/pages/dashboard/forms/components/InfoSectionsEditor.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "../../../../styles/forms/dynamic-form.css";
import Deletebtn from "../../../../components/common/dashboard/Deletebtn";
// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IcoText = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3h10M2 7h8M2 11h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionDivider({ icon, label }) {
  return (
    <div className="dfi-form-section-divider">
      <span className="dfi-form-section-icon">{icon}</span>
      <span className="dfi-form-section-label">{label}</span>
      <div className="dfi-form-section-line" />
    </div>
  );
}

/**
 * InfoSectionsEditor
 *
 * Props:
 *  form            {object}   — the parent form object containing a `sections` array
 *  onAddSection    {fn}
 *  onUpdateSection {fn(section)}
 *  onDeleteSection {fn(sectionId)}
 */
export default function InfoSectionsEditor({ form, onAddSection, onUpdateSection, onDeleteSection }) {
  const { t } = useTranslation();
  const sections = form.sections || [];

  return (
    <div className="dfi-editor">

      {/* Header */}
      <div className="dfi-editor-header">
        <div className="dfi-editor-header-left">
          <span className="dfi-card-header-icon dfi-card-header-icon--blue">
            <IcoText />
          </span>
          <h2 className="dfi-editor-title">{t("cms.info.sections_editor_title")}</h2>
          <span className="dfi-count-badge">{sections.length}</span>
        </div>
        <button type="button" className="dfi-btn dfi-btn--primary dfi-btn--sm" onClick={onAddSection}>
          <IcoPlus />
          {t("cms.info.add_section")}
        </button>
      </div>

      {/* Empty state */}
      {sections.length === 0 ? (
        <div className="dfi-empty dfi-empty--inline">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" opacity="0.3">
            <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M12 14h16M12 20h12M12 26h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>{t("cms.info.sections_empty")}</p>
        </div>
      ) : (
        <div className="dfi-editor-sections-stack">
          {sections.map((section, idx) => (
            <div key={section.id ?? idx} className="dfi-editor-section-card">

              {/* Card header */}
              <div className="dfi-editor-section-card-header">
                <span className="dfi-section-index-label">
                  {t("cms.info.section_number")} {idx + 1}
                </span>
                <Deletebtn
  onConfirm={() => onDeleteSection(section.id)}
  className="dfi-icon-btn dfi-icon-btn--delete"
  iconOnly
  title={t("cms.info.actions.delete_section")}
/>
              </div>

              {/* Titles */}
              <SectionDivider icon={<IcoText />} label={t("cms.info.section_titles")} />
              <div className="dfi-form-row">
                <div className="dfi-form-group">
                  <label className="dfi-label">{t("cms.info.fields.title_ar")}</label>
                  <input className="dfi-input" dir="rtl"
                    placeholder={t("cms.info.placeholders.title_ar")}
                    value={section.title_ar || ""}
                    onChange={(e) => onUpdateSection({ ...section, title_ar: e.target.value })} />
                </div>
                <div className="dfi-form-group">
                  <label className="dfi-label">{t("cms.info.fields.title_en")}</label>
                  <input className="dfi-input" dir="ltr"
                    placeholder={t("cms.info.placeholders.title_en")}
                    value={section.title_en || ""}
                    onChange={(e) => onUpdateSection({ ...section, title_en: e.target.value })} />
                </div>
              </div>

              {/* Subtitles */}
              <div className="dfi-form-row">
                <div className="dfi-form-group">
                  <label className="dfi-label">{t("cms.info.fields.subtitle_ar")}</label>
                  <input className="dfi-input" dir="rtl"
                    placeholder={t("cms.info.placeholders.subtitle_ar")}
                    value={section.subtitle_ar || ""}
                    onChange={(e) => onUpdateSection({ ...section, subtitle_ar: e.target.value })} />
                </div>
                <div className="dfi-form-group">
                  <label className="dfi-label">{t("cms.info.fields.subtitle_en")}</label>
                  <input className="dfi-input" dir="ltr"
                    placeholder={t("cms.info.placeholders.subtitle_en")}
                    value={section.subtitle_en || ""}
                    onChange={(e) => onUpdateSection({ ...section, subtitle_en: e.target.value })} />
                </div>
              </div>

              {/* Body */}
              <SectionDivider icon={<IcoText />} label={t("cms.info.section_body")} />
              <div className="dfi-form-row">
                <div className="dfi-form-group">
                  <label className="dfi-label">{t("cms.info.fields.body_ar")}</label>
                  <textarea className="dfi-textarea" dir="rtl" rows={3}
                    placeholder={t("cms.info.placeholders.body_ar")}
                    value={section.body_ar || ""}
                    onChange={(e) => onUpdateSection({ ...section, body_ar: e.target.value })} />
                </div>
                <div className="dfi-form-group">
                  <label className="dfi-label">{t("cms.info.fields.body_en")}</label>
                  <textarea className="dfi-textarea" dir="ltr" rows={3}
                    placeholder={t("cms.info.placeholders.body_en")}
                    value={section.body_en || ""}
                    onChange={(e) => onUpdateSection({ ...section, body_en: e.target.value })} />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
