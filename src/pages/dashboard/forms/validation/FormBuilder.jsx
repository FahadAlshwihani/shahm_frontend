// src/pages/dashboard/components/forms/FormBuilder.jsx
import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { produce } from "immer";
import FormSettingsPanel from "../components/FormSettingsPanel";
import SectionEditor from "../components/SectionEditor";
import {
    createSection, updateSection, deleteSection,
    createField, updateField, deleteField,
    createOption, updateOption, deleteOption,
} from "../../../../api/formBuilderSectionApi.js";
import InfoSectionsEditor from "../components/InfoSectionsEditor";

const IconPlus = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);
const IconSave = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);
const IconBack = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const Spinner = () => (
    <span className="fb-spinner">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
                strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
        </svg>
    </span>
);

// Deep clone helper to avoid mutation
const clone = (obj) => structuredClone(obj);

// ── Key resolution helpers ─────────────────────────────────────────────────────
const slugifyKey = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "_")
        .replace(/-+/g, "_");

/**
 * Build the key-related portion of a field payload.
 *
 * Rules:
 *  - System field  → send { system_key } only; backend sets key = system_key.
 *  - Custom field  → send { key } derived from label or manual input; no system_key.
 */
const resolveKeyPayload = (field, fallbackLabel = "") => {
    if (field.system_key) {
        return { system_key: field.system_key };
    }
    const key = field.key?.trim();

    if (!key) {
        return {};
    }

    return {
        key: slugifyKey(key),
    };
};

