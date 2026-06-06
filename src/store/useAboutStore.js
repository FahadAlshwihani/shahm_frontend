import { create } from "zustand";
import { getPublicAbout } from "../api/aboutApi";

export const useAboutStore = create((set) => ({
  about: null,
  loading: false,
  error: null,

  fetchAbout: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await getPublicAbout();

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