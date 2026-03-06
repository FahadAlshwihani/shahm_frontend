import api from "./axiosClient";

// Public Contact Page
export const getPublicContactPage = () =>
  api.get("cms/public/contact-page/");
