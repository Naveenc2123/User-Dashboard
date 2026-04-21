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
  <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">

    {/* Avatar */}
    <img
      src={user.profilePic}
      alt={user.name}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/80";
      }}
      className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
    />

    {/* Name */}
    <h3 className="font-semibold text-lg">{user.name}</h3>

    {/* Email */}
    <p className="text-sm text-gray-500">{user.email}</p>

    {/* Company */}
    <p className="text-sm text-gray-500">{user.company}</p>

    {/* Age + Status */}
    <div className="flex items-center justify-center gap-2 mt-2">
      <span className="text-sm font-medium">Age: {user.age}</span>

      <span
        className={`text-xs px-2 py-1 rounded-full ${
          user.isActive
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {user.isActive ? "Active" : "Inactive"}
      </span>
    </div>

    {/* Buttons */}
    <div className="flex justify-center gap-2 mt-4 flex-wrap">

      <button
        onClick={() => navigate(`/dashboard/users/${user._id}`)}
        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
      >
        View
      </button>

      <button
        onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
      >
        Delete
      </button>

    </div>
  </div>
);
};


export default UserCard;