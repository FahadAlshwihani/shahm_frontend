// src/api/cmsApi.js
import api from "./axiosClient";

// ===============================
// Public CMS (لو احتجناه لاحقًا)
// ===============================
export const getPage = (slug) => api.get(`public/page/${slug}/`);

// ===============================
// ADMIN: Heroes (Sections)
// ===============================
export const adminHeroes = () => api.get("cms/admin/heroes/");

export const adminCreateHero = (formData) =>
  api.post("cms/admin/heroes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminEditHero = (id, formData) =>
  api.patch(`cms/admin/heroes/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteHero = (id) =>
  api.delete(`cms/admin/heroes/${id}/`);

// ===============================
// ADMIN: Hero Media (داخل كل Hero)
// ===============================
export const adminGetHeroMedia = (heroId) =>
  api.get(`cms/admin/hero-media/${heroId}/`);

export const adminCreateHeroMedia = (heroId, formData) =>
  api.post(`cms/admin/hero-media/${heroId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminEditHeroMedia = (id, formData) =>
  api.patch(`cms/admin/hero-media/item/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteHeroMedia = (id) =>
  api.delete(`cms/admin/hero-media/item/${id}/`);

// ===============================
// ADMIN: Pages
// ===============================
export const adminPages = () => api.get("cms/admin/pages/");
export const adminCreatePage = (data) =>
  api.post("cms/admin/pages/", data);
export const adminEditPage = (id, data) =>
  api.patch(`cms/admin/pages/${id}/`, data);
export const adminDeletePage = (id) =>
  api.delete(`cms/admin/pages/${id}/`);
