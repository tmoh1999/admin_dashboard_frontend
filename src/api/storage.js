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

export function getStoredRefreshToken() {
  const storage = getBrowserStorage();
  return storage?.getItem(REFRESH_TOKEN_STORAGE_KEY) || null;
}

export function getAccessToken() {
  return inMemoryAccessToken || getBrowserStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) || null;
}

export function hasAuthSession() {
  return Boolean(getAccessToken() || getStoredRefreshToken());
}

export function storeAuthSession(payload = {}) {
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

export function clearAuthSession() {
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

  refreshPromise = (async () => {
    const reqUrl = `${import.meta.env.VITE_API_URL || ""}/api/auth/refresh`;

    const response = await fetch(reqUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      clearAuthSession();
      throw new Error(text || "Refresh failed");
    }

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json") ? await response.json() : JSON.parse(await response.text());

    const nextAccessToken = result.access_token || result.accessToken;
    const nextRefreshToken = result.refresh_token || result.refreshToken || refreshToken;

    if (!nextAccessToken) {
      clearAuthSession();
      throw new Error("Refresh response did not contain an access token");
    }

    storeAuthSession({
      access_token: nextAccessToken,
      refresh_token: nextRefreshToken,
      user: result.user || null,
    });

    return nextAccessToken;
  })()
    .catch((error) => {
      clearAuthSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
