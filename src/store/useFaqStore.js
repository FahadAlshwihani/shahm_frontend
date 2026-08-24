import { create } from "zustand";
import { getPublicFAQ } from "../api/publicApi";

export const useFaqStore = create((set) => ({
  faqs: [],
  categories: [], // ✅ أضف هذا
  loading: false,

  fetchFaqs: async () => {
    try {
      set({ loading: true });

      const res = await getPublicFAQ();

      // 🔥 هنا أهم نقطة
      const data = Array.isArray(res.data) ? res.data : [];

      const normalizedFaqs = data.flatMap((cat) =>
        (cat.faqs || []).map((f) => ({
          id: f.id,
          category: cat.id,
          question_ar: f.question_ar || "",
          question_en: f.question_en || "",
          answer_ar: f.answer_ar || "",
          answer_en: f.answer_en || "",
          order: f.order ?? 0,
          is_active: f.is_active ?? true,
        }))
      );

      const normalizedCategories = data.map((cat) => ({
        id: cat.id,
        title_ar: cat.title_ar,
        title_en: cat.title_en,
        icon_url: cat.icon_url,
        slug: cat.slug,
      }));

      set({
        faqs: normalizedFaqs,
        categories: normalizedCategories, // ✅ مهم
        loading: false,
      });

    } catch (e) {
      console.error("FAQ fetch error:", e);
      set({ faqs: [], categories: [], loading: false });
    }
  },
}));
