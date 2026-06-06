import { create } from "zustand";

export const useFormAccessStore =
  create((set) => ({

    accessToken:
      localStorage.getItem(
        "form_access_token"
      ) || null,

    setAccessToken: (token) => {

      localStorage.setItem(
        "form_access_token",
        token,
      );

      set({
        accessToken: token,
      });
    },

    clearAccessToken: () => {

      localStorage.removeItem(
        "form_access_token",
      );

      set({
        accessToken: null,
      });
    },
}));