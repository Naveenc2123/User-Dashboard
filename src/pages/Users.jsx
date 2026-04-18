import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import useDebounce from "../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import FilterPanel from "../components/FilterPanel";

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
    <div style={styles.page}>
      <h2 style={styles.title}>Users Management</h2>

      {/* Search + Sort */}
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          style={styles.input}
        />

        <select
          value={sortBy}
          onChange={(e) => dispatch(setSort(e.target.value))}
          style={styles.select}
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="company">Company</option>
        </select>
      </div>
      
      {/* Filters */}
      <div style={styles.filterBox}>
        <h4>Filters</h4>

        <div style={styles.filterRow}>
          <select
            value={gender}
            onChange={(e) => dispatch(setFilter({ gender: e.target.value }))}
            style={styles.select}
          >
            <option value="all">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={company}
            onChange={(e) => dispatch(setFilter({ company: e.target.value }))}
            style={styles.select}
          >
            <option value="all">All Companies</option>
            {companies.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={fruit}
            onChange={(e) => dispatch(setFilter({ fruit: e.target.value }))}
            style={styles.select}
          >
            <option value="all">All Fruits</option>
            {fruits.map((f, i) => (
              <option key={i} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={ageRange}
            onChange={(e) => dispatch(setFilter({ ageRange: e.target.value }))}
            style={styles.select}
          >
            <option value="all">All Ages</option>
            <option value="18-25">18 - 25</option>
            <option value="26-35">26 - 35</option>
            <option value="36-50">36 - 50</option>
            <option value="50+">50+</option>
          </select>

          <select
            value={status}
            onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button onClick={() => dispatch(resetFilters())} style={styles.resetBtn}>
            Reset
          </button>
        </div>
      </div>

      {/* 🔥 useReducer Demo Component */}
      <div style={styles.filterBox}>
        <h4>useReducer Demo (Local State)</h4>
        <FilterPanel companies={companies} />
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        {currentUsers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={styles.pageBtn}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              ...styles.pageBtn,
              background: currentPage === i + 1 ? "#667eea" : "white",
              color: currentPage === i + 1 ? "white" : "black"
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          style={styles.pageBtn}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};
const styles = {
  page: {
    padding: "25px",
    fontFamily: "Arial",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "20px"
  },

  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  input: {
    padding: "10px",
    width: "250px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  filterBox: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  resetBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px"
  },

  pagination: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  },
  pageBtn: {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
  transition: "0.2s"
}
};
export default Users;