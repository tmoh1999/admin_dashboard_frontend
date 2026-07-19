import { useEffect, useState } from "react";
import { logout } from "../api";
import { useNavigate } from "react-router-dom";

export default function ExitDemoButton() {
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const demo = localStorage.getItem("demo") === "true";
    setIsDemo(demo);
  }, []);

  const handleExitDemo = () => {
    localStorage.setItem("demo", "false");
    setIsDemo(false);
    logout();
    navigate("/login");
  };

  const handleTryDemo = () => {
    logout();
    localStorage.setItem("demo", "true");
    setIsDemo(true);
    navigate("/login");
  };

  if (isDemo===true) {
    return (
      <button
        onClick={handleExitDemo}
        className="fixed top-4 right-8 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50 font-medium"
        title="Exit Demo Mode - Limited admin access"
      >
        Exit Demo
      </button>
    );
  }

  return (
    <button
      onClick={handleTryDemo}
      className="fixed top-4 right-8 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors z-50 font-medium"
      title="Try Demo Mode - Limited admin access for testing"
    >
      Try Demo
    </button>
  );
}
