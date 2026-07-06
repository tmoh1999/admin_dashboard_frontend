
export const API_URL = import.meta.env.VITE_API_URL;
const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
const USER_STORAGE_KEY = "user";

let inMemoryAccessToken = null;
let refreshPromise = null;

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function getStoredRefreshToken() {
  const storage = getBrowserStorage();
  return storage?.getItem(REFRESH_TOKEN_STORAGE_KEY) || null;
}

export function getAccessToken() {
  return inMemoryAccessToken || getBrowserStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) || null;
}

export function hasAuthSession() {
  return Boolean(getAccessToken() || getStoredRefreshToken());
}

function storeAuthSession(payload = {}) {
  const accessToken = payload.access_token || payload.accessToken || null;
  const refreshToken = payload.refresh_token || payload.refreshToken || null;
  const user = payload.user || null;
  const storage = getBrowserStorage();

  inMemoryAccessToken = accessToken;

  if (storage) {
    if (accessToken) {
      storage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    } else {
      storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }

    if (refreshToken) {
      storage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    } else {
      storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }

    if (user) {
      storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      storage.removeItem(USER_STORAGE_KEY);
    }
  }

  return accessToken;
}

function clearAuthSession() {
  inMemoryAccessToken = null;
  const storage = getBrowserStorage();

  if (storage) {
    storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    storage.removeItem(USER_STORAGE_KEY);
  }
}

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    throw new Error("No refresh token available");
  }

  refreshPromise = request("/api/auth/refresh", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
    .then((result) => {
      const nextAccessToken = result.access_token || result.accessToken;
      const nextRefreshToken = result.refresh_token || result.refreshToken || refreshToken;

      if (!nextAccessToken) {
        throw new Error("Refresh response did not contain an access token");
      }

      storeAuthSession({
        access_token: nextAccessToken,
        refresh_token: nextRefreshToken,
        user: result.user || null,
      });

      return nextAccessToken;
    })
    .catch((error) => {
      clearAuthSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

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
      // text was not JSON
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

function buildQuery(options) {
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

export async function login(formData) {
  const result = await request("/api/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      login: formData.login,
      password: formData.password,
    }),
  });

  storeAuthSession(result);
  return result;
}

export function logout() {
  clearAuthSession();
}

export function register(formData) {
  return request("/api/auth/register", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }),
  });
}
