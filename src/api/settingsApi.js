import api from "./axiosClient";
import { API_PATHS } from "./routes";

// جلب الإعدادات
export const getSettings = () => api.get(API_PATHS.settings.site);

// تحديث الإعدادات
export const updateSettings = (data) =>
  api.put(API_PATHS.settings.site, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
