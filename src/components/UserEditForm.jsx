import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request as apiRequest } from "../api";

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return Boolean(value);
}

export default function UserEditForm({
  initialData = { id: null, username: "", email: "", role: "", is_active: false, is_email_verified: false },
  onSaved,
  onCancel,
  userId = null,
  mode = "self",
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: initialData.id ?? userId ?? "",
    username: initialData.username || "",
    email: initialData.email || "",
    role: initialData.role?.value ?? initialData.role ?? "",
    is_active: normalizeBoolean(initialData.is_active),
    is_email_verified: normalizeBoolean(initialData.is_email_verified),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      id: initialData.id ?? userId ?? "",
      username: initialData.username || "",
      email: initialData.email || "",
      role: initialData.role?.value ?? initialData.role ?? "",
      is_active: normalizeBoolean(initialData.is_active),
      is_email_verified: normalizeBoolean(initialData.is_email_verified),
    });
  }, [initialData.id, initialData.username, initialData.email, initialData.role, initialData.is_active, initialData.is_email_verified, userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = userId ? `/api/users/${userId}` : "/api/users/me";
      const payload = mode === "admin"
        ? {
            id: form.id || userId,
            username: form.username,
            email: form.email,
            role: form.role || null,
            is_active: normalizeBoolean(form.is_active),
            is_email_verified: normalizeBoolean(form.is_email_verified),
          }
        : {
            id: form.id || userId,
            username: form.username,
            email: form.email,
          };

      const result = await apiRequest(endpoint, { method: "PUT", body: JSON.stringify(payload) });
      onSaved && onSaved(result);
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    navigate(`/admin/reset-password`, { state: { userId: form.id || userId } });
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3 min-w-[280px]">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <label className="text-sm">
        <div className="text-xs font-medium">Username</div>
        <input name="username" value={form.username} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </label>
      <label className="text-sm">
        <div className="text-xs font-medium">Email</div>
        <input name="email" value={form.email} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </label>

      {mode === "admin" && (
        <>
          <label className="text-sm">
            <div className="text-xs font-medium">Role</div>
            <input name="role" value={form.role || ""} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
          </label>
          <div className="text-sm">
            <div className="text-xs font-medium mb-1">Reset Password</div>
            <button
              type="button"
              onClick={handleResetPassword}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 w-full"
            >
              Reset Password
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" checked={Boolean(form.is_active)} onChange={handleCheckboxChange} />
            <span className="text-xs font-medium">Active</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_email_verified" checked={Boolean(form.is_email_verified)} onChange={handleCheckboxChange} />
            <span className="text-xs font-medium">Email Verified</span>
          </label>
        </>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-60">
          {loading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 text-black px-3 py-1 rounded text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
