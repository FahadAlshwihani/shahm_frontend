// src/pages/dashboard/services/requests/components/RequestAccessPanel.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSweetAlert } from "../../../../../components/common/SweetAlert";
import { useFormBuilderStore } from "../../../../../store/useFormBuilderStore";
import useRequestAccess from "../hooks/useRequestAccess";
import { copyToClipboard, formatDateTime } from "../utils/requestHelpers";

/* ── Icons ─────────────────────────────────────────────────── */
const IcoLock = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M8 1a3 3 0 00-3 3v1H3a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1h-2V4a3 3 0 00-3-3zm0 2a1 1 0 011 1v1H7V4a1 1 0 011-1zm0 5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
  </svg>
);
const IcoPlus = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoX = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M11.5 1.5L1.5 11.5M1.5 1.5L11.5 11.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
const IcoCheck = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoCopy = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="5" y="5" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 9V2h7v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoRegen = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7a5 5 0 015-5 5 5 0 014.33 2.5M12 7a5 5 0 01-5 5 5 5 0 01-4.33-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10.5 4.5V2M10.5 2h-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 9.5V12M3.5 12H6"    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoRevoke = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IcoLink = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5.5 8.5a3.5 3.5 0 005 0l1.5-1.5a3.5 3.5 0 00-5-5L6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8.5 5.5a3.5 3.5 0 00-5 0L2 7a3.5 3.5 0 005 5L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoInfo = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7 5v-.5M7 7v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IcoSpinner = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="cms-svc-btn-spin">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
      strokeDasharray="26" strokeDashoffset="8" strokeLinecap="round" />
  </svg>
);

/* ── Helpers ────────────────────────────────────────────────── */
const linkStatusClass = (status) => {
  if (status === "active")  return "cms-request-services-link-badge cms-request-services-link-badge--active";
  if (status === "revoked") return "cms-request-services-link-badge cms-request-services-link-badge--revoked";
  return "cms-request-services-link-badge cms-request-services-link-badge--expired";
};

/* ── Divider ────────────────────────────────────────────────── */
function SectionDivider({ label, count }) {
  return (
    <div className="cms-access-divider">
      <div className="cms-access-divider-line" />
      <span className="cms-access-divider-label">
        {label}
        {count != null && (
          <span className="cms-access-divider-count">{count}</span>
        )}
      </span>
      <div className="cms-access-divider-line" />
    </div>
  );
}

