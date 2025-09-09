import axios from "axios";
import { storage } from "../storage/storage";

export const efirmaApiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "json",
  timeout: 10000,
});

efirmaApiInstance.interceptors.request.use(
  async (config) => {
    const session = storage.get("session");
    if (typeof session === "string") {
      config.headers.token = config.headers.token
        ? config.headers.token
        : `${session}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

efirmaApiInstance.interceptors.response.use(
  async (response) => response,
  (error) => {
    if (window.location.pathname !== "/" && error.request.status === 401) {
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
