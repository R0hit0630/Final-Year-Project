import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg.jpg";

const Login = ({ setUser }) => {
  const [identifier, setIdentifier] = useState(""); // ✅ username OR email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        identifier,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setUser({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
      });

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* LEFT IMAGE */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-blue-900/60" />
      </div>

      {/* RIGHT LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm px-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Login</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#274c77] text-white font-medium hover:opacity-90 transition"
          >
            LOGIN
          </button>

          <p className="text-center text-xs mt-6 text-gray-500">
            Don’t have an account?
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer ml-1 hover:underline"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
