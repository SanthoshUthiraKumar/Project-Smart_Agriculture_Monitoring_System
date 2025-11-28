import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- ADD THIS REQUEST INTERCEPTOR ---
http.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem("token");

    // 2. If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Basic error logging (Response Interceptor)
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    
    // Optional: Auto-logout on 401 (Token Expired/Invalid)
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // Only redirect if not already on login page to avoid loops
        if (window.location.pathname !== '/login') {
            // localStorage.clear(); // Optional: clear bad token
            // window.location.href = '/login'; 
        }
    }
    
    throw err;
  }
);

export default http;
