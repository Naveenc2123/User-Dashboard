import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure
} from "../redux/slices/userSlice";
const loadChartJS = () => {
  return new Promise((resolve) => {
    if (window.Chart) return resolve();
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [statusView, setStatusView] = useState("count");

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

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

  const users = useSelector((state) => state.users.users);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  const avgAge =
    users.length > 0
      ? (users.reduce((sum, u) => sum + u.age, 0) / users.length).toFixed(1)
      : 0;

  const activePct =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const inactivePct = totalUsers > 0 ? 100 - activePct : 0;
  const ageRanges = {
    "18-25": users.filter((u) => u.age >= 18 && u.age <= 25).length,
    "26-35": users.filter((u) => u.age >= 26 && u.age <= 35).length,
    "36-50": users.filter((u) => u.age >= 36 && u.age <= 50).length,
    "50+": users.filter((u) => u.age > 50).length,
  };
  useEffect(() => {
    if (
      location.pathname !== "/dashboard" ||
      users.length === 0 ||
      !barRef.current ||
      !pieRef.current
    )
      return;

    loadChartJS().then(() => {
      const Chart = window.Chart;
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      barChartInstance.current = new Chart(barRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(ageRanges),
          datasets: [
            {
              label: "Users",
              data: Object.values(ageRanges),
              backgroundColor: ["#818cf8", "#6366f1", "#4f46e5", "#3730a3"],
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1, color: "#6b7280", font: { size: 11 } },
              grid: { color: "rgba(0,0,0,0.05)" },
            },
            x: {
              ticks: { color: "#6b7280", font: { size: 11 } },
              grid: { display: false },
            },
          },
        },
      });
      pieChartInstance.current = new Chart(pieRef.current, {
        type: "doughnut",
        data: {
          labels: ["Active", "Inactive"],
          datasets: [
            {
              data: [activeUsers, inactiveUsers],
              backgroundColor: ["#22c55e", "#f87171"],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = Math.round((ctx.parsed / total) * 100);
                  return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                },
              },
            },
          },
        },
      });
    });

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();
    };
  }, [users, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-white shadow sticky top-0 z-50">
        <h2 className="text-lg sm:text-xl font-semibold">User Management</h2>
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">

        {location.pathname === "/dashboard" && (
          <>
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

            <div className="bg-white rounded-xl shadow p-5 mb-6">

              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-base font-semibold text-gray-700">
                  User Status Breakdown
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="statusView"
                      value="count"
                      checked={statusView === "count"}
                      onChange={() => setStatusView("count")}
                      className="accent-indigo-600 w-4 h-4 cursor-pointer"
                    />
                    Count
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="statusView"
                      value="percent"
                      checked={statusView === "percent"}
                      onChange={() => setStatusView("percent")}
                      className="accent-indigo-600 w-4 h-4 cursor-pointer"
                    />
                    Percentage
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Active</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      {statusView === "percent" ? `${activePct}%` : activeUsers}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {statusView === "percent" ? `${activePct}%` : `${activeUsers} users`}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Inactive</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                      {statusView === "percent" ? `${inactivePct}%` : inactiveUsers}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {statusView === "percent" ? `${inactivePct}%` : `${inactiveUsers} users`}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-400 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${inactivePct}%` }}
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              {/* Bar Chart — Users by Age Range */}
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-base font-semibold text-gray-700 mb-4">
                  Users by Age Range
                </h3>
                <div className="relative w-full h-56">
                  <canvas
                    ref={barRef}
                    role="img"
                    aria-label="Bar chart showing number of users per age range"
                  />
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "18-25", color: "#818cf8" },
                    { label: "26-35", color: "#6366f1" },
                    { label: "36-50", color: "#4f46e5" },
                    { label: "50+",   color: "#3730a3" },
                  ].map(({ label, color }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 text-xs text-gray-500"
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-sm"
                        style={{ background: color }}
                      />
                      {label}: {ageRanges[label]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-base font-semibold text-gray-700 mb-4">
                  Users by Status
                </h3>
                {/* Legend */}
                <div className="flex gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500" />
                    Active: {activeUsers}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" />
                    Inactive: {inactiveUsers}
                  </span>
                </div>
                <div className="relative w-full h-56">
                  <canvas
                    ref={pieRef}
                    role="img"
                    aria-label="Doughnut chart showing active vs inactive user ratio"
                  />
                </div>
              </div>

            </div>
          </>
        )}
        <div className="w-full">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;