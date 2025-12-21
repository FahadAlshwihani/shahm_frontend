import { create } from "zustand";
import {
  getAreas,
  createArea as apiCreateArea,
  updateArea as apiUpdateArea,
  deleteArea as apiDeleteArea,

  getServices,
  createService as apiCreateService,
  updateService as apiUpdateService,
  deleteService as apiDeleteService,
} from "../api/servicesApi";

export const useServicesStore = create((set, get) => ({

  areas: [],
  services: [],

  fetchAreas: async () => {
    const res = await getAreas();
    set({ areas: res.data });
  },

  createArea: async (data) => {
    try {
      await apiCreateArea(data);
      await get().fetchAreas();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  updateArea: async (id, data) => {
    try {
      await apiUpdateArea(id, data);
      await get().fetchAreas();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  deleteArea: async (id) => {
    try {
      await apiDeleteArea(id);
      await get().fetchAreas();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  fetchServices: async () => {
    const res = await getServices();
    set({ services: res.data });
  },

  createService: async (data) => {
    try {
      await apiCreateService(data);
      await get().fetchServices();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  updateService: async (id, data) => {
    try {
      await apiUpdateService(id, data);
      await get().fetchServices();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data };
    }
  },

  deleteService: async (id) => {
    try {
      await apiDeleteService(id);
      await get().fetchServices();
      return { success: true };
    } catch {
      return { success: false };
    }
  },

}));
