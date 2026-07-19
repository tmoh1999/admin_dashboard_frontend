import { useEffect, useState } from "react";
import {getCurrentUser } from "../api";
import { apiGet } from "../api/http";
import NoDataFound from "../components/NoDataFound";
import DTable from "../components/DTable";
import { Users as UsersIcon, UserCheck, UserX, MailCheck } from "lucide-react";

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

export default function Users() {

  const [refreshKey,setRefreshKey]=useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") return;

    const fetchStats = async () => {
      try {
        const data = await apiGet("/api/users/stats");
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch statistics", err);
        setError("Failed to fetch statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        <div className="p-8">
          <NoDataFound message="Access denied. Admins only." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-300 h-fit sm:h-screen items-center p-2 sm:p-6 min-w-150 w-full sm:w-full">
      <h1 className="text-3xl w-full font-bold text-center mb-6">Users Management</h1>
      
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto min-w-80 md:min-w-170 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Users" 
              value={stats?.total_users} 
              icon={UsersIcon} 
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
            <StatCard 
              title="Verified Emails" 
              value={stats?.verified_emails} 
              icon={MailCheck} 
              color="bg-emerald-500" 
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto">
        <DTable
          mode="view"
          tableMode="users"
          TableName="Users"
          refreshKey={refreshKey}
          refreshParent={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
    </div>
  );
}
