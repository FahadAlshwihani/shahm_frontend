// src/pages/dashboard/CareersCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { getAdminJobs, createJob, updateJob, deleteJob } from "../../../api/careersApi";
import "../../../styles/CMS_TEAM.css";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../../components/common/dashboard/Pagination";
import Editbtn from "../../../components/common/dashboard/Editbtn";
import Deletebtn from "../../../components/common/dashboard/Deletebtn";
import { useSweetAlert } from "../../../components/common/SweetAlert";
import Modal from "../../../components/common/dashboard/Modal";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z" fill="currentColor" />
  </svg>
);
const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditJobModal({ job, onClose, onSave, saving, t, isRtl }) {
  const [titleAr, setTitleAr] = useState(job.title_ar || "");
  const [titleEn, setTitleEn] = useState(job.title_en || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) {
      toast.error(t("cms.careers.errors.title_required"));
      return;
    }
    onSave({ title_ar: titleAr, title_en: titleEn });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={t("cms.careers.edit_job")}
      dir={isRtl ? "rtl" : "ltr"}
      width={620}
      footer={
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            className="dashboard-careers-btn-ghost"
            onClick={onClose}
            type="button"
          >
            <IconX />
            {t("cms.careers.actions.cancel")}
          </button>
          <button
            className="dashboard-careers-btn-solid"
            onClick={handleSubmit}
            disabled={saving}
            type="button"
          >
            <IconSave />
            {saving ? t("cms.careers.actions.saving") : t("cms.careers.actions.save")}
          </button>
        </div>
      }
    >
      <div className="dashboard-careers-form-section">
        <div className="dashboard-careers-form-grid-row">
          <div className="dashboard-careers-form-group">
            <label className="dashboard-careers-label">
              {t("cms.careers.fields.title_ar")}
            </label>
            <input
              className="dashboard-careers-input"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder={t("cms.careers.placeholders.title_ar")}
              dir="rtl"
            />
          </div>
          <div className="dashboard-careers-form-group">
            <label className="dashboard-careers-label">
              {t("cms.careers.fields.title_en")}
            </label>
            <input
              className="dashboard-careers-input"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder={t("cms.careers.placeholders.title_en")}
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CareersCMS() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetAlertEl, show: showAlert } = useSweetAlert();

  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [editingJob, setEditingJob] = useState(null);

  const { currentPage, totalPages, paginatedData, goToPage } =
    usePagination(jobs, 15);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAdminJobs();
      setJobs(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch {
      toast.error(t("cms.careers.errors.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!titleAr.trim() && !titleEn.trim()) {
      return toast.error(t("cms.careers.errors.title_required"));
    }
    setSaving(true);
    try {
      await createJob({ title_ar: titleAr, title_en: titleEn });
      toast.success(t("cms.careers.success.job_created"));
      setTitleAr("");
      setTitleEn("");
      load();
    } catch {
      toast.error(t("cms.careers.errors.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleSaveEdit = async (payload) => {
    setSaving(true);
    try {
      await updateJob(editingJob.id, payload);
      toast.success(t("cms.careers.success.job_updated"));
      setEditingJob(null);
      load();
    } catch {
      toast.error(t("cms.careers.errors.save_failed"));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmed = await showAlert({
      type:        "confirm",
      title:       t("cms.careers.confirm_delete_title"),
      message:     t("cms.careers.confirm_delete"),
      confirmText: t("cms.careers.actions.delete"),
      cancelText:  t("cms.careers.actions.cancel"),
      showCancel:  true,
      isRtl,
    });
    if (!confirmed) return;
    try {
      await deleteJob(id);
      toast.success(t("cms.careers.success.job_deleted"));
      load();
    } catch {
      toast.error(t("cms.careers.errors.delete_failed"));
    }
  };

  return (
    <div className="dashboard-careers-container" dir={isRtl ? "rtl" : "ltr"}>
      {sweetAlertEl}

      {/* ── Page Header ── */}
      <div className="dashboard-careers-header">
        <div className="dashboard-careers-header-content">
          <h1 className="dashboard-careers-title">{t("cms.careers.title")}</h1>
          <p className="dashboard-careers-subtitle">{t("cms.careers.subtitle")}</p>
        </div>
      </div>

      {/* ── Create Form Card ── */}
      <div className="dashboard-careers-form-card">
        <div className="dashboard-careers-content-header">
          <div className="dashboard-careers-content-header-left">
            <IconBriefcase />
            <h2>{t("cms.careers.create_job")}</h2>
          </div>
        </div>

        <div className="dashboard-careers-form-section">
          <div className="dashboard-careers-form-grid-row">
            <div className="dashboard-careers-form-group">
              <label className="dashboard-careers-label">
                {t("cms.careers.fields.title_ar")}
              </label>
              <input
                className="dashboard-careers-input"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={t("cms.careers.placeholders.title_ar")}
                dir="rtl"
              />
            </div>
            <div className="dashboard-careers-form-group">
              <label className="dashboard-careers-label">
                {t("cms.careers.fields.title_en")}
              </label>
              <input
                className="dashboard-careers-input"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={t("cms.careers.placeholders.title_en")}
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="dashboard-careers-form-actions">
          <button
            className="dashboard-careers-btn-solid"
            onClick={handleCreate}
            disabled={saving}
          >
            <IconPlus />
            {t("cms.careers.actions.create")}
          </button>
        </div>
      </div>

      {/* ── Jobs List Card ── */}
      <div className="dashboard-careers-list-card">
        <div className="dashboard-careers-list-header">
          <div className="dashboard-careers-list-title-wrapper">
            <IconList />
            <h3>{t("cms.careers.jobs_list")}</h3>
          </div>
          <span className="dashboard-careers-count-badge">{jobs.length}</span>
        </div>

        {loading ? (
          <div className="dashboard-careers-empty">
            <div className="dashboard-careers-spinner" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="dashboard-careers-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M40 12H32V8C32 5.79 30.21 4 28 4H20C17.79 4 16 5.79 16 8V12H8C5.79 12 4.02 13.79 4.02 16L4 38C4 40.21 5.79 42 8 42H40C42.21 42 44 40.21 44 38V16C44 13.79 42.21 12 40 12ZM20 8H28V12H20V8Z" fill="currentColor" />
            </svg>
            <p>{t("cms.careers.empty")}</p>
          </div>
        ) : (
          <>
            <div className="dashboard-careers-table-wrapper">
              <table className="dashboard-careers-table">
                <thead>
                  <tr>
                    <th className="dashboard-careers-th--id">
                      {t("cms.careers.table.id")}
                    </th>
                    <th className="dashboard-careers-th--rtl">
                      {t("cms.careers.table.title_ar")}
                    </th>
                    <th className="dashboard-careers-th--ltr">
                      {t("cms.careers.table.title_en")}
                    </th>
                    <th>{t("cms.careers.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((job) => (
                    <tr key={job.id}>
                      <td className="dashboard-careers-td--id">{job.id}</td>
                      <td className="dashboard-careers-td--rtl">{job.title_ar}</td>
                      <td className="dashboard-careers-td--ltr">{job.title_en}</td>
                      <td>
                        <div className="dashboard-careers-table-actions">
                          <Editbtn onClick={() => setEditingJob(job)} />
                          <Deletebtn onConfirm={() => handleDelete(job.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveEdit}
          saving={saving}
          t={t}
          isRtl={isRtl}
        />
      )}
    </div>
  );
}