import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) return;

  localStorage.removeItem("isAuth");
  localStorage.removeItem("user");

  navigate("/login");
};

return (
  <nav style={styles.navbar}>

    <div style={styles.center}>
      <button onClick={() => navigate("/dashboard")} style={styles.link}>
        Dashboard
      </button>

      <button onClick={() => navigate("/dashboard/users")} style={styles.link}>
        Users
      </button>

      <button onClick={() => navigate("/dashboard/add-user")} style={styles.link}>
        Add User
      </button>
    </div>

    <div style={styles.right}>
      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>

  </nav>
);
};
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    gap: "15px"
  },

  center: {
    display: "flex",
    gap: "15px"
  },

  right: {},

  link: {
    border: "none",
    padding: "8px 12px",
    background: "#667eea",
    color: "white",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer"
  },

  logout: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Navbar;