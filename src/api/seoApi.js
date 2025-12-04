import api from "./axiosClient";

export const getSEO = (slug) => api.get(`seo/public/${slug}/`);
export const getDefaultSEO = () => api.get("seo/public/");

export const adminAllPages = () => api.get("seo/admin/all-pages/");

export const adminSEOList = () => api.get("seo/admin/pages/");

export const adminCreateSEO = (data) =>
  api.post("seo/admin/pages/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminUpdateSEO = (id, data) =>
  api.patch(`seo/admin/pages/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteSEO = (id) => api.delete(`seo/admin/pages/${id}/`);
