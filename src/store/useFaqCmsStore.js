import { create } from "zustand";
import {
  adminFaq,
  adminCreateFaq,
  adminEditFaq,
  adminDeleteFaq,
} from "../api/cmsApi";

export const useFaqCmsStore = create((set, get) => ({
  faqs: [],
  loading: false,

  fetchFaqs: async () => {
    set({ loading: true });
    const res = await adminFaq();
    set({ faqs: res.data, loading: false });
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
}));
