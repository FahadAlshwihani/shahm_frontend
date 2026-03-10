import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
});


// attach token
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


// refresh interceptor
axiosClient.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      const auth = useAuthStore.getState();
      const refreshToken = auth.refreshToken;

      if (!refreshToken) {
        auth.logout();
        return Promise.reject(error);
      }

      try {

        const res = await axios.post(

          `${axiosClient.defaults.baseURL}/accounts/refresh/`,
          { refresh: refreshToken }

        );

        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);

        useAuthStore.setState({
          accessToken: newAccess,
          isAuthenticated: true
        });

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosClient(originalRequest);

      } catch (refreshError) {

        auth.logout();
        return Promise.reject(refreshError);

      }

    }

    return Promise.reject(error);

  }

);

export default axiosClient;