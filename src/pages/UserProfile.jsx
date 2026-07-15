import { useLocation, useNavigate } from "react-router-dom";
import { apiGet, logout, request, getCurrentUser } from "../api";
import { useEffect, useState } from "react";
import NoDataFound from "../components/NoDataFound";
import UserEditForm from "../components/UserEditForm";

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const targetUserId = location.state?.id ?? location.state?.userId ?? null;
  const isAdminView = Boolean(targetUserId) && currentUser?.role === "admin";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    username: "",
    email: "",
    role: "",
    is_active: false,
    is_email_verified: false,
    status: "",
    last_seen: "",
    created_at: "",
  });
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setError("");
    setLoading(true);

    if (!currentUser) {
      setError("Please log in to continue.");
      setLoading(false);
      return;
    }

    if (targetUserId) {
      if (currentUser.role !== "admin") {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      apiGet(`/api/users/${targetUserId}`)
        .then((result) => {
          setUserData({
            id: result.id,
            username: result.username,
            email: result.email,
            role: result.role?.value ?? result.role ?? "",
            is_active: result.is_active ?? false,
            is_email_verified: result.is_email_verified ?? false,
            status: result.status ?? "",
            last_seen: result.last_seen ?? "",
            created_at: result.created_at,
          });
        })
        .catch((err) => {
          setError(err.message || "Failed to load user details.");
        })
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    apiGet("/api/users/me")
      .then((result) => {
        setUserData({
          id: result.id,
          username: result.username,
          email: result.email,
          role: result.role?.value ?? result.role ?? "",
          is_active: result.is_active ?? false,
          is_email_verified: result.is_email_verified ?? false,
          status: result.status ?? "",
          last_seen: result.last_seen ?? "",
          created_at: result.created_at,
        });
      })
      .catch((err) => {
        setError(err.message || "Failed to load user details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [targetUserId]);

  function handleEditToggle() {
    setShowEdit((value) => !value);
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await request("/api/users/me", { method: "DELETE" });
      logout();
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  }

  function handleSaved(result) {
    if (result) {
      setUserData((prev) => ({
        ...prev,
        username: result.username ?? prev.username,
        email: result.email ?? prev.email,
        role: result.role?.value ?? result.role ?? prev.role,
        is_active: result.is_active ?? prev.is_active,
        is_email_verified: result.is_email_verified ?? prev.is_email_verified,
      }));
    }
    setShowEdit(false);
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
      {loading ? (
        <div className="flex flex-col h-screen justify-center items-center p-6 bg-gray-400">
          <div className="w-3/4">
            <NoDataFound message="Loading..." />
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col h-screen justify-center items-center p-6 bg-gray-400">
          <div className="w-3/4">
            <NoDataFound message={error} />
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="flex flex-col w-60 sm:w-fit rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
            <div className="flex items-center justify-start mb-3">
              <h1 className="font-semibold text-2xl mr-4">{isAdminView ? "Admin User Profile" : "Description Data:"}</h1>
              <button onClick={handleEditToggle} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                {showEdit ? "Close" : "Edit User"}
              </button>
            </div>

            {!isAdminView && (
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="mb-4 w-fit bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            )}

            {showEdit ? (
              <UserEditForm
                initialData={userData}
                onSaved={handleSaved}
                onCancel={() => setShowEdit(false)}
                userId={userData.id || targetUserId}
                mode={isAdminView ? "admin" : "self"}
              />
            ) : (
              <>
                {isAdminView && (
                  <p className="text-lg wrap-break-word mb-2">
                    <span className="text-xl underline mr-4">User ID:</span>
                    {userData.id}
                  </p>
                )}
                <p className="text-lg wrap-break-word flex items-center gap-2">
                  <span className="text-xl underline mr-2">Status:</span>
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${userData.status=="online" ? "bg-green-500" : "bg-red-500"}`}
                    title={userData.status=="online" ? "Online" : "Offline"}
                  />
                  <span>{userData.status}</span>
                </p>
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Username:</span>
                  {userData.username}
                </p>
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Email:</span>
                  {userData.email}
                </p>
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Role:</span>
                  {userData.role}
                </p>
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Active:</span>
                  {userData.is_active ? "Yes" : "No"}
                </p>
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Email Verified:</span>
                  {userData.is_email_verified ? "Yes" : "No"}
                </p>
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Last Seen:</span>
                  {userData.last_seen}
                </p>                
                <p className="text-lg wrap-break-word">
                  <span className="text-xl underline mr-4">Created At:</span>
                  {userData.created_at}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}