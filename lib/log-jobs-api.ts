import axios, { type AxiosError } from "axios";

function isJobsApiPath(url?: string): boolean {
  return Boolean(url?.includes("/api/jobs"));
}

function summarizePayload(data: unknown): Record<string, unknown> {
  if (Array.isArray(data)) {
    return {
      type: "array",
      length: data.length,
      sample: data.length > 0 ? data[0] : null,
    };
  }
  if (data && typeof data === "object") {
    return { type: "object", keys: Object.keys(data as object) };
  }
  return { type: typeof data, value: data };
}

/** Dev-only console logging for market / jobs landing endpoints. */
export function logJobsApiSuccess(
  method: string | undefined,
  url: string | undefined,
  status: number,
  params: unknown,
  data: unknown,
): void {
  if (process.env.NODE_ENV !== "development") return;
  if (!isJobsApiPath(url)) return;

  const base =
    typeof window !== "undefined" ? window.location.origin : "(server)";
  console.log(
    `[jobs-api] ${(method ?? "get").toUpperCase()} ${base}${url} → ${status}`,
    { params, response: summarizePayload(data) },
  );
}

export function logJobsApiError(error: unknown): void {
  if (process.env.NODE_ENV !== "development") return;
  if (!axios.isAxiosError(error)) {
    console.error("[jobs-api] request failed (non-axios)", error);
    return;
  }

  const err = error as AxiosError;
  const url = err.config?.url;
  if (!isJobsApiPath(url)) return;

  const base =
    typeof window !== "undefined" ? window.location.origin : "(server)";
  const fullUrl = `${base}${url}`;
  const params = err.config?.params;

  if (!err.response) {
    console.error(
      `[jobs-api] ${(err.config?.method ?? "get").toUpperCase()} ${fullUrl} → network error`,
      {
        params,
        code: err.code,
        message: err.message,
        hint: "Is the API running? In dev, Next proxies /api/* to API_URL (default http://localhost:8000).",
      },
    );
    return;
  }

  console.error(
    `[jobs-api] ${(err.config?.method ?? "get").toUpperCase()} ${fullUrl} → ${err.response.status}`,
    { params, body: err.response.data },
  );
}

export function logMarketSectionFailure(section: string, error: unknown): void {
  if (process.env.NODE_ENV !== "development") return;
  console.error(`[market-ui] ${section} fetch failed`, error);
  logJobsApiError(error);
}
