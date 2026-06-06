import axios from "./axiosClient";

/* =========================
   PUBLIC
========================= */
export const getPublicAbout = () =>
  axios.get("/cms/public/about/");

/* =========================
   ABOUT PAGE
========================= */
export const getAdminAbout = () =>
  axios.get("/cms/admin/about/");

export const updateAdminAbout = (data) =>
  axios.patch("/cms/admin/about/", data);

/* =========================
   STATS
========================= */
export const createStat = (data) =>
  axios.post("/cms/admin/about/stats/", data);

export const updateStat = (id, data) =>
  axios.patch(`/cms/admin/about/stats/${id}/`, data);

export const deleteStat = (id) =>
  axios.delete(`/cms/admin/about/stats/${id}/`);

/* =========================
   POSTS
========================= */
export const createPost = (data) =>
  axios.post("/cms/admin/about/posts/", data);

export const updatePost = (id, data) =>
  axios.patch(`/cms/admin/about/posts/${id}/`, data);

export const deletePost = (id) =>
  axios.delete(`/cms/admin/about/posts/${id}/`);

/* =========================
   SECTIONS
========================= */
export const createSection = (data) =>
  axios.post("/cms/admin/about/sections/", data);

export const updateSection = (id, data) =>
  axios.patch(`/cms/admin/about/sections/${id}/`, data);

export const deleteSection = (id) =>
  axios.delete(`/cms/admin/about/sections/${id}/`);

/* =========================
   ICONS
========================= */
export const createIcon = (data) =>
  axios.post("/cms/admin/about/icons/", data);

export const updateIcon = (id, data) =>
  axios.patch(`/cms/admin/about/icons/${id}/`, data);

export const deleteIcon = (id) =>
  axios.delete(`/cms/admin/about/icons/${id}/`);

/* =========================
   PARTNERS
========================= */
export const createPartner = (data) =>
  axios.post("/cms/admin/about/partners/", data);

export const updatePartner = (id, data) =>
  axios.patch(`/cms/admin/about/partners/${id}/`, data);

export const deletePartner = (id) =>
  axios.delete(`/cms/admin/about/partners/${id}/`);