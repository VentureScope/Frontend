import axios from "axios";

// Create a standard base API instance
const api = axios.create({
  // Reads from env first; falls back to local backend for development.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure Request Interceptor (e.g., inject auth tokens here)
api.interceptors.request.use(
  (config) => {
    // Example: retrieve token from local storage or memory
    // const token = useAppStore.getState().token;
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Configure Response Interceptor (e.g., global error handling)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle known HTTP errors globally (e.g., redirect on 401)
      if (error.response.status === 401) {
        // e.g., trigger an action to clear auth state or redirect to login
        console.warn("Unauthorized. Please log in again.");
      }
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
