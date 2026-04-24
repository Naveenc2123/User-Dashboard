import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import useDebounce from "../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUser,
  deleteUser
} from "../redux/slices/userSlice";
import {
  setSearch,
  setSort,
  resetFilters
} from "../redux/slices/filterSlice";

// ─── Add User Modal ────────────────────────────────────────────────────────────
const AddUserModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    age: "", gender: "", favoriteFruit: "",
    address: "", latitude: "", longitude: "",
    isActive: true
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 3)
      errs.name = "Name must be at least 3 characters";
    if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email";
    if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Phone must be 10 digits";
    if (!form.age || Number(form.age) < 18)
      errs.age = "Age must be 18 or above";
    if (form.latitude && isNaN(form.latitude))
      errs.latitude = "Invalid latitude";
    if (form.longitude && isNaN(form.longitude))
      errs.longitude = "Invalid longitude";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newUser = {
      _id: Date.now().toString(),
      ...form,
      age: Number(form.age),
      tags: [],
      friends: []
    };

    try {
      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      onAdd(newUser);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              placeholder="Phone (10 digits)"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Company + Age */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
            <div>
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Gender + Fruit */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-white"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              name="favoriteFruit"
              placeholder="Favorite Fruit"
              value={form.favoriteFruit}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Status:</label>
            <select
              name="isActive"
              value={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: e.target.value === "true"
                }))
              }
              className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Address */}
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
          />

          {/* Lat + Lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                name="latitude"
                placeholder="Latitude"
                value={form.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
              />
              {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
            </div>
            <div>
              <input
                name="longitude"
                placeholder="Longitude"
                value={form.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
              />
              {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Add User
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ─── Users Page ───────────────────────────────────────────────────────────────
const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state) => state.users.users);
  const { search, sortBy } = useSelector((state) => state.filters);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"
  const [showAddModal, setShowAddModal] = useState(false);
  const usersPerPage = 6;

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy]);

  // 🔍 Filter
  const filteredUsers = users.filter((user) => {
    const value = debouncedSearch.toLowerCase();
    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.company.toLowerCase().includes(value)
    );
  });

  // 🔃 Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "age") return a.age - b.age;
    if (sortBy === "company") return a.company.localeCompare(b.company);
    return 0;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // ── Delete handler (passed down to UserCard) ──────────────────────────────
  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("http://localhost:3001/users");
      const all = await res.json();
      const target = all.find((u) => u._id === user._id);
      if (!target) return;
      await fetch(`http://localhost:3001/users/${target.id || target._id}`, {
        method: "DELETE"
      });
      dispatch(deleteUser(user._id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6">

      {/* ── Row 1: Title ──────────────────────────────────── */}
      <h2 className="text-xl font-semibold mb-4">Users Management</h2>

      {/* ── Row 2: Search (left) + Sort (right) ──────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full sm:w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSort(e.target.value))}
          className="w-full sm:w-44 px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="company">Company</option>
        </select>

      </div>

      {/* ── Row 3: Action buttons ─────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">

        {/* Add */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          <span className="text-base leading-none">+</span> Add
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            dispatch(resetFilters());
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
        >
          Reset
        </button>

        {/* Card View */}
        <button
          onClick={() => setViewMode("card")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            viewMode === "card"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {/* grid icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="8" y="0" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="0" y="8" width="6" height="6" rx="1" fill="currentColor"/>
            <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor"/>
          </svg>
          Card View
        </button>

        {/* Table View */}
        <button
          onClick={() => setViewMode("table")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            viewMode === "table"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {/* list icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0" y="1" width="14" height="2" rx="1" fill="currentColor"/>
            <rect x="0" y="6" width="14" height="2" rx="1" fill="currentColor"/>
            <rect x="0" y="11" width="14" height="2" rx="1" fill="currentColor"/>
          </svg>
          Table View
        </button>

      </div>

      {/* ── Card View ─────────────────────────────────────── */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onDelete={() => handleDelete(user)}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm col-span-3 text-center py-10">
              No users found.
            </p>
          )}
        </div>
      )}

      {/* ── Table View ────────────────────────────────────── */}
      {viewMode === "table" && (
        <div className="w-full overflow-x-auto rounded-xl shadow">
          <table className="w-full text-sm bg-white border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="px-4 py-3 font-medium border-b">#</th>
                <th className="px-4 py-3 font-medium border-b">Name</th>
                <th className="px-4 py-3 font-medium border-b">Email</th>
                <th className="px-4 py-3 font-medium border-b">Company</th>
                <th className="px-4 py-3 font-medium border-b">Age</th>
                <th className="px-4 py-3 font-medium border-b">Status</th>
                <th className="px-4 py-3 font-medium border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-400">
                      {(currentPage - 1) * usersPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{user.company}</td>
                    <td className="px-4 py-3 text-gray-600">{user.age}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/users/${user._id}`)}
                          className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
                          className="text-xs px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-10">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center flex-wrap gap-2">

          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
          >
            Next
          </button>

        </div>
      )}

      {/* ── Add User Modal ────────────────────────────────── */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newUser) => dispatch(addUser(newUser))}
        />
      )}

    </div>
  );
};

export default Users;
