import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get auth state from Redux
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [isAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const data = await res.json();

      if (data.length === 0) {
        alert("User not found");
        return;
      }

      const user = data[0];

      // Password = favoriteFruit
      if (user.favoriteFruit === password) {
        // ✅ Save to localStorage (NEW)
        localStorage.setItem(
          "auth",
          JSON.stringify({
            isAuthenticated: true,
            user: user,
          }),
        );

        // ✅ Redux login
        dispatch(loginSuccess(user));

        navigate("/dashboard");
      } else {
        alert("Invalid password");
      }
    } catch (err) {
      console.error(err);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
    
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2">
        Welcome Back 👋
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Login to your dashboard
      </p>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />

        <input
          type="password"
          placeholder="Enter Password (favorite fruit)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition"
        >
          Login
        </button>

      </form>
    </div>
  </div>
);
};
export default Login;
