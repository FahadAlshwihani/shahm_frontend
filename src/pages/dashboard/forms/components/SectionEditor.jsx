// src/pages/dashboard/components/forms/SectionEditor.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FieldEditor from "./FieldEditor";

const FIELD_TYPES = [
    "text", "textarea", "email", "phone", "number",
    "date", "select", "radio", "checkbox", "file",
];

const IconUp = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 10V3M3.5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconDown = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 3v7M3.5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconTrash = () => (
    <svg width="13" height="13" viewBox="0 0 48 48" fill="currentColor">
        <path d="M20 2C18.355 2 17 3.355 17 5v2H4a1 1 0 100 2h13.832a1 1 0 00.326 0h11.674a1 1 0 00.326 0H44a1 1 0 100-2H31V5c0-1.645-1.355-3-3-3h-8zm0 2h8c.565 0 1 .435 1 1v2H19V5c0-.565.435-1 1-1zM6.98 10.986a1 1 0 00-.986 1.108l2.67 28.369C8.9 43.03 11.061 45 13.64 45h20.72c2.579 0 4.74-1.97 4.976-4.538l2.67-28.369a1 1 0 10-1.992-.187L37.344 40.28C37.2 41.851 35.94 43 34.36 43H13.64c-1.58 0-2.84-1.149-2.984-2.72L7.986 11.906a1 1 0 00-1.006-.92z" />
    </svg>
);
const IconCopy = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-7A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
);
const IconPlus = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const IconChevron = ({ open }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
        style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.22s ease" }}>
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconGrip = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="4.5" cy="4" r="1" fill="currentColor" opacity=".5" />
        <circle cx="9.5" cy="4" r="1" fill="currentColor" opacity=".5" />
        <circle cx="4.5" cy="7" r="1" fill="currentColor" opacity=".5" />
        <circle cx="9.5" cy="7" r="1" fill="currentColor" opacity=".5" />
        <circle cx="4.5" cy="10" r="1" fill="currentColor" opacity=".5" />
        <circle cx="9.5" cy="10" r="1" fill="currentColor" opacity=".5" />
    </svg>
);

