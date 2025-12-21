// src/pages/dashboard/messages/Messages_Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/CMS_MESSAGES.css";

export default function Messages_Dashboard() {
  const { t } = useTranslation();

  const {
    messages,
    subscribers,
    broadcastLogs,
    loadMessages,
    loadSubscribers,
    loadBroadcastLogs,
    sendBroadcast,
    deleteSubscriber,
    exportSubscribers,
  } = useMessagesStore();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedSubscriberIds, setSelectedSubscriberIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Pagination & Search
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [messagesPage, setMessagesPage] = useState(1);
  const [subscribersPage, setSubscribersPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();
    loadSubscribers();
    loadBroadcastLogs();
  }, []);

  /* ================= SEARCH & FILTER ================= */
  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const paginateData = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  const getTotalPages = (dataLength) => Math.ceil(dataLength / itemsPerPage);

  const paginatedMessages = paginateData(messages, messagesPage);
  const paginatedSubscribers = paginateData(filteredSubscribers, subscribersPage);
  const paginatedLogs = paginateData(broadcastLogs, logsPage);

  /* ================= SELECTORS ================= */
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscriberIds([]);
      setSelectAll(false);
    } else {
      setSelectedSubscriberIds(filteredSubscribers.map((s) => s.id));
      setSelectAll(true);
    }
  };

  const toggleSubscriber = (id) => {
    setSelectedSubscriberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= EXPORT ================= */
  const handleExport = async () => {
    try {
      const res = await exportSubscribers();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "subscribers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(t("messages.export_success"));
    } catch {
      toast.error(t("messages.error"));
    }
  };

  /* ================= BROADCAST ================= */
  const handleBroadcast = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error(t("messages.broadcast_required"));
      return;
    }

    const payload = { subject, html: content };
    if (selectedSubscriberIds.length > 0) {
      payload.subscriber_ids = selectedSubscriberIds;
    }

    const res = await sendBroadcast(payload);

    if (res.success) {
      toast.success(t("messages.broadcast_sent", { count: res.sent }));
      setSubject("");
      setContent("");
      loadBroadcastLogs();
    } else {
      toast.error(t("messages.error"));
    }
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="messages-pagination">
        <button
          className="messages-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </button>
        
        <div className="messages-pagination-info">
          {t("messages.pagination.page")} {currentPage} {t("messages.pagination.of")} {totalPages}
        </div>

        <button
          className="messages-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
    );
  };

  return (
    <div className="messages-cms-container">
      <div className="messages-cms-header">
        <h1 className="messages-cms-title">{t("messages.dashboard")}</h1>
        <div className="messages-cms-subtitle">{t("messages.subtitle")}</div>
      </div>

      {/* ================= CONTACT MESSAGES ================= */}
      <div className="messages-card">
        <div className="messages-card-header">
          <h2>{t("messages.contact_messages")}</h2>
        </div>

        <div className="messages-table-wrapper">
          <table className="messages-table">
            <thead>
              <tr>
                <th>{t("messages.name")}</th>
                <th>{t("messages.email")}</th>
                <th>{t("messages.subject")}</th>
                <th>{t("messages.status.title")}</th>
                <th>{t("messages.read")}</th>
                <th>{t("messages.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMessages.map((m) => (
                <tr key={m.id}>
                  <td className="messages-table-name">{m.name}</td>
                  <td className="messages-table-email">{m.email}</td>
                  <td>{m.subject}</td>
                  <td>
                    <span className={`messages-status-badge ${m.status}`}>
                      {t(`messages.status.${m.status}`)}
                    </span>
                  </td>
                  <td>
                    <span className={`messages-read-badge ${m.is_read ? 'read' : 'unread'}`}>
                      {m.is_read ? t("common.yes") : t("common.no")}
                    </span>
                  </td>
                  <td>
                    <button
                      className="messages-btn-view"
                      onClick={() => navigate(`/dashboard/messages/${m.id}`)}
                    >
                      {t("messages.open")}
                    </button>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="messages-table-empty">
                    {t("messages.no_messages")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={messagesPage}
          totalPages={getTotalPages(messages.length)}
          onPageChange={setMessagesPage}
        />
      </div>

      {/* ================= SUBSCRIBERS ================= */}
      <div className="messages-card">
        <div className="messages-card-header">
          <h2>{t("messages.subscribers")}</h2>
        </div>

        <div className="messages-toolbar">
          <div className="messages-search-wrapper">
            <input
              className="messages-search-input"
              type="text"
              placeholder={t("messages.search_email")}
              value={subscriberSearch}
              onChange={(e) => {
                setSubscriberSearch(e.target.value);
                setSubscribersPage(1);
              }}
            />
          </div>

          <div className="messages-toolbar-actions">
            <label className="messages-checkbox-label">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              <span className="messages-checkbox-text">{t("messages.select_all")}</span>
            </label>

            <span className="messages-counter">
              {t("messages.selected")} {selectedSubscriberIds.length} / {filteredSubscribers.length}
            </span>

            <button className="messages-btn-export" onClick={handleExport}>
              {t("messages.export")}
            </button>
          </div>
        </div>

        <div className="messages-table-wrapper">
          <table className="messages-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th>{t("messages.email")}</th>
                <th>{t("messages.date")}</th>
                <th>{t("messages.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubscribers.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSubscriberIds.includes(s.id)}
                      onChange={() => toggleSubscriber(s.id)}
                    />
                  </td>
                  <td className="messages-table-email">{s.email}</td>
                  <td className="messages-table-date">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="messages-btn-delete"
                      onClick={async () => {
                        if (window.confirm(t("messages.delete_confirm"))) {
                          await deleteSubscriber(s.id);
                          toast.success(t("messages.delete_success"));
                        }
                      }}
                    >
                      {t("messages.delete")}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="messages-table-empty">
                    {subscriberSearch ? t("messages.no_results") : t("messages.no_subscribers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={subscribersPage}
          totalPages={getTotalPages(filteredSubscribers.length)}
          onPageChange={setSubscribersPage}
        />
      </div>

      {/* ================= BROADCAST ================= */}
      <div className="messages-card">
        <div className="messages-card-header">
          <h2>{t("messages.broadcast")}</h2>
        </div>

        <div className="messages-broadcast-form">
          <div className="messages-form-group">
            <label className="messages-label">{t("messages.broadcast_subject")}</label>
            <input
              className="messages-input"
              placeholder={t("messages.broadcast_subject_placeholder")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="messages-form-group">
            <label className="messages-label">{t("messages.broadcast_content")}</label>
            <div className="messages-editor-wrapper">
              <SunEditor
                setContents={content}
                onChange={setContent}
                setOptions={{
                  height: 300,
                  buttonList: [
                    ["undo", "redo"],
                    ["bold", "italic", "underline"],
                    ["fontSize", "formatBlock"],
                    ["align", "list"],
                    ["link"],
                    ["codeView"],
                  ],
                }}
              />
            </div>
          </div>

          <button className="messages-btn-primary" onClick={handleBroadcast}>
            {t("messages.send")}
          </button>
        </div>
      </div>

      {/* ================= BROADCAST LOGS ================= */}
      <div className="messages-card">
        <div className="messages-card-header">
          <h2>{t("messages.logs")}</h2>
        </div>

        <div className="messages-table-wrapper">
          <table className="messages-table">
            <thead>
              <tr>
                <th>{t("messages.date")}</th>
                <th>{t("messages.subject")}</th>
                <th>{t("messages.recipients_count")}</th>
                <th>{t("messages.recipients_list")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id}>
                  <td className="messages-table-date">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td>{log.subject}</td>
                  <td className="messages-table-count">{log.recipients_count}</td>
                  <td className="messages-table-recipients">
                    {log.recipients_list.length > 100
                      ? log.recipients_list.slice(0, 100) + "..."
                      : log.recipients_list}
                  </td>
                </tr>
              ))}

              {broadcastLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="messages-table-empty">
                    {t("messages.no_logs")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={logsPage}
          totalPages={getTotalPages(broadcastLogs.length)}
          onPageChange={setLogsPage}
        />
      </div>
    </div>
  );
}