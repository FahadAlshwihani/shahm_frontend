import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getRequestAccessLogs,
} from "../../../../../api/servicesApi";

import {
  formatDateTime,
} from "../utils/requestHelpers";

export default function RequestAccessLogs({ request }) {
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadLogs = async () => {
      if (!request?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await getRequestAccessLogs(
          request.id
        );

        if (!mounted) return;

        setLogs(res.data || []);
      } catch (err) {
        console.error(err);

        if (!mounted) return;

        setError(
          t(
            "cms.requestservices.logs.load_failed",
            "Failed to load logs."
          )
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      mounted = false;
    };
  }, [request, t]);

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
            "cms.requestservices.logs.empty",
            "No activity logs found."
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
            <strong>{log.action}</strong>

            <span>
              {formatDateTime(log.created_at)}
            </span>
          </div>

          <div className="cms-request-services-history-body">
            <div className="cms-request-services-history-column">
              <span className="cms-request-services-history-label">
                {t("cms.requestservices.logs.ip", "IP")}
              </span>

              <div className="cms-request-services-history-value">
                {log.ip_address || "—"}
              </div>
            </div>

            <div className="cms-request-services-history-column">
              <span className="cms-request-services-history-label">
                {t("cms.requestservices.logs.user_agent", "User Agent")}
              </span>

              <div className="cms-request-services-history-value">
                {log.user_agent || "—"}
              </div>
            </div>
          </div>

          {log.link && (
            <div
              className="cms-request-services-history-footer"
            >
              {t("cms.requestservices.logs.link", "Link")}:{" "}
              <code>
                {log.link.public_key?.slice(0, 12)}
              </code>
            </div>
          )}

          {log.metadata &&
            Object.keys(log.metadata).length > 0 && (
              <pre className="cms-request-services-log-metadata">
                {JSON.stringify(
                  log.metadata,
                  null,
                  2
                )}
              </pre>
            )}
        </div>
      ))}
    </div>
  );
}