import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Loader from "../components/Loader";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) =>
    state.users.users.find((u) => u._id === id)
  );

  if (!user) return <Loader message="Loading user…" />;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <Avatar src={user.profilePic} name={user.name} size="xl" />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.company}</p>
            <Badge variant={user.isActive ? "success" : "danger"} className="mt-1">
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          {[
            { label: "Email",  value: user.email  },
            { label: "Phone",  value: user.phone  },
            { label: "Age",    value: user.age    },
            { label: "Gender", value: user.gender },
          ].map(({ label, value }) => (
            <p key={label}>
              <span className="font-medium text-gray-700">{label}: </span>
              <span className="text-gray-600">{value}</span>
            </p>
          ))}
        </div>

        {/* Address */}
        {user.address && (
          <p className="mb-4 text-sm">
            <span className="font-medium text-gray-700">Address: </span>
            <span className="text-gray-600">{user.address}</span>
          </p>
        )}

        {/* About */}
        {user.about && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-1">About</h3>
            <p className="text-sm text-gray-600">{user.about}</p>
          </div>
        )}

        {/* Tags */}
        {user.tags?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {user.tags.map((tag, i) => (
                <Badge key={i} variant="info">#{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Friends */}
        {user.friends?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Friends</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {user.friends.map((friend) => (
                <li key={friend.id}>{friend.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/dashboard/users")}
          >
            ← Back
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
          >
            Edit User
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${user.latitude},${user.longitude}`,
                "_blank"
              )
            }
          >
            View on Map
          </Button>
        </div>

      </div>
    </div>
  );
};

export default UserDetails;
