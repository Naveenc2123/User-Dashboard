import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure
} from "../redux/slices/userSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
useEffect(() => {
  const getUsers = async () => {
    dispatch(fetchUsersStart());

    try {
      const res = await fetch("http://localhost:3001/users");
      const data = await res.json();

      dispatch(fetchUsersSuccess(data));
    } catch (err) {
      dispatch(fetchUsersFailure(err.toString()));
    }
  };

  getUsers();
}, [dispatch]);
  // ✅ Get users from Redux
  const users = useSelector((state) => state.users.users);

  // 📊 Calculations (derived from Redux state)
  const totalUsers = users.length;

  const activeUsers = users.filter((u) => u.isActive).length;

  const avgAge =
    users.length > 0
      ? (
          users.reduce((sum, u) => sum + u.age, 0) / users.length
        ).toFixed(1)
      : 0;

return (
  <div className="min-h-screen bg-gray-100">

    {/* ✅ Navbar */}
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-white shadow sticky top-0 z-50">
      <h2 className="text-lg sm:text-xl font-semibold">
        User Management
      </h2>
      <Navbar />
    </div>

    {/* ✅ Main Content */}
    <div className="p-4 sm:p-6">

      {/* ✅ Stats Cards (only dashboard home) */}
      {location.pathname === "/dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-2xl font-bold mt-2">{totalUsers}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-gray-500 text-sm">Active Users</h3>
            <p className="text-2xl font-bold mt-2">{activeUsers}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-gray-500 text-sm">Average Age</h3>
            <p className="text-2xl font-bold mt-2">{avgAge}</p>
          </div>

        </div>
      )}

      {/* ✅ Full Page Content */}
      <div className="w-full">
        <Outlet />
      </div>

    </div>
  </div>
);
};
export default Dashboard;