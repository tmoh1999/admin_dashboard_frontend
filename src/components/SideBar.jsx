import { NavLink ,useNavigate} from "react-router-dom";
import { LayoutDashboard , Menu ,LogOut , CircleUserRound} from "lucide-react";
import { useState } from "react";
import { getCurrentUser } from "../api";
export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const currentUser = getCurrentUser();
  return (
    
    <div className={`h-screen flex flex-col bg-gray-900 text-white p-4 transition-all duration-300
      ${open ? "w-64 fixed left-0 top-0 z-50" : "w-20 relative"}`}>
      
      {/* Top */}
      <div className="flex items-center justify-between mb-6">
      {open &&
        <h1 className={`text-2xl font-bold`}>
          My App 
        </h1>
       }
        <button onClick={() => setOpen(!open)}>
          <Menu size={28} className="text-white" />
        </button>
      </div>

      {/* Links */}
      <div className="flex-1 overflow-y-auto no-scrollbar   gap-3">
       <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg transition
            ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
          }
        >
          <LayoutDashboard size={22} />
          {open && <span>Dashboard</span>}
        </NavLink>
        <NavLink
            to="/profile"
            className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-lg transition
                ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
            >
            <CircleUserRound size={22} />
            {open && <span>Profile</span>}
        </NavLink>
        {currentUser && currentUser.role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 rounded-lg transition
              ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
          >
            <LayoutDashboard size={22} />
            {open && <span>Users</span>}
          </NavLink>
        )}
        <NavLink
            to="/logout"
            className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-lg transition
                ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
            }
            >
            <LogOut size={22} />
            {open && <span>LogOut</span>}
        </NavLink>
      </div>
    </div>
  );
}