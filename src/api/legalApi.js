import api from "./axiosClient";

export const getLegalPage = (slug) => api.get(`legal/public/${slug}/`);

// Dashboard
export const adminLegalList = () => api.get("legal/admin/");
export const adminLegalCreate = (data) => api.post("legal/admin/", data);
export const adminLegalEdit = (id, data) =>
  api.patch(`legal/admin/${id}/`, data);
export const adminLegalDelete = (id) =>
  api.delete(`legal/admin/${id}/`);
