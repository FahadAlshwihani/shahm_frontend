// src/pages/dashboard/ServicePracticeAreas.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ServicePracticeAreas() {
  const { t, i18n } = useTranslation();

  const [areas, setAreas] = useState([]);
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    name_ar: "",
    name_en: "",
    icon: "",
    order: 0,
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      const res = await api.get("services/admin/areas/");
      setAreas(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await api.patch(`services/admin/areas/${editing.id}/`, form);
        toast.success(t("cms.services.areas.success.updated"));
      } else {
        await api.post("services/admin/areas/", form);
        toast.success(t("cms.services.areas.success.created"));
      }

      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(t("cms.services.areas.error.save_failed"));
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("cms.services.areas.confirm_delete_title"),
      text: t("cms.services.areas.confirm_delete_text"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t("cms.services.areas.delete_button"),
      cancelButtonText: t("cms.services.areas.cancel_button"),
      reverseButtons: i18n.language === 'ar',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`services/admin/areas/${id}/`);
        Swal.fire({
          title: t("cms.services.areas.deleted_title"),
          text: t("cms.services.areas.success.deleted"),
          icon: 'success',
          confirmButtonColor: '#22c55e',
        });
        load();
      } catch (err) {
        toast.error(t("cms.services.areas.error.delete_failed"));
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`services/admin/areas/${id}/`, {
        is_active: !currentStatus,
      });
      toast.success(t("cms.services.areas.success.toggled"));
      load();
    } catch (err) {
      toast.error(t("cms.services.areas.error.toggle_failed"));
    }
  };

  return (
    <div className="dashboard-services-content">
      <div className="dashboard-services-content-header">
        <div className="dashboard-services-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.services.areas.title")}</h2>
        </div>
        <p className="dashboard-services-content-subtitle">
          {t("cms.services.areas.subtitle")}
        </p>
      </div>

      {/* FORM */}
      <form className="dashboard-services-form-card" onSubmit={submit}>
        <div className="dashboard-services-form-header">
          <div className="dashboard-services-form-header-left">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2ZM14 16H6V4H14V16Z" fill="currentColor"/>
            </svg>
            <h3>
              {editing
                ? t("cms.services.areas.form_edit")
                : t("cms.services.areas.form_create")}
            </h3>
          </div>
          {editing && (
            <button
              type="button"
              className="dashboard-services-btn-cancel"
              onClick={() => {
                setForm(emptyForm);
                setEditing(null);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("cms.services.actions.cancel")}
            </button>
          )}
        </div>

        <div className="dashboard-services-form-section">
          <div className="dashboard-services-form-grid-row">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.areas.name_ar")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.areas.placeholder_name_ar")}
                value={form.name_ar}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                required
                dir="rtl"
              />
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.areas.name_en")}
              </label>
              <input
                className="dashboard-services-input"
                placeholder={t("cms.services.areas.placeholder_name_en")}
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="dashboard-services-form-grid">
            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.areas.icon")}
              </label>
              <select
                className="dashboard-services-select"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                <option value="">{t("cms.services.areas.select_icon")}</option>
                <option value="gavel">⚖️ Gavel</option>
                <option value="scale">⚖️ Scale</option>
                <option value="briefcase">💼 Briefcase</option>
                <option value="balance">⚖️ Balance</option>
                <option value="court">🏛️ Court</option>
                <option value="document">📄 Document</option>
                <option value="shield">🛡️ Shield</option>
                <option value="pen">✒️ Pen</option>
              </select>
            </div>

            <div className="dashboard-services-form-group">
              <label className="dashboard-services-label">
                {t("cms.services.areas.order")}
              </label>
              <input
                className="dashboard-services-input"
                type="number"
                placeholder="0"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
          </div>

          <div className="dashboard-services-checkbox-wrapper">
            <label className="dashboard-services-checkbox-label">
              <input
                type="checkbox"
                className="dashboard-services-checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <span className="dashboard-services-checkbox-text">
                {t("cms.services.areas.active")}
              </span>
            </label>
          </div>
        </div>

        <div className="dashboard-services-form-actions">
          <button type="submit" className="dashboard-services-btn-primary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {editing ? t("cms.services.actions.update") : t("cms.services.actions.create")}
          </button>
          {editing && (
            <button
              type="button"
              className="dashboard-services-btn-secondary"
              onClick={() => {
                setForm(emptyForm);
                setEditing(null);
              }}
            >
              {t("cms.services.actions.cancel")}
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="dashboard-services-list-card">
        <div className="dashboard-services-list-header">
          <div className="dashboard-services-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h3>{t("cms.services.areas.list_title")}</h3>
          </div>
          <span className="dashboard-services-count-badge">{areas.length}</span>
        </div>

        {areas.length > 0 ? (
          <div className="dashboard-services-table-wrapper">
            <table className="dashboard-services-table">
              <thead>
                <tr>
                  <th>{t("cms.services.table.id")}</th>
                  <th>{t("cms.services.table.name")}</th>
                  <th>{t("cms.services.table.icon")}</th>
                  <th>{t("cms.services.table.order")}</th>
                  <th>{t("cms.services.table.status")}</th>
                  <th>{t("cms.services.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.id}>
                    <td>{area.id}</td>
                    <td className="dashboard-services-table-name">
                      {i18n.language === 'ar' ? area.name_ar : area.name_en}
                    </td>
                    <td>{area.icon || "—"}</td>
                    <td>{area.order}</td>
                    <td>
                      <span
                        className={`dashboard-services-status-badge ${
                          area.is_active
                            ? "dashboard-services-status-active"
                            : "dashboard-services-status-inactive"
                        }`}
                      >
                        {area.is_active
                          ? t("cms.services.status.active")
                          : t("cms.services.status.inactive")}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-services-table-actions">
                        <button
                          className="dashboard-services-btn-edit"
                          onClick={() => {
                            setEditing(area);
                            setForm(area);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                          </svg>
                          {t("cms.services.actions.edit")}
                        </button>

                        <button
                          className="dashboard-services-btn-toggle"
                          onClick={() => handleToggle(area.id, area.is_active)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2ZM8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12Z" fill="currentColor"/>
                          </svg>
                          {area.is_active
                            ? t("cms.services.actions.deactivate")
                            : t("cms.services.actions.activate")}
                        </button>

                        <button
                          className="dashboard-services-btn-delete"
                          onClick={() => handleDelete(area.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                          </svg>
                          {t("cms.services.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-services-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.18 40 8 32.82 8 24C8 15.18 15.18 8 24 8C32.82 8 40 15.18 40 24C40 32.82 32.82 40 24 40Z" fill="currentColor"/>
              <path d="M22 22H26V34H22V22ZM22 14H26V18H22V14Z" fill="currentColor"/>
            </svg>
            <p>{t("cms.services.areas.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}