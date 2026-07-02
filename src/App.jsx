import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./tools/ErrorBoundary";
export default function App() {
  return (
    <div className="flex h-screen">
      <ErrorBoundary>
      <div className="overflow-y-auto w-full ">
        <div className="h-fit  ">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
      </ErrorBoundary>
    </div>
  );
}