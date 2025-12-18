// src/api/axiosClient.js
import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: "http://localhost:5000/api", // backend Express của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosAdmin;
