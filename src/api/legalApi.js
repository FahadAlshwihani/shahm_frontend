import api from "./axiosClient";

/*
PUBLIC
*/

export const getPublicLegal = (slug) =>
  api.get(`legal/page/${slug}/`);

/*
DASHBOARD
*/

export const adminLegalList = () =>
  api.get("legal/admin/pages/");

export const adminLegalCreate = (data) =>
  api.post("legal/admin/pages/", data);

export const adminLegalEdit = (id, data) =>
  api.patch(`legal/admin/pages/${id}/`, data);

export const adminLegalDelete = (id) =>
  api.delete(`legal/admin/pages/${id}/`);