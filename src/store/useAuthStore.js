import { create } from "zustand";
import { login as loginApi } from "../api/authApi";
import { stopIdleTimer } from "../utils/idleSessionManager";
import {
  clearTokens,
  readAccessToken,
  readRefreshToken,
  saveTokens,
} from "../utils/tokenStorage";

export const useAuthStore = create((set, get) => ({

  user: null,
  accessToken: readAccessToken(),
  refreshToken: readRefreshToken(),
  isAuthenticated: !!readAccessToken(),

  login: async (credentials) => {

    try {

      const res = await loginApi(credentials);

      const { access, refresh, user } = res.data;

      saveTokens({ access, refresh });

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

    clearTokens();

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });

  }

}));
