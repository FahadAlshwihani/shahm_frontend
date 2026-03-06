// src/pages/dashboard/messages/Messages_Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/Messages.css";

export default function Messages_Dashboard() {
  const { t, i18n } = useTranslation();

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

  // Arrow components based on language
  const LeftArrow = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {i18n.language === 'ar' ? (
        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ) : (
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  );

  const RightArrow = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {i18n.language === 'ar' ? (
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      ) : (
        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      )}
    </svg>
  );

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
      <div className="dashboard-messages-pagination">
        <button
          className="dashboard-messages-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <LeftArrow />
        </button>
        
        <div className="dashboard-messages-pagination-info">
          {t("messages.pagination.page")} <strong>{currentPage}</strong> {t("messages.pagination.of")} <strong>{totalPages}</strong>
        </div>

        <button
          className="dashboard-messages-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <RightArrow />
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-messages-container">
      {/* Header */}
      <div className="dashboard-messages-header">
        <div className="dashboard-messages-header-content">
          <h1 className="dashboard-messages-title">{t("messages.dashboard")}</h1>
          <p className="dashboard-messages-subtitle">{t("messages.subtitle")}</p>
        </div>
      </div>

      {/* ================= CONTACT MESSAGES ================= */}
      <div className="dashboard-messages-card">
        <div className="dashboard-messages-card-header">
          <div className="dashboard-messages-card-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 20L4 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 14H4L2 16V2H18V14Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-messages-card-title">{t("messages.contact_messages")}</h2>
          </div>
          <span className="dashboard-messages-count-badge">{messages.length}</span>
        </div>

        <div className="dashboard-messages-table-wrapper">
          <table className="dashboard-messages-table">
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
                  <td className="dashboard-messages-table-name">{m.name}</td>
                  <td className="dashboard-messages-table-email">{m.email}</td>
                  <td className="dashboard-messages-table-subject">{m.subject}</td>
                  <td>
                    <span className={`dashboard-messages-status-badge dashboard-messages-status-${m.status}`}>
                      {t(`messages.status.${m.status}`)}
                    </span>
                  </td>
                  <td>
                    <span className={`dashboard-messages-read-badge ${m.is_read ? 'dashboard-messages-read' : 'dashboard-messages-unread'}`}>
                      {m.is_read ? t("common.yes") : t("common.no")}
                    </span>
                  </td>
                  <td>
                    <button
                      className="dashboard-messages-btn-view"
                      onClick={() => navigate(`/dashboard/messages/${m.id}`)}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 3.375C5.25 3.375 2.0475 5.7075 0.75 9C2.0475 12.2925 5.25 14.625 9 14.625C12.75 14.625 15.9525 12.2925 17.25 9C15.9525 5.7075 12.75 3.375 9 3.375ZM9 12.75C6.93 12.75 5.25 11.07 5.25 9C5.25 6.93 6.93 5.25 9 5.25C11.07 5.25 12.75 6.93 12.75 9C12.75 11.07 11.07 12.75 9 12.75ZM9 6.75C7.755 6.75 6.75 7.755 6.75 9C6.75 10.245 7.755 11.25 9 11.25C10.245 11.25 11.25 10.245 11.25 9C11.25 7.755 10.245 6.75 9 6.75Z" fill="currentColor"/>
                      </svg>
                      {t("messages.open")}
                    </button>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="dashboard-messages-table-empty">
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
      <div className="dashboard-messages-card">
        <div className="dashboard-messages-card-header">
          <div className="dashboard-messages-card-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.33 6.67C13.33 8.5 11.83 10 10 10C8.17 10 6.67 8.5 6.67 6.67C6.67 4.83 8.17 3.33 10 3.33C11.83 3.33 13.33 4.83 13.33 6.67ZM3.33 15V16.67H16.67V15C16.67 12.78 12.22 11.67 10 11.67C7.78 11.67 3.33 12.78 3.33 15Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-messages-card-title">{t("messages.subscribers")}</h2>
          </div>
          <span className="dashboard-messages-count-badge">{subscribers.length}</span>
        </div>

        <div className="dashboard-messages-toolbar">
          <div className="dashboard-messages-search-wrapper">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.742 10.344C12.716 9.023 13.126 7.353 12.878 5.718C12.63 4.083 11.746 2.607 10.407 1.608C9.068 0.609 7.379 0.164 5.692 0.368C4.005 0.572 2.465 1.408 1.372 2.7C0.279 3.992 -0.301 5.648 -0.097 7.335C0.107 9.022 0.943 10.562 2.235 11.655C3.527 12.748 5.183 13.329 6.87 13.125C8.557 12.921 10.097 12.085 11.19 10.793L14.707 14.307L15.707 13.307L11.742 10.344ZM6.5 11.5C5.507 11.5 4.536 11.206 3.711 10.655C2.886 10.104 2.243 9.32 1.873 8.41C1.503 7.5 1.421 6.506 1.638 5.549C1.855 4.592 2.361 3.716 3.086 3.014C3.811 2.312 4.726 1.813 5.708 1.586C6.69 1.359 7.701 1.415 8.654 1.745C9.607 2.075 10.462 2.669 11.116 3.454C11.77 4.239 12.197 5.186 12.349 6.189C12.5 7.192 12.37 8.217 11.974 9.153C11.578 10.089 10.929 10.902 10.104 11.5C9.279 12.098 8.308 12.458 7.308 12.543C6.308 12.628 5.305 12.435 4.404 11.984L6.5 11.5Z" fill="currentColor"/>
            </svg>
            <input
              className="dashboard-messages-search-input"
              type="text"
              placeholder={t("messages.search_email")}
              value={subscriberSearch}
              onChange={(e) => {
                setSubscriberSearch(e.target.value);
                setSubscribersPage(1);
              }}
            />
          </div>

          <div className="dashboard-messages-toolbar-actions">
            <label className="dashboard-messages-checkbox-label">
              <input
                type="checkbox"
                className="dashboard-messages-checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
              <span className="dashboard-messages-checkbox-text">{t("messages.select_all")}</span>
            </label>

            <span className="dashboard-messages-counter">
              {t("messages.selected")} <strong>{selectedSubscriberIds.length}</strong> / {filteredSubscribers.length}
            </span>

            <button className="dashboard-messages-btn-export" onClick={handleExport}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10V13.5C14 13.8978 13.842 14.2794 13.5607 14.5607C13.2794 14.842 12.8978 15 12.5 15H3.5C3.10218 15 2.72064 14.842 2.43934 14.5607C2.15804 14.2794 2 13.8978 2 13.5V10M4.5 6.5L8 10M8 10L11.5 6.5M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("messages.export")}
            </button>
          </div>
        </div>

        <div className="dashboard-messages-table-wrapper">
          <table className="dashboard-messages-table">
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
                      className="dashboard-messages-checkbox"
                      checked={selectedSubscriberIds.includes(s.id)}
                      onChange={() => toggleSubscriber(s.id)}
                    />
                  </td>
                  <td className="dashboard-messages-table-email">{s.email}</td>
                  <td className="dashboard-messages-table-date">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="dashboard-messages-btn-delete"
                      onClick={async () => {
                        if (window.confirm(t("messages.delete_confirm"))) {
                          await deleteSubscriber(s.id);
                          toast.success(t("messages.delete_success"));
                        }
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                      </svg>
                      {t("messages.delete")}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="dashboard-messages-table-empty">
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
      <div className="dashboard-messages-card">
        <div className="dashboard-messages-card-header">
          <div className="dashboard-messages-card-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 2.5H2.5C1.4 2.5 0.51 3.4 0.51 4.5L0.5 15.5C0.5 16.6 1.4 17.5 2.5 17.5H17.5C18.6 17.5 19.5 16.6 19.5 15.5V4.5C19.5 3.4 18.6 2.5 17.5 2.5ZM17.5 6.5L10 11.25L2.5 6.5V4.5L10 9.25L17.5 4.5V6.5Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-messages-card-title">{t("messages.broadcast")}</h2>
          </div>
        </div>

        <div className="dashboard-messages-broadcast-form">
          <div className="dashboard-messages-form-group">
            <label className="dashboard-messages-label">{t("messages.broadcast_subject")}</label>
            <input
              className="dashboard-messages-input"
              placeholder={t("messages.broadcast_subject_placeholder")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="dashboard-messages-form-group">
            <label className="dashboard-messages-label">{t("messages.broadcast_content")}</label>
            <div className="dashboard-messages-editor-wrapper">
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

          <button className="dashboard-messages-btn-primary" onClick={handleBroadcast}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.33333 14L14.6667 8L1.33333 2V6.66667L10.6667 8L1.33333 9.33333V14Z" fill="currentColor"/>
            </svg>
            {t("messages.send")}
          </button>
        </div>
      </div>

      {/* ================= BROADCAST LOGS ================= */}
      <div className="dashboard-messages-card">
        <div className="dashboard-messages-card-header">
          <div className="dashboard-messages-card-title-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H16C17.1 18 18 17.1 18 16V4C18 2.9 17.1 2 16 2ZM16 16H4V6H16V16ZM6 8H14V10H6V8ZM6 12H14V14H6V12Z" fill="currentColor"/>
            </svg>
            <h2 className="dashboard-messages-card-title">{t("messages.logs")}</h2>
          </div>
          <span className="dashboard-messages-count-badge">{broadcastLogs.length}</span>
        </div>

        <div className="dashboard-messages-table-wrapper">
          <table className="dashboard-messages-table">
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
                  <td className="dashboard-messages-table-date">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="dashboard-messages-table-subject">{log.subject}</td>
                  <td className="dashboard-messages-table-count">
                    <span className="dashboard-messages-count-badge">{log.recipients_count}</span>
                  </td>
                  <td className="dashboard-messages-table-recipients">
                    {log.recipients_list.length > 100
                      ? log.recipients_list.slice(0, 100) + "..."
                      : log.recipients_list}
                  </td>
                </tr>
              ))}

              {broadcastLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="dashboard-messages-table-empty">
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