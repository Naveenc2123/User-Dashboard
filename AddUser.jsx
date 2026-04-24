import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/userSlice";
import Button from "../components/Button";
import UserFormFields from "../components/UserFormFields";
import { useToast } from "../components/Toast";

const INITIAL_FORM = {
  name: "", email: "", phone: "", company: "",
  age: "", gender: "", favoriteFruit: "",
  address: "", latitude: "", longitude: "",
  isActive: true,
};

const validate = (form) => {
  const errors = {};
  if (!form.name || form.name.length < 3)
    errors.name = "Name must be at least 3 characters";
  if (!/\S+@\S+\.\S+/.test(form.email))
    errors.email = "Invalid email";
  if (!/^\d{10}$/.test(form.phone))
    errors.phone = "Phone must be 10 digits";
  if (!form.age || Number(form.age) < 18)
    errors.age = "Age must be 18 or above";
  if (form.latitude && isNaN(form.latitude))
    errors.latitude = "Invalid latitude";
  if (form.longitude && isNaN(form.longitude))
    errors.longitude = "Invalid longitude";
  return errors;
};

const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newUser = {
      _id: Date.now().toString(),
      ...form,
      age: Number(form.age),
      tags: [],
      friends: [],
    };

    try {
      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      dispatch(addUser(newUser));
      toast.success("User added successfully");
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 mx-auto">

        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Add New User
        </h2>

        <form onSubmit={handleSubmit}>
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
              Add User
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddUser;
