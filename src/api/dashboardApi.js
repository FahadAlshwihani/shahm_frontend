import api from "./axiosClient";

export const getDashboardStats = () =>
  api.get("public/admin/dashboard-stats/");
