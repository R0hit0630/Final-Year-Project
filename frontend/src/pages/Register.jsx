import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api.js";
import bgImage from "../assets/bg.jpg";
import travelinLogo from "../assets/travolin-logo.png";

const Register = ({ setUser }) => {
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

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nationality: "",
    password: "",
    role: "user",
    agencyName: "",
    agencyAddress: "",
    agencyPhone: "",
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
      const payload = {
        username: formData.username,
        email: formData.email,
        nationality: formData.nationality,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "agency") {
        payload.agencyName = formData.agencyName;
        payload.agencyAddress = formData.agencyAddress;
        payload.agencyPhone = formData.agencyPhone;
      }

      const res = await axios.post(
        `${API_BASE}/api/auth/register`,
        payload
      );

      localStorage.setItem("token", res.data.token);

      const userObj = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role,
        agencyVerified: res.data.agencyVerified ?? null,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      if (setUser) setUser(userObj);

      if (res.data.role === "agency") {
        if (res.data.agencyVerified) {
          navigate("/agency");
        } else {
          navigate("/agency/pending");
        }
      } else if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/explore");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow";

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-800">
      
      {/* LEFT IMAGE PANEL */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden sticky top-0 h-screen">
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
            Join Travolin
          </p>
          <h1 className="text-5xl font-light leading-tight">
            Start your <br/>
            <span className="font-semibold">adventure today.</span>
          </h1>
        </div>
      </div>

      {/* RIGHT FORM PANEL (Scrollable) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white min-h-screen">
        <div className="w-full max-w-[500px] my-auto">
          
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
          <div className="mb-10">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src={travelinLogo} alt="Travolin" className="h-9 w-auto" />
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-3">Create an account</h2>
            <p className="text-slate-500 text-base">Enter your details to register as a Traveler or Agency.</p>
          </div>

          {error && (
            <div className="mb-6 border-l-4 border-red-500 bg-red-50 p-4 rounded-r-md">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Clean Role Switcher */}
          <div className="flex bg-slate-100 rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "user" })}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                formData.role === "user"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Traveler
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "agency" })}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                formData.role === "agency"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Agency
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="e.g. USA"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Agency Details */}
            {formData.role === "agency" && (
              <div className="mt-6 p-5 border border-slate-200 bg-slate-50 rounded-xl space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Agency Information</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 block">Agency Name</label>
                  <input
                    type="text"
                    name="agencyName"
                    placeholder="Acme Travel Co."
                    value={formData.agencyName}
                    onChange={handleChange}
                    className={inputClass}
                    required={formData.role === "agency"}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 block">Phone Number</label>
                  <input
                    type="text"
                    name="agencyPhone"
                    placeholder="+977 9800000000"
                    value={formData.agencyPhone}
                    onChange={handleChange}
                    className={inputClass}
                    required={formData.role === "agency"}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 block">Business Address</label>
                  <input
                    type="text"
                    name="agencyAddress"
                    placeholder="123 Kathmandu, Nepal"
                    value={formData.agencyAddress}
                    onChange={handleChange}
                    className={inputClass}
                    required={formData.role === "agency"}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 mt-6"
            >
              {loading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : formData.role === "agency" ? (
                "Register Agency"
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;