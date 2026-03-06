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
export const getPublicBlog = (type = null) =>
  type
    ? api.get(`blog/?type=${type}`)
    : api.get("blog/");

export const getPublicBlogPost = (slug) =>
  api.get(`blog/${slug}/`);

export const getPublicBlogSettings = () =>
  api.get("blog/settings/");


// ================================
// SERVICES
// ================================

// جميع المجالات
export const getPublicAreas = () =>
  api.get("services/public/");

// جميع الخدمات
export const getPublicServices = () =>
  api.get("services/public/services/");

// تفاصيل خدمة
export const getPublicServiceDetail = (slug) =>
  api.get(`services/public/service/${slug}/`);

// تفاصيل مجال مع خدماته
export const getPublicServiceArea = (slug) =>
  api.get(`services/public/${slug}/`);


// ================================
// SEO
// ================================
export const getPublicSEO = (slug = null) =>
  slug ? api.get(`public/seo/${slug}/`) : api.get("public/seo/");

export const getPublicHeader = () => api.get("public/header/");
export const getPublicFooter = () => api.get("public/footer/");
export const getPublicSettings = () => api.get("public/settings/");


// ================================
// Public Search
// ================================
export const searchPublic = (q, lang) =>
  api.get("/cms/public/search/", {
    params: { q, lang },
  });

// ================================
// FAQ
// ================================
export const getPublicFAQ = () => api.get("cms/public/faq/");
