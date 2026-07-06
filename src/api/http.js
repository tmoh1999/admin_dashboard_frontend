import { getAccessToken, getStoredRefreshToken, clearAuthSession, refreshAccessToken } from "./storage";

export const API_URL = import.meta.env.VITE_API_URL;

export async function request(url, options = {}) {
  const reqUrl = `${API_URL || ""}${url}`;
  let accessToken = getAccessToken();

  if (!options.skipAuth && !accessToken && getStoredRefreshToken()) {
    await refreshAccessToken();
    accessToken = getAccessToken();
  }

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(reqUrl, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMsg = text;

    try {
      const json = JSON.parse(text);
      errorMsg = json.error || json.message || text;
    } catch {
      // not JSON
    }

    const shouldRetry =
      !options._retry &&
      !options.skipAuth &&
      response.status === 401 &&
      Boolean(getStoredRefreshToken());

    if (shouldRetry) {
      await refreshAccessToken();
      return request(url, { ...options, _retry: true });
    }

    if (response.status === 401 || /expired|invalid token|unauthorized/i.test(errorMsg)) {
      clearAuthSession();
    }

    throw new Error(errorMsg || "Request failed");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function downloadFile(mode, filename, options = {}) {
  const token = getAccessToken();
  const query = buildQuery(options);
  const url = query ? `${mode}?${query}` : `${mode}`;
  const reqUrl = `${API_URL || ""}${url}`;

  const response = await fetch(reqUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();

    if (text.includes("expired") || text.includes("unauthorized")) {
      clearAuthSession();
    }

    throw new Error("Download failed");
  }

  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlBlob;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(urlBlob);
}

export function buildQuery(options) {
  const params = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  return params.toString();
}

export function apiGet(mode, options = {}) {
  const query = buildQuery(options);
  const url = query ? `${mode}?${query}` : `${mode}`;

  return request(url);
}