export default function FormBuilder({
    form: initialForm,
    onSaveForm,
    onBack,
    saving,
    successResponses,
}) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "ar";

    // Local copy of the entire form tree
    const [formData, setFormData] = useState(() => clone(initialForm));
    useEffect(() => {
        setFormData(clone(initialForm));
    }, [initialForm?.id, initialForm?.updated_at]);

    const [activeView, setActiveView] = useState("builder");
    const [opSaving, setOpSaving] = useState(false);
    const pendingRef = useRef(false);

    const isBusy = saving || opSaving;

    // ── Helper: update local state ──────────────────────────────────────────────
    const updateLocalForm = useCallback((updater) => {
        setFormData((prev) =>
            produce(prev, (draft) => {
                updater(draft);
            })
        );
    }, []);

    // ── Top-level form settings save ───────────────────────────────────────────
    const handleSaveSettings = async () => {
        if (pendingRef.current) return;
        pendingRef.current = true;
        try {
            await onSaveForm(formData.id, {
                title_ar: formData.title_ar,
                title_en: formData.title_en,
                description_ar: formData.description_ar,
                description_en: formData.description_en,
                slug: formData.slug,
                is_active: formData.is_active,
                submit_button_text_ar: formData.submit_button_text_ar,
                submit_button_text_en: formData.submit_button_text_en,
                success_response_id: formData.success_response_id || null,
                requires_login: formData.requires_login,
                allow_multiple_submissions: formData.allow_multiple_submissions,
                context_type: formData.context_type || "generic",
                form_type: formData.form_type || "dynamic",
                terms_text_ar: formData.terms_text_ar,
                terms_text_en: formData.terms_text_en,
                require_terms_approval: formData.require_terms_approval,
            });
            toast.success(t("cms.forms.success.settings_saved"));
        } catch {
            toast.error(t("cms.forms.errors.save_failed"));
        } finally {
            pendingRef.current = false;
        }
    };

    // ── Section operations ─────────────────────────────────────────────────────
    const handleAddSection = async () => {
        setOpSaving(true);
        try {
            const payload = {
                title_ar: "",
                title_en: "",
                description_ar: "",
                description_en: "",
                order: (formData.sections || []).length,
                is_active: true,
            };
            const res = await createSection(formData.id, payload);
            updateLocalForm((f) => {
                f.sections = [...(f.sections || []), { ...res.data, fields: [] }];
            });
            toast.success(t("cms.forms.success.section_added"));
        } catch {
            toast.error(t("cms.forms.errors.section_failed"));
        } finally {
            setOpSaving(false);
        }
    };

    const handleUpdateSection = useCallback(async (section) => {
        // Optimistic local update
        updateLocalForm((f) => {
            const idx = f.sections.findIndex((s) => s.id === section.id);
            if (idx !== -1) f.sections[idx] = { ...f.sections[idx], ...section };
        });
        if (!section.id) return;
        try {
            await updateSection(section.id, {
                title_ar: section.title_ar,
                title_en: section.title_en,
                description_ar: section.description_ar,
                description_en: section.description_en,
                order: section.order,
                is_active: section.is_active,
            });
        } catch {
            toast.error(t("cms.forms.errors.section_failed"));
        }
    }, [updateLocalForm, t]);

    const handleDeleteSection = async (sectionId) => {
        setOpSaving(true);
        try {
            await deleteSection(sectionId);
            updateLocalForm((f) => {
                f.sections = f.sections.filter((s) => s.id !== sectionId);
            });
            toast.success(t("cms.forms.success.section_deleted"));
        } catch (err) {
            const msg = err?.response?.data?.detail || t("cms.forms.errors.section_failed");
            toast.error(msg);
        } finally {
            setOpSaving(false);
        }
    };

    const handleDuplicateSection = async (section) => {
        setOpSaving(true);
        try {
            const payload = {
                title_ar: `${section.title_ar} (${t("cms.forms.copy")})`,
                title_en: `${section.title_en} (copy)`,
                description_ar: section.description_ar,
                description_en: section.description_en,
                order: (formData.sections || []).length,
                is_active: section.is_active,
            };
            const res = await createSection(formData.id, payload);
            updateLocalForm((f) => {
                f.sections = [...(f.sections || []), { ...res.data, fields: [] }];
            });
            toast.success(t("cms.forms.success.section_added"));
        } catch {
            toast.error(t("cms.forms.errors.section_failed"));
        } finally {
            setOpSaving(false);
        }
    };

    // ── Field operations ───────────────────────────────────────────────────────

    /**
     * Add a local-only draft field. NO API call.
     */
    const handleAddField = (section, fieldType) => {
        const localField = {
            id: null,
            temp_id: crypto.randomUUID(),
            _isNew: true,
            _isDirty: true,
            _isSaving: false,
            _hasErrors: {},
            field_type: fieldType,
            key: "",
            system_key: "",
            label_ar: "",
            label_en: "",
            placeholder_ar: "",
            placeholder_en: "",
            help_text_ar: "",
            help_text_en: "",
            required: false,
            order: (section.fields || []).length,
            width: "full",
            validation_rules: {},
            settings: {},
            is_active: true,
            options: [],
            option_source: "static",
            dynamic_source: "",
        };

        updateLocalForm((f) => {
            const sec = f.sections.find((s) => s.id === section.id);
            if (!sec) return;
            sec.fields = [...(sec.fields || []), localField];
        });
    };

    /**
     * Pure local state update — NO API call.
     * Called by FieldEditor on every keystroke/toggle/change.
     */
    const handleUpdateField = useCallback((section, fieldIdx, updatedField) => {
        updateLocalForm((f) => {
            const sec = f.sections.find((s) => s.id === section.id);
            if (!sec) return;
            const idx = sec.fields.findIndex(
                (field) =>
                    (updatedField.id && field.id === updatedField.id) ||
                    (updatedField.temp_id && field.temp_id === updatedField.temp_id)
            );
            if (idx !== -1) {
                sec.fields[idx] = {
                    ...sec.fields[idx],
                    ...updatedField,
                    _isDirty: true,
                };
            }
        });
    }, [updateLocalForm]);

    /**
     * Explicit save — called only when user clicks "Save Field".
     * POSTs new fields, PATCHes existing ones.
     */
    const handleSaveField = useCallback(async (section, field) => {
        // ── Frontend validation ──────────────────────────────────────────────
        const errors = {};

        if (!field.field_type) {
            errors.field_type = t("cms.forms.errors.field_type_required");
        }
        if (
            ["select", "radio", "checkbox"].includes(field.field_type) &&
            field.option_source !== "dynamic" &&
            (!field.options || field.options.length === 0)
        ) {
            errors.options = t(
                "cms.forms.errors.options_required"
            );
        }
        if (!field.system_key && !field.key?.trim() && !field.label_en?.trim() && !field.label_ar?.trim()) {
            errors.key = t("cms.forms.errors.key_required");
        }

        if (Object.keys(errors).length > 0) {
            // Write errors back to local state so FieldEditor can display them
            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (!sec) return;
                const idx = sec.fields.findIndex(
                    (fld) =>
                        (field.id && fld.id === field.id) ||
                        (field.temp_id && fld.temp_id === field.temp_id)
                );
                if (idx !== -1) {
                    sec.fields[idx]._hasErrors = errors;
                }
            });
            // Show first error in toast
            toast.error(normalizeErrorMessage(errors));
            return;
        }

        // Mark as saving
        updateLocalForm((f) => {
            const sec = f.sections.find((s) => s.id === section.id);
            if (!sec) return;
            const idx = sec.fields.findIndex(
                (fld) =>
                    (field.id && fld.id === field.id) ||
                    (field.temp_id && fld.temp_id === field.temp_id)
            );
            if (idx !== -1) {
                sec.fields[idx]._isSaving = true;
                sec.fields[idx]._hasErrors = {};
            }
        });

        const fallbackLabel = field.label_en?.trim() || field.label_ar?.trim() || "";

        // ── POST (new field) ─────────────────────────────────────────────────
        if (!field.id) {
            try {
                const payload = {
                    section: section.id,
                    field_type: field.field_type,
                    ...resolveKeyPayload(field, fallbackLabel),
                    label_ar: field.label_ar || "",
                    label_en: field.label_en || "",
                    placeholder_ar: field.placeholder_ar || "",
                    placeholder_en: field.placeholder_en || "",
                    help_text_ar: field.help_text_ar || "",
                    help_text_en: field.help_text_en || "",
                    required: field.required || false,
                    order: field.order ?? 0,
                    width: field.width || "full",
                    validation_rules: field.validation_rules || {},
                    settings: field.settings || {},
                    option_source: field.option_source || "static",
                    dynamic_source: field.dynamic_source || "",
                    is_active: true,
                };

                const res = await createField(formData.id, payload);

                // Auto create appointment period options
                if (field.system_key === "appointment_period") {
                    const defaultOptions = [
                        {
                            label_ar: "صباحي",
                            label_en: "Morning",
                            value: "morning",
                            order: 0,
                            is_active: true,
                        },
                        {
                            label_ar: "مسائي",
                            label_en: "Evening",
                            value: "evening",
                            order: 1,
                            is_active: true,
                        },
                    ];

                    await Promise.all(
                        defaultOptions.map((option) =>
                            createOption(res.data.id, option)
                        )
                    );

                    // reload field with options
                    res.data.options = defaultOptions;
                }

                // Replace temp draft with persisted data from server
                updateLocalForm((f) => {
                    const sec = f.sections.find((s) => s.id === section.id);
                    if (!sec) return;
                    const idx = sec.fields.findIndex(
                        (fld) => fld.temp_id === field.temp_id
                    );
                    if (idx !== -1) {
                        sec.fields[idx] = {
                            ...res.data,
                            options: res.data.options || [],
                            _isNew: false,
                            _isDirty: false,
                            _isSaving: false,
                            _hasErrors: {},
                        };
                    }
                });

                toast.success(t("cms.forms.success.field_saved"));
            } catch (err) {
                const errors = err?.response?.data || {};
                const msg = normalizeErrorMessage(
                    errors,
                    t("cms.forms.errors.field_failed")
                );
                toast.error(msg);

                updateLocalForm((f) => {
                    const sec = f.sections.find((s) => s.id === section.id);
                    if (!sec) return;
                    const idx = sec.fields.findIndex((fld) => fld.temp_id === field.temp_id);
                    if (idx !== -1) {
                        sec.fields[idx]._isSaving = false;
                        sec.fields[idx]._hasErrors = errors;
                    }
                });
            }
            return;
        }

        // ── PATCH (existing field) ───────────────────────────────────────────
        try {
            const res = await updateField(field.id, {
                field_type: field.field_type,
                ...resolveKeyPayload(field, fallbackLabel),
                label_ar: field.label_ar,
                label_en: field.label_en,
                placeholder_ar: field.placeholder_ar,
                placeholder_en: field.placeholder_en,
                help_text_ar: field.help_text_ar,
                help_text_en: field.help_text_en,
                required: field.required,
                order: field.order,
                width: field.width,
                validation_rules: field.validation_rules || {},
                settings: field.settings || {},
                option_source: field.option_source || "static",
                dynamic_source: field.dynamic_source || "",
                is_active: field.is_active,
            });

            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (!sec) return;
                const idx = sec.fields.findIndex((fld) => fld.id === field.id);
                if (idx !== -1) {
                    sec.fields[idx] = {
                        ...sec.fields[idx],
                        ...res.data,
                        options: res.data.options || sec.fields[idx].options || [],
                        _isDirty: false,
                        _isSaving: false,
                        _hasErrors: {},
                    };
                }
            });

            toast.success(t("cms.forms.success.field_saved"));
        } catch (err) {
            const errors = err?.response?.data || {};
            const msg = Object.values(errors).flat().join(", ") || t("cms.forms.errors.field_failed");
            toast.error(msg);

            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (!sec) return;
                const idx = sec.fields.findIndex((fld) => fld.id === field.id);
                if (idx !== -1) {
                    sec.fields[idx]._isSaving = false;
                    sec.fields[idx]._hasErrors = errors;
                }
            });
        }
    }, [updateLocalForm, formData.id, t]);

    const handleDeleteField = async (section, fieldIdx, field) => {
        if (!field.id) {
            // Local draft — just remove from state, no API call needed
            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (sec) sec.fields.splice(fieldIdx, 1);
            });
            return;
        }
        setOpSaving(true);
        try {
            await deleteField(field.id);
            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (sec) {
                    const existing = sec.fields[fieldIdx];
                    if (existing) existing.is_active = false;
                }
            });
            toast.success(t("cms.forms.success.field_deleted"));
        } catch (err) {
            toast.error(err?.response?.data?.detail || t("cms.forms.errors.field_failed"));
        } finally {
            setOpSaving(false);
        }
    };

    const handleDuplicateField = async (section, dupField) => {
        setOpSaving(true);
        try {
            const payload = {
                section: section.id,
                field_type: dupField.field_type,
                key: `${dupField.key || dupField.system_key || "field"}_copy`,
                system_key: "",
                label_ar: dupField.label_ar,
                label_en: dupField.label_en,
                placeholder_ar: dupField.placeholder_ar,
                placeholder_en: dupField.placeholder_en,
                help_text_ar: dupField.help_text_ar,
                help_text_en: dupField.help_text_en,
                required: dupField.required,
                order: (section.fields || []).length,
                width: dupField.width,
                validation_rules: dupField.validation_rules || {},
                settings: dupField.settings || {},
                is_active: true,
            };
            const res = await createField(formData.id, payload);
            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (sec) {
                    sec.fields = [
                        ...(sec.fields || []),
                        {
                            ...res.data,
                            options: [],
                            _isNew: false,
                            _isDirty: false,
                            _isSaving: false,
                            _hasErrors: {},
                        },
                    ];
                }
            });
            toast.success(t("cms.forms.success.field_saved"));
        } catch {
            toast.error(t("cms.forms.errors.field_failed"));
        } finally {
            setOpSaving(false);
        }
    };

    // ── Option operations ──────────────────────────────────────────────────────
    const handleAddOption = async (section, field) => {
        if (!field.id) {
            toast.error(t("cms.forms.errors.save_field_first"));
            return;
        }
        setOpSaving(true);
        try {
            const payload = {
                field: field.id,
                label_ar: "Option",
                label_en: "Option",
                value: "",
                order: (field.options || []).length,
                is_active: true,
            };
            const res = await createOption(field.id, payload);
            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (!sec) return;
                const fld = sec.fields.find((ff) => ff.id === field.id);
                if (fld) {
                    fld.options = [...(fld.options || []), res.data];
                }
            });
        } catch {
            toast.error(t("cms.forms.errors.option_failed"));
        } finally {
            setOpSaving(false);
        }
    };

    const handleUpdateOption = useCallback(async (option) => {
        if (!option.id) return;
        try {
            await updateOption(option.id, {
                label_ar: option.label_ar,
                label_en: option.label_en,
                value: option.value,
                order: option.order,
                is_active: option.is_active,
            });
        } catch {
            toast.error(t("cms.forms.errors.option_failed"));
        }
    }, [t]);

    const handleDeleteOption = async (section, field, optionId, newOptions) => {
        setOpSaving(true);
        try {
            await deleteOption(optionId);
            updateLocalForm((f) => {
                const sec = f.sections.find((s) => s.id === section.id);
                if (!sec) return;
                const fld = sec.fields.find((ff) => ff.id === field.id);
                if (fld) {
                    fld.options = [...newOptions];
                }
            });
        } catch {
            toast.error(t("cms.forms.errors.option_failed"));
        } finally {
            setOpSaving(false);
        }
    };

    const sections = formData.sections || [];

    const normalizeErrorMessage = (errors, fallback = "Something went wrong") => {
        if (!errors) return fallback;

        // string مباشرة
        if (typeof errors === "string") return errors;

        // array
        if (Array.isArray(errors)) {
            return errors
                .map((item) =>
                    typeof item === "string"
                        ? item
                        : JSON.stringify(item)
                )
                .join(", ");
        }

        // object
        if (typeof errors === "object") {
            return Object.entries(errors)
                .map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return `${key}: ${value.join(", ")}`;
                    }

                    if (typeof value === "object") {
                        return `${key}: ${JSON.stringify(value)}`;
                    }

                    return `${key}: ${value}`;
                })
                .join(" | ");
        }

        return fallback;
    };

    return (
        <div className="fb-builder-root">
            {/* Sticky top bar */}
            <div className="fb-builder-topbar">
                <div className="fb-builder-topbar-left">
                    <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={onBack} type="button">
                        <IconBack />
                        {t("cms.forms.actions.back")}
                    </button>
                    <div className="fb-builder-form-name">
                        <span className="fb-builder-form-title">{formData.title_ar || formData.title_en}</span>
                        <code className="fb-slug-chip fb-slug-chip--sm">{formData.slug}</code>
                    </div>
                </div>
                <div className="fb-builder-topbar-right">
                    <div className="fb-view-tabs">
                        <button type="button"
                            className={`fb-view-tab ${activeView === "builder" ? "fb-view-tab--active" : ""}`}
                            onClick={() => setActiveView("builder")}>
                            {t("cms.forms.view.builder")}
                        </button>
                        <button type="button"
                            className={`fb-view-tab ${activeView === "settings" ? "fb-view-tab--active" : ""}`}
                            onClick={() => setActiveView("settings")}>
                            {t("cms.forms.view.settings")}
                        </button>
                    </div>
                    <button className="fb-btn fb-btn--primary" onClick={handleSaveSettings} disabled={isBusy} type="button">
                        {isBusy ? <Spinner /> : <IconSave />}
                        {t("cms.forms.actions.save")}
                    </button>
                </div>
            </div>

            {/* Builder view */}
            {activeView === "builder" &&
                (formData.form_type === "dynamic" ||
                    !formData.form_type) && (
                    <div className="fb-builder-body">
                        {sections.length === 0 ? (
                            <div className="fb-sections-empty">
                                <div className="fb-empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <rect x="8" y="8" width="32" height="10" rx="3" stroke="currentColor" strokeWidth="2" opacity=".3" />
                                        <rect x="8" y="24" width="32" height="16" rx="3" stroke="currentColor" strokeWidth="2" opacity=".2" />
                                        <path d="M20 32h8M24 28v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".4" />
                                    </svg>
                                </div>
                                <p className="fb-empty-title">{t("cms.forms.section.empty_title")}</p>
                                <p className="fb-empty-subtitle">{t("cms.forms.section.empty_subtitle")}</p>
                                <button type="button" className="fb-btn fb-btn--primary" onClick={handleAddSection} disabled={isBusy}>
                                    <IconPlus />
                                    {t("cms.forms.actions.add_section")}
                                </button>
                            </div>
                        ) : (
                            <>
                                {sections.map((section, sIdx) => (
                                    <SectionEditor
                                        key={section.id ?? section.temp_id}
                                        section={section}
                                        formId={formData.id}
                                        sectionIndex={sIdx}
                                        totalSections={sections.length}
                                        onUpdateSection={handleUpdateSection}
                                        onDeleteSection={() => handleDeleteSection(section.id)}
                                        onDuplicateSection={() => handleDuplicateSection(section)}
                                        onMoveSectionUp={async () => {
                                            if (sIdx === 0) return;

                                            const reordered = [...sections];

                                            [reordered[sIdx], reordered[sIdx - 1]] = [
                                                reordered[sIdx - 1],
                                                reordered[sIdx],
                                            ];

                                            reordered.forEach((sec, idx) => {
                                                sec.order = idx;
                                            });

                                            updateLocalForm((f) => {
                                                f.sections = reordered;
                                            });

                                            try {
                                                await Promise.all(
                                                    reordered
                                                        .filter((sec) => sec.id)
                                                        .map((sec) =>
                                                            updateSection(sec.id, {
                                                                title_ar: sec.title_ar,
                                                                title_en: sec.title_en,
                                                                description_ar: sec.description_ar,
                                                                description_en: sec.description_en,
                                                                order: sec.order,
                                                                is_active: sec.is_active,
                                                            })
                                                        )
                                                );
                                            } catch {
                                                toast.error(t("cms.forms.errors.section_failed"));
                                            }
                                        }}
                                        onMoveSectionDown={async () => {
                                            if (sIdx >= sections.length - 1) return;

                                            const reordered = [...sections];

                                            [reordered[sIdx], reordered[sIdx + 1]] = [
                                                reordered[sIdx + 1],
                                                reordered[sIdx],
                                            ];

                                            reordered.forEach((sec, idx) => {
                                                sec.order = idx;
                                            });

                                            updateLocalForm((f) => {
                                                f.sections = reordered;
                                            });

                                            try {
                                                await Promise.all(
                                                    reordered
                                                        .filter((sec) => sec.id)
                                                        .map((sec) =>
                                                            updateSection(sec.id, {
                                                                title_ar: sec.title_ar,
                                                                title_en: sec.title_en,
                                                                description_ar: sec.description_ar,
                                                                description_en: sec.description_en,
                                                                order: sec.order,
                                                                is_active: sec.is_active,
                                                            })
                                                        )
                                                );
                                            } catch {
                                                toast.error(t("cms.forms.errors.section_failed"));
                                            }
                                        }}
                                        onAddField={handleAddField}
                                        onUpdateField={handleUpdateField}
                                        onSaveField={handleSaveField}
                                        onDeleteField={handleDeleteField}
                                        onDuplicateField={handleDuplicateField}
                                        onAddOption={handleAddOption}
                                        onUpdateOption={handleUpdateOption}
                                        onDeleteOption={handleDeleteOption}
                                        saving={isBusy}
                                    />
                                ))}
                                <button type="button" className="fb-btn fb-btn--add-section" onClick={handleAddSection} disabled={isBusy}>
                                    <IconPlus />
                                    {t("cms.forms.actions.add_section")}
                                </button>
                            </>
                        )}
                    </div>
                )}
            {activeView === "builder" &&
                formData.form_type === "info" && (
                    <InfoSectionsEditor
                        form={formData}
                        onAddSection={handleAddSection}
                        onUpdateSection={handleUpdateSection}
                        onDeleteSection={handleDeleteSection}
                    />
                )}

            {/* Settings view */}
            {activeView === "settings" && (
                <div className="fb-settings-view">
                    <FormSettingsPanel
                        data={formData}
                        successResponses={successResponses}
                        onChange={(updated) => setFormData(updated)}
                    />
                    <div className="fb-settings-save-bar">
                        <button className="fb-btn fb-btn--primary" onClick={handleSaveSettings} disabled={isBusy} type="button">
                            {isBusy ? <Spinner /> : <IconSave />}
                            {t("cms.forms.actions.save")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}