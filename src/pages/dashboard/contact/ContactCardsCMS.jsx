// src/pages/dashboard/contact/ContactCardsCMS.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import { API_PATHS } from "../../../api/routes";
import toast from "react-hot-toast";
import { useSweetAlert } from "../../../components/common/SweetAlert";
import Editbtn   from "../../../components/common/dashboard/Editbtn";
import Deletebtn from "../../../components/common/dashboard/Deletebtn";
import {
  BilingualField,
  DraftNotice,
  FieldRow,
  SaveBar,
} from "../../../components/forms/cms";
import useFormDraft from "../../../hooks/useFormDraft";
import useResourceForm from "../../../hooks/useResourceForm";
import { parseApiError } from "../../../utils/apiErrors";
import "../../../styles/forms/cms-form.css";

/* ── Icons ──────────────────────────────────────────────────── */
const IcoCards = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" fill="currentColor"/>
  </svg>
);
const IcoSettings = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M13.5 2.25H4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zm0 12H4.5V3.75h9v10.5z" fill="currentColor"/>
  </svg>
);
const IcoPrimary = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="5" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 9h6M8 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IcoSecondary = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="5" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 9h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IcoList = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M2 3h14v2H2V3zm0 4h14v2H2V7zm0 4h14v2H2v-2zm0 4h9v2H2v-2z" fill="currentColor"/>
  </svg>
);
const IcoToggle = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="5" width="14" height="6" rx="3" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="11" cy="8" r="2" fill="currentColor"/>
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12 2L2 12M2 2l10 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const EMPTY_FORM = {
  type: "default",
  title_ar: "", title_en: "",
  subtitle_ar: "", subtitle_en: "",
  description_ar: "", description_en: "",
  primary_button_label_ar: "", primary_button_label_en: "",
  primary_action_type: "none",
  primary_url: "", primary_form: "", primary_info_modal_id: "",
  secondary_button_label_ar: "", secondary_button_label_en: "",
  secondary_action_type: "none",
  secondary_url: "", secondary_form: "", secondary_info_modal_id: "",
  order: 0,
  is_active: true,
};

/* ── Action target, shown only for the action types that need one ──
   Declared at module level. While it lived inside the screen component React
   saw a new component type on every keystroke and remounted the input, so the
   field lost focus after each character typed into it. */
function ActionField({ prefix, values, errors, forms, infoModals, onChange, t }) {
  const actionType = values[`${prefix}_action_type`];

  if (actionType === "url") {
    const name = `${prefix}_url`;
    return (
      <FieldRow label={t("cms.contact.cards.fields.url")} htmlFor={name} error={errors[name]}>
        <input
          id={name}
          data-field={name}
          className="sf-control"
          dir="ltr"
          value={values[name]}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder="https://…"
        />
      </FieldRow>
    );
  }

  if (actionType === "form_modal") {
    const name = `${prefix}_form`;
    return (
      <FieldRow label={t("cms.contact.cards.fields.form")} htmlFor={name} error={errors[name]}>
        <select
          id={name}
          data-field={name}
          className="sf-control"
          value={values[name]}
          onChange={(e) => onChange(name, e.target.value)}
        >
          <option value="">{t("cms.contact.cards.options.select_form")}</option>
          {forms.map((f) => <option key={f.id} value={f.id}>{f.title_en || f.title_ar}</option>)}
        </select>
      </FieldRow>
    );
  }

  if (actionType === "info_modal") {
    const name = `${prefix}_info_modal_id`;
    return (
      <FieldRow label={t("cms.contact.cards.fields.info_modal")} htmlFor={name} error={errors[name]}>
        <select
          id={name}
          data-field={name}
          className="sf-control"
          value={values[name]}
          onChange={(e) => onChange(name, e.target.value)}
        >
          <option value="">{t("cms.contact.cards.options.select_info_modal")}</option>
          {infoModals.map((m) => <option key={m.id} value={m.id}>{m.title_en || m.title_ar}</option>)}
        </select>
      </FieldRow>
    );
  }

  return null;
}

