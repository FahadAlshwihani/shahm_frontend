// src/store/usePublicStore.js
import { create } from "zustand";
import {
  getPublicHome,
  getPublicPage,
  getPublicLegal,
  getPublicServices,
  getPublicTeam,
  getPublicBlog,
  getPublicBlogPost,
} from "../api/publicApi";
import api from "../api/axiosClient";

export const usePublicStore = create((set) => ({
  loading: false,
  error: null,

  // Main data holders
  home: null,
  page: null,
  legal: null,
  services: [],
  team: [],
  blog: [],
  blogPost: null,
  seo: null,

  // Generic Loader
  setLoading: (val) => set({ loading: val }),

  // Home
  fetchHome: async () => {
    try {
      set({ loading: true });
      const res = await getPublicHome();
      set({ home: res.data, loading: false });
    } catch (e) {
      set({ home: null, loading: false, error: "Failed to load home content" });
    }
  },

  // Dynamic CMS Page
  fetchPage: async (slug) => {
    try {
      set({ loading: true });
      const res = await getPublicPage(slug);
      set({ page: res.data, loading: false });
    } catch (e) {
      set({ page: null, loading: false, error: "Page not found" });
    }
  },

  // Legal Page
  fetchLegal: async (slug) => {
    try {
      set({ loading: true });
      const res = await getPublicLegal(slug);
      set({ legal: res.data, loading: false });
    } catch (e) {
      set({ legal: null, loading: false, error: "Legal page not found" });
    }
  },

  // Practice Areas + Services
  fetchServices: async () => {
    try {
      set({ loading: true });
      const res = await getPublicServices();
      set({ services: res.data, loading: false });
    } catch (e) {
      set({
        services: [],
        loading: false,
        error: "Failed to load services",
      });
    }
  },

  // Team
  fetchTeam: async () => {
    try {
      set({ loading: true });
      const res = await getPublicTeam();
      set({ team: res.data, loading: false });
    } catch (e) {
      set({
        team: [],
        loading: false,
        error: "Failed to load team",
      });
    }
  },

  // Blog List
  fetchBlog: async () => {
    try {
      set({ loading: true });
      const res = await getPublicBlog();
      set({ blog: res.data, loading: false });
    } catch (e) {
      set({ blog: [], loading: false, error: "Failed to load blog posts" });
    }
  },

  // Blog single
  fetchBlogPost: async (slug) => {
    try {
      set({ loading: true });
      const res = await getPublicBlogPost(slug);
      set({ blogPost: res.data, loading: false });
    } catch (e) {
      set({
        blogPost: null,
        loading: false,
        error: "Failed to load blog article",
      });
    }
  },

  // Dynamic SEO
  fetchSEO: async (slug = "") => {
    try {
      const res = await api.get(`public/seo/${slug || ""}`);
      set({ seo: res.data });
    } catch (e) {
      set({ seo: null });
    }
  },
}));
