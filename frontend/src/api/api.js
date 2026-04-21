import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const instance = axios.create({ baseURL: API_URL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang") || "en";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = lang;
  return config;
});

export default instance;