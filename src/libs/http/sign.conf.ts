import axios from "axios";

export const signApiInstance = axios.create({
  baseURL: import.meta.env.VITE_SIGN_SERVICE_API_URL,
  responseType: "json",
  timeout: 10000,
});
