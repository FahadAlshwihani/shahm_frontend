import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
const pendingRequests = new Map();
const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 15000,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // إذا كان FormData لا نضع content-type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    const requestKey = `${config.method}:${config.url}`;

    if (pendingRequests.has(requestKey)) {
      const controller = pendingRequests.get(requestKey);
      controller.abort();
    }

    const controller = new AbortController();

    config.signal = controller.signal;

    pendingRequests.set(requestKey, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}:${response.config.url}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const auth = useAuthStore.getState();

    if (!error.response) {
      if (error.config) {
        const requestKey =
          `${error.config.method}:${error.config.url}`;

        pendingRequests.delete(requestKey);
      }
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/accounts/login/") &&
      !originalRequest.url?.includes("/accounts/refresh/")
    ) {
      originalRequest._retry = true;

      const refreshToken = auth.refreshToken;

      if (!refreshToken) {
        auth.logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${axiosClient.defaults.baseURL}/accounts/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);

        useAuthStore.setState({
          accessToken: newAccess,
          isAuthenticated: true,
        });

        onRefreshed(newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        auth.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }



    if (error.config) {
      const requestKey = `${error.config.method}:${error.config.url}`;
      pendingRequests.delete(requestKey);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;