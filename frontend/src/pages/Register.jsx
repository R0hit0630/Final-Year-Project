import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg.jpg";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nationality: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/users/register", formData);

      // After successful register → go to login
      navigate("/login");
    } catch (err) {
      console.log("REGISTER ERROR RESPONSE:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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

      {/* RIGHT REGISTER */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-sm px-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Register</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <label className="text-sm text-gray-600">Enter your Username</label>
          <input
            type="text"
            name="username"
            placeholder="johnstark"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 mt-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
            required
          />

          <label className="text-sm text-gray-600">Enter your Email</label>
          <input
            type="email"
            name="email"
            placeholder="abc12@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 mt-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
            required
          />

          <label className="text-sm text-gray-600">Enter your Nationality</label>
          <input
            type="text"
            name="nationality"
            placeholder="Country"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full mb-4 mt-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
            required
          />

          <label className="text-sm text-gray-600">Enter your Password</label>
          <input
            type="password"
            name="password"
            placeholder="************"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-6 mt-1 px-4 py-3 rounded-full bg-gray-100 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#274c77] text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-xs mt-6 text-gray-500">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer ml-1 hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
