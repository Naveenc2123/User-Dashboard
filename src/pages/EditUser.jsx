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
  <div className="p-4 sm:p-6">

    {/* Card */}
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto">

      <h2 className="text-xl font-semibold mb-6 text-center">
        Edit User
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Phone */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* Company + Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Gender + Fruit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Gender"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            name="favoriteFruit"
            value={form.favoriteFruit}
            onChange={handleChange}
            placeholder="Favorite Fruit"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Address */}
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Update User
        </button>

      </form>
    </div>
  </div>
);
};
export default EditUser;