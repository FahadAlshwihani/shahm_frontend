// src/store/useSettingsStore.js
import { create } from "zustand";
import { getSettings, updateSettings } from "../api/settingsApi";

export const useSettingsStore = create((set) => ({
  settings: null,
  loading: false,

  // جلب الإعدادات
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await getSettings();
      set({ settings: res.data });
    } catch (err) {
      console.error("Settings Fetch Error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // تحديث الإعدادات
  saveSettings: async (formData) => {
    set({ loading: true });

    try {
      const res = await updateSettings(formData);
      set({ settings: res.data });
      return { success: true };
    } catch (err) {
      console.error("Settings Update Error:", err);
      return {
        success: false,
        message: err.response?.data?.detail || "Update failed",
      };
    } finally {
      set({ loading: false });
    }
  },
}));
