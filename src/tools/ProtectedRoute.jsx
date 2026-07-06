import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasAuthSession, refreshAccessToken } from "../api";

export default function ProtectedRoute({ children }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        if (hasAuthSession()) {
          setAuthenticated(true);
          setReady(true);
          return;
        }

        await refreshAccessToken();

        if (!cancelled) {
          setAuthenticated(true);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setAuthenticated(false);
          setReady(true);
        }
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}