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
export const adminGetSubscribers = () => api.get("messaging/admin/subscribers/");
export const adminBroadcast = (data) =>
  api.post("messaging/admin/broadcast/", data);
