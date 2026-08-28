import api from "./axiosClient";
import { API_PATHS } from "./routes";

// ================================
// HOME (Hero + Footer + Sections)
// ================================
export const getPublicHome = () => api.get(API_PATHS.public.home);

// ================================
// BLOG
// ================================
export const getPublicPosts = (params = {}) =>
  api.get(API_PATHS.blog.publicPosts, { params });

export const getPublicPostDetails = (slug) =>
  api.get(API_PATHS.blog.publicPost(slug));

export const getPublicCategories = () =>
  api.get(API_PATHS.blog.publicCategories);

export const getPublicBlogSettings = () =>
  api.get(API_PATHS.blog.publicSettings);

export const getPublicHeader = () => api.get(API_PATHS.public.header);
export const getPublicFooter = () => api.get(API_PATHS.public.footer);
export const getPublicSettings = () => api.get(API_PATHS.public.settings);


// ================================
// Public Search
// ================================
// Typed queries arrive faster than the answers, so a newer search replaces the
// request still in flight.
export const searchPublic = (q, lang) =>
  api.get(API_PATHS.cms.publicSearch, {
    params: { q, lang },
    dedupe: true,
  });

// ================================
// FAQ
// ================================
export const getPublicFAQ = () => api.get(API_PATHS.cms.publicFaq);
