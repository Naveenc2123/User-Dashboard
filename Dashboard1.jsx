import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
} from "../redux/slices/userSlice";
import StatCard from "../components/StatCard";

const loadChartJS = () =>
  new Promise((resolve) => {
    if (window.Chart) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [statusView, setStatusView] = useState("count");

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const barChart = useRef(null);
  const pieChart = useRef(null);

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

  const totalUsers   = users.length;
  const activeUsers  = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const avgAge =
    totalUsers > 0
      ? (users.reduce((s, u) => s + u.age, 0) / totalUsers).toFixed(1)
      : 0;

  const activePct   = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100)   : 0;
  const inactivePct = totalUsers > 0 ? 100 - activePct : 0;

  const ageRanges = {
    "18-25": users.filter((u) => u.age >= 18 && u.age <= 25).length,
    "26-35": users.filter((u) => u.age >= 26 && u.age <= 35).length,
    "36-50": users.filter((u) => u.age >= 36 && u.age <= 50).length,
    "50+":   users.filter((u) => u.age > 50).length,
  };

  useEffect(() => {
    if (location.pathname !== "/dashboard" || users.length === 0 || !barRef.current || !pieRef.current) return;

    loadChartJS().then(() => {
      const Chart = window.Chart;
      if (barChart.current) barChart.current.destroy();
      if (pieChart.current) pieChart.current.destroy();

      barChart.current = new Chart(barRef.current, {
        type: "bar",
        data: {
          labels: Object.keys(ageRanges),
          datasets: [{
            label: "Users",
            data: Object.values(ageRanges),
            backgroundColor: ["#818cf8", "#6366f1", "#4f46e5", "#3730a3"],
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1, color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" } },
            x: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { display: false } },
          },
        },
      });

      pieChart.current = new Chart(pieRef.current, {
        type: "doughnut",
        data: {
          labels: ["Active", "Inactive"],
          datasets: [{
            data: [activeUsers, inactiveUsers],
            backgroundColor: ["#22c55e", "#f87171"],
            borderWidth: 0,
            hoverOffset: 6,
          }],
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
                  return ` ${ctx.label}: ${ctx.parsed} (${Math.round((ctx.parsed / total) * 100)}%)`;
                },
              },
            },
          },
        },
      });
    });

    return () => {
      if (barChart.current) barChart.current.destroy();
      if (pieChart.current) pieChart.current.destroy();
    };
  }, [users, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-white shadow sticky top-0 z-50">
        <h2 className="text-lg sm:text-xl font-semibold">User Management</h2>
        <Navbar />
      </div>

      <div className="p-4 sm:p-6">

        {location.pathname === "/dashboard" && (
          <>
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard label="Total Users"  value={totalUsers}   color="indigo" icon="👥" />
              <StatCard label="Active Users" value={activeUsers}  color="green"  icon="✅" />
              <StatCard label="Average Age"  value={avgAge}       color="yellow" icon="📊" />
            </div>

            {/* ── Status Progress Bars ── */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-base font-semibold text-gray-700">User Status Breakdown</h3>
                <div className="flex items-center gap-4">
                  {["count", "percent"].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        name="statusView"
                        value={v}
                        checked={statusView === v}
                        onChange={() => setStatusView(v)}
                        className="accent-indigo-600 w-4 h-4 cursor-pointer"
                      />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {[
                { label: "Active",   count: activeUsers,   pct: activePct,   bar: "bg-green-500", badge: "bg-green-100 text-green-700" },
                { label: "Inactive", count: inactiveUsers, pct: inactivePct, bar: "bg-red-400",   badge: "bg-red-100 text-red-600"     },
              ].map(({ label, count, pct, bar, badge }) => (
                <div key={label} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
                        {statusView === "percent" ? `${pct}%` : count}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {statusView === "percent" ? `${pct}%` : `${count} users`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`${bar} h-3 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Users by Age Range</h3>
                <div className="relative w-full h-56">
                  <canvas ref={barRef} />
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "18-25", color: "#818cf8" },
                    { label: "26-35", color: "#6366f1" },
                    { label: "36-50", color: "#4f46e5" },
                    { label: "50+",   color: "#3730a3" },
                  ].map(({ label, color }) => (
                    <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                      {label}: {ageRanges[label]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Users by Status</h3>
                <div className="flex gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500" /> Active: {activeUsers}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" /> Inactive: {inactiveUsers}
                  </span>
                </div>
                <div className="relative w-full h-56">
                  <canvas ref={pieRef} />
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
