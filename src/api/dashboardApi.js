import api from "./axiosClient";
import { API_PATHS } from "./routes";

export const getDashboardStats = () =>
  api.get(API_PATHS.public.dashboardStats);
