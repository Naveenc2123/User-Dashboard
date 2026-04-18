import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser } from "../redux/slices/userSlice";
const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch("http://localhost:3001/users");
    const users = await res.json();

    const targetUser = users.find((u) => u._id === user._id);
    if (!targetUser) return;

    // ✅ API delete
    await fetch(
      `http://localhost:3001/users/${targetUser.id || targetUser._id}`,
      {
        method: "DELETE",
      }
    );

    // ✅ Redux update (IMPORTANT)
    dispatch(deleteUser(user._id));

    alert("User deleted successfully");

  } catch (err) {
    console.error(err);
  }
};
return (
  <div style={styles.card}>
    
    <img
      src={user.profilePic}
      alt={user.name}
      style={styles.image}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/80";
      }}
    />

    <h3 style={styles.name}>{user.name}</h3>
    <p style={styles.text}>{user.email}</p>
    <p style={styles.text}>{user.company}</p>

    <div style={styles.age}>Age: {user.age}</div>

    <div style={styles.btnGroup}>
      <button onClick={() => navigate(`/users/${user._id}`)} style={styles.view}>
        View
      </button>

      <button onClick={() => navigate(`/edit-user/${user._id}`)} style={styles.edit}>
        Edit
      </button>

      <button onClick={handleDelete} style={styles.delete}>
        Delete
      </button>
    </div>

  </div>
);
};

const styles = {
  card: {
    width: "220px",
    padding: "15px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "0.3s"
  },

  image: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px"
  },

  name: {
    margin: "5px 0"
  },

  text: {
    fontSize: "13px",
    color: "gray",
    margin: "2px 0"
  },

  age: {
    marginTop: "5px",
    fontWeight: "bold"
  },

  btnGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },

  view: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },

  edit: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px"
  }
};

export default UserCard;