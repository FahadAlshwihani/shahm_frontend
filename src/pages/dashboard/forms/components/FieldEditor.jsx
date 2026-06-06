// src/pages/dashboard/components/forms/FieldEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";

// ── Country codes for phone field ─────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: "+966", label: "SA +966" },
  { code: "+971", label: "AE +971" },
  { code: "+965", label: "KW +965" },
  { code: "+974", label: "QA +974" },
  { code: "+973", label: "BH +973" },
  { code: "+968", label: "OM +968" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "GB +44" },
  { code: "+20", label: "EG +20" },
  { code: "+962", label: "JO +962" },
  { code: "+961", label: "LB +961" },
  { code: "+963", label: "SY +963" },
  { code: "+964", label: "IQ +964" },
  { code: "+967", label: "YE +967" },
  { code: "+212", label: "MA +212" },
  { code: "+216", label: "TN +216" },
  { code: "+213", label: "DZ +213" },
];

const SYSTEM_FIELD_TYPES = {
  appointment_date: "date",
  appointment_period: "select",
  email: "email",
  phone: "phone",
  message: "textarea",
  service_ids: "select",
  service_category_id: "select",
  job_id: "select",
  slot_id: "select",
  attachment: "file",
  voice_note: "file",
  cv_file: "file",
  cover_letter: "file",
};

const COMMON_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".xlsx", ".zip"];
const FIELD_TYPES = [
  "text", "textarea", "email", "phone", "number",
  "date", "select", "radio", "checkbox", "file",
];
const WIDTH_OPTIONS = ["full", "half", "third"];

