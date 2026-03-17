// src/pages/dashboard/AppointmentBookings.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { getAdminBookings, updateBookingStatus } from "../../../api/appointmentsApi";

export default function AppointmentBookings() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("calendar");
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    type: "all",
    status: "all",
    search: "",
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getAdminBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(t("cms.appointments.error.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
      toast.success(t("cms.appointments.bookings.success.status_updated"));
    } catch {
      toast.error(t("cms.appointments.error.update_failed"));
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "attachment";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(t("cms.appointments.bookings.download_success"));
    } catch {
      toast.error(t("cms.appointments.bookings.download_failed"));
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter((booking) => {
      if (filters.dateFrom && booking.slot_date < filters.dateFrom) return false;
      if (filters.dateTo && booking.slot_date > filters.dateTo) return false;
      if (filters.type !== "all" && booking.appointment_type !== filters.type) return false;
      if (filters.status !== "all" && booking.status !== filters.status) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const fullName = `${booking.first_name} ${booking.last_name}`.toLowerCase();
        const email = booking.email?.toLowerCase() || "";
        if (!fullName.includes(search) && !email.includes(search)) return false;
      }
      return true;
    });
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return bookings.filter((booking) => booking.slot_date === dateStr);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "dashboard-appointments-status-pending";
      case "confirmed":
        return "dashboard-appointments-status-confirmed";
      case "cancelled":
        return "dashboard-appointments-status-cancelled";
      default:
        return "";
    }
  };

  if (loading) return null;

  const filteredBookings = getFilteredBookings();

  return (
    <div className="dashboard-appointments-content">
      <div className="dashboard-appointments-content-header">
        <div className="dashboard-appointments-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor" />
          </svg>
          <h2>{t("cms.appointments.bookings.title")}</h2>
        </div>
        <p className="dashboard-appointments-content-subtitle">
          {t("cms.appointments.bookings.subtitle")}
        </p>
      </div>

      {/* VIEW TOGGLE */}
      <div className="dashboard-appointments-view-toggle">
        <button
          className={`dashboard-appointments-view-btn ${viewMode === "calendar" ? "dashboard-appointments-view-btn-active" : ""
            }`}
          onClick={() => setViewMode("calendar")}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 2H13V1H11V2H7V1H5V2H4C2.9 2 2 2.9 2 4V15C2 16.1 2.9 17 4 17H14C15.1 17 16 16.1 16 15V4C16 2.9 15.1 2 14 2ZM14 15H4V7H14V15Z" fill="currentColor" />
          </svg>
          {t("cms.appointments.view.calendar")}
        </button>
        <button
          className={`dashboard-appointments-view-btn ${viewMode === "list" ? "dashboard-appointments-view-btn-active" : ""
            }`}
          onClick={() => setViewMode("list")}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 3H16V5H2V3ZM2 7H16V9H2V7ZM2 11H16V13H2V11ZM2 15H16V17H2V15Z" fill="currentColor" />
          </svg>
          {t("cms.appointments.view.list")}
        </button>
      </div>

      {/* FILTERS */}
      {viewMode === "list" && (
        <div className="dashboard-appointments-filters-card">
          <h3 className="dashboard-appointments-filters-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 13H11V11H7V13ZM2 3V5H16V3H2ZM4 9H14V7H4V9Z" fill="currentColor" />
            </svg>
            {t("cms.appointments.bookings.filters_title")}
          </h3>
          <div className="dashboard-appointments-filters-row">
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.bookings.filter_search")}
              </label>
              <input
                type="text"
                className="dashboard-appointments-input"
                placeholder={t("cms.appointments.bookings.placeholder_search")}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.bookings.filter_date_from")}
              </label>
              <input
                type="date"
                className="dashboard-appointments-input"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.bookings.filter_date_to")}
              </label>
              <input
                type="date"
                className="dashboard-appointments-input"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.bookings.filter_type")}
              </label>
              <select
                className="dashboard-appointments-select"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">{t("cms.appointments.bookings.type_all")}</option>
                <option value="in_person">{t("cms.appointments.bookings.type_in_person")}</option>
                <option value="online">{t("cms.appointments.bookings.type_online")}</option>
              </select>
            </div>
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.bookings.filter_status")}
              </label>
              <select
                className="dashboard-appointments-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">{t("cms.appointments.bookings.status_all")}</option>
                <option value="pending">{t("cms.appointments.bookings.status_pending")}</option>
                <option value="confirmed">{t("cms.appointments.bookings.status_confirmed")}</option>
                <option value="cancelled">{t("cms.appointments.bookings.status_cancelled")}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="dashboard-appointments-calendar-card">
          <div className="dashboard-appointments-calendar-header">
            <button
              className="dashboard-appointments-calendar-nav"
              onClick={() => navigateMonth(-1)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h3 className="dashboard-appointments-calendar-month">
              {currentMonth.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              className="dashboard-appointments-calendar-nav"
              onClick={() => navigateMonth(1)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="dashboard-appointments-calendar-grid">
            <div className="dashboard-appointments-calendar-weekdays">
              {[
                t("cms.appointments.calendar.sun"),
                t("cms.appointments.calendar.mon"),
                t("cms.appointments.calendar.tue"),
                t("cms.appointments.calendar.wed"),
                t("cms.appointments.calendar.thu"),
                t("cms.appointments.calendar.fri"),
                t("cms.appointments.calendar.sat"),
              ].map((day, i) => (
                <div key={i} className="dashboard-appointments-calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="dashboard-appointments-calendar-days">
              {getDaysInMonth(currentMonth).map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="dashboard-appointments-calendar-day-empty" />;
                }

                const dayBookings = getBookingsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    className={`dashboard-appointments-calendar-day ${isToday ? "dashboard-appointments-calendar-day-today" : ""
                      } ${isSelected ? "dashboard-appointments-calendar-day-selected" : ""} ${dayBookings.length > 0 ? "dashboard-appointments-calendar-day-has-bookings" : ""
                      }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="dashboard-appointments-calendar-day-number">{day.getDate()}</div>
                    {dayBookings.length > 0 && (
                      <div className="dashboard-appointments-calendar-day-badge">
                        {dayBookings.length} {t("cms.appointments.bookings.bookings")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED DATE BOOKINGS */}
          {selectedDate && (
            <div className="dashboard-appointments-selected-date">
              <h4 className="dashboard-appointments-selected-date-title">
                {t("cms.appointments.bookings.bookings_for")} {selectedDate.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
              </h4>
              <div className="dashboard-appointments-bookings-grid">
                {getBookingsForDate(selectedDate).map((booking) => (
                  <div key={booking.id} className="dashboard-appointments-booking-card">
                    <div className="dashboard-appointments-booking-header">
                      <div className="dashboard-appointments-booking-name">
                        {booking.first_name} {booking.last_name}
                      </div>
                      <span className={`dashboard-appointments-booking-badge ${getStatusColor(booking.status)}`}>
                        {t(`cms.appointments.bookings.status_${booking.status}`)}
                      </span>
                    </div>
                    <div className="dashboard-appointments-booking-info">
                      <div className="dashboard-appointments-booking-time">
                        🕐 {booking.slot_start} - {booking.slot_end}
                      </div>
                      <div className="dashboard-appointments-booking-type">
                        {booking.appointment_type === "in_person" ? "👤" : "💻"}{" "}
                        {booking.appointment_type === "in_person"
                          ? t("cms.appointments.bookings.type_in_person")
                          : t("cms.appointments.bookings.type_online")}
                      </div>
                    </div>
                    <button
                      className="dashboard-appointments-btn-view"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3C4.5 3 1.5 5.5 1 8C1.5 10.5 4.5 13 8 13C11.5 13 14.5 10.5 15 8C14.5 5.5 11.5 3 8 3ZM8 11C6.3 11 5 9.7 5 8C5 6.3 6.3 5 8 5C9.7 5 11 6.3 11 8C11 9.7 9.7 11 8 11Z" fill="currentColor" />
                      </svg>
                      {t("cms.appointments.actions.view_details")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="dashboard-appointments-list-card">
          <div className="dashboard-appointments-list-header">
            <div className="dashboard-appointments-list-title-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor" />
              </svg>
              <h3>{t("cms.appointments.bookings.list_title")}</h3>
            </div>
            <span className="dashboard-appointments-count-badge">{filteredBookings.length}</span>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="dashboard-appointments-table-wrapper">
              <table className="dashboard-appointments-table">
                <thead>
                  <tr>
                    <th>{t("cms.appointments.table.name")}</th>
                    <th>{t("cms.appointments.table.type")}</th>
                    <th>{t("cms.appointments.table.date")}</th>
                    <th>{t("cms.appointments.table.time")}</th>
                    <th>{t("cms.appointments.table.phone")}</th>
                    <th>{t("cms.appointments.table.email")}</th>
                    <th>{t("cms.appointments.table.status")}</th>
                    <th>{t("cms.appointments.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="dashboard-appointments-table-name">
                        {booking.first_name} {booking.last_name}
                      </td>
                      <td>
                        {booking.appointment_type === "in_person"
                          ? t("cms.appointments.bookings.type_in_person")
                          : t("cms.appointments.bookings.type_online")}
                      </td>
                      <td>{booking.slot_date}</td>
                      <td>
                        {booking.slot_start} - {booking.slot_end}
                      </td>
                      <td>{booking.phone}</td>
                      <td>{booking.email}</td>
                      <td>
                        <select
                          className={`dashboard-appointments-select-status ${getStatusColor(booking.status)}`}
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        >
                          <option value="pending">{t("cms.appointments.bookings.status_pending")}</option>
                          <option value="confirmed">{t("cms.appointments.bookings.status_confirmed")}</option>
                          <option value="cancelled">{t("cms.appointments.bookings.status_cancelled")}</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="dashboard-appointments-btn-view"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3C4.5 3 1.5 5.5 1 8C1.5 10.5 4.5 13 8 13C11.5 13 14.5 10.5 15 8C14.5 5.5 11.5 3 8 3Z" fill="currentColor" />
                          </svg>
                          {t("cms.appointments.actions.view")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dashboard-appointments-empty">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M28 4H12C9.8 4 8 5.8 8 8V40C8 42.2 9.8 44 12 44H36C38.2 44 40 42.2 40 40V16L28 4Z" fill="currentColor" />
              </svg>
              <p>{t("cms.appointments.bookings.empty")}</p>
            </div>
          )}
        </div>
      )}

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div
          className="dashboard-appointments-modal-overlay"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="dashboard-appointments-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dashboard-appointments-modal-header">
              <h3>
                {t("cms.appointments.bookings.modal.title")} #{selectedBooking.id}
              </h3>
              <button
                className="dashboard-appointments-modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="dashboard-appointments-modal-body">
              <div className="dashboard-appointments-modal-section">
                <h4>{t("cms.appointments.bookings.modal.personal_info")}</h4>
                <div className="dashboard-appointments-modal-grid">
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.name")}</label>
                    <p>
                      {selectedBooking.first_name} {selectedBooking.last_name}
                    </p>
                  </div>
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.email")}</label>
                    <p>{selectedBooking.email}</p>
                  </div>
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.phone")}</label>
                    <p>{selectedBooking.phone}</p>
                  </div>
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.visitors")}</label>
                    <p>{selectedBooking.visitors || 1}</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-appointments-modal-section">
                <h4>{t("cms.appointments.bookings.modal.appointment_details")}</h4>
                <div className="dashboard-appointments-modal-grid">
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.type")}</label>
                    <p>
                      {selectedBooking.appointment_type === "in_person"
                        ? t("cms.appointments.bookings.type_in_person")
                        : t("cms.appointments.bookings.type_online")}
                    </p>
                  </div>
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.date")}</label>
                    <p>{selectedBooking.slot_date}</p>
                  </div>
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.time")}</label>
                    <p>
                      {selectedBooking.slot_start} - {selectedBooking.slot_end}
                    </p>
                  </div>
                  <div className="dashboard-appointments-modal-field">
                    <label>{t("cms.appointments.bookings.modal.status")}</label>
                    <select
                      className={`dashboard-appointments-select-status ${getStatusColor(selectedBooking.status)}`}
                      value={selectedBooking.status}
                      onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                    >
                      <option value="pending">{t("cms.appointments.bookings.status_pending")}</option>
                      <option value="confirmed">{t("cms.appointments.bookings.status_confirmed")}</option>
                      <option value="cancelled">{t("cms.appointments.bookings.status_cancelled")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="dashboard-appointments-modal-section">
                  <h4>{t("cms.appointments.bookings.modal.message")}</h4>
                  <div className="dashboard-appointments-modal-message">
                    {selectedBooking.message}
                  </div>
                </div>
              )}

              {(selectedBooking.attachment || selectedBooking.voice_note) && (
                <div className="dashboard-appointments-modal-section">
                  <h4>{t("cms.appointments.bookings.modal.attachments")}</h4>
                  <div className="dashboard-appointments-modal-files">
                    {selectedBooking.voice_note && (
                      <div className="dashboard-appointments-audio-wrapper">
                        <label>{t("cms.appointments.bookings.modal.voice_note")}</label>
                        <audio
                          controls
                          preload="metadata"
                          className="dashboard-appointments-audio"
                        >
                          <source src={selectedBooking.voice_note} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                    {selectedBooking.attachment && (
                      <button
                        className="dashboard-appointments-btn-download"
                        onClick={() =>
                          handleDownload(selectedBooking.attachment, "attachment")
                        }
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M15 11.25V14.25C15 14.6478 14.842 15.0294 14.5607 15.3107C14.2794 15.592 13.8978 15.75 13.5 15.75H4.5C4.10218 15.75 3.72064 15.592 3.43934 15.3107C3.15804 15.0294 3 14.6478 3 14.25V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9 11.25V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {t("cms.appointments.bookings.modal.download_attachment")}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="dashboard-appointments-modal-footer">
              <button
                className="dashboard-appointments-btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                {t("cms.appointments.actions.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}