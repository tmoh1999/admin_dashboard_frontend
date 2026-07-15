import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { request as apiRequest } from "../api";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest(`/api/users/${userId}/set-password`, {
        method: "POST",
        body: JSON.stringify({ password: formData.password }),
      });
      setSuccess("Password updated successfully.");
      setFormData({ password: "", confirmPassword: "" });
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col items-center gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Reset User Password</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded w-full">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded w-full">{success}</div>}

        <div className="w-full relative">
          <label htmlFor="password" className="block text-xl text-gray-700 font-medium mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              onChange={handleChange}
              value={formData.password}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="border p-2 rounded-lg w-full pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-900"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="w-full relative">
          <label htmlFor="confirmPassword" className="block text-xl text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              onChange={handleChange}
              value={formData.confirmPassword}
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="border p-2 rounded-lg w-full pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-900"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-black p-2 rounded-lg font-medium hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
