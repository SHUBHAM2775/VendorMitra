import axios from "axios";

// Create an Axios instance with a base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Make sure this matches your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically include token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
