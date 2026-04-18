import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const { id } = useParams();
const navigate = useNavigate();

const user = useSelector((state) =>
  state.users.users.find((u) => u._id === id)
);

  if (!user) return <h2>Loading...</h2>;

return (
  <div style={styles.page}>

    <div style={styles.card}>
    <button
  onClick={() => navigate("/dashboard/users")}
  style={styles.backBtn}
>
  ← Back to Dashboard
</button>
      {/* Header */}
      <div style={styles.header}>
        <img
          src={user.profilePic}
          alt={user.name}
          style={styles.avatar}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/100";
          }}
        />

        <div>
          <h2 style={styles.name}>{user.name}</h2>
          <p style={styles.sub}>{user.company}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div style={styles.grid}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
      </div>

      <p style={styles.address}>
        <strong>Address:</strong> {user.address}
      </p>

      {/* About */}
      <div style={styles.section}>
        <h3>About</h3>
        <p>{user.about}</p>
      </div>

      {/* Tags */}
      <div style={styles.section}>
        <h3>Tags</h3>
        <div style={styles.tags}>
          {user.tags?.map((tag, i) => (
            <span key={i} style={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Friends */}
      <div style={styles.section}>
        <h3>Friends</h3>
        <ul style={styles.list}>
          {user.friends?.map((friend) => (
            <li key={friend.id}>{friend.name}</li>
          ))}
        </ul>
      </div>

      {/* Map Button */}
      <button
        style={styles.mapBtn}
        onClick={() =>
          window.open(
            `https://www.google.com/maps?q=${user.latitude},${user.longitude}`,
            "_blank"
          )
        }
      >
        View Location
      </button>

    </div>

  </div>
);
};
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    padding: "20px"
  },

  card: {
    width: "500px",
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px"
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover"
  },

  name: {
    margin: 0
  },

  sub: {
    margin: 0,
    color: "gray"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "10px"
  },

  address: {
    marginTop: "10px"
  },

  section: {
    marginTop: "15px"
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },

  tag: {
    background: "#667eea",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px"
  },

  list: {
    paddingLeft: "15px"
  },

  mapBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  backBtn: {
  marginBottom: "15px",
  padding: "8px 12px",
  border: "none",
  background: "#667eea",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
}
};
export default UserDetails;