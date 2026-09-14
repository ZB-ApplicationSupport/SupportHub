import axios from "axios";
import { appConfig } from "../config/appConfig";

const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const authRequest = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/register") ||
  url.includes("/users/register") ||
  url.includes("/users/password-reset") ||
  url.includes("/openid-connect/token");

const applyBearer = (headers, token) => {
  if (!headers || !token) {
    return;
  }
  if (typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
    return;
  }
  headers.Authorization = `Bearer ${token}`;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      applyBearer(config.headers, token);
    }
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (typeof config.headers?.delete === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      if (authRequest(requestUrl) || error.config?.skipAuthRedirect) {
        return Promise.reject(error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
