import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, resetPassword } from "../api";

export default function Login() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);

    try {
      const response=await resetPassword(resetEmail);
      if(response?.verification_url){
        window.open(response.verification_url, "_blank");
      }
      setResetMessage("Password reset link sent to your email!");
      setResetEmail("");
      setTimeout(() => setShowResetModal(false), 2000);
    } catch (err) {
      setResetError(err.message || "Failed to send reset link");
    } finally {
      setResetLoading(false);
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
        <div className="w-full relative">
          <label htmlFor="password" className="block text-xl text-gray-700 font-medium mb-1">Password</label>
          <div className="relative">
            <input onChange={handleChange} placeholder="Password" value={formData.password} id="password" type={showPassword ? "text" : "password"} className="border p-2 rounded-lg w-full pr-12" name="password" required />
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
        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-8 font-medium text-xl rounded-xl hover:bg-blue-700">
          {loading ? "Logging in..." : "Login"}
        </button>
        <button 
          type="button" 
          onClick={() => setShowResetModal(true)} 
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Forgot Password?
        </button>
        <p>
          No account?
          <Link to="/register" className="ml-2 text-green-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form onSubmit={handleResetSubmit} className="bg-white p-6 rounded-xl shadow-lg w-80 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            {resetError && <div className="bg-red-100 text-red-700 p-2 rounded w-full">{resetError}</div>}
            {resetMessage && <div className="bg-green-100 text-green-700 p-2 rounded w-full">{resetMessage}</div>}
            <div className="w-full">
              <label htmlFor="resetEmail" className="block text-lg text-gray-700 font-medium mb-1">Email</label>
              <input 
                onChange={(e) => setResetEmail(e.target.value)} 
                placeholder="Enter your email" 
                value={resetEmail} 
                id="resetEmail" 
                name="resetEmail" 
                type="email"
                className="border p-2 rounded-lg w-full" 
                required 
              />
            </div>
            <div className="flex gap-3 w-full">
              <button 
                type="submit" 
                disabled={resetLoading} 
                className="flex-1 bg-blue-600 text-white py-2 px-4 font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {resetLoading ? "Sending..." : "Send"}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowResetModal(false);
                  setResetEmail("");
                  setResetError("");
                  setResetMessage("");
                }} 
                className="flex-1 bg-gray-400 text-white py-2 px-4 font-medium rounded-xl hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

