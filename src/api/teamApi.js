// src/api/teamApi.js
import api from "./axiosClient";

// Public
export const getPublicTeam = () => api.get("/team/public/");

// Admin
export const adminTeamList = () => api.get("/team/admin/members/");

export const adminAddMember = (formData) =>
  api.post("/team/admin/members/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminUpdateMember = (id, formData) =>
  api.patch(`/team/admin/members/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const adminDeleteMember = (id) =>
  api.delete(`/team/admin/members/${id}/`);
