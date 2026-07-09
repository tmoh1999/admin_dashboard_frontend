import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { confirmResetPassword } from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!token) {
      setError("Reset token is missing.");
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
      await confirmResetPassword(token, formData.password);
      setSuccess("Password updated successfully. You can now sign in.");
      setFormData({ password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-center">Set New Password</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded w-full">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded w-full">{success}</div>}

        <div className="w-full">
          <label htmlFor="password" className="block text-xl text-gray-700 font-medium mb-1">
            New Password
          </label>
          <input
            onChange={handleChange}
            value={formData.password}
            id="password"
            name="password"
            type="password"
            className="border p-2 rounded-lg w-full"
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="confirmPassword" className="block text-xl text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            onChange={handleChange}
            value={formData.confirmPassword}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="border p-2 rounded-lg w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-8 font-medium text-xl rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

        <p>
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
