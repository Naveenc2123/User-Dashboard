import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import useDebounce from "../hooks/useDebounce";

const Users = () => {
  const [users, setUsers] = useState([]);
  const companies = [...new Set(users.map((u) => u.company))];
const fruits = [...new Set(users.map((u) => u.favoriteFruit))];
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const usersPerPage = 6;
  const debouncedSearch = useDebounce(search, 500);
  const [filters, setFilters] = useState({
  gender: "all",
  company: "all",
  fruit: "all",
  ageRange: "all",
  status: "all"
});

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch, sortBy, filters]);
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
    // Gender
    if (filters.gender !== "all" && user.gender !== filters.gender) {
      return false;
    }

    // Company
    if (filters.company !== "all" && user.company !== filters.company) {
      return false;
    }

    // Fruit
    if (filters.fruit !== "all" && user.favoriteFruit !== filters.fruit) {
      return false;
    }

    // Status
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      if (user.isActive !== isActive) return false;
    }

    // Age Range
    if (filters.ageRange !== "all") {
      if (filters.ageRange === "18-25" && !(user.age >= 18 && user.age <= 25)) return false;
      if (filters.ageRange === "26-35" && !(user.age >= 26 && user.age <= 35)) return false;
      if (filters.ageRange === "36-50" && !(user.age >= 36 && user.age <= 50)) return false;
      if (filters.ageRange === "50+" && !(user.age > 50)) return false;
    }

    return true;
  });
  const sortedUsers = [...filteredUsers].sort((a, b) => {
  if (sortBy === "name") {
    return a.name.localeCompare(b.name);
  }
  if (sortBy === "age") {
    return a.age - b.age;
  }
  if (sortBy === "company") {
    return a.company.localeCompare(b.company);
  }
  return 0;
});
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
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
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
  value={filters.gender}
  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
  style={styles.select}
>
          <option value="all">All Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select
  value={filters.company}
  onChange={(e) => setFilters({ ...filters, company: e.target.value })}
  style={styles.select}
>
          <option value="all">All Companies</option>
          {companies.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select
  value={filters.fruit}
  onChange={(e) => setFilters({ ...filters, fruit: e.target.value })}
  style={styles.select}
>
          <option value="all">All Fruits</option>
          {fruits.map((f, i) => (
            <option key={i} value={f}>{f}</option>
          ))}
        </select>

        <select
  value={filters.ageRange}
  onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
  style={styles.select}
>
          <option value="all">All Ages</option>
          <option value="18-25">18 - 25</option>
          <option value="26-35">26 - 35</option>
          <option value="36-50">36 - 50</option>
          <option value="50+">50+</option>
        </select>

        <select
  value={filters.status}
  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
  style={styles.select}
>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button onClick={() =>
  setFilters({
    gender: "all",
    company: "all",
    fruit: "all",
    ageRange: "all",
    status: "all"
  })
} style={styles.resetBtn}>
          Reset
        </button>

      </div>
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
        color: currentPage === i + 1 ? "white" : "black",
        fontWeight: currentPage === i + 1 ? "bold" : "normal"
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