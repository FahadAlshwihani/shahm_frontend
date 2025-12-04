// src/store/useCmsStore.js
import { create } from "zustand";
import { getPublicHome } from "../api/publicApi";

import {
  adminHeroes,
  adminCreateHero,
  adminEditHero,
  adminDeleteHero,
  adminPages,
  adminCreatePage,
  adminEditPage,
  adminDeletePage,
} from "../api/cmsApi";

export const useCmsStore = create((set, get) => ({
  // Public
  hero: null,
  footer: null,

  // Heroes
  heroes: [],
  loadingHeroes: false,

  // Pages
  pages: [],
  loadingPages: false,

  // ================================
  // PUBLIC HOME
  // ================================
  fetchPublicHome: async () => {
    try {
      const res = await getPublicHome();
      set({
        hero: res.data.hero || null,
        footer: res.data.footer_columns || [],
      });
    } catch (err) {
      console.error("Public Home Error:", err);
    }
  },

  // ================================
  // ADMIN: HEROES
  // ================================
  fetchAdminHeroes: async () => {
    try {
      set({ loadingHeroes: true });
      const res = await adminHeroes();
      set({ heroes: res.data, loadingHeroes: false });
    } catch {
      set({ loadingHeroes: false });
    }
  },

  createHero: async (formData) => {
    try {
      await adminCreateHero(formData);
      await get().fetchAdminHeroes();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  updateHero: async (id, formData) => {
    try {
      await adminEditHero(id, formData);
      await get().fetchAdminHeroes();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  deleteHero: async (id) => {
    try {
      await adminDeleteHero(id);
      await get().fetchAdminHeroes();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  // ================================
  // ADMIN: PAGES
  // ================================
  fetchAdminPages: async () => {
    try {
      set({ loadingPages: true });
      const res = await adminPages();
      set({ pages: res.data, loadingPages: false });
    } catch {
      set({ loadingPages: false });
    }
  },

  createPage: async (data) => {
    try {
      await adminCreatePage(data);
      await get().fetchAdminPages();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  updatePage: async (id, data) => {
    try {
      await adminEditPage(id, data);
      await get().fetchAdminPages();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  deletePage: async (id) => {
    try {
      await adminDeletePage(id);
      await get().fetchAdminPages();
      return { success: true };
    } catch {
      return { success: false };
    }
  },
}));
