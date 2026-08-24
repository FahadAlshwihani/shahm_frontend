// src/api/cmsApi.js
import api from "./axiosClient";
import { API_PATHS } from "./routes";

// ===============================
// ADMIN: Heroes (Sections)
// ===============================
export const adminHeroes = () => api.get(API_PATHS.cms.heroes);

export const adminCreateHero = (formData) =>
  api.post(API_PATHS.cms.heroes, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminEditHero = (id, formData) =>
  api.patch(API_PATHS.cms.hero(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteHero = (id) =>
  api.delete(API_PATHS.cms.hero(id));

// ===============================
// ADMIN: Hero Media (داخل كل Hero)
// ===============================
export const adminGetHeroMedia = (heroId) =>
  api.get(API_PATHS.cms.heroMedia(heroId));

export const adminCreateHeroMedia = (heroId, formData) =>
  api.post(API_PATHS.cms.heroMedia(heroId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminEditHeroMedia = (id, formData) =>
  api.patch(API_PATHS.cms.heroMediaItem(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteHeroMedia = (id) =>
  api.delete(API_PATHS.cms.heroMediaItem(id));

// ===============================
// ADMIN: Pages
// ===============================
export const adminPages = () => api.get(API_PATHS.cms.pages);
export const adminCreatePage = (data) =>
  api.post(API_PATHS.cms.pages, data);
export const adminEditPage = (id, data) =>
  api.patch(API_PATHS.cms.page(id), data);
export const adminDeletePage = (id) =>
  api.delete(API_PATHS.cms.page(id));

// ===============================
// ADMIN: FAQ Categories
// ===============================
export const adminFaqCategories = () =>
  api.get(API_PATHS.cms.faqCategories);

export const adminCreateFaqCategory = (formData) =>
  api.post(API_PATHS.cms.faqCategories, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminEditFaqCategory = (id, formData) =>
  api.patch(API_PATHS.cms.faqCategory(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteFaqCategory = (id) =>
  api.delete(API_PATHS.cms.faqCategory(id));

export const adminFaq = () => api.get(API_PATHS.cms.faq);

export const adminCreateFaq = (data) =>
  api.post(API_PATHS.cms.faq, data);

export const adminEditFaq = (id, data) =>
  api.patch(API_PATHS.cms.faqItem(id), data);

export const adminDeleteFaq = (id) =>
  api.delete(API_PATHS.cms.faqItem(id));
