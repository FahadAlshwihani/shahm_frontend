import { create } from "zustand";
import { login as loginApi } from "../api/authApi";
import { stopIdleTimer } from "../utils/idleSessionManager";

export const useAuthStore = create((set, get) => ({

  user: null,
  accessToken: localStorage.getItem("access_token") || null,
  refreshToken: localStorage.getItem("refresh_token") || null,
  isAuthenticated: !!localStorage.getItem("access_token"),

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
        isAuthenticated: true
      });

      return true;

    } catch {
      return false;
    }

  },

  logout: () => {

    stopIdleTimer();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });

  }

}));
