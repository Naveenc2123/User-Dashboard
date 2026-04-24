import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/userSlice";
import Button from "../components/Button";
import Loader from "../components/Loader";
import UserFormFields from "../components/UserFormFields";
import { useToast } from "../components/Toast";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    age: "", gender: "", favoriteFruit: "",
    address: "", latitude: "", longitude: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Load existing user
  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => {
        const user = data.find((u) => u._id === id);
        if (user) setForm(user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();
      const existing = users.find((u) => u._id === id);
      if (!existing) return;

      const updatedUser = { ...form, _id: id, age: Number(form.age) };

      await fetch(`http://localhost:3001/users/${existing.id || existing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      dispatch(updateUser(updatedUser));
      toast.success("User updated successfully");
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  if (loading) return <Loader message="Loading user…" />;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto">

        <h2 className="text-xl font-semibold mb-6 text-center">Edit User</h2>

        <form onSubmit={handleUpdate}>
          <UserFormFields
            form={form}
            errors={errors}
            handleChange={handleChange}
          />

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate("/dashboard/users")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              Update User
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditUser;
