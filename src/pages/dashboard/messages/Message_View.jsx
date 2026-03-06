import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../../styles/Messages.css";

export default function Message_View() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
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

  // Arrow direction based on language
  const BackArrow = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {i18n.language === 'ar' ? (
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ) : (
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  );

  if (!selectedMessage) {
    return (
      <div className="dashboard-messages-container">
        <div className="dashboard-messages-loading">
          <div className="dashboard-messages-spinner">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="var(--color-border)" strokeWidth="3"/>
              <path d="M38 20C38 10.0589 29.9411 2 20 2" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <p>{t("messages.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-messages-container">
      {/* Header */}
      <div className="dashboard-messages-header">
        <div className="dashboard-messages-header-content">
          <button 
            className="dashboard-messages-btn-back" 
            onClick={() => navigate('/dashboard/messages')}
          >
            <BackArrow />
            {t("messages.back")}
          </button>
          <h1 className="dashboard-messages-title">{t("messages.details")}</h1>
        </div>
        
        {/* Status Badge */}
        <div className={`dashboard-messages-status-badge dashboard-messages-status-${selectedMessage.status}`}>
          {t(`messages.status.${selectedMessage.status}`)}
        </div>
      </div>

      {/* View Card */}
      <div className="dashboard-messages-view-card">
        {/* Sender Info Section */}
        <div className="dashboard-messages-section">
          <div className="dashboard-messages-section-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10ZM10 12.5C6.66667 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3333 12.5 10 12.5Z" fill="currentColor"/>
            </svg>
            <h3 className="dashboard-messages-section-title">{t("messages.sender_info")}</h3>
          </div>

          <div className="dashboard-messages-grid">
            <div className="dashboard-messages-field">
              <label className="dashboard-messages-label">{t("messages.name")}</label>
              <div className="dashboard-messages-value">{selectedMessage.name}</div>
            </div>

            <div className="dashboard-messages-field">
              <label className="dashboard-messages-label">{t("messages.email")}</label>
              <div className="dashboard-messages-value">{selectedMessage.email}</div>
            </div>

            <div className="dashboard-messages-field">
              <label className="dashboard-messages-label">{t("messages.phone")}</label>
              <div className="dashboard-messages-value">
                {selectedMessage.phone || "—"}
              </div>
            </div>

            <div className="dashboard-messages-field">
              <label className="dashboard-messages-label">{t("messages.subject")}</label>
              <div className="dashboard-messages-value">{selectedMessage.subject}</div>
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className="dashboard-messages-section">
          <div className="dashboard-messages-section-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 20L4 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 14H4L2 16V2H18V14Z" fill="currentColor"/>
            </svg>
            <h3 className="dashboard-messages-section-title">{t("messages.message")}</h3>
          </div>

          <div className="dashboard-messages-message-content">
            {selectedMessage.message}
          </div>
        </div>

        {/* Status Update Section */}
        <div className="dashboard-messages-section">
          <div className="dashboard-messages-section-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 5.83333L7.5 15.8333L2.5 10.8333L3.575 9.75833L7.5 13.6833L16.425 4.75833L17.5 5.83333Z" fill="currentColor" strokeWidth="2"/>
            </svg>
            <h3 className="dashboard-messages-section-title">{t("messages.status_update")}</h3>
          </div>

          <div className="dashboard-messages-actions">
            <select
              className="dashboard-messages-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">{t("messages.status.new")}</option>
              <option value="in_progress">{t("messages.status.in_progress")}</option>
              <option value="closed">{t("messages.status.closed")}</option>
            </select>

            <button className="dashboard-messages-btn-primary" onClick={handleSave}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("messages.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}