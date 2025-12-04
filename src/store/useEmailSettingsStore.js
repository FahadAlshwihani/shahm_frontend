import { create } from "zustand";
import { getEmailSettings, updateEmailSettings } from "../api/emailApi";
import api from "../api/axiosClient";

export const useEmailSettingsStore = create((set) => ({
  settings: null,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    const res = await getEmailSettings();
    set({ settings: res.data, loading: false });
  },

  saveSettings: async (data) => {
    try {
      const res = await updateEmailSettings(data);
      set({ settings: res.data });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  testSMTP: async (config) => {
    try {
      const res = await api.post("settings/email/test/", config);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Connection failed",
      };
    }
  },

  resetDefaults: async () => {
    const defaults = {
      smtp_host: "",
      smtp_port: 587,
      smtp_username: "",
      smtp_password: "",
      smtp_use_tls: true,
      smtp_use_ssl: false,
      contact_receiver_email: "",
      auto_reply_email: "",
    };
    set({ settings: defaults });
  },
}));
