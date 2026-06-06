// src/pages/dashboard/messages/Message_View.jsx
import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSweetAlert } from "../../../components/common/SweetAlert";
import "../../../styles/Messages.css";

// ─── Icon Components ──────────────────────────────────────────
const Icon = {
  Back: ({ isRtl }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      {isRtl ? (
        <path d="M7.5 15 12.5 10 7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M12.5 15 7.5 10l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 10a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM10 12.5c-3.333 0-10 1.675-10 5V20h20v-2.5c0-3.325-6.667-5-10-5Z" fill="currentColor" />
    </svg>
  ),
  Status: () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M17.5 5.833 7.5 15.833l-5-5 1.075-1.075 3.925 3.925 8.925-8.925 1.075 1.075Z" fill="currentColor" />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <rect x="7" y="7" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M15.75 8.063v7.124c0 .25-.1.487-.255.663A.937.937 0 0 1 14.813 16H3.187a.938.938 0 0 1-.937-.938V3.563c0-.25.1-.487.255-.663A.937.937 0 0 1 3.187 2.5h7.126" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.5 1.5 3 3-8.25 8.25H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Spinner: () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="msg-spinner">
      <circle cx="20" cy="20" r="18" stroke="rgba(53,60,60,0.15)" strokeWidth="3" />
      <path d="M38 20C38 10.059 29.941 2 20 2" stroke="#353C3C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
};

export default function Message_View() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === "ar";
  const { alert, show } = useSweetAlert();

  const { selectedMessage, loadSingle, updateMessage } = useMessagesStore();
  const [status, setStatus] = useState("");

  useEffect(() => { loadSingle(id); }, [id]);
  useEffect(() => { if (selectedMessage) setStatus(selectedMessage.status); }, [selectedMessage]);

  const handleSave = async () => {
    const confirmed = await show({
      type: "confirm",
      title: t("messages.save_confirm_title"),
      message: t("messages.save_confirm_text"),
      confirmText: t("messages.save"),
      cancelText: t("messages.cancel"),
      showCancel: true,
    });
    if (confirmed) {
      await updateMessage(id, { status });
      toast.success(t("messages.updated"));
    }
  };

  /* ─── Loading ─────────────────────────────────────────────── */
  if (!selectedMessage) {
    return (
      <div className="msg-dashboard" dir={isRtl ? "rtl" : "ltr"}>
        <div className="msg-loading">
          <Icon.Spinner />
          <p>{t("messages.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-dashboard" dir={isRtl ? "rtl" : "ltr"}>
      {alert}

      {/* ── VIEW HEADER ── */}
      <div className="msg-view-header">
        <div className="msg-view-header-left">
          <button
            className="msg-btn-back"
            onClick={() => navigate("/dashboard/messages")}
          >
            <Icon.Back isRtl={isRtl} />
            {t("messages.back")}
          </button>
          <h1 className="msg-view-title">{t("messages.details")}</h1>
        </div>

        <span className={`msg-badge msg-badge--${selectedMessage.status}`}>
          <span className="msg-badge-dot" />
          {t(`messages.status.${selectedMessage.status}`)}
        </span>
      </div>

      <div className="msg-view-grid">

        {/* ── SENDER INFO SECTION ── */}
        <div className="msg-section">
          <div className="msg-section-header">
            <span
              className="msg-section-header-icon"
              style={{ background: "rgba(59,130,246,0.09)", color: "#3B82F6" }}
            >
              <Icon.User />
            </span>
            <h3 className="msg-section-title">{t("messages.sender_info")}</h3>
          </div>

          <div className="msg-section-body">
            <div className="msg-field-row">
              <div className="msg-field">
                <span className="msg-field-label">{t("messages.phone")}</span>
                <div className="msg-field-value msg-field-value--phone">
                  <span>{selectedMessage.phone}</span>
                  {/* Copy */}
                  <button
                    className="msg-icon-btn msg-icon-btn--copy"
                    title={t("messages.copy")}
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMessage.phone);
                      toast.success(t("messages.phone_copied"));
                    }}
                  >
                    <Icon.Copy />
                  </button>
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="msg-icon-btn msg-icon-btn--whatsapp"
                    title="WhatsApp"
                  >
                    <Icon.WhatsApp />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATUS UPDATE SECTION ── */}
        <div className="msg-section">
          <div className="msg-section-header">
            <span
              className="msg-section-header-icon"
              style={{ background: "rgba(34,197,94,0.09)", color: "#22C55E" }}
            >
              <Icon.Status />
            </span>
            <h3 className="msg-section-title">{t("messages.status_update")}</h3>
          </div>

          <div className="msg-section-body">
            <div className="msg-actions-row">
              <select
                className="msg-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="new">{t("messages.status.new")}</option>
                <option value="in_progress">{t("messages.status.in_progress")}</option>
                <option value="closed">{t("messages.status.closed")}</option>
              </select>

              <button className="msg-btn msg-btn--primary" onClick={handleSave}>
                <Icon.Save />
                {t("messages.save")}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}