import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/userSlice";

const AddUser = () => {
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

  const newUser = {
    _id: Date.now().toString(),
    ...form,
    isActive: true,
    tags: [],
    friends: []
  };

  try {
    // ✅ API call
    await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    // ✅ Redux update (IMPORTANT)
    dispatch(addUser(newUser));

    alert("User added successfully");

    navigate("/dashboard/users"); // better route
  } catch (err) {
    console.error(err);
  }
};

return (
   <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
    
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 mx-auto">
      
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        Add New User
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Name */}
        <div>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Company + Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="company"
            placeholder="Company"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <div>
            <input
              name="age"
              type="number"
              placeholder="Age"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
        </div>

        {/* Gender + Fruit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="gender"
            placeholder="Gender"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            name="favoriteFruit"
            placeholder="Favorite Fruit"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Address */}
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* Latitude + Longitude */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="latitude"
            placeholder="Latitude"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            name="longitude"
            placeholder="Longitude"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {(errors.latitude || errors.longitude) && (
          <p className="text-red-500 text-xs">
            {errors.latitude || errors.longitude}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition"
        >
          Add User
        </button>

      </form>
    </div>
  </div>
);
};
export default AddUser;