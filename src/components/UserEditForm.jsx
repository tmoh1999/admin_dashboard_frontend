import React, { useState } from "react";
import { request as apiRequest } from "../api";

export default function UserEditForm({ initialData = { username: "", email: "" }, onSaved, onCancel }) {
  const [form, setForm] = useState({ username: initialData.username || "", email: initialData.email || "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { username: form.username, email: form.email };
      const result = await apiRequest("/api/users/me", { method: "PUT", body: JSON.stringify(payload) });
      onSaved && onSaved(result);
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <label className="text-sm">
        <div className="text-xs font-medium">Username</div>
        <input name="username" value={form.username} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </label>
      <label className="text-sm">
        <div className="text-xs font-medium">Email</div>
        <input name="email" value={form.email} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
      </label>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-60">Save</button>
        <button onClick={onCancel} className="bg-gray-300 text-black px-3 py-1 rounded text-sm">Cancel</button>
      </div>
    </form>
  );
}
