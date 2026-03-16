import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const EMPTY_FORM = {
  type: "info",
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  description2_ar: "",
  description2_en: "",
  button_label_ar: "",
  button_label_en: "",
  order: 0,
  is_active: true,
};

export default function ContactCardsCMS() {
  const { t, i18n } = useTranslation();
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadCards = async () => {
    const res = await api.get("cms/admin/contact/cards/");
    setCards(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    loadCards();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.type) {
      toast.error(t("cms.contact.cards.errors.type_required"));
      return;
    }

    await api.post("cms/admin/contact/cards/", form);
    toast.success(t("cms.contact.cards.success.card_created"));
    setForm(EMPTY_FORM);
    loadCards();
  };

  const toggleActive = async (id, is_active) => {
    await api.patch(`cms/admin/contact/cards/${id}/`, {
      is_active: !is_active,
    });
    toast.success(t("cms.contact.cards.success.status_updated"));
    loadCards();
  };

  const remove = async (id) => {
    const result = await Swal.fire({
      title: t("cms.contact.cards.confirm_delete_title"),
      text: t("cms.contact.cards.confirm_delete_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.contact.cards.delete_button"),
      cancelButtonText: t("cms.contact.cards.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      await api.delete(`cms/admin/contact/cards/${id}/`);
      Swal.fire({
        title: t("cms.contact.cards.deleted_title"),
        text: t("cms.contact.cards.success.card_deleted"),
        icon: 'success',
        confirmButtonColor: '#22c55e',
      });
      loadCards();
    }
  };

  return (
    <>
      {/* ===== FORM ===== */}
      <div className="dashboard-contact-form-card">
        <div className="dashboard-contact-form-header">
          <div className="dashboard-contact-form-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H10V10H4V4ZM12 4H20V10H12V4ZM4 12H10V20H4V12ZM12 12H20V20H12V12Z" fill="currentColor"/>
            </svg>
            <h2>{t("cms.contact.cards.form_title")}</h2>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="dashboard-contact-form-section">
            <h3 className="dashboard-contact-section-title">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 2.25H4.5C3.675 2.25 3 2.925 3 3.75V14.25C3 15.075 3.675 15.75 4.5 15.75H13.5C14.325 15.75 15 15.075 15 14.25V3.75C15 2.925 14.325 2.25 13.5 2.25ZM13.5 14.25H4.5V3.75H13.5V14.25Z" fill="currentColor"/>
              </svg>
              {t("cms.contact.cards.section_card_settings")}
            </h3>

            <div className="dashboard-contact-form-grid">
              <div className="dashboard-contact-form-group">
                <label className="dashboard-contact-label">
                  {t("cms.contact.cards.fields.type")}
                </label>
                <select
                  className="dashboard-contact-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="info">{t("cms.contact.cards.types.info")}</option>
                  <option value="button">{t("cms.contact.cards.types.button")}</option>
                  <option value="form">{t("cms.contact.cards.types.form")}</option>
                  <option value="faq">{t("cms.contact.cards.types.faq")}</option>
                </select>
              </div>

              <div className="dashboard-contact-form-group">
                <label className="dashboard-contact-label">
                  {t("cms.contact.cards.fields.order")}
                </label>
                <input
                  className="dashboard-contact-input"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="dashboard-contact-form-grid-row">
              <div className="dashboard-contact-form-group">
                <label className="dashboard-contact-label">
                  {t("cms.contact.cards.fields.title_ar")}
                </label>
                <input
                  className="dashboard-contact-input"
                  placeholder={t("cms.contact.cards.placeholders.title_ar")}
                  value={form.title_ar}
                  onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="dashboard-contact-form-group">
                <label className="dashboard-contact-label">
                  {t("cms.contact.cards.fields.title_en")}
                </label>
                <input
                  className="dashboard-contact-input"
                  placeholder={t("cms.contact.cards.placeholders.title_en")}
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                />
              </div>
            </div>

            <div className="dashboard-contact-form-grid-row">
              <div className="dashboard-contact-form-group">
                <label className="dashboard-contact-label">
                  {t("cms.contact.cards.fields.description_ar")}
                </label>
                <textarea
                  className="dashboard-contact-textarea"
                  placeholder={t("cms.contact.cards.placeholders.description_ar")}
                  value={form.description_ar}
                  onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="dashboard-contact-form-group">
                <label className="dashboard-contact-label">
                  {t("cms.contact.cards.fields.description_en")}
                </label>
                <textarea
                  className="dashboard-contact-textarea"
                  placeholder={t("cms.contact.cards.placeholders.description_en")}
                  value={form.description_en}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                />
              </div>
            </div>

            {form.type === "button" && (
              <>
                <div className="dashboard-contact-form-grid-row">
                  <div className="dashboard-contact-form-group">
                    <label className="dashboard-contact-label">
                      {t("cms.contact.cards.fields.button_label_ar")}
                    </label>
                    <input
                      className="dashboard-contact-input"
                      placeholder={t("cms.contact.cards.placeholders.button_label_ar")}
                      value={form.button_label_ar}
                      onChange={(e) => setForm({ ...form, button_label_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>

                  <div className="dashboard-contact-form-group">
                    <label className="dashboard-contact-label">
                      {t("cms.contact.cards.fields.button_label_en")}
                    </label>
                    <input
                      className="dashboard-contact-input"
                      placeholder={t("cms.contact.cards.placeholders.button_label_en")}
                      value={form.button_label_en}
                      onChange={(e) => setForm({ ...form, button_label_en: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="dashboard-contact-checkbox-wrapper">
              <label className="dashboard-contact-checkbox-label">
                <input
                  type="checkbox"
                  className="dashboard-contact-checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <span className="dashboard-contact-checkbox-text">
                  {t("cms.contact.cards.fields.active")}
                </span>
              </label>
            </div>
          </div>

          <div className="dashboard-contact-form-actions">
            <button type="submit" className="dashboard-contact-btn-primary">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("cms.contact.cards.actions.save")}
            </button>
          </div>
        </form>
      </div>

      {/* ===== LIST ===== */}
      <div className="dashboard-contact-list-card">
        <div className="dashboard-contact-list-header">
          <div className="dashboard-contact-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-contact-list-title">
              {t("cms.contact.cards.list_title")}
            </h2>
          </div>
          <span className="dashboard-contact-count-badge">{cards.length}</span>
        </div>

        {cards.length === 0 ? (
          <div className="dashboard-contact-empty">
            {t("cms.contact.cards.empty")}
          </div>
        ) : (
          cards
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((c) => (
              <div key={c.id} className="dashboard-contact-card-item">
                <div className="dashboard-contact-card-info">
                  <span className="dashboard-contact-card-type">
                    {t(`cms.contact.cards.types.${c.type}`)}
                  </span>
                  <span className="dashboard-contact-card-title">
                    {i18n.language === 'ar' ? c.title_ar : c.title_en}
                  </span>
                </div>

                <div className="dashboard-contact-card-actions">
                  <button
                    className={`dashboard-contact-btn-toggle ${c.is_active ? '' : 'dashboard-contact-btn-inactive'}`}
                    onClick={() => toggleActive(c.id, c.is_active)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 13.5C4.96 13.5 2.5 11.04 2.5 8C2.5 4.96 4.96 2.5 8 2.5C11.04 2.5 13.5 4.96 13.5 8C13.5 11.04 11.04 13.5 8 13.5Z" fill="currentColor"/>
                    </svg>
                    {c.is_active
                      ? t("cms.contact.cards.actions.deactivate")
                      : t("cms.contact.cards.actions.activate")}
                  </button>
                  <button
                    className="dashboard-contact-btn-delete"
                    onClick={() => remove(c.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                    </svg>
                    {t("cms.contact.cards.actions.delete")}
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}