/* ── Single link card ───────────────────────────────────────── */
function LinkCard({ link, onCopy, onRegenerate, onRevoke, actionLoading, t, i18n }) {
  const isActive = link.status === "active";

  return (
    <div className={`cms-request-services-link-card${!isActive ? " cms-request-services-link-card--inactive" : ""}`}>

      {/* Card header */}
      <div className="cms-request-services-link-card-header">
        <span className={linkStatusClass(link.status)}>
          {t(`cms.requestservices.access.status.${link.status}`, link.status)}
        </span>

        {(link.selected_form || link.form_title_ar || link.form_title_en) && (
          <span className="cms-request-services-link-form-label">
            {link.selected_form
              ? (i18n.language === "ar" ? link.selected_form.title_ar : link.selected_form.title_en)
              : (i18n.language === "ar"
                  ? link.form_title_ar || link.form_title_en
                  : link.form_title_en || link.form_title_ar)}
          </span>
        )}

        <code className="cms-request-services-link-key" title={link.public_key}>
          {link.public_key?.slice(0, 12)}…
        </code>

        <div className="cms-request-services-link-card-actions">
          {/* Copy URL — always available */}
          <button
            className="cms-request-services-icon-btn cms-request-services-icon-btn--copy"
            onClick={() => onCopy(link.access_url)}
            title={t("cms.requestservices.access.copy_url", "Copy access URL")}
          >
            <IcoCopy />
          </button>

          {isActive && (
            <>
              <button
                className="cms-request-services-icon-btn cms-request-services-icon-btn--regen"
                onClick={() => onRegenerate(link.id)}
                disabled={actionLoading}
                title={t("cms.requestservices.access.regenerate", "Regenerate")}
              >
                <IcoRegen />
              </button>
              <button
                className="cms-request-services-icon-btn cms-request-services-icon-btn--danger"
                onClick={() => onRevoke(link.id)}
                disabled={actionLoading}
                title={t("cms.requestservices.access.revoke", "Revoke")}
              >
                <IcoRevoke />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Meta grid */}
      <div className="cms-request-services-link-meta-grid">
        <div className="cms-request-services-link-meta-item">
          <span className="cms-request-services-link-meta-label">{t("cms.requestservices.access.edits", "Edits")}</span>
          <span className="cms-request-services-link-meta-value">{link.edit_count ?? 0} / {link.max_edits ?? "—"}</span>
        </div>
        <div className="cms-request-services-link-meta-item">
          <span className="cms-request-services-link-meta-label">{t("cms.requestservices.access.created_at", "Created")}</span>
          <span className="cms-request-services-link-meta-value">{formatDateTime(link.created_at)}</span>
        </div>
        <div className="cms-request-services-link-meta-item">
          <span className="cms-request-services-link-meta-label">{t("cms.requestservices.access.expires_at", "Expires")}</span>
          <span className="cms-request-services-link-meta-value">{formatDateTime(link.expires_at)}</span>
        </div>
        {link.verified_at && (
          <div className="cms-request-services-link-meta-item">
            <span className="cms-request-services-link-meta-label">{t("cms.requestservices.access.verified_at", "Verified")}</span>
            <span className="cms-request-services-link-meta-value">{formatDateTime(link.verified_at)}</span>
          </div>
        )}
        {link.last_accessed_at && (
          <div className="cms-request-services-link-meta-item">
            <span className="cms-request-services-link-meta-label">{t("cms.requestservices.access.last_accessed", "Last Accessed")}</span>
            <span className="cms-request-services-link-meta-value">{formatDateTime(link.last_accessed_at)}</span>
          </div>
        )}
      </div>

      {/* URL row */}
      <div className="cms-request-services-link-url-row">
        <span className="cms-access-url-icon"><IcoLink /></span>
        <input
          readOnly
          className="cms-request-services-input cms-request-services-input--url"
          value={link.access_url || ""}
          onClick={(e) => e.target.select()}
        />
        <button
          className="cms-request-services-btn-copy-full"
          onClick={() => onCopy(link.access_url)}
        >
          <IcoCopy />
          {t("cms.requestservices.access.copy", "Copy")}
        </button>
      </div>

    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function RequestAccessPanel({ request }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetEl, show: showAlert } = useSweetAlert();
  const { forms, fetchForms } = useFormBuilderStore();

  const {
    links, linksLoading, linksError, actionLoading,
    fetchLinks, createLink, revokeLink, regenerateLink, resetLinks,
  } = useRequestAccess();

  const [createForm, setCreateForm] = useState({
    form_id: "", editable_fields: [], expires_in_hours: 72, max_edits: 3,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  const hasSubmission = Boolean(request?.form_submission_id || request?.form_submission);

  useEffect(() => {
    if (request?.id && hasSubmission) { fetchLinks(request.id); fetchForms(); }
    else resetLinks();
  }, [request?.id, hasSubmission, fetchLinks, fetchForms, resetLinks]);

  /* ── Actions ── */
  const handleCreate = async () => {
    if (!createForm.form_id) {
      toast.error(t("cms.requestservices.access.form_required"));
      return;
    }
    const result = await createLink(request.id, createForm);
    if (result.success) {
      toast.success(t("cms.requestservices.access.created"));
      setShowCreateForm(false);
      setCreateForm({ form_id: "", editable_fields: [], expires_in_hours: 72, max_edits: 3 });
    } else {
      toast.error(result.error || t("cms.requestservices.access.create_failed"));
    }
  };

  const handleRevoke = async (linkId) => {
    const confirmed = await showAlert({
      type: "confirm",
      title:       t("cms.requestservices.access.revoke_title"),
      message:     t("cms.requestservices.access.revoke_text"),
      confirmText: t("cms.requestservices.access.revoke_btn"),
      cancelText:  t("cms.requestservices.cancel"),
      showCancel: true, isRtl,
    });
    if (!confirmed) return;
    const result = await revokeLink(linkId);
    if (result.success) toast.success(t("cms.requestservices.access.revoked"));
    else toast.error(result.error || t("cms.requestservices.access.revoke_failed"));
  };

  const handleRegenerate = async (linkId) => {
    const confirmed = await showAlert({
      type: "confirm",
      title:       t("cms.requestservices.access.regen_title"),
      message:     t("cms.requestservices.access.regen_text"),
      confirmText: t("cms.requestservices.access.regen_btn"),
      cancelText:  t("cms.requestservices.cancel"),
      showCancel: true, isRtl,
    });
    if (!confirmed) return;
    const result = await regenerateLink(linkId);
    if (result.success) toast.success(t("cms.requestservices.access.regenerated"));
    else toast.error(result.error || t("cms.requestservices.access.regen_failed"));
  };

  const handleCopy = async (url) => {
    const ok = await copyToClipboard(url);
    if (ok) toast.success(t("cms.requestservices.access.copied"));
    else toast.error(t("cms.requestservices.access.copy_failed"));
  };

  /* ── Sort: active first, then revoked/expired ── */
  const activeLinks   = links.filter((l) => l.status === "active");
  const inactiveLinks = links.filter((l) => l.status !== "active");

  /* ── No submission state ── */
  if (!hasSubmission) {
    return (
      <div className="cms-request-services-access-panel">
        {sweetEl}
        <PanelHeader t={t} count={0} onNew={null} actionLoading={false} />
        <div className="cms-request-services-access-empty">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.3">
            <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm0 22C10.5 26 6 21.5 6 16S10.5 6 16 6s10 4.5 10 10-4.5 10-10 10zm-1-7h2v2h-2v-2zm0-10h2v8h-2V9z" fill="currentColor" />
          </svg>
          <p>{t("cms.requestservices.access.no_submission")}</p>
          <p className="cms-request-services-access-empty-hint">
            {t("cms.requestservices.access.no_submission_hint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-request-services-access-panel">
      {sweetEl}

      {/* ── Panel header ── */}
      <PanelHeader
        t={t}
        count={links.length}
        onNew={() => setShowCreateForm((v) => !v)}
        actionLoading={actionLoading}
        showCreateForm={showCreateForm}
      />

      {/* ── Create link form ── */}
      {showCreateForm && (
        <div className="cms-request-services-create-link-form">

          {/* Form heading */}
          <div className="cms-access-form-heading">
            <IcoLock />
            <span>{t("cms.requestservices.access.new_link_heading", "New Access Link")}</span>
          </div>

          <div className="cms-request-services-create-link-row">

            {/* Form select */}
            <div className="cms-request-services-field-group">
              <label className="cms-request-services-field-label">
                {t("cms.requestservices.access.form")}
              </label>
              <select
                className="cms-request-services-input"
                value={createForm.form_id}
                onChange={(e) => {
                  const formId = Number(e.target.value);
                  const selectedForm = forms.find((f) => f.id === formId);
                  const BLOCKED = ["service_ids", "slot_id", "job_id"];
                  const editableFields =
                    selectedForm?.sections
                      ?.flatMap((s) => s.fields || [])
                      .filter((field) =>
                        !field.is_hidden && !field.settings?.hidden &&
                        !field.settings?.internal && !BLOCKED.includes(field.system_key)
                      )
                      .map((field) => field.key)
                      .filter(Boolean) || [];
                  setCreateForm((prev) => ({ ...prev, form_id: formId, editable_fields: editableFields }));
                }}
              >
                <option value="">{t("cms.requestservices.access.select_form")}</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {i18n.language === "ar" ? form.title_ar : form.title_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Expires */}
            <div className="cms-request-services-field-group">
              <label className="cms-request-services-field-label">
                {t("cms.requestservices.access.expires_hours")}
              </label>
              <input
                type="number"
                className="cms-request-services-input"
                value={createForm.expires_in_hours}
                min={1} max={720}
                onChange={(e) => setCreateForm((f) => ({ ...f, expires_in_hours: Number(e.target.value) }))}
              />
            </div>

            {/* Max edits */}
            <div className="cms-request-services-field-group">
              <label className="cms-request-services-field-label">
                {t("cms.requestservices.access.max_edits")}
              </label>
              <input
                type="number"
                className="cms-request-services-input"
                value={createForm.max_edits}
                min={1} max={50}
                onChange={(e) => setCreateForm((f) => ({ ...f, max_edits: Number(e.target.value) }))}
              />
            </div>

          </div>

          {/* Actions — styled */}
          <div className="cms-access-form-actions">
            <button
              className="cms-access-btn-create"
              onClick={handleCreate}
              disabled={actionLoading}
              type="button"
            >
              {actionLoading ? <IcoSpinner /> : <IcoCheck />}
              {actionLoading
                ? t("cms.requestservices.creating")
                : t("cms.requestservices.access.create_btn")}
            </button>
            <button
              className="cms-access-btn-cancel"
              onClick={() => {
                setShowCreateForm(false);
                setCreateForm({ form_id: "", editable_fields: [], expires_in_hours: 72, max_edits: 3 });
              }}
              disabled={actionLoading}
              type="button"
            >
              <IcoX />
              {t("cms.requestservices.cancel")}
            </button>
          </div>

        </div>
      )}

      {/* ── Link list ── */}
      {linksLoading ? (
        <div className="cms-request-services-panel-loading">
          <span className="cms-request-services-spinner" />
          {t("cms.requestservices.loading")}
        </div>
      ) : linksError ? (
        <div className="cms-request-services-panel-error">{linksError}</div>
      ) : links.length === 0 ? (
        <div className="cms-request-services-access-empty">
          <IcoLock />
          <p>{t("cms.requestservices.access.no_links")}</p>
          <p className="cms-request-services-access-empty-hint">
            {t("cms.requestservices.access.no_links_hint",
              "Click \"New Link\" above to generate a secure access link for the client.")}
          </p>
        </div>
      ) : (
        <div className="cms-request-services-link-list">

          {/* Active links — always first */}
          {activeLinks.length > 0 && (
            <>
              <SectionDivider
                label={t("cms.requestservices.access.section_active", "Active")}
                count={activeLinks.length}
              />
              {activeLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerate}
                  onRevoke={handleRevoke}
                  actionLoading={actionLoading}
                  t={t}
                  i18n={i18n}
                />
              ))}
            </>
          )}

          {/* Inactive links — revoked / expired — always below */}
          {inactiveLinks.length > 0 && (
            <>
              <SectionDivider
                label={t("cms.requestservices.access.section_inactive", "Revoked / Expired")}
                count={inactiveLinks.length}
              />
              {inactiveLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerate}
                  onRevoke={handleRevoke}
                  actionLoading={actionLoading}
                  t={t}
                  i18n={i18n}
                />
              ))}
            </>
          )}

        </div>
      )}
    </div>
  );
}

/* ── Panel header component ── */
function PanelHeader({ t, count, onNew, actionLoading, showCreateForm }) {
  return (
    <div className="cms-request-services-panel-header">
      <span className="cms-request-services-panel-icon cms-request-services-panel-icon--blue">
        <IcoLock />
      </span>
      <h4 className="cms-request-services-panel-title">
        {t("cms.requestservices.access.title")}
      </h4>
      <span className="cms-request-services-count-pill">{count}</span>
      {onNew && (
        <button
          className={`cms-request-services-btn-create-link${showCreateForm ? " cms-request-services-btn-create-link--active" : ""}`}
          onClick={onNew}
          disabled={actionLoading}
          type="button"
        >
          {showCreateForm ? <IcoX /> : <IcoPlus />}
          {showCreateForm
            ? t("cms.requestservices.cancel")
            : t("cms.requestservices.access.new_link")}
        </button>
      )}
    </div>
  );
}