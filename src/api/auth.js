import { request } from "./http";
import { storeAuthSession, clearAuthSession } from "./storage";

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

export function resetPassword(email) {
  return request("/api/auth/password-reset", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email }),
  });
}

export function confirmResetPassword(token, password) {
  return request(`/api/auth/reset-password/${token}`, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ password }),
  });
}

export function sendHeartbeat() {
  return request("/api/auth/heartbeat", {
    method: "POST",
  });
}
