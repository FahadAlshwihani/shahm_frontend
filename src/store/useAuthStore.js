// src/store/useAuthStore.js
import { create } from "zustand";
import jwtDecode from "jwt-decode";
import { login as loginApi } from "../api/authApi";
import api from "../api/axiosClient";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("access_token") || null,
  refreshToken: localStorage.getItem("refresh_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"),

  // -----------------------------
  // Login
  // -----------------------------
login: async (credentials) => {
    try {
      const res = await loginApi(credentials);


      const { access, refresh, user } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      set({
        accessToken: access,
        refreshToken: refresh,
        user,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Login failed",
      };
    }
  },

  // -----------------------------
  // Refresh access token
  // -----------------------------
  refreshAccessToken: async () => {
    const refresh = get().refreshToken;

    if (!refresh) return;

    try {
      const res = await api.post("accounts/refresh/", {
        refresh,
      });

      const { access } = res.data;

      localStorage.setItem("access_token", access);

      set({ accessToken: access, isAuthenticated: true });

      return access;
    } catch (err) {
      get().logout();
      return null;
    }
  },

  // -----------------------------
  // Logout
  // -----------------------------
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
