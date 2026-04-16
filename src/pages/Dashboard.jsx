import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  // 📊 Calculations
  const totalUsers = users.length;

  const activeUsers = users.filter((u) => u.isActive).length;

  const avgAge =
    users.length > 0
      ? (
          users.reduce((sum, u) => sum + u.age, 0) / users.length
        ).toFixed(1)
      : 0;

return (
  <div style={styles.container}>
    
    {/* Header */}
    <div style={styles.header}>
      <h2 style={styles.title}>User Management Dashboard</h2>

      <Navbar/>
    </div>

    {/* Stats Cards */}
    <div style={styles.cardContainer}>
      
      <div style={styles.card}>
        <h3>Total Users</h3>
        <p>{totalUsers}</p>
      </div>

      <div style={styles.card}>
        <h3>Active Users</h3>
        <p>{activeUsers}</p>
      </div>

      <div style={styles.card}>
        <h3>Average Age</h3>
        <p>{avgAge}</p>
      </div>

    </div>

    {/* Nested Pages */}
    <div style={styles.outlet}>
      <Outlet />
    </div>

  </div>
);
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    margin: 0,
    color: "#333"
  },

  nav: {
    display: "flex",
    gap: "15px"
  },

  link: {
    textDecoration: "none",
    padding: "8px 12px",
    background: "#667eea",
    color: "white",
    borderRadius: "6px",
    fontSize: "14px"
  },

  cardContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap"
  },

  card: {
    flex: "1",
    minWidth: "180px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "0.3s"
  },

  outlet: {
    marginTop: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  }
};

export default Dashboard;