import api from "./axiosClient";

/* ================= PUBLIC ================= */

// صفحة الحجز (النصوص)
export const getAppointmentPage = () =>
  api.get("/services/public/appointments/page/");

// الإعدادات (السعر)
export const getAppointmentSettings = () =>
  api.get("/services/public/appointments/settings/");

// المواعيد المتاحة
export const getAvailableSlots = () =>
  api.get("/services/public/appointments/slots/");

// إنشاء حجز (قبل الدفع)
export const bookAppointment = (data) =>
  api.post("/services/public/appointments/book/", data);


/* ================= ADMIN (CMS) ================= */

// صفحة CMS
export const getAdminAppointmentPage = () =>
  api.get("/services/admin/appointments/page/");

export const updateAdminAppointmentPage = (data) =>
  api.patch("/services/admin/appointments/page/", data);

// الإعدادات
export const getAdminAppointmentSettings = () =>
  api.get("/services/admin/appointments/settings/");

export const updateAdminAppointmentSettings = (data) =>
  api.patch("/services/admin/appointments/settings/", data);

// Slots
export const getAdminSlots = () =>
  api.get("/services/admin/appointments/slots/");

export const createSlot = (data) =>
  api.post("/services/admin/appointments/slots/", data);

export const updateSlot = (id, data) =>
  api.patch(`/services/admin/appointments/slots/${id}/`, data);

export const deleteSlot = (id) =>
  api.delete(`/services/admin/appointments/slots/${id}/`);

// Bookings
export const getAdminBookings = () =>
  api.get("/services/admin/appointments/bookings/");
