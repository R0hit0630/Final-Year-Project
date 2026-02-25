import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/bg.jpg";

const Register = ({ setUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nationality: "",
    password: "",
    role: "user", // ✅ default
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
      // ✅ build payload
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

      // ✅ store token + user (because backend returns token on register)
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

      // ✅ redirect after register
      if (res.data.role === "agency") {
          if (res.data.agencyVerified) {
            navigate("/AgencyDashboard");   // AgencyDashboard
          } else {
            navigate("/agency/AgencyPending"); // AgencyPending
          }
        } else if (res.data.role === "admin") {
          navigate("/adddestination"); // your admin landing page
        } else {
          navigate("/userhome"); // normal user
        }
    } catch (err) {
      console.log("REGISTER ERROR RESPONSE:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
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
              Create your account
            </h1>
            <p className="text-white/80 mt-3 text-sm leading-relaxed">
              Book trips, manage packages, and access your dashboard in one
              place.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT REGISTER */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Register
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose account type and fill your details
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ✅ Role selector */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                >
                  <option value="user">User</option>
                  <option value="agency">Agency</option>
                </select>

                {/* small helper */}
                <div className="mt-2 flex gap-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      formData.role === "user"
                        ? "bg-[#274c77]/10 border-[#274c77]/20 text-[#274c77]"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                  >
                    User
                  </span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      formData.role === "agency"
                        ? "bg-[#274c77]/10 border-[#274c77]/20 text-[#274c77]"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                  >
                    Agency
                  </span>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="johnstark"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="abc12@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                  required
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="Country"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                  required
                />
              </div>

              {/* ✅ Agency extra fields */}
              {formData.role === "agency" && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">
                      Agency Details
                    </p>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-[#274c77]/10 text-[#274c77] border border-[#274c77]/20">
                      Required
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      name="agencyName"
                      placeholder="Mountain Tours Pvt Ltd"
                      value={formData.agencyName}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Agency Address
                    </label>
                    <input
                      type="text"
                      name="agencyAddress"
                      placeholder="Pokhara, Nepal"
                      value={formData.agencyAddress}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Agency Phone
                      </label>
                      <input
                        type="text"
                        name="agencyPhone"
                        placeholder="+977 98XXXXXXXX"
                        value={formData.agencyPhone}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Logo URL (optional)
                      </label>
                      <input
                        type="text"
                        name="agencyLogo"
                        placeholder="https://..."
                        value={formData.agencyLogo}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Note: Agency accounts need admin approval before you can
                      access the agency dashboard.
                    </p>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="************"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#274c77]/30 focus:border-[#274c77]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#274c77] text-white font-semibold hover:opacity-95 transition disabled:opacity-50 shadow-md shadow-[#274c77]/20"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Already have an account?
                  <span
                    onClick={() => navigate("/login")}
                    className="text-[#274c77] font-semibold cursor-pointer ml-1 hover:underline"
                  >
                    Login
                  </span>
                </p>
              </div>
            </form>
          </div>

          {/* small footer */}
          <p className="text-center text-[11px] text-gray-400 mt-4">
            By registering, you agree to our basic terms & privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;