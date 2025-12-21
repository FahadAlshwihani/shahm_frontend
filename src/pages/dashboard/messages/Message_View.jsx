import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../../styles/CMS_MESSAGES.css";

export default function Message_View() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { selectedMessage, loadSingle, updateMessage } = useMessagesStore();

  const [status, setStatus] = useState("");

  useEffect(() => {
    loadSingle(id);
  }, [id]);

  useEffect(() => {
    if (selectedMessage) setStatus(selectedMessage.status);
  }, [selectedMessage]);

  const handleSave = async () => {
    await updateMessage(id, { status });
    toast.success(t("messages.updated"));
  };

  if (!selectedMessage) {
    return (
      <div className="messages-cms-container">
        <div className="messages-loading">{t("messages.loading")}</div>
      </div>
    );
  }

  return (
    <div className="messages-cms-container">
      <div className="messages-view-header">
        <button className="messages-btn-back" onClick={() => navigate('/dashboard/messages')}>
          ← {t("messages.back")}
        </button>
        <h1 className="messages-view-title">{t("messages.details")}</h1>
      </div>

      <div className="messages-view-card">
        <div className="messages-view-section">
          <h3 className="messages-view-section-title">{t("messages.sender_info")}</h3>
          <div className="messages-view-grid">
            <div className="messages-view-field">
              <label className="messages-view-label">{t("messages.name")}</label>
              <div className="messages-view-value">{selectedMessage.name}</div>
            </div>

            <div className="messages-view-field">
              <label className="messages-view-label">{t("messages.email")}</label>
              <div className="messages-view-value">{selectedMessage.email}</div>
            </div>

            <div className="messages-view-field">
              <label className="messages-view-label">{t("messages.phone")}</label>
              <div className="messages-view-value">
                {selectedMessage.phone || "—"}
              </div>
            </div>

            <div className="messages-view-field">
              <label className="messages-view-label">{t("messages.subject")}</label>
              <div className="messages-view-value">{selectedMessage.subject}</div>
            </div>
          </div>
        </div>

        <div className="messages-view-section">
          <h3 className="messages-view-section-title">{t("messages.message")}</h3>
          <div className="messages-view-message">
            {selectedMessage.message}
          </div>
        </div>

        <div className="messages-view-section">
          <h3 className="messages-view-section-title">{t("messages.status_update")}</h3>
          <div className="messages-view-actions">
            <select
              className="messages-view-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">{t("messages.status.new")}</option>
              <option value="in_progress">{t("messages.status.in_progress")}</option>
              <option value="closed">{t("messages.status.closed")}</option>
            </select>

            <button className="messages-btn-primary" onClick={handleSave}>
              {t("messages.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}