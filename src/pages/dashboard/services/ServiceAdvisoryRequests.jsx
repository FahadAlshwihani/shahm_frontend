// src/pages/dashboard/ServiceAdvisoryRequests.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function ServiceAdvisoryRequests() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("services/admin/service-advisory/requests/");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDownload = async (request) => {
    try {
      const res = await api.get(
        `services/admin/service-advisory/requests/${request.id}/download/`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = request.attachment.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(t("cms.services.requests.download_success"));
    } catch (err) {
      toast.error(t("cms.services.requests.download_failed"));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.patch(
        `services/admin/service-advisory/requests/${id}/`,
        { status: newStatus }
      );
      setSelected(res.data);
      toast.success(t("cms.services.requests.status_updated"));
      load();
    } catch (err) {
      toast.error(t("cms.services.requests.status_update_failed"));
    }
  };

  return (
    <div className="dashboard-services-content">
      <div className="dashboard-services-content-header">
        <div className="dashboard-services-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM4 8L12 13L20 8V6L12 11L4 6V8Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.services.requests.title")}</h2>
        </div>
        <p className="dashboard-services-content-subtitle">
          {t("cms.services.requests.subtitle")}
        </p>
      </div>

      <div className="dashboard-services-list-card">
        <div className="dashboard-services-list-header">
          <div className="dashboard-services-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h3>{t("cms.services.requests.list_title")}</h3>
          </div>
          <span className="dashboard-services-count-badge">{items.length}</span>
        </div>

        {items.length > 0 ? (
          <div className="dashboard-services-table-wrapper">
            <table className="dashboard-services-table">
              <thead>
                <tr>
                  <th>{t("cms.services.requests.table.id")}</th>
                  <th>{t("cms.services.requests.table.name")}</th>
                  <th>{t("cms.services.requests.table.email")}</th>
                  <th>{t("cms.services.requests.table.phone")}</th>
                  <th>{t("cms.services.requests.table.service")}</th>
                  <th>{t("cms.services.requests.table.date")}</th>
                  <th>{t("cms.services.requests.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td className="dashboard-services-table-name">
                      {r.first_name} {r.last_name}
                    </td>
                    <td>{r.email}</td>
                    <td>{r.phone}</td>
                    <td>
                      {r.items?.length
                        ? r.items
                            .map((i) => 
                              i18n.language === 'ar' 
                                ? i.service?.title_ar 
                                : i.service?.title_en
                            )
                            .join(", ")
                        : "—"}
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="dashboard-services-btn-view"
                        onClick={() => setSelected(r)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3C4.5 3 1.5 5.5 1 8C1.5 10.5 4.5 13 8 13C11.5 13 14.5 10.5 15 8C14.5 5.5 11.5 3 8 3ZM8 11C6.3 11 5 9.7 5 8C5 6.3 6.3 5 8 5C9.7 5 11 6.3 11 8C11 9.7 9.7 11 8 11ZM8 6.5C7.2 6.5 6.5 7.2 6.5 8C6.5 8.8 7.2 9.5 8 9.5C8.8 9.5 9.5 8.8 9.5 8C9.5 7.2 8.8 6.5 8 6.5Z" fill="currentColor"/>
                        </svg>
                        {t("cms.services.actions.view")}
                      </button>
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
            <p>{t("cms.services.requests.empty")}</p>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <div className="dashboard-services-modal-overlay" onClick={() => setSelected(null)}>
          <div className="dashboard-services-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-services-modal-header">
              <h3>
                {t("cms.services.requests.modal.title")} #{selected.id}
              </h3>
              <button
                className="dashboard-services-modal-close"
                onClick={() => setSelected(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="dashboard-services-modal-body">
              <div className="dashboard-services-modal-section">
                <h4>{t("cms.services.requests.modal.personal_info")}</h4>
                <div className="dashboard-services-modal-grid">
                  <div className="dashboard-services-modal-field">
                    <label>{t("cms.services.requests.modal.name")}</label>
                    <p>{selected.first_name} {selected.last_name}</p>
                  </div>
                  <div className="dashboard-services-modal-field">
                    <label>{t("cms.services.requests.modal.email")}</label>
                    <p>{selected.email}</p>
                  </div>
                  <div className="dashboard-services-modal-field">
                    <label>{t("cms.services.requests.modal.phone")}</label>
                    <p>{selected.phone}</p>
                  </div>
                  <div className="dashboard-services-modal-field">
                    <label>{t("cms.services.requests.modal.date")}</label>
                    <p>{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selected.items && selected.items.length > 0 && (
                <div className="dashboard-services-modal-section">
                  <h4>{t("cms.services.requests.modal.services")}</h4>
                  <ul className="dashboard-services-modal-list">
                    {selected.items.map((item, index) => (
                      <li key={index}>
                        {i18n.language === 'ar' 
                          ? item.service?.title_ar 
                          : item.service?.title_en}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.message && (
                <div className="dashboard-services-modal-section">
                  <h4>{t("cms.services.requests.modal.message")}</h4>
                  <div className="dashboard-services-modal-message">
                    {selected.message}
                  </div>
                </div>
              )}

              {selected.voice_note && (
                <div className="dashboard-services-modal-section">
                  <h4>{t("cms.services.requests.modal.voice_note")}</h4>
                  <audio controls className="dashboard-services-audio">
                    <source src={selected.voice_note} />
                    {t("cms.services.requests.modal.audio_not_supported")}
                  </audio>
                </div>
              )}

              {selected.attachment && (
                <div className="dashboard-services-modal-section">
                  <h4>{t("cms.services.requests.modal.attachment")}</h4>
                  <button
                    className="dashboard-services-btn-download"
                    onClick={() => handleDownload(selected)}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M15 11.25V14.25C15 14.6478 14.842 15.0294 14.5607 15.3107C14.2794 15.592 13.8978 15.75 13.5 15.75H4.5C4.10218 15.75 3.72064 15.592 3.43934 15.3107C3.15804 15.0294 3 14.6478 3 14.25V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11.25V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t("cms.services.requests.modal.download_attachment")}
                  </button>
                </div>
              )}

              <div className="dashboard-services-modal-section">
                <h4>{t("cms.services.requests.modal.status")}</h4>
                <select
                  className="dashboard-services-select-status"
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                >
                  <option value="new">{t("cms.services.requests.status.new")}</option>
                  <option value="replied">{t("cms.services.requests.status.replied")}</option>
                  <option value="closed">{t("cms.services.requests.status.closed")}</option>
                </select>
              </div>
            </div>

            <div className="dashboard-services-modal-footer">
              <button
                className="dashboard-services-btn-secondary"
                onClick={() => setSelected(null)}
              >
                {t("cms.services.actions.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}