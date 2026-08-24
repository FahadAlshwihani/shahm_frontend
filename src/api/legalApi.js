import api from "./axiosClient";
import { API_PATHS } from "./routes";

/*
PUBLIC
*/

export const getPublicLegal = (slug) =>
  api.get(API_PATHS.legal.publicPage(slug));

/*
DASHBOARD
*/

export const adminLegalList = () =>
  api.get(API_PATHS.legal.pages);

export const adminLegalCreate = (data) =>
  api.post(API_PATHS.legal.pages, data);

export const adminLegalEdit = (id, data) =>
  api.patch(API_PATHS.legal.page(id), data);

export const adminLegalDelete = (id) =>
  api.delete(API_PATHS.legal.page(id));
