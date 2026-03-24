import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg.jpg";

const Login = ({ setUser }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier,
        password,
      });

      localStorage.setItem("token", res.data.token);

      const userObj = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        agencyVerified: res.data.agencyVerified ?? null,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      // ✅ Redirect by role (MATCH YOUR APP ROUTES)
      if (res.data.role === "agency") {
        if (res.data.agencyVerified) {
          navigate("/agency"); // AgencyDashboard
        } else {
          navigate("/agency/pending"); // AgencyPending
        }
      } else if (res.data.role === "admin") {
        navigate("/adddestination"); // your admin landing page
      } else {
        navigate("/explore"); // normal user: go to Explore page
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f6f8fb]">
      {/* LEFT IMAGE */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545]/80 via-[#274c77]/65 to-black/50" />
        <div className="relative z-10 p-10 flex flex-col justify-end w-full">
          <div className="max-w-md">
            <p className="text-white/80 text-sm mb-2">Travolin</p>
            <h1 className="text-white text-3xl font-bold leading-tight">
              Welcome back
            </h1>
            <p className="text-white/80 mt-3 text-sm leading-relaxed">
              Log in to manage your trips, bookings, and dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your credentials to continue
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#274c77] text-white font-semibold hover:opacity-95 transition shadow-md shadow-[#274c77]/20"
              >
                LOGIN
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Don’t have an account?
                  <span
                    onClick={() => navigate("/register")}
                    className="text-[#274c77] font-semibold cursor-pointer ml-1 hover:underline"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </form>
          </div>

          {/* small footer */}
          <p className="text-center text-[11px] text-gray-400 mt-4">
            Secure login • Your data stays protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;