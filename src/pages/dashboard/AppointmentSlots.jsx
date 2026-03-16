// src/pages/dashboard/AppointmentSlots.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getAdminSlots,
  generateSlots,
  updateSlot,
  deleteSlot,
  getAdminAppointmentSettings,
} from "../../api/appointmentsApi";

export default function AppointmentSlots() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("calendar");
  const [slots, setSlots] = useState([]);
  const [settings, setSettings] = useState({ slot_duration: 60 });
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [generator, setGenerator] = useState({
    date: "",
    morning_start: "",
    morning_end: "",
    evening_start: "",
    evening_end: "",
  });

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    shift: "all",
    status: "all",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [slotsRes, settingsRes] = await Promise.all([
        getAdminSlots(),
        getAdminAppointmentSettings(),
      ]);
      setSlots(slotsRes.data || []);
      setSettings(settingsRes.data || {});
    } catch (err) {
      console.error(err);
      toast.error(t("cms.appointments.error.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  const generateShift = async (shift, start, end) => {
    if (!generator.date || !start || !end) return;

    await generateSlots({
      date: generator.date,
      shift: shift,
      start_time: start,
      end_time: end,
      duration: Number(settings.slot_duration || 60),
    });
  };

  const generateDaySlots = async () => {
    if (!generator.date) {
      toast.error(t("cms.appointments.slots.error.select_date"));
      return;
    }

    try {
      if (generator.morning_start && generator.morning_end) {
        await generateShift("morning", generator.morning_start, generator.morning_end);
      }

      if (generator.evening_start && generator.evening_end) {
        await generateShift("evening", generator.evening_start, generator.evening_end);
      }

      toast.success(t("cms.appointments.slots.success.generated"));
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(t("cms.appointments.slots.error.generation_failed"));
    }
  };

  const toggleSlot = async (slot) => {
    try {
      const res = await updateSlot(slot.id, {
        is_available: !slot.is_available,
      });
      setSlots(slots.map((s) => (s.id === slot.id ? res.data : s)));
      toast.success(t("cms.appointments.slots.success.toggled"));
    } catch {
      toast.error(t("cms.appointments.error.update_failed"));
    }
  };

  const handleDeleteSlot = async (id) => {
    const result = await Swal.fire({
      title: t("cms.appointments.slots.confirm_delete_title"),
      text: t("cms.appointments.slots.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.appointments.slots.delete_button"),
      cancelButtonText: t("cms.appointments.slots.cancel_button"),
      reverseButtons: i18n.language === "ar",
    });

    if (result.isConfirmed) {
      try {
        await deleteSlot(id);
        setSlots(slots.filter((s) => s.id !== id));
        Swal.fire({
          title: t("cms.appointments.slots.deleted_title"),
          text: t("cms.appointments.slots.success.deleted"),
          icon: "success",
          confirmButtonColor: "#22c55e",
        });
      } catch {
        toast.error(t("cms.appointments.slots.error.delete_failed"));
      }
    }
  };

  const getFilteredSlots = () => {
    return slots.filter((slot) => {
      if (filters.dateFrom && slot.date < filters.dateFrom) return false;
      if (filters.dateTo && slot.date > filters.dateTo) return false;
      if (filters.shift !== "all" && slot.shift !== filters.shift) return false;
      if (filters.status === "available" && !slot.is_available) return false;
      if (filters.status === "disabled" && slot.is_available) return false;
      return true;
    });
  };

  const getSlotsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return slots.filter((slot) => slot.date === dateStr);
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

  if (loading) return null;

  const filteredSlots = getFilteredSlots();

  return (
    <div className="dashboard-appointments-content">
      <div className="dashboard-appointments-content-header">
        <div className="dashboard-appointments-content-header-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor"/>
          </svg>
          <h2>{t("cms.appointments.slots.title")}</h2>
        </div>
        <p className="dashboard-appointments-content-subtitle">
          {t("cms.appointments.slots.subtitle")}
        </p>
      </div>

      {/* VIEW TOGGLE */}
      <div className="dashboard-appointments-view-toggle">
        <button
          className={`dashboard-appointments-view-btn ${
            viewMode === "calendar" ? "dashboard-appointments-view-btn-active" : ""
          }`}
          onClick={() => setViewMode("calendar")}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 2H13V1H11V2H7V1H5V2H4C2.9 2 2 2.9 2 4V15C2 16.1 2.9 17 4 17H14C15.1 17 16 16.1 16 15V4C16 2.9 15.1 2 14 2ZM14 15H4V7H14V15Z" fill="currentColor"/>
          </svg>
          {t("cms.appointments.view.calendar")}
        </button>
        <button
          className={`dashboard-appointments-view-btn ${
            viewMode === "list" ? "dashboard-appointments-view-btn-active" : ""
          }`}
          onClick={() => setViewMode("list")}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 3H16V5H2V3ZM2 7H16V9H2V7ZM2 11H16V13H2V11ZM2 15H16V17H2V15Z" fill="currentColor"/>
          </svg>
          {t("cms.appointments.view.list")}
        </button>
      </div>

      {/* AUTO GENERATOR */}
      <div className="dashboard-appointments-form-card">
        <div className="dashboard-appointments-form-section">
          <h3 className="dashboard-appointments-section-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C7.5 1.5 6.3 2.7 6.3 4.2C6.3 5.7 7.5 6.9 9 6.9C10.5 6.9 11.7 5.7 11.7 4.2C11.7 2.7 10.5 1.5 9 1.5ZM9 9.9C6.3 9.9 1.5 11.25 1.5 13.8V15.3H16.5V13.8C16.5 11.25 11.7 9.9 9 9.9Z" fill="currentColor"/>
            </svg>
            {t("cms.appointments.slots.generator_title")}
          </h3>

          <div className="dashboard-appointments-form-group">
            <label className="dashboard-appointments-label">
              {t("cms.appointments.slots.select_date")}
            </label>
            <input
              type="date"
              className="dashboard-appointments-input"
              value={generator.date}
              onChange={(e) => setGenerator({ ...generator, date: e.target.value })}
            />
          </div>

          <div className="dashboard-appointments-shift-section">
            <h4 className="dashboard-appointments-shift-title">
              ☀️ {t("cms.appointments.slots.morning_shift")}
            </h4>
            <div className="dashboard-appointments-time-row">
              <div className="dashboard-appointments-form-group">
                <label className="dashboard-appointments-label">
                  {t("cms.appointments.slots.start_time")}
                </label>
                <input
                  type="time"
                  className="dashboard-appointments-input"
                  value={generator.morning_start}
                  onChange={(e) =>
                    setGenerator({ ...generator, morning_start: e.target.value })
                  }
                />
              </div>
              <div className="dashboard-appointments-form-group">
                <label className="dashboard-appointments-label">
                  {t("cms.appointments.slots.end_time")}
                </label>
                <input
                  type="time"
                  className="dashboard-appointments-input"
                  value={generator.morning_end}
                  onChange={(e) =>
                    setGenerator({ ...generator, morning_end: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="dashboard-appointments-shift-section">
            <h4 className="dashboard-appointments-shift-title">
              🌙 {t("cms.appointments.slots.evening_shift")}
            </h4>
            <div className="dashboard-appointments-time-row">
              <div className="dashboard-appointments-form-group">
                <label className="dashboard-appointments-label">
                  {t("cms.appointments.slots.start_time")}
                </label>
                <input
                  type="time"
                  className="dashboard-appointments-input"
                  value={generator.evening_start}
                  onChange={(e) =>
                    setGenerator({ ...generator, evening_start: e.target.value })
                  }
                />
              </div>
              <div className="dashboard-appointments-form-group">
                <label className="dashboard-appointments-label">
                  {t("cms.appointments.slots.end_time")}
                </label>
                <input
                  type="time"
                  className="dashboard-appointments-input"
                  value={generator.evening_end}
                  onChange={(e) =>
                    setGenerator({ ...generator, evening_end: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="dashboard-appointments-form-actions">
            <button
              onClick={generateDaySlots}
              className="dashboard-appointments-btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM12.75 9.75H9.75V12.75H8.25V9.75H5.25V8.25H8.25V5.25H9.75V8.25H12.75V9.75Z" fill="currentColor"/>
              </svg>
              {t("cms.appointments.slots.generate_button")}
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      {viewMode === "list" && (
        <div className="dashboard-appointments-filters-card">
          <h3 className="dashboard-appointments-filters-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 13H11V11H7V13ZM2 3V5H16V3H2ZM4 9H14V7H4V9Z" fill="currentColor"/>
            </svg>
            {t("cms.appointments.slots.filters_title")}
          </h3>
          <div className="dashboard-appointments-filters-row">
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.slots.filter_date_from")}
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
                {t("cms.appointments.slots.filter_date_to")}
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
                {t("cms.appointments.slots.filter_shift")}
              </label>
              <select
                className="dashboard-appointments-select"
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
              >
                <option value="all">{t("cms.appointments.slots.shift_all")}</option>
                <option value="morning">{t("cms.appointments.slots.shift_morning")}</option>
                <option value="evening">{t("cms.appointments.slots.shift_evening")}</option>
              </select>
            </div>
            <div className="dashboard-appointments-form-group">
              <label className="dashboard-appointments-label">
                {t("cms.appointments.slots.filter_status")}
              </label>
              <select
                className="dashboard-appointments-select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">{t("cms.appointments.slots.status_all")}</option>
                <option value="available">{t("cms.appointments.slots.status_available")}</option>
                <option value="disabled">{t("cms.appointments.slots.status_disabled")}</option>
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
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

                const daySlots = getSlotsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    className={`dashboard-appointments-calendar-day ${
                      isToday ? "dashboard-appointments-calendar-day-today" : ""
                    } ${isSelected ? "dashboard-appointments-calendar-day-selected" : ""} ${
                      daySlots.length > 0 ? "dashboard-appointments-calendar-day-has-slots" : ""
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="dashboard-appointments-calendar-day-number">{day.getDate()}</div>
                    {daySlots.length > 0 && (
                      <div className="dashboard-appointments-calendar-day-badge">
                        {daySlots.length} {t("cms.appointments.slots.slots")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED DATE SLOTS */}
          {selectedDate && (
            <div className="dashboard-appointments-selected-date">
              <h4 className="dashboard-appointments-selected-date-title">
                {t("cms.appointments.slots.slots_for")} {selectedDate.toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
              </h4>
              <div className="dashboard-appointments-slots-grid">
                {getSlotsForDate(selectedDate).map((slot) => (
                  <div key={slot.id} className="dashboard-appointments-slot-card">
                    <div className="dashboard-appointments-slot-header">
                      <span className="dashboard-appointments-slot-time">
                        {slot.start_time} - {slot.end_time}
                      </span>
                      <span
                        className={`dashboard-appointments-slot-badge ${
                          slot.is_available
                            ? "dashboard-appointments-slot-badge-available"
                            : "dashboard-appointments-slot-badge-disabled"
                        }`}
                      >
                        {slot.is_available
                          ? t("cms.appointments.slots.status_available")
                          : t("cms.appointments.slots.status_disabled")}
                      </span>
                    </div>
                    <div className="dashboard-appointments-slot-actions">
                      <button
                        className="dashboard-appointments-btn-toggle"
                        onClick={() => toggleSlot(slot)}
                      >
                        {slot.is_available
                          ? t("cms.appointments.actions.disable")
                          : t("cms.appointments.actions.enable")}
                      </button>
                      <button
                        className="dashboard-appointments-btn-delete"
                        onClick={() => handleDeleteSlot(slot.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                        </svg>
                        {t("cms.appointments.actions.delete")}
                      </button>
                    </div>
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
                <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
              </svg>
              <h3>{t("cms.appointments.slots.list_title")}</h3>
            </div>
            <span className="dashboard-appointments-count-badge">{filteredSlots.length}</span>
          </div>

          {filteredSlots.length > 0 ? (
            <div className="dashboard-appointments-table-wrapper">
              <table className="dashboard-appointments-table">
                <thead>
                  <tr>
                    <th>{t("cms.appointments.table.date")}</th>
                    <th>{t("cms.appointments.table.shift")}</th>
                    <th>{t("cms.appointments.table.start_time")}</th>
                    <th>{t("cms.appointments.table.end_time")}</th>
                    <th>{t("cms.appointments.table.status")}</th>
                    <th>{t("cms.appointments.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td>{slot.date}</td>
                      <td>
                        {slot.shift === "morning"
                          ? t("cms.appointments.slots.shift_morning")
                          : t("cms.appointments.slots.shift_evening")}
                      </td>
                      <td>{slot.start_time}</td>
                      <td>{slot.end_time}</td>
                      <td>
                        <span
                          className={`dashboard-appointments-status-badge ${
                            slot.is_available
                              ? "dashboard-appointments-status-available"
                              : "dashboard-appointments-status-disabled"
                          }`}
                        >
                          {slot.is_available
                            ? t("cms.appointments.slots.status_available")
                            : t("cms.appointments.slots.status_disabled")}
                        </span>
                      </td>
                      <td>
                        <div className="dashboard-appointments-table-actions">
                          <button
                            className="dashboard-appointments-btn-toggle"
                            onClick={() => toggleSlot(slot)}
                          >
                            {slot.is_available
                              ? t("cms.appointments.actions.disable")
                              : t("cms.appointments.actions.enable")}
                          </button>
                          <button
                            className="dashboard-appointments-btn-delete"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                            </svg>
                            {t("cms.appointments.actions.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dashboard-appointments-empty">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M38 6H34V4H30V6H18V4H14V6H10C7.8 6 6 7.8 6 10V38C6 40.2 7.8 42 10 42H38C40.2 42 42 40.2 42 38V10C42 7.8 40.2 6 38 6ZM38 38H10V16H38V38Z" fill="currentColor"/>
              </svg>
              <p>{t("cms.appointments.slots.empty")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}