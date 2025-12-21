import api from "./axiosClient";

// ======================
// Email SMTP Settings
// ======================
export const getEmailSettings = () => api.get("settings/email/");
export const updateEmailSettings = (data) =>
  api.put("settings/email/", data);

// ======================
// Email Templates API
// ======================
export const getEmailTemplates = () => api.get("messaging/admin/email-templates/");
export const updateEmailTemplate = (data) =>
  api.post("messaging/admin/email-templates/", data);
