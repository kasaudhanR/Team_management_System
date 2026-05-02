import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;