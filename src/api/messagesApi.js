import api from "./axiosClient";

// Public
export const sendContact = (data) => api.post("messaging/contact/", data);
export const subscribeNewsletter = (data) =>
  api.post("messaging/subscribe/", data);

// Admin
export const adminGetMessages = () => api.get("messaging/admin/messages/");
export const adminGetSingleMessage = (id) =>
  api.get(`messaging/admin/messages/${id}/`);
export const adminUpdateMessage = (id, data) =>
  api.patch(`messaging/admin/messages/${id}/`, data);

export const adminGetSubscribers = () =>
  api.get("messaging/admin/subscribers/");

export const adminDeleteSubscriber = (id) =>
  api.delete(`messaging/admin/subscribers/${id}/`);

export const adminBroadcast = (data) =>
  api.post("messaging/admin/broadcast/", data);

// ✅ تصدير المشتركين إلى CSV (Excel)
export const adminExportSubscribers = () =>
  api.get("messaging/admin/subscribers/export/", {
    responseType: "blob",
  });

// ✅ جلب سجل الرسائل المرسلة
export const adminGetBroadcastLogs = () =>
  api.get("messaging/admin/broadcast/logs/");
