import axios, { type AxiosError } from "axios";
import {
  buildSignInUrl,
  getClientReturnPath,
  isProtectedMemberPath,
} from "@/lib/auth-redirect";
import { logJobsApiError, logJobsApiSuccess } from "@/lib/log-jobs-api";
import { useAppStore } from "@/store/useAppStore";

/** Server-side and build-time API root. */
function serverApiBaseUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  );
}

function isLocalApiHost(url: string): boolean {
  try {
    const host = new URL(
      url.startsWith("http") ? url : `http://${url}`,
    ).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/**
 * Browser base URL: use same-origin `/api/*` (proxied in next.config) in local
 * dev so the browser never cross-origin calls localhost:8000 (CORS / Network Error).
 */
function clientApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (process.env.NODE_ENV === "development") {
    if (!configured || isLocalApiHost(configured)) {
      return "";
    }
  }

  if (configured) {
    return configured.replace(/\/api\/?$/, "").replace(/\/$/, "");
  }
  return "";
}

const api = axios.create({
  baseURL:
    typeof window === "undefined" ? serverApiBaseUrl() : clientApiBaseUrl(),
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function isApiNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  const err = error as AxiosError;
  return !err.response && (err.code === "ERR_NETWORK" || err.message === "Network Error");
}

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const base = clientApiBaseUrl();
      if (base) {
        config.baseURL = base;
      }
    }
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

api.interceptors.response.use(
  (response) => {
    logJobsApiSuccess(
      response.config.method,
      response.config.url,
      response.status,
      response.config.params,
      response.data,
    );
    return response;
  },
  (error) => {
    logJobsApiError(error);
    if (error.response) {
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
    }
    return Promise.reject(error);
  },
);

export default api;
