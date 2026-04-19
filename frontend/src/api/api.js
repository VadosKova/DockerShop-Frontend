import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000" });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  const lang  = localStorage.getItem("lang") || "en";
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  cfg.headers["Accept-Language"] = lang;
  return cfg;
});

export default api;