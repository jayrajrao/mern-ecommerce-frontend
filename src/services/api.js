import axios from "axios";

export const api = axios.create({
  baseURL: "https://ecom-api-fjf3.onrender.com/api",
  //  baseURL:    "http://localhost:3000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("INTERCEPTOR TOKEN:", token); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});