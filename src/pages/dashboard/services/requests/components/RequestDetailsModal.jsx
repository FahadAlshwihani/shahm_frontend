// src/pages/dashboard/services/requests/components/RequestDetailsModal.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../../../components/common/dashboard/Modal";
import {
  getRequestDisplayName,
  getLocalizedServiceTitle,
  getStatusMeta,
  formatDateTime,
  prettifyKey,
  renderSnapshotValue,
  isFileUrl,
} from "../utils/requestHelpers";
import RequestStatusActions from "./RequestStatusActions";
import RequestAccessPanel from "./RequestAccessPanel";
import RequestAccessLogs from "./RequestAccessLogs";
import RequestEditHistory from "./RequestEditHistory";
import { updateAdminSubmission } from "../../../../../api/servicesApi";
import { toast } from "react-hot-toast";

const TABS = ["details", "status", "access", "logs", "history"];

/* ── Save icon ─────────────────────────────────────────────── */
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
    <path d="M15.75 8.063v7.124c0 .25-.1.487-.255.663A.937.937 0 0 1 14.813 16H3.187a.938.938 0 0 1-.937-.938V3.563c0-.25.1-.487.255-.663A.937.937 0 0 1 3.187 2.5h7.126"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m13.5 1.5 3 3-8.25 8.25H5.25V9.75L13.5 1.5Z"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Spinner for save loading state ────────────────────────── */
const IconSpinner = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="cms-svc-btn-spin">
    <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"
      strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

