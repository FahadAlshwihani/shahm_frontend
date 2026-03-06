import React, { useEffect } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/Messages.css";

export default function Messages_List() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { messages, loadMessages } = useMessagesStore();

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="dashboard-messages-container">
      <div className="dashboard-messages-header">
        <h1 className="dashboard-messages-title">{t("messages.contact_messages")}</h1>
      </div>

      <div className="dashboard-messages-card">
        <div className="dashboard-messages-table-wrapper">
          <table className="dashboard-messages-table">
            <thead>
              <tr>
                <th>{t("messages.name")}</th>
                <th>{t("messages.email")}</th>
                <th>{t("messages.subject")}</th>
                <th>{t("messages.status.title")}</th>
                <th>{t("messages.read")}</th>
                <th>{t("messages.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td className="dashboard-messages-table-name">{m.name}</td>
                  <td className="dashboard-messages-table-email">{m.email}</td>
                  <td className="dashboard-messages-table-subject">{m.subject}</td>
                  <td>
                    <span className={`dashboard-messages-status-badge dashboard-messages-status-${m.status}`}>
                      {t(`messages.status.${m.status}`)}
                    </span>
                  </td>
                  <td>
                    <span className={`dashboard-messages-read-badge ${m.is_read ? 'dashboard-messages-read' : 'dashboard-messages-unread'}`}>
                      {m.is_read ? t("common.yes") : t("common.no")}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="dashboard-messages-btn-view"
                      onClick={() => navigate(`/dashboard/messages/${m.id}`)}
                    >
                      {t("messages.open")}
                    </button>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="dashboard-messages-table-empty">
                    {t("messages.no_messages")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}