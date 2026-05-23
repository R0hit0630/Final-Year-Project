import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api.js";
import bgImage from "../assets/bg.jpg";
import travelinLogo from "../assets/travolin-logo.png";

const Login = ({ setUser }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // [FLOW FEATURE: LOGIN]
  // Handles form submission, calls backend API, stores session credentials, and redirects
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: POST to /api/auth/login endpoint
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        identifier,
        password,
      });

      // Step 2: Store the token inside localStorage
      localStorage.setItem("token", res.data.token);

      const userObj = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        agencyVerified: res.data.agencyVerified ?? null,
      };

      // Step 3: Store the profile details in localStorage and update state
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      // Step 4: Redirect the user to the correct workspace depending on their role
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-800">

      {/* LEFT IMAGE PANEL */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* Very light overlay to keep it bright and airy */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Subtle branding overlay */}
        <div className="absolute bottom-12 left-12 text-white max-w-lg drop-shadow-md">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4 opacity-90">
            Journey to the Himalayas
          </p>
          <h1 className="text-5xl font-light leading-tight">
            Discover a world of <br />
            <span className="font-semibold">extraordinary beauty.</span>
          </h1>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-[420px]">

          {/* Back to Home */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
              Back to Home
            </Link>
          </div>

          {/* Logo */}
          <div className="mb-12">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src={travelinLogo} alt="Travolin" className="h-9 w-auto" />
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">Welcome back</h2>
            <p className="text-slate-500 text-base">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 border-l-4 border-red-500 bg-red-50 p-4 rounded-r-md">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                Username or Email
              </label>
              <input
                type="text"
                placeholder="Enter your email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Login;