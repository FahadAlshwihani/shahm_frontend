// src/pages/dashboard/CareerApplicationsCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApplications } from "../../../api/careersApi";
import "../../../styles/CMS_TEAM.css";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../../components/common/dashboard/Pagination";

export default function CareerApplicationsCMS() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
  } = usePagination(items, 15);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getApplications();
    setItems(
      Array.isArray(res.data)
        ? res.data
        : res.data.results || []
    );
  };


  const buildFieldsMap = (application) => {
    return Object.fromEntries(
      (application.dynamic_fields || []).map((field) => [
        field.system_key || field.key,
        field.value,
      ])
    );
  };

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      if ("country_code" in value || "number" in value) {
        return `${value.country_code || ""}${value.number || ""}`.trim() || "-";
      }

      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "-";
    }

    return value;
  };

  const getUrlValue = (value) => {
    if (!value || typeof value !== "string") return null;
    return value.startsWith("http") ? value : `https://${value}`;
  };

  const getAllFiles = (application) => {
    return application?.files || [];
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
              <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor" />
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
                {paginatedData.map((a) => {

                  const fields = buildFieldsMap(a);
                  const allFiles = getAllFiles(a);

                  const filesMap = (a.files || []).reduce(
                    (acc, file) => {

                      const key =
                        file.system_key || file.key;

                      if (!acc[key]) {
                        acc[key] = [];
                      }

                      acc[key].push(file);

                      return acc;

                    },
                    {}
                  );

                  const cvFiles =
                    filesMap.cv_file || [];

                  const coverFiles =
                    filesMap.cover_letter || [];

                  return (
                    <tr key={a.id}>
                      <td className="dashboard-applications-table-name">
                        {renderValue(fields.first_name)} {renderValue(fields.last_name)}
                      </td>

                      <td
                        className="dashboard-applications-table-name"
                        dir="rtl"
                      >
                        {renderValue(fields.first_name_ar)} {renderValue(fields.last_name_ar)}
                      </td>

                      <td>
                        {renderValue(fields.phone)}
                      </td>

                      <td className="dashboard-applications-table-email">
                        {renderValue(fields.email)}
                      </td>

                      <td>
                        {renderValue(fields.nationality)}
                      </td>

                      <td>
                        {renderValue(fields.gender)}
                      </td>

                      <td>
                        {renderValue(fields.location)}
                      </td>

                      <td>
                        {renderValue(fields.source)}
                      </td>

                      <td className="dashboard-applications-table-job">
                        {a.job_title || "-"}
                      </td>

                      <td>
                        {renderValue(fields.id_number)}
                      </td>

                      <td>
                        {getUrlValue(fields.linkedin) && (
                          <a
                            className="dashboard-applications-link"
                            href={getUrlValue(fields.linkedin)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t("cms.applications.actions.open")}
                          </a>
                        )}
                      </td>

                      <td className="dashboard-applications-table-text">
                        {renderValue(fields.certifications)}
                      </td>

                      <td className="dashboard-applications-table-notes">
                        {renderValue(fields.notes)}
                      </td>

                      <td>
                        {allFiles.length > 0 ? (
                          <details className="dashboard-files-dropdown">
                            <summary className="dashboard-files-button">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                                  fill="currentColor"
                                />
                              </svg>

                              Files ({allFiles.length})
                            </summary>

                            <div className="dashboard-files-menu">
                              {allFiles.map((file, index) => (
                                <a
                                  key={`${file.field_id}-${index}`}
                                  className="dashboard-files-item"
                                  href={file.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {file.label_ar ||
                                    file.label_en ||
                                    file.key ||
                                    `File ${index + 1}`}
                                </a>
                              ))}
                            </div>
                          </details>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {coverFiles.length > 0 &&
                          coverFiles.map((file) => (
                            <a
                              key={file.id}
                              className="dashboard-applications-link-download"
                              href={file.file_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <path
                                  d="M12 9V11.6667C12 12.0333 11.7 12.3333 11.3333 12.3333H2.66667C2.3 12.3333 2 12.0333 2 11.6667V9H3.33333V11H10.6667V9H12ZM10.6667 6.33333L9.72667 5.39333L7.66667 7.44667V2H6.33333V7.44667L4.27333 5.39333L3.33333 6.33333L7 10L10.6667 6.33333Z"
                                  fill="currentColor"
                                />
                              </svg>

                              {t("cms.applications.actions.download")}
                            </a>
                          ))}
                      </td>

                      <td className="dashboard-applications-table-date">
                        {a.created_at
                          ? new Date(a.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        ) : (
          <div className="dashboard-applications-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M40 12H32V8C32 5.79 30.21 4 28 4H20C17.79 4 16 5.79 16 8V12H8C5.79 12 4.02 13.79 4.02 16L4 38C4 40.21 5.79 42 8 42H40C42.21 42 44 40.21 44 38V16C44 13.79 42.21 12 40 12ZM20 8H28V12H20V8Z" fill="currentColor" />
            </svg>
            <p>{t("cms.applications.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}