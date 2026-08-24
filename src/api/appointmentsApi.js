import api from "./axiosClient";
import { API_PATHS } from "./routes";

/* ================= PUBLIC ================= */

// المواعيد المتاحة
export const getAvailableSlots = (params = {}) =>
  api.get(API_PATHS.appointments.publicSlots, { params });

/* ================= ADMIN (CMS) ================= */

// صفحة CMS
export const getAdminAppointmentPage = () =>
  api.get(API_PATHS.appointments.page);

export const updateAdminAppointmentPage = (data) =>
  api.patch(API_PATHS.appointments.page, data);

// الإعدادات
export const getAdminAppointmentSettings = () =>
  api.get(API_PATHS.appointments.settings);

export const updateAdminAppointmentSettings = (data) =>
  api.patch(API_PATHS.appointments.settings, data);

// Slots
export const getAdminSlots = () =>
  api.get(API_PATHS.appointments.slots);

export const updateSlot = (id, data) =>
  api.patch(API_PATHS.appointments.slot(id), data);

export const deleteSlot = (id) =>
  api.delete(API_PATHS.appointments.slot(id));

// Bookings
export const getAdminBookings = () =>
  api.get(API_PATHS.appointments.bookings);

export const generateSlots = (data) =>
  api.post(API_PATHS.appointments.generateSlots, data);

export const updateBookingStatus = (id, data) =>
  api.patch(API_PATHS.appointments.bookingStatus(id), data);
