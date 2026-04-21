import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + " " + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    dispatch(logout());
    navigate("/login");
  };

return (
  <div className="flex items-center justify-between gap-4 flex-wrap relative">

    {/* ✅ Hamburger (Mobile) */}
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="md:hidden text-2xl"
    >
      ☰
    </button>

    {/* ✅ Menu */}
    <div
      className={`
        ${menuOpen ? "flex" : "hidden"} 
        flex-col absolute top-14 right-0 w-48 bg-white shadow-lg rounded-xl p-4 gap-3
        md:static md:flex md:flex-row md:w-auto md:bg-transparent md:shadow-none md:p-0
      `}
    >
      <button
        onClick={() => navigate("/dashboard")}
        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        Dashboard
      </button>

      <button
        onClick={() => navigate("/dashboard/users")}
        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        Users
      </button>

      <button
        onClick={() => navigate("/dashboard/add-user")}
        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        Add User
      </button>
    </div>

    {/* ✅ Right Section */}
    <div className="flex items-center gap-3 ml-auto">

      {/* 👤 Avatar */}
      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
        {getInitials(user?.name || "Guest User")}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
      >
        Logout
      </button>

    </div>
  </div>
);
};

export default Navbar;