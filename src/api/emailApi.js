// src/api/emailApi.js
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
export const getEmailTemplates = () => api.get("settings/email-templates/");
export const updateEmailTemplate = (data) =>
  api.put("settings/email-templates/", data);
