import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./tools/ErrorBoundary";
import ProtectedRoute from "./tools/ProtectedRoute";
import Login from "./pages/Login";
import LogOut from "./pages/LogOut";
import Register from "./pages/Register";
import Sidebar from "./components/SideBar";
import UserProfile from "./pages/UserProfile";
import ResetPassword from "./pages/ResetPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Users from "./pages/Users";
import { sendHeartbeat } from "./api/auth";
import { hasAuthSession, subscribeToAuthState } from "./api/storage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthSession());

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(() => {
      setIsAuthenticated(hasAuthSession());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void sendHeartbeat().catch(() => {});
    }, 4 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated]);

  return (
    <div className="flex h-screen">
      <ErrorBoundary>
      <Sidebar />  
      <div className="overflow-y-auto w-full ">
        <div className="h-fit  min-w-fit px-1">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/admin/reset-password" element={<ProtectedRoute><AdminResetPassword /></ProtectedRoute>} />

          </Routes>
        </div>
      </div>
      </ErrorBoundary>
    </div>
  );
}