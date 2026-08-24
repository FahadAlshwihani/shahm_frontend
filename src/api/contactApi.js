import api from "./axiosClient";
import { API_PATHS } from "./routes";

// Public Contact Page
export const getPublicContactPage = () =>
  api.get(API_PATHS.cms.publicContact);
