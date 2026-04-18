import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
    agencyLogo: "",
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
        payload.agencyLogo = formData.agencyLogo;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
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
      console.log("REGISTER ERROR RESPONSE:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1.5 px-4 py-3 rounded-xl bg-[#fcfbf8] border border-gray-200 text-sm outline-none focus:border-[#197fe6]/50 focus:ring-2 focus:ring-[#197fe6]/10 transition";

  return (
    <div className="min-h-screen w-full flex bg-[#0f1923]">
      {/* LEFT IMAGE */}
      <div
        className="hidden lg:flex w-[45%] relative bg-cover bg-center"
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
              Join Us
            </p>
            <h1 className="text-white text-3xl font-bold leading-tight">
              Start your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                adventure today
              </span>
            </h1>
            <p className="text-white/70 mt-4 text-sm leading-relaxed">
              Create your account to book trips, manage packages, and access your dashboard in one place.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT REGISTER */}
      <div className="w-full lg:w-[55%] flex items-center justify-center px-4 py-10 bg-[#f6f7f8] overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center">
              <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-black/5 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#2d3b2a]">
                Create Account
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Choose your account type and fill in your details
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Type */}
              <div>
                <label className="text-sm font-semibold text-[#2d3b2a]">
                  Account Type
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "user" })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition ${
                      formData.role === "user"
                        ? "bg-[#197fe6]/10 border-[#197fe6]/30 text-[#197fe6]"
                        : "bg-[#fcfbf8] border-gray-200 text-[#6b7280] hover:border-gray-300"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">
                      person
                    </span>
                    Traveler
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "agency" })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition ${
                      formData.role === "agency"
                        ? "bg-[#197fe6]/10 border-[#197fe6]/30 text-[#197fe6]"
                        : "bg-[#fcfbf8] border-gray-200 text-[#6b7280] hover:border-gray-300"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">
                      business
                    </span>
                    Agency
                  </button>
                </div>
              </div>

              {/* Username / Email / Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#2d3b2a]">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="johnstark"
                    value={formData.username}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#2d3b2a]">
                    Email
                  </label>
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

              <div>
                <label className="text-sm font-semibold text-[#2d3b2a]">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Nepal"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              {/* Agency Details */}
              {formData.role === "agency" && (
                <div className="rounded-2xl border border-[#197fe6]/15 bg-[#197fe6]/[0.03] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#2d3b2a]">
                      Agency Details
                    </p>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#197fe6]/10 text-[#197fe6] border border-[#197fe6]/20 font-bold">
                      Required
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#2d3b2a]">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      name="agencyName"
                      placeholder="Mountain Tours Pvt Ltd"
                      value={formData.agencyName}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#2d3b2a]">
                      Agency Address
                    </label>
                    <input
                      type="text"
                      name="agencyAddress"
                      placeholder="Pokhara, Nepal"
                      value={formData.agencyAddress}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#2d3b2a]">
                        Agency Phone
                      </label>
                      <input
                        type="text"
                        name="agencyPhone"
                        placeholder="+977 98XXXXXXXX"
                        value={formData.agencyPhone}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2d3b2a]">
                        Logo URL (optional)
                      </label>
                      <input
                        type="text"
                        name="agencyLogo"
                        placeholder="https://..."
                        value={formData.agencyLogo}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <p className="text-xs text-amber-800 leading-relaxed flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      Agency accounts require admin approval before dashboard access.
                    </p>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-[#2d3b2a]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#197fe6] hover:bg-[#1570d4] text-white font-bold transition disabled:opacity-50 shadow-lg shadow-[#197fe6]/20 text-sm"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-[#6b7280]">
                  Already have an account?
                  <span
                    onClick={() => navigate("/login")}
                    className="text-[#197fe6] font-semibold cursor-pointer ml-1 hover:underline"
                  >
                    Log in
                  </span>
                </p>
              </div>
            </form>
          </div>

          <p className="text-center text-[11px] text-[#94a3b8] mt-4">
            By registering, you agree to our terms & privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;