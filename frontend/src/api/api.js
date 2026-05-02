import axios from "axios";

// 🌐 Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api", // 🔁 change after deployment
  withCredentials: false
});

// 🔐 Attach token automatically to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized
    if (error.response?.status === 401) {
      console.log("Unauthorized! Redirecting to login...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;