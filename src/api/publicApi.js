// src/api/publicApi.js
import api from "./axiosClient";

// ================================
// HOME (Hero + Footer + Sections)
// ================================
export const getPublicHome = () => api.get("public/home/");

// ================================
// CMS PAGES
// ================================
export const getPublicPage = (slug) => api.get(`public/page/${slug}/`);

// ================================
// LEGAL PAGES
// ================================
export const getPublicLegal = (slug) => api.get(`public/legal/${slug}/`);

// ================================
// TEAM
// ================================
export const getPublicTeam = () => api.get("public/team/");

// ================================
// BLOG
// ================================
export const getPublicBlog = () => api.get("public/blog/");
export const getPublicBlogPost = (slug) => api.get(`public/blog/${slug}/`);

// ================================
// SERVICES
// ================================
export const getPublicServices = () => api.get("public/services/");

// ================================
// SEO (Default + Page SEO)
// ================================
export const getPublicSEO = (slug = null) =>
  slug ? api.get(`public/seo/${slug}/`) : api.get("public/seo/");

export const getPublicHeader = () => api.get("public/header/");
export const getPublicFooter = () => api.get("public/footer/");
export const getPublicSettings = () => api.get("public/settings/");

