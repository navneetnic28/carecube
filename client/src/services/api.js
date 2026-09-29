
import axios from "axios";

const api = axios.create({
  baseURL: "https://carecube-2-mmnb.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("carecube_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
