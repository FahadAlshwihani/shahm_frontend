import api from "./axiosClient";

export const login = (data) => api.post("accounts/login/", data);

export const getUsers = () => api.get("accounts/users/");
export const getUserById = (id) => api.get(`accounts/users/${id}/`);
export const createUser = (data) => api.post("accounts/users/create/", data);

export const updateUser = (id, data) =>
  api.patch(`accounts/users/${id}/`, data);

export const deleteUser = (id) =>
  api.delete(`accounts/users/${id}/`);
