import axios from "axios";

const API = "http://localhost:3000";

const instance = axios.create({
  baseURL: API,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang") || "en";

  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = lang;

  return config;
});

export default instance;