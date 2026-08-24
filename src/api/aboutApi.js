import axios from "./axiosClient";
import { API_PATHS } from "./routes";

/* =========================
   PUBLIC
========================= */
export const getPublicAbout = () =>
  axios.get(API_PATHS.cms.publicAbout);

/* =========================
   ABOUT PAGE
========================= */
export const getAdminAbout = () =>
  axios.get(API_PATHS.cms.adminAbout);

export const updateAdminAbout = (data) =>
  axios.patch(API_PATHS.cms.adminAbout, data);

/* =========================
   STATS
========================= */
export const createStat = (data) =>
  axios.post(API_PATHS.cms.aboutStats, data);

export const updateStat = (id, data) =>
  axios.patch(API_PATHS.cms.aboutStat(id), data);

export const deleteStat = (id) =>
  axios.delete(API_PATHS.cms.aboutStat(id));

/* =========================
   POSTS
========================= */
export const createPost = (data) =>
  axios.post(API_PATHS.cms.aboutPosts, data);

export const updatePost = (id, data) =>
  axios.patch(API_PATHS.cms.aboutPost(id), data);

export const deletePost = (id) =>
  axios.delete(API_PATHS.cms.aboutPost(id));

/* =========================
   SECTIONS
========================= */
export const createSection = (data) =>
  axios.post(API_PATHS.cms.aboutSections, data);

export const updateSection = (id, data) =>
  axios.patch(API_PATHS.cms.aboutSection(id), data);

export const deleteSection = (id) =>
  axios.delete(API_PATHS.cms.aboutSection(id));

/* =========================
   ICONS
========================= */
export const createIcon = (data) =>
  axios.post(API_PATHS.cms.aboutIcons, data);

export const updateIcon = (id, data) =>
  axios.patch(API_PATHS.cms.aboutIcon(id), data);

export const deleteIcon = (id) =>
  axios.delete(API_PATHS.cms.aboutIcon(id));

/* =========================
   PARTNERS
========================= */
export const createPartner = (data) =>
  axios.post(API_PATHS.cms.aboutPartners, data);

export const updatePartner = (id, data) =>
  axios.patch(API_PATHS.cms.aboutPartner(id), data);

export const deletePartner = (id) =>
  axios.delete(API_PATHS.cms.aboutPartner(id));
