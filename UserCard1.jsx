import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser } from "../redux/slices/userSlice";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./Toast";

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();
      const target = users.find((u) => u._id === user._id);
      if (!target) return;

      await fetch(`http://localhost:3001/users/${target.id || target._id}`, {
        method: "DELETE",
      });

      dispatch(deleteUser(user._id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition">

        {/* Avatar */}
        <Avatar src={user.profilePic} name={user.name} size="xl" className="mx-auto mb-3" />

        {/* Name */}
        <h3 className="font-semibold text-base">{user.name}</h3>

        {/* Email */}
        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>

        {/* Company */}
        <p className="text-xs text-gray-500">{user.company}</p>

        {/* Age + Status */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-sm font-medium text-gray-700">Age: {user.age}</span>
          <Badge variant={user.isActive ? "success" : "danger"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            className="!text-blue-600 !border-blue-200 hover:!bg-blue-50"
            onClick={() => navigate(`/dashboard/users/${user._id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="!text-green-600 !border-green-200 hover:!bg-green-50"
            onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="!text-red-500 !border-red-200 hover:!bg-red-50"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>

      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${user.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
};

export default UserCard;
