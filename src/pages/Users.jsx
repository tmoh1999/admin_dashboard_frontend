import { useEffect, useState } from "react";
import {getCurrentUser } from "../api";
import NoDataFound from "../components/NoDataFound";
import DTable from "../components/DTable";
export default function Users() {

  const [refreshKey,setRefreshKey]=useState(0);

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") return;

  }, []);

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
    <div className="p-1">
      <DTable
        mode="view"
        tableMode="users"
        TableName="Users"
        refreshKey={refreshKey}
        refreshParent={() => setRefreshKey(prev => prev + 1)}
        Edit={true}
      />
    </div>
  );
}