export default function ContactCardsCMS() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetEl } = useSweetAlert();

  const [cards,      setCards]      = useState([]);
  const [forms,      setForms]      = useState([]);
  const [infoModals, setInfoModals] = useState([]);
  const [editingId,  setEditingId]  = useState(null);

  const loadCards = useCallback(async () => {
    try {
      const [cardsRes, formsRes, infoModalsRes] = await Promise.all([
        api.get(API_PATHS.cms.contactCards),
        api.get(API_PATHS.forms.admin),
        api.get(API_PATHS.forms.infoModals),
      ]);
      setCards(Array.isArray(cardsRes.data)      ? cardsRes.data      : []);
      setForms(Array.isArray(formsRes.data)      ? formsRes.data      : []);
      setInfoModals(Array.isArray(infoModalsRes.data) ? infoModalsRes.data : []);
    } catch (error) {
      if (!parseApiError(error).canceled) toast.error(t("cms.contact.error.load_failed"));
    }
  }, [t]);

  useEffect(() => { loadCards(); }, [loadCards]);

  const saveCard = useCallback(async (payload) => {
    if (editingId) {
      await api.patch(API_PATHS.cms.contactCard(editingId), payload);
      toast.success(t("cms.contact.cards.success.card_updated"));
    } else {
      await api.post(API_PATHS.cms.contactCards, payload);
      toast.success(t("cms.contact.cards.success.card_created"));
    }
    return true;
  }, [editingId, t]);

  const {
    values,
    setField,
    setValues,
    reset,
    dirty,
    saving,
    errors,
    formError,
    submit,
  } = useResourceForm({ initialValues: EMPTY_FORM, onSubmit: saveCard });

  const draftKey = editingId ? `contact-cards:${editingId}` : "contact-cards:new";
  const { draft, restore, discard, clear } = useFormDraft({
    key: draftKey,
    values,
    dirty,
  });

  const handleSubmit = async (event) => {
    const saved = await submit(event);

    if (!saved) return;

    clear();
    reset(EMPTY_FORM);
    setEditingId(null);
    loadCards();
  };

  const cancelEdit = () => {
    clear();
    reset(EMPTY_FORM);
    setEditingId(null);
  };

  const toggleActive = async (id, is_active) => {
    try {
      await api.patch(API_PATHS.cms.contactCard(id), { is_active: !is_active });
      toast.success(t("cms.contact.cards.success.status_updated"));
      loadCards();
    } catch (error) {
      const parsed = parseApiError(error);
      if (!parsed.canceled) toast.error(parsed.message || t("cms.contact.error.save_failed"));
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setValues({
      type: c.type || "default",
      title_ar: c.title_ar || "", title_en: c.title_en || "",
      subtitle_ar: c.subtitle_ar || "", subtitle_en: c.subtitle_en || "",
      description_ar: c.description_ar || "", description_en: c.description_en || "",
      primary_button_label_ar:  c.primary_button_label_ar  || "",
      primary_button_label_en:  c.primary_button_label_en  || "",
      primary_action_type:      c.primary_action_type      || "none",
      primary_url:              c.primary_url              || "",
      primary_form:             c.primary_form             || "",
      primary_info_modal_id:    c.primary_info_modal_id    || "",
      secondary_button_label_ar: c.secondary_button_label_ar || "",
      secondary_button_label_en: c.secondary_button_label_en || "",
      secondary_action_type:     c.secondary_action_type     || "none",
      secondary_url:             c.secondary_url             || "",
      secondary_form:            c.secondary_form            || "",
      secondary_info_modal_id:   c.secondary_info_modal_id   || "",
      order:     c.order     ?? 0,
      is_active: c.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    await api.delete(API_PATHS.cms.contactCard(id));
    toast.success(t("cms.contact.cards.success.card_deleted"));
    loadCards();
  };

  const actionOptions = (
    <>
      <option value="none">{t("cms.contact.cards.options.action_none")}</option>
      <option value="url">{t("cms.contact.cards.options.action_url")}</option>
      <option value="form_modal">{t("cms.contact.cards.options.action_form_modal")}</option>
      <option value="contact_request">{t("cms.contact.cards.options.action_contact_request")}</option>
      <option value="info_modal">{t("cms.contact.cards.options.action_info_modal")}</option>
    </>
  );

  return (
    <div className="cnt-section-content">
      {sweetEl}

      {/* ── Section header ── */}
      <div className="cnt-section-header">
        <span className="cnt-section-icon cnt-section-icon--purple"><IcoCards /></span>
        <div>
          <h2 className="cnt-section-title">{t("cms.contact.cards.section_heading")}</h2>
          <p className="cnt-section-subtitle">{t("cms.contact.cards.section_subtitle")}</p>
        </div>
      </div>

      {/* ── FORM CARD ── */}
      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon cnt-card-icon--purple"><IcoCards /></span>
          <h3 className="cnt-card-title">
            {editingId ? t("cms.contact.cards.form_edit") : t("cms.contact.cards.form_title")}
          </h3>
          {editingId && (
            <button className="cnt-btn-icon cnt-btn-icon--ghost" onClick={cancelEdit} type="button"
              style={{ marginInlineStart:"auto" }} title={t("cms.contact.actions.cancel")}>
              <IcoX />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="cnt-form">

          <DraftNotice
            draft={draft}
            onRestore={() => {
              const restored = restore();
              if (restored) setValues(restored, { asBaseline: false });
            }}
            onDiscard={discard}
          />

          {/* ── Card settings ── */}
          <div className="cnt-form-section">
            <div className="cnt-form-section-heading">
              <IcoSettings />
              {t("cms.contact.cards.section_card_settings")}
            </div>

            <div className="cnt-form-row cnt-form-row--2col">
              <FieldRow label={t("cms.contact.cards.fields.type")} htmlFor="card-type" error={errors.type}>
                <select
                  id="card-type"
                  data-field="type"
                  className="sf-control"
                  value={values.type}
                  onChange={(e) => setField("type", e.target.value)}
                >
                  <option value="default">{t("cms.contact.cards.options.type_default")}</option>
                  <option value="faq_preview">{t("cms.contact.cards.options.type_faq")}</option>
                </select>
              </FieldRow>

              <FieldRow label={t("cms.contact.cards.fields.order")} htmlFor="card-order" error={errors.order}>
                <input
                  id="card-order"
                  data-field="order"
                  className="sf-control"
                  type="number"
                  min="0"
                  value={values.order}
                  onChange={(e) => setField("order", Number(e.target.value))}
                  placeholder="0"
                />
              </FieldRow>
            </div>

            <div className="cnt-form-row">
              <BilingualField
                label={t("cms.contact.cards.fields.title_ar")}
                name="title"
                values={values}
                errors={errors}
                onChange={setField}
                placeholder={t("cms.contact.cards.placeholders.title_ar")}
                placeholderEn={t("cms.contact.cards.placeholders.title_en")}
              />
            </div>

            <div className="cnt-form-row">
              <BilingualField
                label={t("cms.contact.cards.fields.subtitle_ar")}
                name="subtitle"
                values={values}
                errors={errors}
                onChange={setField}
                placeholder={t("cms.contact.cards.placeholders.subtitle_ar")}
                placeholderEn={t("cms.contact.cards.placeholders.subtitle_en")}
              />
            </div>

            <div className="cnt-form-row">
              <BilingualField
                label={t("cms.contact.cards.fields.description_ar")}
                name="description"
                as="textarea"
                values={values}
                errors={errors}
                onChange={setField}
                placeholder={t("cms.contact.cards.placeholders.description_ar")}
                placeholderEn={t("cms.contact.cards.placeholders.description_en")}
              />
            </div>
          </div>

          {/* ── Primary button ── */}
          <div className="cnt-form-section">
            <div className="cnt-form-section-heading">
              <IcoPrimary />
              {t("cms.contact.cards.section_primary_btn")}
            </div>

            <div className="cnt-form-row">
              <BilingualField
                label={t("cms.contact.cards.fields.btn_label_ar")}
                name="primary_button_label"
                values={values}
                errors={errors}
                onChange={setField}
                placeholder={t("cms.contact.cards.placeholders.btn_label_ar")}
                placeholderEn={t("cms.contact.cards.placeholders.btn_label_en")}
              />
            </div>

            <div className="cnt-form-row cnt-form-row--2col">
              <FieldRow
                label={t("cms.contact.cards.fields.action_type")}
                htmlFor="primary-action"
                error={errors.primary_action_type}
              >
                <select
                  id="primary-action"
                  data-field="primary_action_type"
                  className="sf-control"
                  value={values.primary_action_type}
                  onChange={(e) => setField("primary_action_type", e.target.value)}
                >
                  {actionOptions}
                </select>
              </FieldRow>

              <ActionField
                prefix="primary"
                values={values}
                errors={errors}
                forms={forms}
                infoModals={infoModals}
                onChange={setField}
                t={t}
              />
            </div>
          </div>

          {/* ── Secondary button ── */}
          <div className="cnt-form-section">
            <div className="cnt-form-section-heading">
              <IcoSecondary />
              {t("cms.contact.cards.section_secondary_btn")}
            </div>

            <div className="cnt-form-row">
              <BilingualField
                label={t("cms.contact.cards.fields.btn_label_ar")}
                name="secondary_button_label"
                values={values}
                errors={errors}
                onChange={setField}
                placeholder={t("cms.contact.cards.placeholders.btn_label_ar")}
                placeholderEn={t("cms.contact.cards.placeholders.btn_label_en")}
              />
            </div>

            <div className="cnt-form-row cnt-form-row--2col">
              <FieldRow
                label={t("cms.contact.cards.fields.action_type")}
                htmlFor="secondary-action"
                error={errors.secondary_action_type}
              >
                <select
                  id="secondary-action"
                  data-field="secondary_action_type"
                  className="sf-control"
                  value={values.secondary_action_type}
                  onChange={(e) => setField("secondary_action_type", e.target.value)}
                >
                  {actionOptions}
                </select>
              </FieldRow>

              <ActionField
                prefix="secondary"
                values={values}
                errors={errors}
                forms={forms}
                infoModals={infoModals}
                onChange={setField}
                t={t}
              />
            </div>
          </div>

          {/* ── Active toggle ── */}
          <div className="cnt-checkbox-wrapper">
            <label className="cnt-checkbox-label">
              <input type="checkbox" className="cnt-checkbox"
                checked={values.is_active}
                onChange={(e) => setField("is_active", e.target.checked)} />
              <span className="cnt-checkbox-text">{t("cms.contact.cards.fields.active")}</span>
            </label>
          </div>

          <SaveBar
            dirty={dirty}
            saving={saving}
            formError={formError}
            onCancel={editingId ? cancelEdit : null}
            cancelLabel={t("cms.contact.actions.cancel")}
            savingLabel={t("cms.contact.actions.saving")}
            submitLabel={
              editingId
                ? t("cms.contact.cards.actions.update")
                : t("cms.contact.cards.actions.save")
            }
          />
        </form>
      </div>

      {/* ── LIST CARD ── */}
      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon cnt-card-icon--blue"><IcoList /></span>
          <h3 className="cnt-card-title">{t("cms.contact.cards.list_title")}</h3>
          <span className="cnt-count-badge" style={{ marginInlineStart:"auto" }}>{cards.length}</span>
        </div>

        {cards.length === 0 ? (
          <div className="cnt-empty">{t("cms.contact.cards.empty")}</div>
        ) : (
          <div className="cnt-list">
            {cards
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((c) => (
                <div key={c.id} className="cnt-list-item">
                  <div className="cnt-list-item-info">
                    <span className="cnt-type-badge">{c.type}</span>
                    <span className="cnt-list-item-title">
                      {isRtl ? c.title_ar : c.title_en}
                    </span>
                    <span className={`cnt-status-badge${c.is_active ? " cnt-status-badge--active" : " cnt-status-badge--inactive"}`}>
                      <span className="cnt-status-dot"/>
                      {c.is_active ? t("common.active") : t("common.inactive")}
                    </span>
                  </div>
                  <div className="cnt-list-item-actions">
                    {/* Toggle active */}
                    <button
                      className={`cnt-btn cnt-btn--sm${c.is_active ? " cnt-btn--amber" : " cnt-btn--green"}`}
                      onClick={() => toggleActive(c.id, c.is_active)}
                      type="button"
                    >
                      <IcoToggle />
                      {c.is_active ? t("cms.contact.cards.actions.deactivate") : t("cms.contact.cards.actions.activate")}
                    </button>
                    {/* Edit — global Editbtn */}
                    <Editbtn
                      onClick={() => startEdit(c)}
                      className="cnt-btn cnt-btn--sm cnt-btn--edit"
                      iconOnly={false}
                      label={t("cms.contact.cards.actions.edit")}
                    />
                    {/* Delete — global Deletebtn with built-in confirm */}
                    <Deletebtn
                      onConfirm={() => remove(c.id)}
                      confirmTitle={t("cms.contact.cards.confirm_delete_title")}
                      confirmMessage={t("cms.contact.cards.confirm_delete_text")}
                      className="cnt-btn cnt-btn--sm cnt-btn--danger"
                      iconOnly={false}
                      label={t("cms.contact.cards.actions.delete")}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
}
