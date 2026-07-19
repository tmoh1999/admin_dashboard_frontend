import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/http";
import { getCurrentUser } from "../api/storage";
import { Users, UserCheck, UserX, Shield, Mail, MailCheck, Activity, Calendar } from "lucide-react";
import LineChart from "../components/LineChart";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value?.toLocaleString() || 0}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [registrationChart, setRegistrationChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.role !== 'admin') {
      navigate('/profile');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await apiGet("/api/users/stats");
        setStats(data);
        setRegistrationChart(data.registration_chart || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col bg-slate-300 items-center p-2 sm:p-6 min-w-150 w-full sm:w-full">
        <h1 className="text-3xl w-full font-bold text-center mb-4">Dashboard</h1>
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col bg-slate-300 items-center p-2 sm:p-6 min-w-150 w-full sm:w-full">
        <h1 className="text-3xl w-full font-bold text-center mb-4">Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-300 h-fit sm:h-screen items-center p-2 sm:p-6 min-w-150 w-full sm:w-full">
      <h1 className="text-3xl w-full font-bold text-center mb-6">Dashboard</h1>
      <div className="flex justify-center gap-16 mt-3">
        <div className="max-w-7xl mx-auto min-w-80 md:min-w-170">
          <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mb-6">
            <StatCard 
              title="Total Users" 
              value={stats?.total_users} 
              icon={Users} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Active Users" 
              value={stats?.active_users} 
              icon={UserCheck} 
              color="bg-green-500" 
            />
            <StatCard 
              title="Inactive Users" 
              value={stats?.inactive_users} 
              icon={UserX} 
              color="bg-red-500" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <StatCard 
              title="Online Users" 
              value={stats?.online_users} 
              icon={Activity} 
              color="bg-purple-500" 
            />
            <StatCard 
              title="Admin Count" 
              value={stats?.admin_count} 
              icon={Shield} 
              color="bg-indigo-500" 
            />
            <StatCard 
              title="User Count" 
              value={stats?.user_count} 
              icon={Users} 
              color="bg-cyan-500" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            <StatCard 
              title="Verified Emails" 
              value={stats?.verified_emails} 
              icon={MailCheck} 
              color="bg-emerald-500" 
            />
            <StatCard 
              title="Unverified Emails" 
              value={stats?.unverified_emails} 
              icon={Mail} 
              color="bg-orange-500" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard 
              title="Users (Last 7 Days)" 
              value={stats?.users_last_7_days} 
              icon={Calendar} 
              color="bg-teal-500" 
            />
            <StatCard 
              title="Users (Last 30 Days)" 
              value={stats?.users_last_30_days} 
              icon={Calendar} 
              color="bg-pink-500" 
            />
          </div>
        </div>
        <div className="mt-6">
          <LineChart 
            data={registrationChart}
            title="📈 User Registrations"
            label="Registrations"
            color="#10b981"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}