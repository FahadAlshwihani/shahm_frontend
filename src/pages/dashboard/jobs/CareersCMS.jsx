// src/pages/dashboard/CareersCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getAdminJobs, createJob, deleteJob } from "../../../api/careersApi";
import "../../../styles/CMS_TEAM.css";

export default function CareersCMS() {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAdminJobs();
    setJobs(res.data || []);
  };

  const handleCreate = async () => {
    if (!titleAr.trim() || !titleEn.trim()) {
      return toast.error(t("cms.careers.errors.title_required"));
    }

    try {
      await createJob({
        title_ar: titleAr,
        title_en: titleEn,
      });

      toast.success(t("cms.careers.success.job_created"));
      setTitleAr("");
      setTitleEn("");
      load();
    } catch (error) {
      toast.error(t("cms.careers.errors.save_failed"));
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("cms.careers.confirm_delete_title"),
      text: t("cms.careers.confirm_delete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.careers.actions.delete"),
      cancelButtonText: t("cms.careers.actions.cancel"),
      reverseButtons: i18n.language === "ar",
    });

    if (result.isConfirmed) {
      await deleteJob(id);
      Swal.fire({
        title: t("cms.careers.deleted_title"),
        text: t("cms.careers.success.job_deleted"),
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
      load();
    }
  };

  return (
    <div className="dashboard-careers-container">
      <div className="dashboard-careers-header">
        <div className="dashboard-careers-header-content">
          <h1 className="dashboard-careers-title">{t("cms.careers.title")}</h1>
          <p className="dashboard-careers-subtitle">{t("cms.careers.subtitle")}</p>
        </div>
      </div>

      <div className="dashboard-careers-form-card">
        <div className="dashboard-careers-content-header">
          <div className="dashboard-careers-content-header-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z" fill="currentColor"/>
            </svg>
            <h2>{t("cms.careers.create_job")}</h2>
          </div>
        </div>

        <div className="dashboard-careers-form-section">
          <div className="dashboard-careers-form-grid-row">
            <div className="dashboard-careers-form-group">
              <label className="dashboard-careers-label">{t("cms.careers.fields.title_ar")}</label>
              <input
                className="dashboard-careers-input"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={t("cms.careers.placeholders.title_ar")}
                dir="rtl"
              />
            </div>
            <div className="dashboard-careers-form-group">
              <label className="dashboard-careers-label">{t("cms.careers.fields.title_en")}</label>
              <input
                className="dashboard-careers-input"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={t("cms.careers.placeholders.title_en")}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-careers-form-actions">
          <button className="dashboard-careers-btn-primary" onClick={handleCreate}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {t("cms.careers.actions.create")}
          </button>
        </div>
      </div>

      <div className="dashboard-careers-list-card">
        <div className="dashboard-careers-list-header">
          <div className="dashboard-careers-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h3>{t("cms.careers.jobs_list")}</h3>
          </div>
          <span className="dashboard-careers-count-badge">{jobs.length}</span>
        </div>

        {jobs.length > 0 ? (
          <div className="dashboard-careers-table-wrapper">
            <table className="dashboard-careers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("cms.careers.table.title_ar")}</th>
                  <th>{t("cms.careers.table.title_en")}</th>
                  <th>{t("cms.careers.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td className="dashboard-careers-table-id">{j.id}</td>
                    <td className="dashboard-careers-table-name">{j.title_ar}</td>
                    <td className="dashboard-careers-table-name">{j.title_en}</td>
                    <td>
                      <div className="dashboard-careers-table-actions">
                        <button
                          className="dashboard-careers-btn-delete"
                          onClick={() => handleDelete(j.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                          </svg>
                          {t("cms.careers.actions.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-careers-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M40 12H32V8C32 5.79 30.21 4 28 4H20C17.79 4 16 5.79 16 8V12H8C5.79 12 4.02 13.79 4.02 16L4 38C4 40.21 5.79 42 8 42H40C42.21 42 44 40.21 44 38V16C44 13.79 42.21 12 40 12ZM20 8H28V12H20V8Z" fill="currentColor"/>
            </svg>
            <p>{t("cms.careers.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}