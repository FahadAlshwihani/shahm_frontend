import { create } from "zustand";
import { getAdminAbout } from "../api/aboutApi";

export const useAboutStore = create((set) => ({
  about: null,
  loading: false,
  error: null,

  fetchAbout: async () => {
    try {
      set({ loading: true });

      const res = await getAdminAbout(); // ✅ admin مو public

      set({
        about: res.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      set({
        about: null,
        loading: false,
        error: err,
      });
    }
  },
}));