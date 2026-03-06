import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

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
  url: "",
  order: 0,
  is_active: true,
};

export default function ContactCardsCMS() {
  const { t } = useTranslation();
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
    if (!window.confirm(t("cms.contact.cards.confirm_delete"))) return;
    await api.delete(`cms/admin/contact/cards/${id}/`);
    toast.success(t("cms.contact.cards.success.card_deleted"));
    loadCards();
  };

  return (
    <>
      {/* ===== FORM ===== */}
      <div className="cms-contact-form-card">
        <div className="cms-contact-form-header">
          <h2>{t("cms.contact.cards.form_title")}</h2>
        </div>

        <form onSubmit={submit}>
          <div className="cms-contact-form-grid">
            <div className="cms-contact-form-group">
              <label className="cms-contact-label">
                {t("cms.contact.cards.fields.type")}
              </label>
              <select
                className="cms-contact-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="info">{t("cms.contact.cards.types.info")}</option>
                <option value="button">{t("cms.contact.cards.types.button")}</option>
                <option value="form">{t("cms.contact.cards.types.form")}</option>
                <option value="faq">{t("cms.contact.cards.types.faq")}</option>
              </select>
            </div>

            <div className="cms-contact-form-group">
              <label className="cms-contact-label">
                {t("cms.contact.cards.fields.order")}
              </label>
              <input
                className="cms-contact-input"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </div>

            <div className="cms-contact-form-group">
              <label className="cms-contact-label">
                {t("cms.contact.cards.fields.title_ar")}
              </label>
              <input
                className="cms-contact-input"
                placeholder={t("cms.contact.cards.placeholders.title_ar")}
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
              />
            </div>

            <div className="cms-contact-form-group">
              <label className="cms-contact-label">
                {t("cms.contact.cards.fields.title_en")}
              </label>
              <input
                className="cms-contact-input"
                placeholder={t("cms.contact.cards.placeholders.title_en")}
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
              />
            </div>

            <div className="cms-contact-form-group full-width">
              <label className="cms-contact-label">
                {t("cms.contact.cards.fields.description_ar")}
              </label>
              <textarea
                className="cms-contact-textarea"
                placeholder={t("cms.contact.cards.placeholders.description_ar")}
                value={form.description_ar}
                onChange={(e) =>
                  setForm({ ...form, description_ar: e.target.value })
                }
              />
            </div>

            <div className="cms-contact-form-group full-width">
              <label className="cms-contact-label">
                {t("cms.contact.cards.fields.description_en")}
              </label>
              <textarea
                className="cms-contact-textarea"
                placeholder={t("cms.contact.cards.placeholders.description_en")}
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
              />
            </div>

            {form.type === "button" && (
              <>
                <div className="cms-contact-form-group">
                  <label className="cms-contact-label">
                    {t("cms.contact.cards.fields.button_label_ar")}
                  </label>
                  <input
                    className="cms-contact-input"
                    placeholder={t("cms.contact.cards.placeholders.button_label_ar")}
                    value={form.button_label_ar}
                    onChange={(e) =>
                      setForm({ ...form, button_label_ar: e.target.value })
                    }
                  />
                </div>

                <div className="cms-contact-form-group">
                  <label className="cms-contact-label">
                    {t("cms.contact.cards.fields.button_label_en")}
                  </label>
                  <input
                    className="cms-contact-input"
                    placeholder={t("cms.contact.cards.placeholders.button_label_en")}
                    value={form.button_label_en}
                    onChange={(e) =>
                      setForm({ ...form, button_label_en: e.target.value })
                    }
                  />
                </div>

                <div className="cms-contact-form-group full-width">
                  <label className="cms-contact-label">
                    {t("cms.contact.cards.fields.url")}
                  </label>
                  <input
                    className="cms-contact-input"
                    placeholder={t("cms.contact.cards.placeholders.url")}
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="cms-contact-form-group full-width">
              <label className="cms-contact-checkbox-label">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                <span className="cms-contact-checkbox-text">
                  {t("cms.contact.cards.fields.active")}
                </span>
              </label>
            </div>
          </div>

          <div className="cms-contact-form-actions">
            <button type="submit" className="cms-contact-btn-primary">
              {t("cms.contact.cards.actions.save")}
            </button>
          </div>
        </form>
      </div>

      {/* ===== LIST ===== */}
      <div className="cms-contact-list-card">
        <h2 className="cms-contact-list-title">
          {t("cms.contact.cards.list_title")}
        </h2>

        {cards
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((c) => (
            <div key={c.id} className="cms-contact-card-item">
              <div className="cms-contact-card-info">
                <span className="cms-contact-card-type">
                  {t(`cms.contact.cards.types.${c.type}`)}
                </span>
                <span className="cms-contact-card-title">{c.title_ar}</span>
              </div>

              <div className="cms-contact-card-actions">
                <button
                  className={`cms-contact-btn-toggle ${c.is_active ? "" : "inactive"}`}
                  onClick={() => toggleActive(c.id, c.is_active)}
                >
                  {c.is_active
                    ? t("cms.contact.cards.actions.deactivate")
                    : t("cms.contact.cards.actions.activate")}
                </button>
                <button
                  className="cms-contact-btn-delete"
                  onClick={() => remove(c.id)}
                >
                  {t("cms.contact.cards.actions.delete")}
                </button>
              </div>
            </div>
          ))}

        {cards.length === 0 && (
          <p style={{ textAlign: "center", color: "#666666", padding: "20px" }}>
            {t("cms.contact.cards.empty")}
          </p>
        )}
      </div>
    </>
  );
}