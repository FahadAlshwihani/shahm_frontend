import { create } from "zustand";
import {
  getDefaultSEO,
  adminSEOList,
  adminCreateSEO,
  adminUpdateSEO,
  adminDeleteSEO,
  adminAllPages,
} from "../api/seoApi";

export const useSEOStore = create((set, get) => ({

  defaultSEO: null,
  pages: [],
  allPages: [],

  loadDefaultSEO: async () => {
    const res = await getDefaultSEO();
    set({ defaultSEO: res.data });
  },

  loadPages: async () => {
    const res = await adminSEOList();
    set({ pages: res.data });
  },

  loadAllPages: async () => {
    const res = await adminAllPages();
    set({ allPages: res.data });
  },

  createPageSEO: async (data) => {
    await adminCreateSEO(data);
    await get().loadPages();
    return { success: true };
  },

  updatePageSEO: async (id, data) => {
    await adminUpdateSEO(id, data);
    await get().loadPages();
    return { success: true };
  },

  deletePageSEO: async (id) => {
    await adminDeleteSEO(id);
    await get().loadPages();
    return { success: true };
  },

}));
