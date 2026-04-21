import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import useDebounce from "../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure
} from "../redux/slices/userSlice";

import {
  setSearch,
  setSort,
  setFilter,
  resetFilters
} from "../redux/slices/filterSlice";

const Users = () => {
  const dispatch = useDispatch();

  // ✅ Redux state
  const users = useSelector((state) => state.users.users);

  const {
    search,
    sortBy,
    gender,
    company,
    fruit,
    ageRange,
    status
  } = useSelector((state) => state.filters);

  // ✅ Local state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const debouncedSearch = useDebounce(search, 500);

  // ✅ Derived values
  const companies = [...new Set(users.map((u) => u.company))];
  const fruits = [...new Set(users.map((u) => u.favoriteFruit))];

  // 🔥 Fetch users
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

  // ✅ Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, gender, company, fruit, ageRange, status]);

  // 🔍 Filter users
  const filteredUsers = users
    .filter((user) => {
      const value = debouncedSearch.toLowerCase();

      return (
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.company.toLowerCase().includes(value)
      );
    })
    .filter((user) => {
      if (gender !== "all" && user.gender !== gender) return false;
      if (company !== "all" && user.company !== company) return false;
      if (fruit !== "all" && user.favoriteFruit !== fruit) return false;

      if (status !== "all") {
        const isActive = status === "active";
        if (user.isActive !== isActive) return false;
      }

      if (ageRange !== "all") {
        if (ageRange === "18-25" && !(user.age >= 18 && user.age <= 25)) return false;
        if (ageRange === "26-35" && !(user.age >= 26 && user.age <= 35)) return false;
        if (ageRange === "36-50" && !(user.age >= 36 && user.age <= 50)) return false;
        if (ageRange === "50+" && !(user.age > 50)) return false;
      }

      return true;
    });

  // 🔃 Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "age") return a.age - b.age;
    if (sortBy === "company") return a.company.localeCompare(b.company);
    return 0;
  });

  // 📄 Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;

  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

return (
  <div className="p-4 sm:p-6">

    {/* Title */}
    <h2 className="text-xl font-semibold mb-4">Users Management</h2>

    {/* 🔥 Top Bar */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

      {/* ✅ Search (LEFT) */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        className="w-full md:w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      {/* ✅ Filters (RIGHT) */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-end">

        {/* Gender */}
        <select
          value={gender}
          onChange={(e) => dispatch(setFilter({ gender: e.target.value }))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Company */}
        <select
          value={company}
          onChange={(e) => dispatch(setFilter({ company: e.target.value }))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">Company</option>
          {companies.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {/* Fruit */}
        <select
          value={fruit}
          onChange={(e) => dispatch(setFilter({ fruit: e.target.value }))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">Fruit</option>
          {fruits.map((f, i) => (
            <option key={i} value={f}>{f}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* 🔥 Age Buttons */}
        <div className="flex gap-1">
          {["all", "18-25", "26-35", "36-50", "50+"].map((age) => (
            <button
              key={age}
              onClick={() => dispatch(setFilter({ ageRange: age }))}
              className={`px-3 py-1 rounded-lg text-xs border ${
                ageRange === age
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
              }`}
            >
              {age === "all" ? "All" : age}
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={() => dispatch(resetFilters())}
          className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
        >
          Reset
        </button>

      </div>
    </div>

    {/* 🔥 Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentUsers.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>

    {/* 🔥 Pagination */}
    <div className="mt-6 flex justify-center flex-wrap gap-2">
      
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        className="px-3 py-1 border rounded-lg"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded-lg border ${
            currentPage === i + 1
              ? "bg-indigo-600 text-white"
              : "bg-white"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        className="px-3 py-1 border rounded-lg"
      >
        Next
      </button>

    </div>

  </div>
);
};
export default Users;