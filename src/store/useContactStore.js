import { create } from "zustand";
import { getPublicContactPage } from "../api/contactApi";
import { sendContact } from "../api/messagesApi";

export const useContactStore = create((set) => ({
  loading: false,

  // 🆕 Page Header
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",

  cards: [],
  faqPreview: [],

  fetchContactPage: async () => {
    set({ loading: true });
    const res = await getPublicContactPage();

    set({
      title_ar: res.data.title_ar || "",
      title_en: res.data.title_en || "",
      description_ar: res.data.description_ar || "",
      description_en: res.data.description_en || "",

      cards: res.data.cards || [],
      faqPreview: res.data.faq_preview || [],
      loading: false,
    });
  },

  submitContact: async (data) => {
    await sendContact(data);
    return { success: true };
  },
}));
