import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg.jpg";
import travelinLogo from "../assets/travolin-logo.png";

const Login = ({ setUser }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Redirect already-logged-in users to their dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !user) return;
    if (user.role === "admin") { navigate("/admin/dashboard", { replace: true }); return; }
    if (user.role === "agency") {
      navigate(user.agencyVerified ? "/agency" : "/agency/pending", { replace: true });
      return;
    }
    navigate("/explore", { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      //  Redirect by role (MATCH YOUR APP ROUTES)
      if (res.data.role === "agency") {
        if (res.data.agencyVerified) {
          navigate("/agency", { replace: true });
        } else {
          navigate("/agency/pending", { replace: true });
        }
      } else if (res.data.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/explore", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f1923]">
      {/* LEFT IMAGE */}
      <div
        className="hidden md:flex w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545]/85 via-[#0f1923]/70 to-black/60" />
        <div className="relative z-10 p-10 flex flex-col justify-between w-full h-full">
          {/* Top Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-white rounded-xl px-2 py-1 shadow-md transition-transform group-hover:scale-105">
              <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
            </div>
          </Link>

          {/* Bottom Text */}
          <div className="max-w-md">
            <p className="text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-3">
              Welcome Back
            </p>
            <h1 className="text-white text-3xl font-bold leading-tight">
              Continue your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Himalayan journey
              </span>
            </h1>
            <p className="text-white/70 mt-4 text-sm leading-relaxed">
              Log in to manage your trips, track bookings, and access your personalized dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10 bg-[#f6f7f8]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-black/5 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#2d3b2a]">Log In</h2>
              <p className="text-sm text-[#6b7280] mt-1">
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
                <label className="text-sm font-semibold text-[#2d3b2a]">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#fcfbf8] border border-gray-200 text-sm outline-none focus:border-[#197fe6]/50 focus:ring-2 focus:ring-[#197fe6]/10 transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#2d3b2a]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl bg-[#fcfbf8] border border-gray-200 text-sm outline-none focus:border-[#197fe6]/50 focus:ring-2 focus:ring-[#197fe6]/10 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#197fe6] hover:bg-[#1570d4] text-white font-bold transition shadow-lg shadow-[#197fe6]/20 text-sm"
              >
                Log In
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#6b7280]">
                  Don't have an account?
                  <span
                    onClick={() => navigate("/register")}
                    className="text-[#197fe6] font-semibold cursor-pointer ml-1 hover:underline"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </form>
          </div>

          {/* small footer */}
          <p className="text-center text-[11px] text-[#94a3b8] mt-4">
            Secure login • Your data stays protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;