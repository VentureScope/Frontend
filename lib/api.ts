import axios from "axios";
import {
  buildSignInUrl,
  getClientReturnPath,
  isProtectedMemberPath,
} from "@/lib/auth-redirect";
import { useAppStore } from "@/store/useAppStore";

// Create a standard base API instance
const api = axios.create({
  // Reads from env first; falls back to local backend for development.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  // baseURL: "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configure Request Interceptor (e.g., inject auth tokens here)
api.interceptors.request.use(
  (config) => {
    // retrieve token from local storage or memory
    const token = useAppStore.getState().authData.token;
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      if (error.response.status === 401 && typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const store = useAppStore.getState();
        const hadSession = Boolean(store.authData.token);
        if (store.isLoggingOut) {
          return Promise.reject(error);
        }
        store.clearAuth();
        if (
          hadSession &&
          isProtectedMemberPath(pathname) &&
          !pathname.startsWith("/sign-in")
        ) {
          window.location.replace(buildSignInUrl(getClientReturnPath()));
        } else {
          console.warn("Unauthorized. Please log in again.");
        }
      }
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
