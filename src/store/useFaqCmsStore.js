import { create } from "zustand";
import {
  adminFaq,
  adminCreateFaq,
  adminEditFaq,
  adminDeleteFaq,
  adminFaqCategories,
  adminCreateFaqCategory,
  adminEditFaqCategory,
  adminDeleteFaqCategory,
} from "../api/cmsApi";

const CACHE_TTL = 1000 * 60 * 5;

export const useFaqCmsStore = create((set, get) => ({
  // ===== FAQ =====
  faqs: [],
  loading: false,

  fetchFaqs: async () => {
    set({ loading: true });
    try {
      const res = await adminFaq();
      set({ faqs: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createFaq: async (data) => {
    await adminCreateFaq(data);
    await get().fetchFaqs();
    return { success: true };
  },

  updateFaq: async (id, data) => {
    await adminEditFaq(id, data);
    await get().fetchFaqs();
    return { success: true };
  },

  deleteFaq: async (id) => {
    await adminDeleteFaq(id);
    await get().fetchFaqs();
    return { success: true };
  },

  // ===== CATEGORIES =====
  categories: [],
  categoriesLastFetch: 0,

  fetchCategories: async (force = false) => {
    const now = Date.now();

    if (!force && now - get().categoriesLastFetch < CACHE_TTL) return;

    try {
      const res = await adminFaqCategories();

      // نضيف حقول UI فقط
      const enhanced = res.data.map((c, index) => ({
        ...c,
        parent: c.parent || null,
        order: c.order ?? index,
      }));

      set({
        categories: enhanced,
        categoriesLastFetch: now,
      });
    } catch {
      set({ categories: [] });
    }
  },

  createCategory: async (formData) => {
    await adminCreateFaqCategory(formData);
    await get().fetchCategories(true);
    return { success: true };
  },

  updateCategory: async (id, formData) => {
    await adminEditFaqCategory(id, formData);
    await get().fetchCategories(true);
    return { success: true };
  },

  deleteCategory: async (id) => {
    await adminDeleteFaqCategory(id);
    await get().fetchCategories(true);
    return { success: true };
  },

  // 🔥 local reorder فقط
  reorderLocal: (newOrder) => {
    set({ categories: newOrder });
  },
}));