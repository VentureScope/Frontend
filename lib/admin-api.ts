import axios from "axios";
import {
  adminQueryParams,
  type AdminQueryValue,
} from "@/lib/admin-query-params";
import { useAdminStore } from "@/store/useAdminStore";

/** Axios instance for admin routes — uses admin session token only. */
const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const { token, tokenType } = useAdminStore.getState().authData;
    if (token && config.headers && !config.headers.Authorization) {
      const scheme = tokenType?.trim() || "Bearer";
      config.headers.Authorization = `${scheme} ${token}`;
    }

    if (
      config.params &&
      typeof config.params === "object" &&
      !(config.params instanceof URLSearchParams)
    ) {
      config.params = adminQueryParams(
        config.params as Record<
          string,
          AdminQueryValue | undefined | null
        >,
      );
    }

    return config;
  },
  (error) => Promise.reject(error),
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const hadSession = Boolean(useAdminStore.getState().authData.token);
      useAdminStore.getState().clearAuth();
      if (hadSession && !window.location.pathname.startsWith("/admin/sign-in")) {
        window.location.replace("/admin/sign-in");
      }
    }
    return Promise.reject(error);
  },
);

export default adminApi;