function SectionEditor({
    section,
    formId,
    sectionIndex,
    totalSections,
    onUpdateSection,
    onDeleteSection,
    onDuplicateSection,
    onMoveSectionUp,
    onMoveSectionDown,
    // field-level callbacks
    onAddField,
    onUpdateField,   // pure local state update, no API
    onSaveField,     // explicit API persist (POST or PATCH)
    onDeleteField,
    onDuplicateField,
    // option-level callbacks
    onAddOption,
    onUpdateOption,
    onDeleteOption,
    saving,
}) {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const [showAddField, setShowAddField] = useState(false);
    const [newFieldType, setNewFieldType] = useState("text");

    const fields = (section.fields || []).filter((f) => f.is_active !== false);
    const allFields = section.fields || [];

    const handleMoveField = async (fieldIdx, dir) => {
        const arr = [...allFields];
        const target = fieldIdx + dir;
        if (target < 0 || target >= arr.length) return;
        [arr[fieldIdx], arr[target]] = [arr[target], arr[fieldIdx]];
        const reordered = arr.map((f, idx) => ({ ...f, order: idx }));
        onUpdateSection({ ...section, fields: reordered });
        // Persist order for persisted fields only
        reordered.forEach((field, idx) => {
            if (field.id) {
                onSaveField(section, { ...field, order: idx });
            }
        });
    };

    return (
        <div className={`fb-section-editor ${!section.is_active ? "fb-section-editor--inactive" : ""}`}>
            {/* Section header */}
            <div className="fb-section-header">
                <div className="fb-section-header-left">
                    <span className="fb-section-grip"><IconGrip /></span>
                    <span className="fb-section-index">{sectionIndex + 1}</span>
                    <div className="fb-section-meta">
                        <span className="fb-section-name">
                            {section.title_ar || section.title_en || t("cms.forms.section.unnamed")}
                        </span>
                        <span className="fb-section-field-count">
                            {fields.length} {t("cms.forms.section.fields_count")}
                        </span>
                    </div>
                    {!section.is_active && (
                        <span className="fb-inactive-badge">{t("cms.forms.status.inactive")}</span>
                    )}
                </div>
                <div className="fb-section-header-actions">
                    <button type="button" className="fb-micro-btn" onClick={onMoveSectionUp}
                        disabled={sectionIndex === 0} title={t("cms.forms.actions.move_up")}><IconUp /></button>
                    <button type="button" className="fb-micro-btn" onClick={onMoveSectionDown}
                        disabled={sectionIndex === totalSections - 1} title={t("cms.forms.actions.move_down")}><IconDown /></button>
                    <button type="button" className="fb-micro-btn" onClick={onDuplicateSection}
                        title={t("cms.forms.actions.duplicate")}><IconCopy /></button>
                    <button type="button" className="fb-micro-btn fb-micro-btn--danger" onClick={onDeleteSection}
                        disabled={saving} title={t("cms.forms.actions.delete_section")}><IconTrash /></button>
                    <button type="button" className="fb-micro-btn fb-section-collapse-btn"
                        onClick={() => setCollapsed((p) => !p)}>
                        <IconChevron open={!collapsed} />
                    </button>
                </div>
            </div>

            {/* Section body */}
            {!collapsed && (
                <div className="fb-section-body">
                    {/* Section title/description fields */}
                    <div className="fb-section-meta-form">
                        <div className="fb-form-row">
                            <div className="fb-form-group">
                                <label className="fb-label fb-label--sm">{t("cms.forms.section.title_ar")}</label>
                                <input className="fb-input" dir="rtl"
                                    value={section.title_ar || ""}
                                    onChange={(e) => onUpdateSection({ ...section, title_ar: e.target.value })}
                                    placeholder={t("cms.forms.placeholders.section_title_ar")} />
                            </div>
                            <div className="fb-form-group">
                                <label className="fb-label fb-label--sm">{t("cms.forms.section.title_en")}</label>
                                <input className="fb-input" dir="ltr"
                                    value={section.title_en || ""}
                                    onChange={(e) => onUpdateSection({ ...section, title_en: e.target.value })}
                                    placeholder={t("cms.forms.placeholders.section_title_en")} />
                            </div>
                        </div>
                        <div className="fb-form-row">
                            <div className="fb-form-group">
                                <label className="fb-label fb-label--sm">{t("cms.forms.section.desc_ar")}</label>
                                <input className="fb-input" dir="rtl"
                                    value={section.description_ar || ""}
                                    onChange={(e) => onUpdateSection({ ...section, description_ar: e.target.value })}
                                    placeholder={t("cms.forms.placeholders.section_desc_ar")} />
                            </div>
                            <div className="fb-form-group">
                                <label className="fb-label fb-label--sm">{t("cms.forms.section.desc_en")}</label>
                                <input className="fb-input" dir="ltr"
                                    value={section.description_en || ""}
                                    onChange={(e) => onUpdateSection({ ...section, description_en: e.target.value })}
                                    placeholder={t("cms.forms.placeholders.section_desc_en")} />
                            </div>
                        </div>
                        <div className="fb-form-row">
                            <div className="fb-form-group fb-form-group--toggles">
                                <label className="fb-toggle fb-toggle--sm">
                                    <input type="checkbox" checked={section.is_active !== false}
                                        onChange={(e) => onUpdateSection({ ...section, is_active: e.target.checked })} />
                                    <span className="fb-toggle-track"><span className="fb-toggle-thumb" /></span>
                                    <span className="fb-toggle-label">{t("cms.forms.section.active")}</span>
                                </label>
                            </div>
                            <div className="fb-form-group">
                                <label className="fb-label fb-label--sm">{t("cms.forms.section.order")}</label>
                                <input className="fb-input" type="number" min="0"
                                    value={section.order ?? sectionIndex}
                                    onChange={(e) => onUpdateSection({ ...section, order: parseInt(e.target.value, 10) })} />
                            </div>
                        </div>
                    </div>

                    {/* Fields list */}
                    <div className="fb-fields-list">
                        {fields.length === 0 && (
                            <div className="fb-fields-empty">
                                <p>{t("cms.forms.section.no_fields")}</p>
                            </div>
                        )}
                        {fields.map((field, fIdx) => {
                            if (field.is_active === false && !field._isNew) return null;
                            return (
                                <FieldEditor
                                    key={field.id || field.temp_id}
                                    field={field}
                                    sectionId={section.id}
                                    formId={formId}
                                    onUpdate={(updated) => onUpdateField(section, fIdx, updated)}
                                    onSave={(updated) => onSaveField(section, updated)}
                                    onDelete={() => onDeleteField(section, fIdx, field)}
                                    onDuplicate={() => {
                                        const dup = {
                                            ...field,
                                            id: undefined,
                                            temp_id: crypto.randomUUID(),
                                            _isNew: true,
                                            _isDirty: true,
                                            _isSaving: false,
                                            _hasErrors: {},
                                            system_key: "",
                                            key: "",
                                            options: (field.options || []).map((opt) => ({
                                                ...opt,
                                                id: undefined,
                                                value: "",
                                            })),
                                        };
                                        onDuplicateField(section, dup);
                                    }}
                                    onMoveUp={() => handleMoveField(fIdx, -1)}
                                    onMoveDown={() => handleMoveField(fIdx, 1)}
                                    isFirst={fIdx === 0}
                                    isLast={fIdx === allFields.length - 1}
                                    saving={saving}
                                    onAddOption={(f) => onAddOption(section, f)}
                                    onUpdateOption={onUpdateOption}
                                    onDeleteOption={(optId, f, newOpts) => onDeleteOption(section, f, optId, newOpts)}
                                />
                            );
                        })}
                    </div>

                    {/* Add field bar */}
                    <div className="fb-add-field-bar">
                        {showAddField ? (
                            <div className="fb-add-field-inline">
                                <select className="fb-select fb-select--sm"
                                    value={newFieldType}
                                    onChange={(e) => setNewFieldType(e.target.value)}>
                                    {FIELD_TYPES.map((ft) => (
                                        <option key={ft} value={ft}>{t(`cms.forms.field_types.${ft}`)}</option>
                                    ))}
                                </select>
                                <button type="button" className="fb-btn fb-btn--primary fb-btn--sm"
                                    onClick={() => {
                                        onAddField(section, newFieldType);
                                        setShowAddField(false);
                                        setNewFieldType("text");
                                    }}>
                                    {t("cms.forms.actions.add_field")}
                                </button>
                                <button type="button" className="fb-btn fb-btn--ghost fb-btn--sm"
                                    onClick={() => setShowAddField(false)}>
                                    {t("cms.forms.actions.cancel")}
                                </button>
                            </div>
                        ) : (
                            <button type="button" className="fb-btn fb-btn--add-field"
                                onClick={() => setShowAddField(true)}>
                                <IconPlus />
                                {t("cms.forms.actions.add_field")}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(SectionEditor);