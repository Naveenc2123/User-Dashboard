import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />

        {/* 📊 Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard */}
          <Route index element={<div />} />

          {/* Users */}
          <Route path="users" element={<Users />} />

          {/* Add */}
          <Route path="add-user" element={<AddUser />} />

          {/* ✅ FIXED: Nested routes */}
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="edit-user/:id" element={<EditUser />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;