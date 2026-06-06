// src/pages/dashboard/services/requests/components/RequestStatusActions.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { updateServiceAdvisoryRequest } from "../../../../../api/servicesApi";
import { STATUS_OPTIONS, getStatusMeta } from "../utils/requestHelpers";

const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M15.75 8.063v7.124c0 .25-.1.487-.255.663A.937.937 0 0 1 14.813 16H3.187a.938.938 0 0 1-.937-.938V3.563c0-.25.1-.487.255-.663A.937.937 0 0 1 3.187 2.5h7.126"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m13.5 1.5 3 3-8.25 8.25H5.25V9.75L13.5 1.5Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSpinner = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="cms-svc-btn-spin">
    <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"
      strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

/**
 * Props:
 *   request        – the full request object
 *   onStatusChange – callback(id, newStatus) after successful update
 */
export default function RequestStatusActions({ request, onStatusChange }) {
  const { t } = useTranslation();
  const [pendingStatus, setPendingStatus] = useState(request?.status ?? "");
  const [updating, setUpdating] = useState(false);

  if (!request) return null;

  const currentMeta = getStatusMeta(request.status);
  const isDirty = pendingStatus !== request.status;

  const handleSave = async () => {
    if (!isDirty || updating) return;
    setUpdating(true);
    try {
      await updateServiceAdvisoryRequest(request.id, { status: pendingStatus });
      toast.success(t("cms.requestservices.status_updated", "Status updated"));
      if (onStatusChange) onStatusChange(request.id, pendingStatus);
    } catch {
      toast.error(t("cms.requestservices.status_update_failed", "Status update failed"));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="cms-request-services-status-actions">

      {/* ── Current status display (matches Messages modal style) ── */}
      <div className="cms-rs-status-section">
        <p className="cms-rs-status-section-label">
          {t("cms.requestservices.modal.current_status", "Current Status")}
        </p>
        <div className="cms-rs-status-current-display">
          <span
            className="cms-request-services-status-badge"
            style={{
              "--status-color":  currentMeta.color,
              "--status-bg":     currentMeta.bg,
              "--status-border": currentMeta.border,
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: currentMeta.color, flexShrink: 0, display: "inline-block",
              }}
            />
            {t(`cms.requestservices.status.${request.status}`, currentMeta.label_en)}
          </span>
        </div>
      </div>

      {/* ── Update status (select + save) ── */}
      <div className="cms-rs-status-section">
        <p className="cms-rs-status-section-label">
          {t("cms.requestservices.modal.change_status", "Change Status")}
        </p>
        <div className="cms-rs-status-update-row">
          <select
            className="cms-request-services-input cms-rs-status-select"
            value={pendingStatus}
            onChange={(e) => setPendingStatus(e.target.value)}
            disabled={updating}
          >
            {STATUS_OPTIONS.map((s) => {
              const meta = getStatusMeta(s);
              return (
                <option key={s} value={s}>
                  {t(`cms.requestservices.status.${s}`, meta.label_en)}
                </option>
              );
            })}
          </select>

          <button
            className="cms-services-btn cms-services-btn--primary"
            onClick={handleSave}
            disabled={updating || !isDirty}
            title={updating
              ? t("cms.requestservices.saving", "Saving…")
              : t("cms.requestservices.modal.save_changes", "Save")}
            style={{ padding:"9px 14px", display:"flex", alignItems:"center", justifyContent:"center", minWidth:44 }}
          >
            {updating
              ? <IconSpinner />
              : <IconSave />}
          </button>
        </div>
      </div>

      {/* ── Quick-pick status buttons (unchanged, kept for convenience) ── */}
      <div className="cms-rs-status-section">
        <p className="cms-rs-status-section-label">
          {t("cms.requestservices.modal.quick_pick", "Quick Pick")}
        </p>
        <div className="cms-request-services-status-actions-grid">
          {STATUS_OPTIONS.map((s) => {
            const meta = getStatusMeta(s);
            const isActive = request.status === s;
            return (
              <button
                key={s}
                disabled={updating || isActive}
                onClick={() => { setPendingStatus(s); }}
                className={`cms-request-services-status-btn${isActive ? " cms-request-services-status-btn--active" : ""}`}
                style={{
                  "--status-color":  meta.color,
                  "--status-bg":     meta.bg,
                  "--status-border": meta.border,
                }}
              >
                {isActive && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {t(`cms.requestservices.status.${s}`, meta.label_en)}
              </button>
            );
          })}
        </div>
        <p className="cms-rs-status-hint">
          {t("cms.requestservices.modal.quick_pick_hint", "Click a status to stage it, then press Save above.")}
        </p>
      </div>

    </div>
  );
}