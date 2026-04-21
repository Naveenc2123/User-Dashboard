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
  <div className="p-4 sm:p-6">

    {/* Card */}
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <img
          src={user.profilePic}
          alt={user.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/100";
          }}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.company}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Phone:</span> {user.phone}</p>
        <p><span className="font-medium">Age:</span> {user.age}</p>
        <p><span className="font-medium">Gender:</span> {user.gender}</p>
      </div>

      {/* Address */}
      <p className="mb-4 text-sm">
        <span className="font-medium">Address:</span> {user.address}
      </p>

      {/* About */}
      {user.about && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">About</h3>
          <p className="text-sm text-gray-600">{user.about}</p>
        </div>
      )}

      {/* Tags */}
      {user.tags?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {user.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Friends */}
      {user.friends?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Friends</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {user.friends.map((friend) => (
              <li key={friend.id}>{friend.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Map Button */}
      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps?q=${user.latitude},${user.longitude}`,
            "_blank"
          )
        }
        className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
      >
        View Location
      </button>

    </div>
  </div>
);
};
export default UserDetails;