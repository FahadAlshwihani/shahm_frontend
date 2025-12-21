import axios from "axios";
import jwtDecode from "jwt-decode";
import { useAuthStore } from "../store/useAuthStore";

const BASE_URL = "http://127.0.0.1:8000/api"; // غيره إذا رفعته على السيرفر

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------
// إضافة التوكن قبل كل طلب
// -----------------------------
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// التعامل مع انتهاء التوكن وتجديده
// -----------------------------
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا التوكن منتهي و نقدر نعمل refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const res = await axios.post(`${BASE_URL}/accounts/refresh/`, {
          refresh: refreshToken,
        });


        const newAccess = res.data.access;

        // حفظ التوكن الجديد في Zustand
        useAuthStore.setState({ accessToken: newAccess });

        // تحديث الهيدر وإعادة المحاولة
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
