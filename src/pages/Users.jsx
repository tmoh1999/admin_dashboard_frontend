import { useEffect, useState } from "react";
import { apiGet, getCurrentUser } from "../api";
import NoDataFound from "../components/NoDataFound";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") return;

    setLoading(true);
    setError("");
    apiGet("/api/users")
      .then((result) => {
        setUsers(Array.isArray(result) ? result : []);
      })
      .catch((err) => setError(err.message || "Failed to load users"))
      .finally(() => setLoading(false));
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {loading ? (
        <NoDataFound message="Loading..." />
      ) : error ? (
        <NoDataFound message={error} />
      ) : users.length === 0 ? (
        <NoDataFound message="No users found." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
