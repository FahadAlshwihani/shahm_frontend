import { create } from "zustand";
import { getPublicFAQ } from "../api/publicApi";

export const useFaqStore = create((set) => ({
  faqs: [],
  loading: false,

  fetchFaqs: async () => {
    try {
      set({ loading: true });
      const res = await getPublicFAQ();
      set({ faqs: res.data, loading: false });
    } catch (e) {
      set({ faqs: [], loading: false });
    }
  },
}));
