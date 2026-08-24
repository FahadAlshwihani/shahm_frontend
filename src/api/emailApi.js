import api from "./axiosClient";
import { API_PATHS } from "./routes";

// ======================
// Email SMTP Settings
// ======================
export const getEmailSettings = () => api.get(API_PATHS.settings.email);
export const updateEmailSettings = (data) =>
  api.put(API_PATHS.settings.email, data);

// ======================
// Email Templates API
// ======================
export const getEmailTemplates = () => api.get(API_PATHS.messaging.emailTemplates);
export const updateEmailTemplate = (data) =>
  api.post(API_PATHS.messaging.emailTemplates, data);
