import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/userSlice";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    age: "",
    gender: "",
    address: "",
    latitude: "",
    longitude: "",
    favoriteFruit: ""
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Load existing user
  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => {
        const user = data.find((u) => u._id === id);
        if (user) {
          setForm(user);
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3001/users");
    const users = await res.json();

    const existingUser = users.find((u) => u._id === id);
    if (!existingUser) return;

    const updatedUser = {
      ...form,
      _id: id,
      age: Number(form.age) // ✅ safer
    };

    // ✅ API update
    await fetch(
      `http://localhost:3001/users/${existingUser.id || existingUser._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUser)
      }
    );

    // ✅ Redux update (IMPORTANT)
    dispatch(updateUser(updatedUser));

    alert("User updated successfully");

    navigate(`/dashboard/users`);
  } catch (err) {
    console.error(err);
  }
};
  if (loading) return <h2>Loading...</h2>;

return (
  <div style={styles.page}>

    <div style={styles.card}>
        <button
  onClick={() => navigate("/dashboard/users")}
  style={styles.backBtn}
>
  ← Back to Dashboard
</button>
      <h2 style={styles.title}>Edit User</h2>

      <form onSubmit={handleUpdate} style={styles.form}>

        {Object.keys(form).map((key) => (
          key !== "id" && (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key}
              style={styles.input}
            />
          )
        ))}

        <button type="submit" style={styles.button}>
          Update User
        </button>

      </form>
    </div>

  </div>
);
};
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
    fontFamily: "Arial"
  },

  card: {
    width: "450px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "15px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
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
export default EditUser;