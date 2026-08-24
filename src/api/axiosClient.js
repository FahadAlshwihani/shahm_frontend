import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { API_PATHS } from "./routes";
const pendingRequests = new Map();
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
  timeout: 15000,
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach(({ resolve }) => resolve(newAccessToken));
  refreshSubscribers = [];
}

function onRefreshFailed(error) {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
}

function addRefreshSubscriber(resolve, reject) {
  refreshSubscribers.push({ resolve, reject });
}

function isIntendedApiRequest(url) {
  if (!url || !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) {
    return true;
  }

  try {
    const apiBase = new URL(axiosClient.defaults.baseURL, window.location.origin);
    const target = new URL(url, apiBase);
    const basePath = apiBase.pathname.replace(/\/$/, "");

    return (
      target.origin === apiBase.origin &&
      (target.pathname === basePath || target.pathname.startsWith(`${basePath}/`))
    );
  } catch {
    return false;
  }
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token && isIntendedApiRequest(config.url)) {
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
      !originalRequest.url?.includes(API_PATHS.auth.login) &&
      !originalRequest.url?.includes(API_PATHS.auth.refresh)
    ) {
      originalRequest._retry = true;

      const refreshToken = auth.refreshToken;

      if (!refreshToken) {
        auth.logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axiosClient(originalRequest));
          }, reject);
        });
      }

      isRefreshing = true;

      try {
        const res = await axiosClient.post(
          API_PATHS.auth.refresh,
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
        onRefreshFailed(refreshError);
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
