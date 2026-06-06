// src/pages/dashboard/services/ImportServices.jsx
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { importServicesExcel } from "../../../api/servicesApi";
import {
  IconCheck, IconAlert, IconUpload, IconInfo,
  SvcSpinner, SvcDivider, SvcContentHeader, SvcCardHeader,
} from "./_shared";

const SHEETS = [
  {
    name: "main_services",
    columns: ["code", "title_en", "title_ar", "order"],
    example: [
      { code: "CORP", title_en: "Corporate Law", title_ar: "قانون الشركات", order: 1 },
      { code: "PROP", title_en: "Property Law",  title_ar: "قانون الملكية",  order: 2 },
    ],
  },
  {
    name: "services",
    columns: ["main_code", "title_en", "title_ar", "short_description_en", "short_description_ar", "order"],
    example: [
      { main_code: "CORP", title_en: "Contract Drafting", title_ar: "صياغة العقود",
        short_description_en: "...", short_description_ar: "...", order: 1 },
    ],
  },
  {
    name: "sections",
    columns: ["service_slug", "title_en", "title_ar", "subtitle_en", "subtitle_ar", "content_en", "content_ar", "order"],
    example: [
      { service_slug: "contract-drafting", title_en: "Overview", title_ar: "نظرة عامة",
        subtitle_en: "...", subtitle_ar: "...", content_en: "...", content_ar: "...", order: 1 },
    ],
  },
];

const IconImport = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2v9M6 8l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 13v1.5A1.5 1.5 0 004 16h10a1.5 1.5 0 001.5-1.5V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconSheet = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 5h12M5 5v7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IconTip = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 4.5v.5M7 7v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function ImportServices() {
  const { t } = useTranslation();
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowed.includes(f.type) && !f.name.match(/\.(xlsx|xls)$/i)) {
      toast.error(t("cms.services.import.invalid_file"));
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
  };

  const onDrop    = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = async () => {
    if (!file) { toast.error(t("cms.services.import.no_file")); return; }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await importServicesExcel(file);
      setResult(res.data);
      toast.success(t("cms.services.import.success"));
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.response?.data?.error || t("cms.services.import.error");
      setError(detail);
      toast.error(t("cms.services.import.error"));
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null); setResult(null); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="cms-services-content">
      <SvcContentHeader
        icon={<IconImport />}
        title={t("cms.services.import.title")}
        subtitle={t("cms.services.import.subtitle")}
      />

      {/* ── Upload card ── */}
      <div className="cms-services-card cms-services-card--glass">
        <SvcCardHeader icon={<IconImport />} accent="blue" title={t("cms.services.import.upload_section")} />
        <div className="cms-services-form">
          <SvcDivider icon={<IconUpload />} label={t("cms.services.import.upload_section")} />

          {/* Drop zone */}
          <div
            className={`cms-services-dropzone ${dragging ? "cms-services-dropzone--active" : ""} ${file ? "cms-services-dropzone--has-file" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".xlsx,.xls"
              className="cms-services-file-input"
              onChange={(e) => handleFile(e.target.files[0])} />

            <div className="cms-services-dropzone-icon">
              {file ? <IconCheck /> : <IconUpload />}
            </div>
            <p className="cms-services-dropzone-main">
              {file ? file.name : t("cms.services.import.drop_hint")}
            </p>
            <p className="cms-services-dropzone-sub">
              {t("cms.services.import.accepts")}
            </p>
          </div>

          {/* Actions */}
          <div className="cms-services-form-actions">
            <button type="button" className="cms-services-btn cms-services-btn--primary"
              onClick={handleSubmit} disabled={loading || !file}>
              {loading ? <SvcSpinner /> : <IconImport />}
              {loading ? t("cms.services.import.importing") : t("cms.services.import.run_import")}
            </button>
            {(file || result || error) && (
              <button type="button" className="cms-services-btn cms-services-btn--ghost" onClick={resetAll}>
                {t("cms.services.import.reset")}
              </button>
            )}
          </div>

          {/* ── Result ── */}
          {result && (
            <div className="cms-services-result-box cms-services-result-box--success">
              <div className="cms-services-result-header">
                <IconCheck />
                <h4>{t("cms.services.import.success_title")}</h4>
              </div>
              <div className="cms-services-result-stats">
                {[
                  { label: t("cms.services.import.main_services_created"), value: result.main_services_created },
                  { label: t("cms.services.import.services_created"),      value: result.services_created },
                  { label: t("cms.services.import.sections_created"),      value: result.sections_created },
                ].map(({ label, value }) => (
                  <div key={label} className="cms-services-stat-card">
                    <div className="cms-services-stat-value">{value ?? 0}</div>
                    <div className="cms-services-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="cms-services-result-box cms-services-result-box--error">
              <div className="cms-services-result-header">
                <IconAlert />
                <h4>{t("cms.services.import.error_title")}</h4>
              </div>
              <p className="cms-services-result-message">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Schema reference card ── */}
      <div className="cms-services-card">
        <SvcCardHeader
          icon={<IconSheet />}
          accent="purple"
          title={t("cms.services.import.schema_title")}
          right={
            <div className="cms-services-sheet-chips">
              {SHEETS.map((s) => (
                <span key={s.name} className="cms-services-sheet-chip">{s.name}</span>
              ))}
            </div>
          }
        />
        <div className="cms-services-form">
          <p className="cms-services-schema-desc">{t("cms.services.import.schema_description")}</p>

          {SHEETS.map((sheet) => (
            <div key={sheet.name} className="cms-services-schema-block">
              <div className="cms-services-schema-header">
                <IconSheet />
                <span className="cms-services-schema-name">
                  Sheet: <code className="cms-services-inline-code">{sheet.name}</code>
                </span>
              </div>
              <div className="cms-services-col-chips">
                {sheet.columns.map((col) => (
                  <code key={col} className="cms-services-col-chip">{col}</code>
                ))}
              </div>
              <div className="cms-services-table-wrapper cms-services-table-wrapper--sm">
                <table className="cms-services-table">
                  <thead>
                    <tr>{sheet.columns.map((col) => <th key={col}>{col}</th>)}</tr>
                  </thead>
                  <tbody>
                    {sheet.example.map((row, idx) => (
                      <tr key={idx}>
                        {sheet.columns.map((col) => (
                          <td key={col} className="cms-services-muted">{row[col] ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="cms-services-tips-box">
            <div className="cms-services-tips-header">
              <IconTip />
              <span>{t("cms.services.import.tips_title")}</span>
            </div>
            <ul className="cms-services-tips-list">
              <li>{t("cms.services.import.tip1")}</li>
              <li>{t("cms.services.import.tip2")}</li>
              <li>{t("cms.services.import.tip3")}</li>
              <li>{t("cms.services.import.tip4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}