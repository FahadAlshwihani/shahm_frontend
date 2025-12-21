import api from "./axiosClient";

// جلب الإعدادات
export const getSettings = () => api.get("settings/");

// تحديث الإعدادات
export const updateSettings = (data) =>
  api.put("settings/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
