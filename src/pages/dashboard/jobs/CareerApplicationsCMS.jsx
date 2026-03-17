// src/pages/dashboard/CareerApplicationsCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApplications } from "../../../api/careersApi";
import axiosClient from "../../../api/axiosClient";
import "../../../styles/CMS_TEAM.css";

export default function CareerApplicationsCMS() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getApplications();
    setItems(res.data || []);
  };

  // Get base URL from axios instance
  const getFileUrl = (path) => {
    if (!path) return null;
    return `${axiosClient.defaults.baseURL.replace('/api', '')}${path}`;
  };

  return (
    <div className="dashboard-applications-container">
      <div className="dashboard-applications-header">
        <div className="dashboard-applications-header-content">
          <h1 className="dashboard-applications-title">{t("cms.applications.title")}</h1>
          <p className="dashboard-applications-subtitle">{t("cms.applications.subtitle")}</p>
        </div>
      </div>

      <div className="dashboard-applications-list-card">
        <div className="dashboard-applications-list-header">
          <div className="dashboard-applications-list-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
            </svg>
            <h3>{t("cms.applications.applications_list")}</h3>
          </div>
          <span className="dashboard-applications-count-badge">{items.length}</span>
        </div>

        {items.length > 0 ? (
          <div className="dashboard-applications-table-wrapper">
            <table className="dashboard-applications-table">
              <thead>
                <tr>
                  <th>{t("cms.applications.table.name_en")}</th>
                  <th>{t("cms.applications.table.name_ar")}</th>
                  <th>{t("cms.applications.table.phone")}</th>
                  <th>{t("cms.applications.table.email")}</th>
                  <th>{t("cms.applications.table.nationality")}</th>
                  <th>{t("cms.applications.table.gender")}</th>
                  <th>{t("cms.applications.table.location")}</th>
                  <th>{t("cms.applications.table.source")}</th>
                  <th>{t("cms.applications.table.job")}</th>
                  <th>{t("cms.applications.table.id_number")}</th>
                  <th>{t("cms.applications.table.linkedin")}</th>
                  <th>{t("cms.applications.table.certifications")}</th>
                  <th>{t("cms.applications.table.notes")}</th>
                  <th>{t("cms.applications.table.cv")}</th>
                  <th>{t("cms.applications.table.cover_letter")}</th>
                  <th>{t("cms.applications.table.date")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td className="dashboard-applications-table-name">
                      {a.first_name} {a.last_name}
                    </td>
                    <td className="dashboard-applications-table-name" dir="rtl">
                      {a.first_name_ar} {a.last_name_ar}
                    </td>
                    <td>{a.phone}</td>
                    <td className="dashboard-applications-table-email">{a.email}</td>
                    <td>{a.nationality}</td>
                    <td>{a.gender}</td>
                    <td>{a.location}</td>
                    <td>{a.source}</td>
                    <td className="dashboard-applications-table-job">{a.job_title}</td>
                    <td>{a.id_number}</td>
                    <td>
                      {a.linkedin && (
                        <a
                          className="dashboard-applications-link"
                          href={
                            a.linkedin?.startsWith("http")
                              ? a.linkedin
                              : `https://${a.linkedin}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 7.66667V11H8.66667V8C8.66667 7.26667 8.4 6.66667 7.6 6.66667C7.06667 6.66667 6.73333 7 6.6 7.33333C6.53333 7.46667 6.53333 7.66667 6.53333 7.86667V11H4.2C4.2 11 4.23333 5.66667 4.2 5H6.53333V6C6.8 5.6 7.26667 5 8.33333 5C9.66667 5 10.66667 5.86667 10.66667 7.6V11H11V7.66667ZM2.33333 4H2.33333C1.66667 4 1.33333 3.6 1.33333 3.06667C1.33333 2.53333 1.66667 2.13333 2.4 2.13333C3.06667 2.13333 3.4 2.53333 3.4 3.06667C3.4 3.6 3.06667 4 2.33333 4ZM1.2 11H3.53333V5H1.2V11Z" fill="currentColor"/>
                          </svg>
                          {t("cms.applications.actions.open")}
                        </a>
                      )}
                    </td>
                    <td className="dashboard-applications-table-text">{a.certifications}</td>
                    <td className="dashboard-applications-table-notes">{a.notes}</td>
                    <td>
                      {a.cv_file && (
                        <a
                          className="dashboard-applications-link-download"
                          href={getFileUrl(a.cv_file)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12 9V11.6667C12 12.0333 11.7 12.3333 11.3333 12.3333H2.66667C2.3 12.3333 2 12.0333 2 11.6667V9H3.33333V11H10.6667V9H12ZM10.6667 6.33333L9.72667 5.39333L7.66667 7.44667V2H6.33333V7.44667L4.27333 5.39333L3.33333 6.33333L7 10L10.6667 6.33333Z" fill="currentColor"/>
                          </svg>
                          {t("cms.applications.actions.download")}
                        </a>
                      )}
                    </td>
                    <td>
                      {a.cover_letter && (
                        <a
                          className="dashboard-applications-link-download"
                          href={getFileUrl(a.cover_letter)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12 9V11.6667C12 12.0333 11.7 12.3333 11.3333 12.3333H2.66667C2.3 12.3333 2 12.0333 2 11.6667V9H3.33333V11H10.6667V9H12ZM10.6667 6.33333L9.72667 5.39333L7.66667 7.44667V2H6.33333V7.44667L4.27333 5.39333L3.33333 6.33333L7 10L10.6667 6.33333Z" fill="currentColor"/>
                          </svg>
                          {t("cms.applications.actions.download")}
                        </a>
                      )}
                    </td>
                    <td className="dashboard-applications-table-date">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-applications-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M40 12H32V8C32 5.79 30.21 4 28 4H20C17.79 4 16 5.79 16 8V12H8C5.79 12 4.02 13.79 4.02 16L4 38C4 40.21 5.79 42 8 42H40C42.21 42 44 40.21 44 38V16C44 13.79 42.21 12 40 12ZM20 8H28V12H20V8Z" fill="currentColor"/>
            </svg>
            <p>{t("cms.applications.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}