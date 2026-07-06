import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../api";

export default function Login() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
        <div className="w-full">
          <label htmlFor="login" className="block text-xl text-gray-700 font-medium mb-1">Login</label>
          <input onChange={handleChange} placeholder="Username or Email Address" value={formData.login} id="login" name="login" className="border p-2 rounded-lg w-full" required />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="block text-xl text-gray-700 font-medium mb-1">Password</label>
          <input onChange={handleChange} placeholder="Password" value={formData.password} id="password" type="password" className="border p-2 rounded-lg w-full" name="password" required />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-8 font-medium text-xl rounded-xl hover:bg-blue-700">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          No account?
          <Link to="/register" className="ml-2 text-green-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

