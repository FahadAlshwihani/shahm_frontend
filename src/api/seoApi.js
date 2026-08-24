import api from "./axiosClient";
import { API_PATHS } from "./routes";

export const adminGetDefaultSEO = () => api.get(API_PATHS.seo.adminDefault);
export const adminUpdateDefaultSEO = (data) =>
  api.put(API_PATHS.seo.adminDefault, data);

export const adminAllPages = () => api.get(API_PATHS.seo.allPages);

export const adminSEOList = () => api.get(API_PATHS.seo.pages);

export const adminCreateSEO = (data) =>
  api.post(API_PATHS.seo.pages, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminUpdateSEO = (id, data) =>
  api.patch(API_PATHS.seo.page(id), data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteSEO = (id) => api.delete(API_PATHS.seo.page(id));