const SYSTEM_FIELD_KEYS = [
  { value: "title", label: "Title" },
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "first_name_ar", label: "First Name Arabic" },
  { value: "last_name_ar", label: "Last Name Arabic" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "message", label: "Message" },
  { value: "service_ids", label: "Service IDs" },
  { value: "service_category_id", label: "Service Category" },
  { value: "job_id", label: "Job ID" },
  { value: "slot_id", label: "Slot ID" },
  { value: "appointment_date", label: "Appointment Date" },
  { value: "appointment_period", label: "Appointment Period" },
  { value: "visitors", label: "Visitors" },
  { value: "attachment", label: "Attachment" },
  { value: "voice_note", label: "Voice Note" },
  { value: "cv_file", label: "CV File" },
  { value: "cover_letter", label: "Cover Letter" },
  { value: "nationality", label: "Nationality" },
  { value: "gender", label: "Gender" },
  { value: "location", label: "Location" },
  { value: "source", label: "Source" },
  { value: "id_number", label: "ID Number" },
  { value: "certifications", label: "Certifications" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "notes", label: "Notes" },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 48 48" fill="currentColor">
    <path d="M20 2C18.355 2 17 3.355 17 5v2H4a1 1 0 100 2h13.832a1 1 0 00.326 0h11.674a1 1 0 00.326 0H44a1 1 0 100-2H31V5c0-1.645-1.355-3-3-3h-8zm0 2h8c.565 0 1 .435 1 1v2H19V5c0-.565.435-1 1-1zM6.98 10.986a1 1 0 00-.986 1.108l2.67 28.369C8.9 43.03 11.061 45 13.64 45h20.72c2.579 0 4.74-1.97 4.976-4.538l2.67-28.369a1 1 0 10-1.992-.187L37.344 40.28C37.2 41.851 35.94 43 34.36 43H13.64c-1.58 0-2.84-1.149-2.984-2.72L7.986 11.906a1 1 0 00-1.006-.92z" />
  </svg>
);
const IconPlus = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconUp = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 9V2M2.5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDown = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 2v7M2.5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCopy = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-7A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H4" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconSave = () => (
  <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const Spinner = () => (
  <span className="fb-spinner">
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

// ── Phone Field Config ─────────────────────────────────────────────────────────
function PhoneFieldConfig({ settings, onChange }) {
  const { t } = useTranslation();
  const s = settings || {};
  const set = (k, v) => onChange({ ...s, [k]: v });
  return (
    <div className="fb-phone-config">
      <div className="fb-form-row">
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.phone.default_country")}</label>
          <select className="fb-select"
            value={s.default_country_code || "+966"}
            onChange={(e) => set("default_country_code", e.target.value)}>
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.phone.allowed_note")}</label>
          <div className="fb-phone-countries">
            {COUNTRY_CODES.slice(0, 8).map((c) => {
              const allowed = s.allowed_codes || [];
              const checked = allowed.includes(c.code);
              return (
                <label key={c.code} className="fb-micro-check">
                  <input type="checkbox" checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...allowed, c.code]
                        : allowed.filter((x) => x !== c.code);
                      set("allowed_codes", next);
                    }} />
                  {c.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── File Field Config ──────────────────────────────────────────────────────────
function FileFieldConfig({ validation, onChange }) {
  const { t } = useTranslation();
  const v = validation || {};
  const set = (k, val) => onChange({ ...v, [k]: val });
  const exts = v.allowed_extensions || [];
  const addExt = (ext) => { if (!exts.includes(ext)) set("allowed_extensions", [...exts, ext]); };
  const removeExt = (ext) => set("allowed_extensions", exts.filter((e) => e !== ext));
  return (
    <div className="fb-file-config">
      <div className="fb-form-row">
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.file.max_size")}</label>
          <div className="fb-input-suffix-wrap">
            <input className="fb-input" type="number" min="1" max="25"
              value={v.max_size_mb || ""}
              onChange={(e) => set("max_size_mb", e.target.value)}
              placeholder="10" />
            <span className="fb-input-suffix">MB</span>
          </div>
        </div>
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.file.extensions")}</label>
          <div className="fb-ext-quick">
            {COMMON_EXTENSIONS.map((ext) => (
              <button key={ext} type="button"
                className={`fb-ext-chip ${exts.includes(ext) ? "fb-ext-chip--active" : ""}`}
                onClick={() => exts.includes(ext) ? removeExt(ext) : addExt(ext)}>
                {ext}
              </button>
            ))}
          </div>
        </div>
      </div>
      {exts.length > 0 && (
        <div className="fb-ext-selected">
          {exts.map((ext) => (
            <span key={ext} className="fb-ext-tag">
              {ext}
              <button type="button" onClick={() => removeExt(ext)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Validation Builder ─────────────────────────────────────────────────────────
function ValidationBuilder({ fieldType, validation, onChange }) {
  const { t } = useTranslation();
  const v = validation || {};
  const set = (k, val) => onChange({ ...v, [k]: val });
  if (["text", "textarea"].includes(fieldType)) {
    return (
      <div className="fb-form-row">
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.validation.min_length")}</label>
          <input className="fb-input" type="number" min="0"
            value={v.min_length || ""} onChange={(e) => set("min_length", e.target.value)} />
        </div>
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.validation.max_length")}</label>
          <input className="fb-input" type="number" min="0"
            value={v.max_length || ""} onChange={(e) => set("max_length", e.target.value)} />
        </div>
      </div>
    );
  }
  if (fieldType === "number") {
    return (
      <div className="fb-form-row">
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.validation.min")}</label>
          <input className="fb-input" type="number"
            value={v.min || ""} onChange={(e) => set("min", e.target.value)} />
        </div>
        <div className="fb-form-group">
          <label className="fb-label fb-label--sm">{t("cms.forms.validation.max")}</label>
          <input className="fb-input" type="number"
            value={v.max || ""} onChange={(e) => set("max", e.target.value)} />
        </div>
      </div>
    );
  }
  return null;
}

// ── Option Row ─────────────────────────────────────────────────────────────────
function OptionRow({ option, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast, saving }) {
  const { t } = useTranslation();
  return (
    <div className="fb-option-row">
      <div className="fb-option-reorder">
        <button type="button" className="fb-micro-btn" onClick={onMoveUp} disabled={isFirst}><IconUp /></button>
        <button type="button" className="fb-micro-btn" onClick={onMoveDown} disabled={isLast}><IconDown /></button>
      </div>
      <input className="fb-input fb-input--sm" dir="rtl"
        placeholder={t("cms.forms.option.label_ar")}
        value={option.label_ar || ""}
        onChange={(e) => onUpdate({ ...option, label_ar: e.target.value })} />
      <input className="fb-input fb-input--sm" dir="ltr"
        placeholder={t("cms.forms.option.label_en")}
        value={option.label_en || ""}
        onChange={(e) => onUpdate({ ...option, label_en: e.target.value })} />
      <input
        className="fb-input fb-input--sm fb-input--mono"
        dir="ltr"
        placeholder={t("cms.forms.field.auto_generated")}
        value={option.value || ""}
        disabled
      />
      <button type="button" className="fb-micro-btn fb-micro-btn--danger" onClick={onDelete} disabled={saving}>
        <IconTrash />
      </button>
    </div>
  );
}

// ── Inline field error message ─────────────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return <p className="fb-field-error">{Array.isArray(message) ? message.join(", ") : message}</p>;
}

// ── Main FieldEditor ──────────────────────────────────────────────────────────
/**
 * FieldEditor manages its own internal draft state.
 *
 * Data flow:
 *   parent `field` prop  →  initialises local `draft` on mount / field-id change
 *   user edits           →  update local `draft` only (no API)
 *                           also call `onUpdate(draft)` so parent stays in sync
 *   "Save Field" click   →  call `onSave(draft)` — parent does POST or PATCH
 *
 * State flags (on draft):
 *   _isNew      — field has never been persisted (no real id)
 *   _isDirty    — draft differs from last persisted state
 *   _isSaving   — API call in flight (driven by parent via prop)
 *   _hasErrors  — validation error map from backend or frontend
 */
function FieldEditor({
  field,          // canonical field state from parent
  sectionId,
  formId,
  onUpdate,       // (updatedField) => void  — pure local state, no API
  onSave,         // (updatedField) => void  — triggers POST/PATCH in parent
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  saving,         // global busy flag from parent
  onAddOption,
  onUpdateOption,
  onDeleteOption,
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // ── Internal draft state ───────────────────────────────────────────────────
  // Initialise from the field prop. Re-initialise only when the field's
  // identity changes (new temp_id or real id), not on every re-render.
  const fieldIdentity = field.id ?? field.temp_id;
  const prevIdentityRef = useRef(fieldIdentity);
  const [draft, setDraft] = useState(() => ({ ...field }));
  useEffect(() => {
    setDraft((prev) => ({
      ...prev,
      options: field.options || [],
    }));
  }, [field.options]);

  useEffect(() => {
    // When the field identity changes (e.g. after a successful POST that
    // replaces a temp field with a real one), re-sync draft from parent.
    if (prevIdentityRef.current !== fieldIdentity) {
      prevIdentityRef.current = fieldIdentity;
      setDraft({ ...field });
      return;
    }
    // Also sync error/saving flags that the parent writes back
    if (
      field._isSaving !== draft._isSaving ||
      field._hasErrors !== draft._hasErrors ||
      field._isDirty !== draft._isDirty
    ) {
      setDraft((prev) => ({
        ...prev,
        _isSaving: field._isSaving,
        _hasErrors: field._hasErrors,
        _isDirty: field._isDirty,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldIdentity, field._isSaving, field._hasErrors, field._isDirty]);

  // ── Draft mutation helper ──────────────────────────────────────────────────
  // Updates local draft AND notifies parent of the change (parent stores it
  // so siblings / section reorder etc. stay consistent).
  const set = (k, v) => {
    const updated = { ...draft, [k]: v, _isDirty: true };
    setDraft(updated);
    onUpdate(updated);
  };

  const setMany = (patch) => {
    const updated = { ...draft, ...patch, _isDirty: true };
    setDraft(updated);
    onUpdate(updated);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const isSystemField = !!draft.system_key;
  const hasOptions =
    ["select", "radio", "checkbox"].includes(
      draft.field_type
    );

  const hasStaticOptions =
    hasOptions &&
    draft.option_source !== "dynamic";
  const options = draft.options || [];
  const errors = draft._hasErrors || {};
  const isSaving = !!draft._isSaving;
  const isDirty = !!draft._isDirty;
  const isNew = !!draft._isNew;

  // ── System key change ─────────────────────────────────────────────────────
  const handleSystemKeyChange = (e) => {
    const selectedKey = e.target.value;

    const patch = {
      system_key: selectedKey,
      field_type: SYSTEM_FIELD_TYPES[selectedKey] || draft.field_type,
    };

    /*
     |--------------------------------------------------------------------------
     | Dynamic Sources Auto Mapping
     |--------------------------------------------------------------------------
     */

    if (selectedKey === "appointment_period") {
      patch.field_type = "select";
      patch.option_source = "dynamic";
      patch.dynamic_source = "appointment_periods";
      patch.settings = {};
      patch.options = [];
    }

    if (selectedKey === "service_ids") {
      patch.option_source = "dynamic";
      patch.dynamic_source = "services";
      patch.field_type = "select";

      patch.settings = {
        ...(draft.settings || {}),
        render_as: "services_picker",
      };
    }

    if (selectedKey === "service_category_id") {
      patch.option_source = "dynamic";
      patch.dynamic_source = "service_categories";
      patch.field_type = "select";
    }

    if (selectedKey === "job_id") {
      patch.option_source = "dynamic";
      patch.dynamic_source = "career_jobs";
      patch.field_type = "select";
    }

    if (!selectedKey) {
      patch.system_key = "";
      patch.option_source = "static";
      patch.dynamic_source = "";
    }

    setMany(patch);
  };

  // ── Option reorder (local only) ───────────────────────────────────────────
  const moveOption = (idx, dir) => {
    const opts = [...options];
    const target = idx + dir;
    if (target < 0 || target >= opts.length) return;
    [opts[idx], opts[target]] = [opts[target], opts[idx]];
    setMany({ options: opts });
  };

  // ── Save button handler ───────────────────────────────────────────────────
  const handleSaveClick = () => {
    if (isSaving) return;
    onSave(draft);
  };

  // ── Status label in header ────────────────────────────────────────────────
  const statusLabel = (() => {
    if (isSaving) return <span className="fb-field-status fb-field-status--saving">{t("cms.forms.field.saving")}</span>;
    if (Object.keys(errors).length > 0) return <span className="fb-field-status fb-field-status--error">{t("cms.forms.field.has_errors")}</span>;
    if (isNew) return <span className="fb-field-status fb-field-status--new">{t("cms.forms.field.unsaved")}</span>;
    if (isDirty) return <span className="fb-field-status fb-field-status--dirty">{t("cms.forms.field.unsaved_changes")}</span>;
    return null;
  })();

  const debouncedOptionUpdate = useRef(
    debounce((option) => {
      if (option?.id && onUpdateOption) {
        onUpdateOption(option);
      }
    }, 600)
  ).current;

  useEffect(() => {
    return () => {
      debouncedOptionUpdate.cancel();
    };
  }, [debouncedOptionUpdate]);

  return (
    <div className={`fb-field-editor ${!draft.is_active ? "fb-field-editor--inactive" : ""} ${isNew ? "fb-field-editor--new" : ""} ${Object.keys(errors).length > 0 ? "fb-field-editor--error" : ""}`}>
      {/* Field header bar */}
      <div className="fb-field-header">
        <div className="fb-field-header-left">
          <div className="fb-field-reorder">
            <button type="button" className="fb-micro-btn" onClick={onMoveUp} disabled={isFirst}><IconUp /></button>
            <button type="button" className="fb-micro-btn" onClick={onMoveDown} disabled={isLast}><IconDown /></button>
          </div>
          <span className={`fb-field-type-badge fb-field-type-badge--${draft.field_type}`}>
            {draft.field_type}
          </span>
          <span className="fb-field-key-label">
            {draft.system_key || draft.key || t("cms.forms.field.unnamed")}
          </span>
          {isSystemField && (
            <span className="fb-system-key-badge" title="System field">sys</span>
          )}
          {draft.required && <span className="fb-required-dot" title={t("cms.forms.field.required")}>*</span>}
          {!draft.is_active && <span className="fb-inactive-badge">{t("cms.forms.status.inactive")}</span>}
          {statusLabel}
        </div>
        <div className="fb-field-header-actions">
          <button type="button" className="fb-micro-btn" onClick={onDuplicate} title={t("cms.forms.actions.duplicate")}><IconCopy /></button>
          <button type="button" className="fb-micro-btn fb-micro-btn--danger" onClick={onDelete} title={t("cms.forms.actions.delete")} disabled={saving || isSaving}><IconTrash /></button>
          <button type="button" className="fb-micro-btn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? t("cms.forms.actions.expand") : t("cms.forms.actions.collapse")}>
            <IconChevron open={!collapsed} />
          </button>
        </div>
      </div>

      {/* Field body */}
      {!collapsed && (
        <div className="fb-field-body">
          {/* Inner tabs */}
          <div className="fb-field-tabs">
            {["basic", "labels", "validation"].map((tab) => (
              <button key={tab} type="button"
                className={`fb-field-tab ${activeTab === tab ? "fb-field-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}>
                {t(`cms.forms.field.tab_${tab}`)}
              </button>
            ))}
            {hasStaticOptions && (
              <button type="button"
                className={`fb-field-tab ${activeTab === "source" ? "fb-field-tab--active" : ""}`}
                onClick={() => setActiveTab("source")}>
                {t("cms.forms.field.tab_source")}
              </button>
            )}
            {hasStaticOptions && (
              <button type="button"
                className={`fb-field-tab ${activeTab === "options" ? "fb-field-tab--active" : ""}`}
                onClick={() => setActiveTab("options")}>
                {t("cms.forms.field.tab_options")} ({options.filter((o) => o.is_active !== false).length})
              </button>
            )}
          </div>

          {/* ── Basic tab ─────────────────────────────────────────── */}
          {activeTab === "basic" && (
            <div className="fb-field-tab-body">
              <div className="fb-form-row">
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.type")}</label>
                  <select className="fb-select"
                    value={draft.field_type}
                    disabled={!!draft.system_key}
                    onChange={(e) => set("field_type", e.target.value)}>
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft} value={ft}>{t(`cms.forms.field_types.${ft}`)}</option>
                    ))}
                  </select>
                  <FieldError message={errors.field_type} />
                </div>
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.system_key")}</label>
                  <select className="fb-select"
                    value={draft.system_key || ""}
                    onChange={handleSystemKeyChange}>
                    <option value="">{t("cms.forms.field.custom_field_option")}</option>
                    {SYSTEM_FIELD_KEYS.map((sk) => (
                      <option key={sk.value} value={sk.value}>{sk.label}</option>
                    ))}
                  </select>
                  <FieldError message={errors.system_key} />
                </div>
              </div>
              <div className="fb-form-row">
                {!isSystemField && (
                  <div className="fb-form-group">
                    <label className="fb-label fb-label--sm">{t("cms.forms.field.key")}</label>
                    <input className="fb-input fb-input--mono" dir="ltr"
                      value={draft.key || ""}
                      onChange={(e) => set("key", e.target.value)}
                      placeholder="custom_key" />
                    <FieldError message={errors.key} />
                  </div>
                )}
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.width")}</label>
                  <div className="fb-width-selector">
                    {WIDTH_OPTIONS.map((w) => (
                      <button key={w} type="button"
                        className={`fb-width-btn ${draft.width === w ? "fb-width-btn--active" : ""}`}
                        onClick={() => set("width", w)}>
                        {t(`cms.forms.width.${w}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="fb-form-group fb-form-group--toggles">
                  <label className="fb-toggle fb-toggle--sm">
                    <input type="checkbox" checked={!!draft.required}
                      onChange={(e) => set("required", e.target.checked)} />
                    <span className="fb-toggle-track"><span className="fb-toggle-thumb" /></span>
                    <span className="fb-toggle-label">{t("cms.forms.field.required")}</span>
                  </label>
                  <label className="fb-toggle fb-toggle--sm">
                    <input type="checkbox" checked={draft.is_active !== false}
                      onChange={(e) => set("is_active", e.target.checked)} />
                    <span className="fb-toggle-track"><span className="fb-toggle-thumb" /></span>
                    <span className="fb-toggle-label">{t("cms.forms.field.active")}</span>
                  </label>
                </div>
              </div>
              {draft.field_type === "phone" && (
                <PhoneFieldConfig
                  settings={draft.settings || {}}
                  onChange={(s) => set("settings", s)} />
              )}
              {draft.field_type === "file" && (
                <FileFieldConfig
                  validation={draft.validation_rules || {}}
                  onChange={(v) => set("validation_rules", v)} />
              )}
            </div>
          )}

          {/* ── Labels tab ────────────────────────────────────────── */}
          {activeTab === "labels" && (
            <div className="fb-field-tab-body">
              <div className="fb-form-row">
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">
                    {t("cms.forms.field.label_ar")}
                    <span className="fb-label-required"> *</span>
                  </label>
                  <input className={`fb-input ${errors.label_ar ? "fb-input--invalid" : ""}`} dir="rtl"
                    value={draft.label_ar || ""}
                    onChange={(e) => set("label_ar", e.target.value)}
                    placeholder={t("cms.forms.placeholders.field_label_ar")} />
                  <FieldError message={errors.label_ar} />
                </div>
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.label_en")}</label>
                  <input className="fb-input" dir="ltr"
                    value={draft.label_en || ""}
                    onChange={(e) => set("label_en", e.target.value)}
                    placeholder={t("cms.forms.placeholders.field_label_en")} />
                  <FieldError message={errors.label_en} />
                </div>
              </div>
              <div className="fb-form-row">
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.placeholder_ar")}</label>
                  <input className="fb-input" dir="rtl"
                    value={draft.placeholder_ar || ""}
                    onChange={(e) => set("placeholder_ar", e.target.value)} />
                </div>
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.placeholder_en")}</label>
                  <input className="fb-input" dir="ltr"
                    value={draft.placeholder_en || ""}
                    onChange={(e) => set("placeholder_en", e.target.value)} />
                </div>
              </div>
              <div className="fb-form-row">
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.help_ar")}</label>
                  <input className="fb-input" dir="rtl"
                    value={draft.help_text_ar || ""}
                    onChange={(e) => set("help_text_ar", e.target.value)} />
                </div>
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.help_en")}</label>
                  <input className="fb-input" dir="ltr"
                    value={draft.help_text_en || ""}
                    onChange={(e) => set("help_text_en", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── Validation tab ────────────────────────────────────── */}
          {activeTab === "validation" && (
            <div className="fb-field-tab-body">
              <ValidationBuilder
                fieldType={draft.field_type}
                validation={draft.validation_rules || {}}
                onChange={(v) => set("validation_rules", v)} />
              {!["text", "textarea", "number"].includes(draft.field_type) && (
                <p className="fb-hint-text">{t("cms.forms.validation.no_rules")}</p>
              )}
            </div>
          )}

          {/* ── Source tab ────────────────────────────────────────── */}
          {activeTab === "source" && hasOptions && (
            <div className="fb-field-tab-body">
              <div className="fb-form-group">
                <label className="fb-label fb-label--sm">{t("cms.forms.field.option_source")}</label>
                <select className="fb-select"
                  value={draft.option_source || "static"}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMany({
                      option_source: value,
                      dynamic_source: value === "dynamic"
                        ? draft.dynamic_source || "services"
                        : "",
                    });
                  }}>
                  <option value="static">{t("cms.forms.field.source_static")}</option>
                  <option value="dynamic">{t("cms.forms.field.source_dynamic")}</option>
                </select>
              </div>
              {draft.option_source === "dynamic" && (
                <div className="fb-form-group">
                  <label className="fb-label fb-label--sm">{t("cms.forms.field.dynamic_source")}</label>
                  <select className="fb-select"
                    value={draft.dynamic_source || ""}
                    onChange={(e) => set("dynamic_source", e.target.value)}>
                    <option value="service_categories">
                      {t("cms.forms.dynamic_sources.service_categories")}
                    </option>
                    <option value="services">{t("cms.forms.dynamic_sources.services")}</option>
                    <option value="appointment_slots">{t("cms.forms.dynamic_sources.appointment_slots")}</option>
                    <option value="career_jobs">{t("cms.forms.dynamic_sources.career_jobs")}</option>
                    <option value="appointment_slots">
                      {t("cms.forms.dynamic_sources.appointment_slots")}
                    </option>

                    <option value="appointment_periods">
                      Appointment Periods
                    </option>

                    <option value="career_jobs">
                      {t("cms.forms.dynamic_sources.career_jobs")}
                    </option>
                  </select>
                  <div className="fb-form-group">
                    <label className="fb-label fb-label--sm">
                      Depends On Field
                    </label>

                    <select
                      className="fb-select"
                      value={draft.settings?.depends_on || ""}
                      onChange={(e) =>
                        setMany({
                          settings: {
                            ...draft.settings,
                            depends_on: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">None</option>

                      <option value="appointment_date">
                        Appointment Date
                      </option>

                      <option value="service_category_id">
                        Service Category
                      </option>
                    </select>
                  </div>
                </div>
              )}
              {draft.option_source === "dynamic" && (
                <p className="fb-hint-text" style={{ marginTop: 12 }}>
                  {t("cms.forms.field.dynamic_source_hint")}
                </p>
              )}
            </div>
          )}

          {/* ── Options tab ───────────────────────────────────────── */}
          {activeTab === "options" &&
            hasOptions &&
            draft.option_source !== "dynamic" && (
              <div className="fb-field-tab-body">
                {isNew && (
                  <div className="fb-options-gate">
                    <p className="fb-hint-text">{t("cms.forms.errors.save_field_first")}</p>
                  </div>
                )}
                {!isNew && (
                  <>
                    <div className="fb-options-header">
                      <span className="fb-label fb-label--sm">{t("cms.forms.option.list_title")}</span>
                    </div>
                    <div className="fb-options-list">
                      {options.filter((o) => o.is_active !== false).map((opt, idx) => (
                        <OptionRow
                          key={opt.id || `new-${idx}`}
                          option={opt}
                          onUpdate={(updated) => {
                            const next = [...options];
                            const realIdx = options.indexOf(opt);
                            next[realIdx] = updated;
                            setMany({ options: next });
                            if (updated.id) {
                              debouncedOptionUpdate(updated);
                            }
                          }}
                          onDelete={() => {
                            const filteredOptions = options.filter((o) => {
                              if (opt.id) return o.id !== opt.id;
                              return o.temp_id !== opt.temp_id;
                            });

                            if (opt.id) {
                              onDeleteOption(opt.id, draft, filteredOptions);
                            } else {
                              setMany({ options: filteredOptions });
                            }
                          }}
                          onMoveUp={() => moveOption(options.indexOf(opt), -1)}
                          onMoveDown={() => moveOption(options.indexOf(opt), 1)}
                          isFirst={idx === 0}
                          isLast={idx === options.filter((o) => o.is_active !== false).length - 1}
                          saving={saving}
                        />
                      ))}
                    </div>
                    <button type="button" className="fb-btn fb-btn--add-option"
                      onClick={() => onAddOption(draft)}>
                      <IconPlus />
                      {t("cms.forms.option.add")}
                    </button>
                  </>
                )}
              </div>
            )}

          {/* ── Field footer: Save Field button ───────────────────── */}
          <div className="fb-field-actions">
            {/* Backend error summary (shown when errors come back from API) */}
            {Object.keys(errors).length > 0 && (
              <div className="fb-field-errors-summary">
                {Object.entries(errors).map(([key, msg]) => (
                  <p key={key} className="fb-field-error">
                    <strong>{key}:</strong>{" "}
                    {typeof msg === "object"
                      ? JSON.stringify(msg)
                      : Array.isArray(msg)
                        ? msg.join(", ")
                        : msg}
                  </p>
                ))}
              </div>
            )}
            <button
              type="button"
              className={`fb-btn fb-btn--primary fb-btn--save-field ${(!isDirty && !isNew) ? "fb-btn--saved" : ""}`}
              onClick={handleSaveClick}
              disabled={isSaving || saving || (!isDirty && !isNew)}
              title={(!isDirty && !isNew) ? t("cms.forms.field.already_saved") : t("cms.forms.actions.save_field")}
            >
              {isSaving ? (
                <>
                  <Spinner />
                  {t("cms.forms.field.saving")}
                </>
              ) : (!isDirty && !isNew) ? (
                <>
                  <IconSave />
                  {t("cms.forms.field.saved")}
                </>
              ) : (
                <>
                  <IconSave />
                  {t("cms.forms.actions.save_field")}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(FieldEditor);