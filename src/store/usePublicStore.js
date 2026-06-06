import { create } from "zustand";

import {
  getPublicHome,
  getPublicHeader,
  getPublicFooter,
  getPublicSettings,
} from "../api/publicApi";

export const usePublicStore = create((set, get) => ({
  initialized: false,
  loading: false,
  error: null,

  home: null,
  header: null,
  footer: null,
  settings: null,

  initialize: async () => {
    // prevent duplicate requests
    if (get().initialized || get().loading) {
      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const [
        homeRes,
        headerRes,
        footerRes,
        settingsRes,
      ] = await Promise.all([
        getPublicHome(),
        getPublicHeader(),
        getPublicFooter(),
        getPublicSettings(),
      ]);

      set({
        initialized: true,
        loading: false,

        home: homeRes.data,
        header: headerRes.data,
        footer: footerRes.data,
        settings: settingsRes.data,
      });
    } catch (error) {
      console.error("Public initialization failed:", error);

      set({
        loading: false,
        error: error?.response?.data || error.message,
      });
    }
  },

  reset: () => {
    set({
      initialized: false,
      loading: false,
      error: null,

      home: null,
      header: null,
      footer: null,
      settings: null,
    });
  },
}));