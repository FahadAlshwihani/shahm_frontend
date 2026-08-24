// src/pages/dashboard/components/forms/FormsList.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Editbtn from "../../../../components/common/dashboard/Editbtn";
import Deletebtn from "../../../../components/common/dashboard/Deletebtn";

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function FormsList({ forms, loading, onEdit, onDelete, onNew, onToggleActive }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="fb-skeleton-list">
        {[1, 2, 3].map((i) => <div key={i} className="fb-skeleton-item" />)}
      </div>
    );
  }

  return (
    <div className="fb-forms-list-wrapper">
      <div className="fb-list-header">
        <div className="fb-list-header-left">
          <h2 className="fb-section-title">{t("cms.forms.list_title")}</h2>
          <span className="fb-count-badge">{forms.length}</span>
        </div>
        <button className="fb-btn fb-btn--primary" onClick={onNew}>
          <IconPlus />
          {t("cms.forms.actions.new_form")}
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="fb-empty-state">
          <div className="fb-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2" opacity=".3" />
              <path d="M16 16h16M16 22h12M16 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" />
            </svg>
          </div>
          <p className="fb-empty-title">{t("cms.forms.empty.title")}</p>
          <p className="fb-empty-subtitle">{t("cms.forms.empty.subtitle")}</p>
          <button className="fb-btn fb-btn--primary" onClick={onNew}>
            <IconPlus />
            {t("cms.forms.actions.create_first")}
          </button>
        </div>
      ) : (
        <div className="fb-forms-table-wrapper">
          <table className="fb-table">
            <thead>
              <tr>
                <th>{t("cms.forms.table.title")}</th>
                <th>{t("cms.forms.table.slug")}</th>
                <th>{t("cms.forms.table.sections")}</th>
                <th>{t("cms.forms.table.submissions")}</th>
                <th>{t("cms.forms.table.status")}</th>
                <th>{t("cms.forms.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form.id} className="fb-table-row">
                  <td>
                    <div className="fb-form-name">
                      <span className="fb-form-name-ar" dir="rtl">{form.title_ar}</span>
                      {form.title_en && (
                        <span className="fb-form-name-en">{form.title_en}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <code className="fb-slug-chip">{form.slug}</code>
                  </td>
                  <td>
                    <span className="fb-meta-chip">
                      {form.sections?.length ?? 0}
                    </span>
                  </td>
                  <td>
                    <span className="fb-meta-chip fb-meta-chip--purple">
                      {form.submissions_count ?? 0}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`fb-status-toggle ${form.is_active ? "fb-status-toggle--active" : "fb-status-toggle--inactive"}`}
                      onClick={() => onToggleActive(form)}
                      title={form.is_active ? t("cms.forms.actions.deactivate") : t("cms.forms.actions.activate")}
                    >
                      <span className="fb-status-dot" />
                      {form.is_active ? t("cms.forms.status.active") : t("cms.forms.status.inactive")}
                    </button>
                  </td>
                  <td>
                    <div className="fb-row-actions">
                      <Editbtn onClick={() => onEdit(form)} />
                      <Deletebtn onConfirm={() => onDelete(form.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
