import api from "./axiosClient";

// ================= PRACTICE AREAS =================

export const getAreas = () => api.get("services/admin/areas/");
export const createArea = (data) => api.post("services/admin/areas/", data);
export const updateArea = (id, data) => api.patch(`services/admin/areas/${id}/`, data);
export const deleteArea = (id) => api.delete(`services/admin/areas/${id}/`);

// ================= SERVICE ITEMS =================

export const getServices = () => api.get("services/admin/items/");
export const createService = (data) => api.post("services/admin/items/", data);
export const updateService = (id, data) => api.patch(`services/admin/items/${id}/`, data);
export const deleteService = (id) => api.delete(`services/admin/items/${id}/`);
