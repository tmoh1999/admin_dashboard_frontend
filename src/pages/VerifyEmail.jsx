import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let isMounted = true;

    async function handleVerification() {
      if (!token) {
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await verifyEmail(token);

        if (isMounted) {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error.message || "Email verification failed.");
        }
      }
    }

    void handleVerification();

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h1 className="text-xl font-semibold">Email Verification</h1>
        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