export default function RequestDetailsModal({ request, onClose, onStatusChange, onRequestUpdated }) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [editSaving, setEditSaving] = useState(false);

  if (!request) return null;

  const meta = getStatusMeta(request.status);
  const lang = i18n.language;
  const isRtl = lang === "ar";
  const snapshot = request.snapshot;
  const hasSnapshot = snapshot && typeof snapshot === "object" && Object.keys(snapshot).length > 0;

  const tabLabels = {
    details: t("cms.requestservices.modal.tab_details", "Details"),
    status: t("cms.requestservices.modal.tab_status", "Status"),
    access: t("cms.requestservices.modal.tab_access", "Access Links"),
    logs: t("cms.requestservices.modal.tab_logs", "Activity Logs"),
    history: t("cms.requestservices.modal.tab_history", "Edit History"),
  };

  /* ── Tab definitions — passed as data, Modal owns the indicator ── */
  const tabDefs = TABS.map((tab) => ({ id: tab, label: tabLabels[tab] }));

  /* ── Subtitle: status badge + date + ref ── */
  const subtitleNode = (
    <>
      <span
        className="cms-services-status-badge--request"
        style={{ "--status-color": meta.color, "--status-bg": meta.bg, "--status-border": meta.border }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, flexShrink: 0, display: "inline-block", order: 0 }} />
        <span style={{ flex: 1, textAlign: "center" }}>
          {t(`cms.requestservices.status.${request.status}`, meta.label_en)}
        </span>
      </span>
      <span style={{ fontSize: 12, color: "#97A5A5", fontFamily: "Noto Kufi Arabic, sans-serif" }}>
        {formatDateTime(request.created_at)}
      </span>
      <code style={{
        background: "rgba(53,60,60,0.07)", padding: "2px 8px", borderRadius: 4,
        fontSize: 11, fontFamily: "monospace", fontWeight: 700, direction: "ltr",
        display: "inline-block", color: "#353C3C"
      }}>
        {request.reference_code || request.reference || `#${request.id}`}
      </code>
    </>
  );

  /* ── Footer ── */
  const footerNode = (
    <button className="cms-services-btn cms-services-btn--ghost" onClick={onClose} type="button">
      {t("cms.requestservices.close", "Close")}
    </button>
  );

  /* ── handleSave for edit form ── */
  const handleSave = async () => {
    setEditSaving(true);
    try {
      const hasFile = Object.values(editValues).some(
        (v) => v instanceof File || (Array.isArray(v) && v.some((i) => i instanceof File))
      );
      let payload;
      if (hasFile) {
        payload = new FormData();
        const nonFileData = {};
        Object.entries(editValues).forEach(([k, v]) => {
          if (Array.isArray(v)) { v.forEach((item) => { if (item instanceof File) payload.append(k, item); }); return; }
          if (v instanceof File) payload.append(k, v);
          else nonFileData[k] = v;
        });
        payload.append("data", JSON.stringify(nonFileData));
      } else {
        payload = { data: editValues };
      }
      await updateAdminSubmission(request.form_submission_id, payload);
      toast.success(t("cms.requestservices.modal.edit_saved", "Submission updated."));
      setEditMode(false);
      if (onRequestUpdated) onRequestUpdated(request.id);
    } catch (err) {
      toast.error(err?.response?.data?.detail || t("cms.requestservices.modal.edit_failed", "Failed to save."));
    } finally { setEditSaving(false); }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={getRequestDisplayName(request)}
      subtitle={subtitleNode}
      tabDefs={tabDefs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      footer={footerNode}
      dir={isRtl ? "rtl" : "ltr"}
      width={858}
    >
      {/* ═══════════════ DETAILS TAB ═══════════════ */}
      {activeTab === "details" && (
        <div className="cms-request-services-modal-section-list">

          {/* ── Personal info ── */}
          <section className="cms-request-services-modal-section">
            <h4 className="cms-request-services-section-heading">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 7a3 3 0 100-6 3 3 0 000 6zm0 1c-3.3 0-6 1.3-6 3v1h12v-1c0-1.7-2.7-3-6-3z" fill="currentColor" />
              </svg>
              {t("cms.requestservices.modal.personal_info", "Personal Information")}
            </h4>
            <div className="cms-request-services-info-grid">
              <InfoField label={t("cms.requestservices.modal.name", "Name")}>
                {getRequestDisplayName(request)}
              </InfoField>
              <InfoField label={t("cms.requestservices.modal.email", "Email")}>
                {request.email
                  ? <a href={`mailto:${request.email}`} className="cms-request-services-link">{request.email}</a>
                  : "—"}
              </InfoField>
              <InfoField label={t("cms.requestservices.modal.phone", "Phone")}>
                {request.phone
                  ? <a href={`tel:${request.phone}`} className="cms-request-services-link" dir="ltr">{request.phone}</a>
                  : "—"}
              </InfoField>
              <InfoField label={t("cms.requestservices.modal.submitted", "Submitted")}>
                {formatDateTime(request.created_at)}
              </InfoField>
              {request.title && (
                <InfoField label={t("cms.requestservices.modal.title", "Title")}>{request.title}</InfoField>
              )}
            </div>
          </section>

          {/* ── Requested services ── */}
          {request.items?.length > 0 && (
            <section className="cms-request-services-modal-section">
              <h4 className="cms-request-services-section-heading">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h10v2H2zM2 6h10v2H2zM2 10h6v2H2z" fill="currentColor" />
                </svg>
                {t("cms.requestservices.modal.services", "Requested Services")}
              </h4>
              <ul className="cms-request-services-service-list">
                {request.items.map((item, idx) => (
                  <li key={idx} className="cms-request-services-service-item">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {getLocalizedServiceTitle(item.service, lang)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Message ── */}
          {request.message && (
            <section className="cms-request-services-modal-section">
              <h4 className="cms-request-services-section-heading">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h10a1 1 0 011 1v7a1 1 0 01-1 1H4l-3 2V3a1 1 0 011-1z" fill="currentColor" />
                </svg>
                {t("cms.requestservices.modal.message", "Message")}
              </h4>
              <div className="cms-request-services-message-box">{request.message}</div>
            </section>
          )}

          {/* ── Files from snapshot ── */}
          {hasSnapshot && (() => {
            const snapshotFiles = Object.entries(snapshot).flatMap(([, fieldMeta]) => {
              const rawVal =
                fieldMeta && typeof fieldMeta === "object" && "value" in fieldMeta
                  ? fieldMeta.value
                  : fieldMeta;
              if (!rawVal) return [];
              if (typeof rawVal === "object" && !Array.isArray(rawVal) && rawVal.url) return [rawVal];
              if (Array.isArray(rawVal)) return rawVal.filter((item) => item && typeof item === "object" && item.url);
              return [];
            });
            if (!snapshotFiles.length) return null;
            return (
              <section className="cms-request-services-modal-section">
                <h4 className="cms-request-services-section-heading">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M8 1H3a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5L8 1z"
                      stroke="currentColor" strokeWidth="1.2" fill="none" />
                    <path d="M8 1v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                  {t("cms.requestservices.modal.files", "Files")}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {snapshotFiles.map((file, idx) => (
                    <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer"
                      className="cms-request-services-download-btn">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 11v1.5A.5.5 0 002.5 13h9a.5.5 0 00.5-.5V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                      {file.name || file.original_name || `File ${idx + 1}`}
                    </a>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* ── Voice note ── */}
          {request.voice_note && (
            <section className="cms-request-services-modal-section">
              <h4 className="cms-request-services-section-heading">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1a2 2 0 012 2v4a2 2 0 01-4 0V3a2 2 0 012-2zm4 5a4 4 0 01-8 0H2a5 5 0 0010 0h-1zM6 12h2v1H6v-1z" fill="currentColor" />
                </svg>
                {t("cms.requestservices.modal.voice_note", "Voice Note")}
              </h4>
              <audio controls className="cms-request-services-audio">
                <source src={request.voice_note} />
                {t("cms.requestservices.modal.audio_unsupported", "Audio not supported")}
              </audio>
            </section>
          )}

          {/* ── Form metadata ── */}
          {(request.form_id || request.form_submission_id) && (
            <section className="cms-request-services-modal-section">
              <h4 className="cms-request-services-section-heading">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h10v2H2zM2 6h8v2H2zM2 10h6v2H2z" fill="currentColor" opacity=".8" />
                </svg>
                {t("cms.requestservices.modal.form_metadata", "Form Information")}
              </h4>
              <div className="cms-request-services-info-grid">
                {request.form_id && (
                  <InfoField label={t("cms.requestservices.modal.form_id", "Form ID")}>
                    <code className="cms-request-services-code">#{request.form_id}</code>
                  </InfoField>
                )}
                {request.form_submission_id && (
                  <InfoField label={t("cms.requestservices.modal.submission_id", "Submission ID")}>
                    <code className="cms-request-services-code">#{request.form_submission_id}</code>
                  </InfoField>
                )}
                {(request.form_title_ar || request.form_title_en) && (
                  <InfoField label={t("cms.requestservices.modal.form_title", "Form Title")}>
                    {lang === "ar"
                      ? request.form_title_ar || request.form_title_en
                      : request.form_title_en || request.form_title_ar}
                  </InfoField>
                )}
              </div>
            </section>
          )}

          {/* ── Form snapshot ── */}
          {hasSnapshot && (
            <section className="cms-request-services-modal-section">
              <h4 className="cms-request-services-section-heading"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 3h12v1H1zM1 7h12v1H1zM1 11h8v1H1z" fill="currentColor" />
                  </svg>
                  {t("cms.requestservices.modal.snapshot", "Form Snapshot")}
                </span>
                {request.form_submission_id && !editMode && (
                  <button
                    className="cms-services-btn cms-services-btn--ghost cms-services-btn--sm"
                    type="button"
                    onClick={() => {
  const PROTECTED = [
    "service_ids",
    "job_id",
    "slot_id",
  ];

  const seed = {};

  Object.entries(snapshot).forEach(([k, v]) => {
    const isRich =
      v !== null &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      "value" in v;

    if (!isRich) return;

    const systemKey = v.system_key || k;

    if (PROTECTED.includes(systemKey)) return;
    if (v.settings?.hidden || v.settings?.internal) return;
    if (v.field_type === "hidden") return;
    if (v.editable === false) return;

    seed[k] = v.value ?? "";
  });

  setEditValues(seed);
  setEditMode(true);
}}
                  >
                    {t("cms.requestservices.modal.edit_submission", "Edit submission")}
                  </button>
                )}
              </h4>

              {editMode ? (
                <AdminEditForm
                  snapshot={snapshot}
                  editValues={editValues}
                  setEditValues={setEditValues}
                  lang={lang}
                  saving={editSaving}
                  t={t}
                  onCancel={() => setEditMode(false)}
                  onSave={handleSave}
                />
              ) : (
                <div className="cms-request-services-snapshot-grid">
                  {Object.entries(snapshot)
                    .sort((a, b) => {
                      const A = a[1] || {}, B = b[1] || {};
                      if ((A.section_order ?? 0) !== (B.section_order ?? 0))
                        return (A.section_order ?? 0) - (B.section_order ?? 0);
                      return (A.order ?? 0) - (B.order ?? 0);
                    })
                    .map(([key, fieldMeta]) => {
                      const isRich = fieldMeta !== null && typeof fieldMeta === "object" && !Array.isArray(fieldMeta) && "value" in fieldMeta;
                      const rawVal = isRich
                        ? (
                          fieldMeta.display_value ??
                          fieldMeta.value
                        )
                        : fieldMeta;
                      const label = isRich
                        ? (lang === "ar"
                          ? fieldMeta.label_ar || fieldMeta.label_en || prettifyKey(key)
                          : fieldMeta.label_en || fieldMeta.label_ar || prettifyKey(key))
                        : prettifyKey(key);
                      const editable = isRich ? fieldMeta.editable : undefined;
                      const fieldType = isRich ? fieldMeta.field_type : null;
                      const options = isRich ? fieldMeta.options || [] : [];

                      let displayVal;
                      if (options.length > 0 && ["select", "radio", "checkbox"].includes(fieldType)) {
                        const sel = Array.isArray(rawVal) ? rawVal : [rawVal];
                        displayVal = sel
                          .map((v) => { const opt = options.find((o) => o.value === v); return opt ? (lang === "ar" ? opt.label_ar : opt.label_en) : v; })
                          .filter(Boolean).join(", ") || "—";
                      } else {
                        displayVal = renderSnapshotValue(rawVal);
                      }

                      const fileItems = (() => {
                        if (!rawVal) return [];
                        if (typeof rawVal === "object" && !Array.isArray(rawVal) && rawVal.url) return [rawVal];
                        if (Array.isArray(rawVal)) return rawVal.filter((i) => i && typeof i === "object" && i.url);
                        if (typeof rawVal === "string" && isFileUrl(rawVal)) return [{ url: rawVal, name: "File" }];
                        return [];
                      })();

                      return (
                        <div key={key} className="cms-request-services-snapshot-row">
                          {/* Col 1 — key, inline-start, fixed width */}
                          <span className="cms-request-services-snapshot-key">{label}</span>

                          {/* Col 2 — value, centered */}
                          <span className="cms-request-services-snapshot-val">
                            {fileItems.length > 0
                              ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {fileItems.map((f, idx) => (
                                    <a key={idx} href={f.url} target="_blank" rel="noopener noreferrer"
                                      className="cms-request-services-link">
                                      {f.name || f.original_name || `File ${idx + 1}`}
                                    </a>
                                  ))}
                                </div>
                              )
                              : displayVal}
                          </span>

                          {/* Col 3 — badge, inline-end, fixed width */}
                          <span className="cms-request-services-snapshot-badge-col">
                            {editable === true && (
                              <span className="cms-request-services-snapshot-editable-badge">
                                {t("cms.requestservices.modal.editable", "editable")}
                              </span>
                            )}
                            {editable === false && (
                              <span className="cms-request-services-snapshot-readonly-badge">
                                {t("cms.requestservices.modal.readonly", "readonly")}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* ═══════════════ STATUS TAB ═══════════════ */}
      {activeTab === "status" && <RequestStatusActions request={request} onStatusChange={onStatusChange} />}

      {/* ═══════════════ ACCESS TAB ═══════════════ */}
      {activeTab === "access" && <RequestAccessPanel request={request} />}

      {/* ═══════════════ LOGS TAB ═══════════════ */}
      {activeTab === "logs" && <RequestAccessLogs request={request} />}

      {/* ═══════════════ HISTORY TAB ═══════════════ */}
      {activeTab === "history" && <RequestEditHistory request={request} />}

    </Modal>
  );
}

/* ── InfoField ── */
function InfoField({ label, children }) {
  return (
    <div className="cms-request-services-info-field">
      <span className="cms-request-services-info-label">{label}</span>
      <span className="cms-request-services-info-value">{children}</span>
    </div>
  );
}

/* ── Admin edit form ── */
function AdminEditForm({ snapshot, editValues, setEditValues, lang, saving, t, onCancel, onSave }) {
  const PROTECTED = ["service_ids", "job_id", "slot_id"];

  const editableEntries = Object.entries(snapshot).filter(([key, meta]) => {
    if (!meta || typeof meta !== "object" || Array.isArray(meta)) return true;
    if (meta.settings?.hidden || meta.settings?.internal) return false;
    if (meta.field_type === "hidden" || meta.editable === false) return false;
    if (PROTECTED.includes(meta.system_key || key)) return false;
    return true;
  });

  return (
    <div className="cms-request-services-admin-edit-form">
      {editableEntries.map(([key, meta]) => {
        const isRich = meta && typeof meta === "object" && !Array.isArray(meta);
        const label = isRich ? (lang === "ar" ? meta.label_ar || meta.label_en || key : meta.label_en || meta.label_ar || key) : key;
        const currentVal = editValues[key] ?? (isRich ? meta.value : meta) ?? "";
        const options = isRich ? meta.options || [] : [];
        const ft = isRich ? meta.field_type : "text";

        return (
          <div key={key} className="cms-request-services-field-group">
            <label className="cms-request-services-field-label">{label}</label>

            {ft === "file" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Array.isArray(currentVal) && currentVal.map((item, idx) => {
                  const existingUrl = item?.url;
                  const fileName = item?.name || item?.original_name || `File ${idx + 1}`;
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {existingUrl
                        ? <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="cms-request-services-link">{fileName}</a>
                        : <span>{fileName}</span>}
                    </div>
                  );
                })}
                <input
                  type="file"
                  multiple={meta.validation_rules?.multiple}
                  className="cms-request-services-input"
                  onChange={(e) => {
                    const sel = Array.from(e.target.files || []);
                    setEditValues((prev) => ({
                      ...prev,
                      [key]: meta.validation_rules?.multiple ? sel : sel[0] ? [sel[0]] : [],
                    }));
                  }}
                />
              </div>
            ) : ft === "textarea" ? (
              <textarea className="cms-request-services-input" rows={3}
                value={typeof currentVal === "string" ? currentVal : JSON.stringify(currentVal)}
                onChange={(e) => setEditValues((p) => ({ ...p, [key]: e.target.value }))} />
            ) : ft === "select" && options.length > 0 ? (
              <select className="cms-request-services-input" value={currentVal}
                onChange={(e) => setEditValues((p) => ({ ...p, [key]: e.target.value }))}>
                <option value="">—</option>
                {options.map((o) => (
                  <option key={o.value} value={o.value}>{lang === "ar" ? o.label_ar : o.label_en}</option>
                ))}
              </select>
            ) : ft === "radio" && options.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {options.map((o) => (
                  <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                    <input type="radio" name={key} value={o.value}
                      checked={currentVal === o.value}
                      onChange={() => setEditValues((p) => ({ ...p, [key]: o.value }))} />
                    {lang === "ar" ? o.label_ar : o.label_en}
                  </label>
                ))}
              </div>
            ) : ft === "checkbox" && options.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {options.map((o) => {
                  const arr = Array.isArray(currentVal) ? currentVal : [];
                  return (
                    <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                      <input type="checkbox" checked={arr.includes(o.value)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...arr, o.value]
                            : arr.filter((v) => v !== o.value);
                          setEditValues((p) => ({ ...p, [key]: next }));
                        }} />
                      {lang === "ar" ? o.label_ar : o.label_en}
                    </label>
                  );
                })}
              </div>
            ) : (
              <input type={ft === "number" ? "number" : ft === "email" ? "email" : "text"}
                className="cms-request-services-input"
                value={typeof currentVal === "string" || typeof currentVal === "number" ? currentVal : ""}
                onChange={(e) => setEditValues((p) => ({ ...p, [key]: e.target.value }))} />
            )}
          </div>
        );
      })}

      {/* Save / Cancel — SVG icon only for save, with loading state */}
      <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center" }}>
        <button
          className="cms-services-btn cms-services-btn--primary"
          onClick={onSave}
          disabled={saving}
          type="button"
          title={saving ? t("cms.requestservices.creating", "Saving…") : t("cms.requestservices.modal.save_changes", "Save changes")}
          style={{ padding: "9px 16px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44 }}
        >
          {saving ? <IconSpinner /> : <IconSave />}
        </button>
        <button className="cms-services-btn cms-services-btn--ghost" onClick={onCancel} disabled={saving} type="button">
          {t("cms.requestservices.cancel", "Cancel")}
        </button>
      </div>
    </div>
  );
}