// src/pages/dashboard/CareerApplicationsCMS.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApplications } from "../../../api/careersApi";
import "../../../styles/dashboard/jobs.css";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../../components/common/dashboard/Pagination";
import Modal from "../../../components/common/dashboard/Modal";
import Openbtn from "../../../components/common/dashboard/Openbtn";

export default function CareerApplicationsCMS() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [selectedApplication, setSelectedApplication] =
    useState(null);
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


  const getFieldValue = (application, key) => {
    const field =
      application.dynamic_fields?.find(
        (f) =>
          f.key === key ||
          f.system_key === key
      );

    return (
      field?.display_value ??
      field?.value ??
      "-"
    );
  };

  const getApplicantName = (application) => {
    const first =
      getFieldValue(
        application,
        "first_name"
      );

    const last =
      getFieldValue(
        application,
        "last_name"
      );

    return `${first} ${last}`
      .trim()
      .replace("- -", "")
      || `#${application.id}`;
  };

  const formatFieldValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      if (
        "country_code" in value ||
        "number" in value
      ) {
        return `${value.country_code || ""} ${value.number || ""}`;
      }

      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return String(value);
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
                  <th>Name</th>
                  <th>Job</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {getApplicantName(a)}
                    </td>

                    <td>
                      {a.job_title || "-"}
                    </td>

                    <td>
                      {formatFieldValue(
                        getFieldValue(a, "phone")
                      )}
                    </td>

                    <td>
                      {formatFieldValue(
                        getFieldValue(a, "email")
                      )}
                    </td>

                    <td>
                      {a.created_at
                        ? new Date(
                          a.created_at
                        ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <Openbtn
                        onClick={() =>
                          setSelectedApplication(a)
                        }
                        label="View"
                        iconOnly={false}
                      />
                    </td>
                  </tr>
                ))}
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
      <Modal
        open={!!selectedApplication}
        onClose={() =>
          setSelectedApplication(null)
        }
        title={
          selectedApplication
            ? `Application #${selectedApplication.id}`
            : ""
        }
        width={700}
      >
        {selectedApplication && (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {selectedApplication.dynamic_fields?.map(
              (field) => (
                <div
                  key={field.field_id}
                  className="appt-modal-field"
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {field.label_ar ||
                      field.label_en}
                  </div>

                  <div>
                    {formatFieldValue(
                      field.display_value ??
                      field.value
                    )}
                  </div>
                </div>
              )
            )}

            {selectedApplication.files
              ?.length > 0 && (
                <div>
                  <h4>Files</h4>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {selectedApplication.files.map(
                      (file, index) => (
                        <a
                          key={index}
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {file.label_ar ||
                            file.label_en ||
                            `File ${index + 1
                            }`}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
