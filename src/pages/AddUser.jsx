import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.name || form.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (form.age < 18) {
      newErrors.age = "Age must be above 18";
    }

    if (isNaN(form.latitude)) {
      newErrors.latitude = "Invalid latitude";
    }

    if (isNaN(form.longitude)) {
      newErrors.longitude = "Invalid longitude";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // POST request
    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
         _id: Date.now().toString(), 
        ...form,
        isActive: true,
        tags: [],
        friends: []
      })
    });

    alert("User added successfully");

    navigate("/users");
  };

return (
  <div style={styles.page}>
    <div style={styles.card}>
      <h2 style={styles.title}>Add New User</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.row}>
          <input name="name" placeholder="Name" onChange={handleChange} style={styles.input} />
          <p style={styles.error}>{errors.name}</p>
        </div>

        <div style={styles.row}>
          <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
          <p style={styles.error}>{errors.email}</p>
        </div>

        <div style={styles.row}>
          <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />
          <p style={styles.error}>{errors.phone}</p>
        </div>

        <div style={styles.grid}>
          <input name="company" placeholder="Company" onChange={handleChange} style={styles.input} />
          <input name="age" type="number" placeholder="Age" onChange={handleChange} style={styles.input} />
        </div>
        <p style={styles.error}>{errors.age}</p>

        <div style={styles.grid}>
          <input name="gender" placeholder="Gender" onChange={handleChange} style={styles.input} />
          <input name="favoriteFruit" placeholder="Favorite Fruit" onChange={handleChange} style={styles.input} />
        </div>

        <input name="address" placeholder="Address" onChange={handleChange} style={styles.input} />

        <div style={styles.grid}>
          <input name="latitude" placeholder="Latitude" onChange={handleChange} style={styles.input} />
          <input name="longitude" placeholder="Longitude" onChange={handleChange} style={styles.input} />
        </div>

        <p style={styles.error}>{errors.latitude || errors.longitude}</p>

        <button type="submit" style={styles.button}>
          Add User
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
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  row: {
    display: "flex",
    flexDirection: "column"
  },

  grid: {
    display: "flex",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none"
  },

  button: {
    padding: "12px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "3px"
  }
};
export default AddUser;