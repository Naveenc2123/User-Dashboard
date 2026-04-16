import { BrowserRouter, Routes, Route } from "react-router-dom";
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

        {/* 🔐 Auth */}
        <Route path="/login" element={<Login />} />

        {/* 📊 Dashboard Layout (Nested Routes) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="add-user" element={<AddUser />} />
        </Route>

        {/* 👤 User Pages (Standalone dynamic routes) */}
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-user/:id"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;