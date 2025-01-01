import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject({
        ...error,
        message: error.response.data.message || "An error occurred",
      });
    } else if (error.request) {
      return Promise.reject({
        ...error,
        message: "No response from server. Please check your connection.",
      });
    } else {
      return Promise.reject({
        ...error,
        message: "Error setting up request",
      });
    }
  }
);

export default API;
