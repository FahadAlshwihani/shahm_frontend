// src/store/useCmsStore.js
import { create } from "zustand";
import { getPublicHome } from "../api/publicApi";

import {
  adminHeroes,
  adminCreateHero,
  adminEditHero,
  adminDeleteHero,

  adminGetHeroMedia,
  adminCreateHeroMedia,
  adminEditHeroMedia,
  adminDeleteHeroMedia,

  adminPages,
  adminCreatePage,
  adminEditPage,
  adminDeletePage,
} from "../api/cmsApi";

export const useCmsStore = create((set, get) => ({
  // ==========================
  // PUBLIC DATA
  // ==========================
  hero: null,
  footer: [],

  // ==========================
  // FETCH PUBLIC HOME
  // ==========================
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


  // ==========================
  // HEROES (ADMIN)
  // ==========================
  heroes: [],
  loadingHeroes: false,
  heroMedia: [],

  fetchAdminHeroes: async () => {
    try {
      set({ loadingHeroes: true });
      const res = await adminHeroes();
      set({ heroes: res.data, loadingHeroes: false });
    } catch {
      set({ loadingHeroes: false });
    }
  },

  createHero: async (data) => {
    await adminCreateHero(data);
    await get().fetchAdminHeroes();
    return { success: true };
  },

  updateHero: async (id, data) => {
    await adminEditHero(id, data);
    await get().fetchAdminHeroes();
    return { success: true };
  },

  deleteHero: async (id) => {
    await adminDeleteHero(id);
    await get().fetchAdminHeroes();
    return { success: true };
  },

  // ==========================
  // HERO MEDIA
  // ==========================
  fetchAdminHeroMedia: async (heroId) => {
    const res = await adminGetHeroMedia(heroId);
    set({ heroMedia: res.data });
  },

  createHeroMedia: async (heroId, fd) => {
    await adminCreateHeroMedia(heroId, fd);
    await get().fetchAdminHeroMedia(heroId);
    return { success: true };
  },

  updateHeroMedia: async (id, fd, heroId) => {
    await adminEditHeroMedia(id, fd);
    await get().fetchAdminHeroMedia(heroId);
    return { success: true };
  },

  deleteHeroMedia: async (id, heroId) => {
    await adminDeleteHeroMedia(id);
    await get().fetchAdminHeroMedia(heroId);
    return { success: true };
  },

  // ==========================
  // PAGES (ADMIN)
  // ==========================
  pages: [],

  fetchAdminPages: async () => {
    const res = await adminPages();
    set({ pages: res.data });
  },

  createPage: async (data) => {
    await adminCreatePage(data);
    await get().fetchAdminPages();
    return { success: true };
  },

  updatePage: async (id, data) => {
    await adminEditPage(id, data);
    await get().fetchAdminPages();
    return { success: true };
  },

  deletePage: async (id) => {
    await adminDeletePage(id);
    await get().fetchAdminPages();
    return { success: true };
  },
}));
