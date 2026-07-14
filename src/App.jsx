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
import Users from "./pages/Users";
export default function App() {
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
          </Routes>
        </div>
      </div>
      </ErrorBoundary>
    </div>
  );
}