import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSubmissionEditHistory } from "../../../../../api/servicesApi";
import { formatDateTime } from "../utils/requestHelpers";
import renderFieldValue from "../utils/renderFieldValue";

export default function RequestEditHistory({ request }) {
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const submissionId =
    request?.form_submission_id ||
    request?.form_submission?.id ||
    request?.form_submission;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!submissionId) {
        setLoading(false);
        setError("Missing submission id");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res =
          await getSubmissionEditHistory(
            submissionId
          );

        if (!mounted) return;

        const data = Array.isArray(res.data)
          ? res.data
          : [];

        setLogs(data);
      } catch (err) {
        const apiError =
          err?.response?.data;

        const status =
          err?.response?.status;

        console.error(
          "Edit history failed:",
          {
            submissionId,
            status,
            apiError,
            err,
          }
        );

        if (!mounted) return;

        setError(
          apiError?.detail ||
            apiError?.message ||
            `Failed to load edit history (${status || "unknown"})`
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [submissionId]);

  if (loading) {
    return (
      <div className="cms-request-services-panel-loading">
        <span className="cms-request-services-spinner" />
        {t("cms.requestservices.loading", "Loading…")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="cms-request-services-panel-error">
        {error}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="cms-request-services-access-empty">
        <p>
          {t(
            "cms.requestservices.edit_history.empty",
            "No edit history found."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="cms-request-services-history-list">
      {logs.map((log) => (
        <div
          key={log.id}
          className="cms-request-services-history-card"
        >
          <div className="cms-request-services-history-header">
            <div>
              <strong>
                {log.field_key}
              </strong>
            </div>

            <div className="cms-request-services-history-date">
              {formatDateTime(
                log.created_at
              )}
            </div>
          </div>

          <div className="cms-request-services-history-body">
            <div className="cms-request-services-history-column">
              <span className="cms-request-services-history-label">
                {t(
                  "cms.requestservices.edit_history.old_value",
                  "Old Value"
                )}
              </span>

              <div className="cms-request-services-history-value">
                {renderFieldValue(
                  log.old_value
                )}
              </div>
            </div>

            <div className="cms-request-services-history-arrow">
              →
            </div>

            <div className="cms-request-services-history-column">
              <span className="cms-request-services-history-label">
                {t(
                  "cms.requestservices.edit_history.new_value",
                  "New Value"
                )}
              </span>

              <div className="cms-request-services-history-value">
                {renderFieldValue(
                  log.new_value
                )}
              </div>
            </div>
          </div>

          <div className="cms-request-services-history-footer">
            {log.edited_by_admin ? (
              <span>
                {t(
                  "cms.requestservices.edit_history.edited_by_admin",
                  "Edited by admin"
                )}
                :{" "}
                {
                  log
                    .edited_by_admin
                    .email
                }
              </span>
            ) : log.edited_by_client ? (
              <span>
                {t(
                  "cms.requestservices.edit_history.edited_by_client",
                  "Edited by client"
                )}
              </span>
            ) : (
              <span>
                {t(
                  "cms.requestservices.edit_history.unknown_editor",
                  "Unknown editor"
                )}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}