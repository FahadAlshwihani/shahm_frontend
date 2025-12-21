import { create } from "zustand";
import { getDashboardStats } from "../api/dashboardApi";

export const useDashboardStore = create((set) => ({
  stats: null,

  loadStats: async () => {
    const res = await getDashboardStats();
    set({ stats: res.data });
  },
}));
