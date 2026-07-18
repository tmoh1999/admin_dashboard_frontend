import { request } from "./http";
import { storeAuthSession, clearAuthSession } from "./storage";

export async function login(formData) {
  const demo = localStorage.getItem("demo");
  let path="/api/auth/login";
  if(demo){
    console.log("login-demo",demo);
    path="/api/demo/login";
  }
  const result = await request(path, {
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
  const demo = localStorage.getItem("demo");
  let path="/api/auth/register";
  if(demo){
    console.log("register-demo",demo);
    path="/api/demo/register";
  }  
  return request(path, {
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

export function verifyEmail(token) {
  return request(`/api/auth/verify-email/${token}`, {
    method: "GET",
    skipAuth: true,
  });
}

export function sendHeartbeat() {
  return request("/api/auth/heartbeat", {
    method: "POST",
  });
}
