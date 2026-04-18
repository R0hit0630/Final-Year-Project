// src/Pages/AgencyGuideProfile.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AgencySidebar from "../../components/AgencySidebar";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("token");

export default function AgencyGuideProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };



  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const token = getToken();
        if (!token) { navigate("/login"); return; }

        const res = await axios.get(`${API_BASE}/api/guides/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuide(res.data);
      } catch (err) {
        console.error("fetchGuide error:", err);
        setError(err?.response?.data?.message || "Failed to load guide profile.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGuide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${guide?.fullName} from your team? This cannot be undone.`)) return;
    try {
      setDeleting(true);
      const token = getToken();
      await axios.delete(`${API_BASE}/api/guides/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/agency/guides");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove guide.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]">
        <AgencySidebar />

        {/* Main */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile bar */}
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: COLORS.primary }}>terrain</span>
              <span className="text-lg font-bold text-[#2d3b2a]">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            {/* Back + Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/agency/guides")}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#4b5563] transition hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Guides
                  </button>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#2d3b2a]">Guide Profile</h1>
                <p className="mt-1 text-[#6b7280]">View guide information, expertise, and contact details.</p>
              </div>

              {guide && (
                <div className="flex gap-3">
                  <Link
                    to={`/agency/guides/${id}/edit`}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                  >
                    Edit Guide
                  </Link>
                  <Link
                    to="/agency/bookings"
                    className="rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all"
                    style={{ backgroundColor: COLORS.primary, boxShadow: "0 12px 30px rgba(25,120,229,0.18)" }}
                  >
                    Manage Bookings
                  </Link>
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center p-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-8 text-center">
                <span className="material-symbols-outlined block text-4xl text-red-400 mb-2">error</span>
                <p className="text-red-600 font-semibold">{error}</p>
                <button onClick={() => navigate("/agency/guides")} className="mt-4 text-sm text-blue-600 underline">
                  Go back to Guides
                </button>
              </div>
            )}

            {/* Guide Profile */}
            {!loading && guide && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Left / Main */}
                <div className="space-y-6 xl:col-span-2">
                  {/* Hero card */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                      <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 flex items-center justify-center">
                        {guide.photo ? (
                          <img src={guide.photo} alt={guide.fullName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-5xl text-gray-300">person</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-[#2d3b2a]">{guide.fullName}</h2>
                          <span className={[
                            "rounded-full px-2 py-0.5 text-xs font-bold border",
                            guide.isActive
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          ].join(" ")}>
                            {guide.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#6b7280]">{guide.region}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {guide.experience && (
                            <span className="rounded-full border border-[#1978e5]/20 bg-[#1978e5]/10 px-3 py-1.5 text-xs font-semibold text-[#1978e5]">
                              {guide.experience} Experience
                            </span>
                          )}
                          {guide.specialization && (
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#4b5563]">
                              {guide.specialization}
                            </span>
                          )}
                          {guide.averageRating > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                              <span className="material-symbols-outlined text-sm leading-none">star</span>
                              {guide.averageRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>badge</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Professional Information</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {[
                        { label: "Certification", value: guide.certification },
                        { label: "Languages", value: guide.languages },
                        { label: "Specialization", value: guide.specialization },
                        { label: "Experience", value: guide.experience },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="mb-1 text-sm font-semibold text-[#374151]">{label}</p>
                          <p className="text-sm text-[#6b7280]">{value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  {guide.skills?.length > 0 && (
                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                      <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>psychology</span>
                        <h2 className="text-lg font-bold text-[#2d3b2a]">Skills & Expertise</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {guide.skills.map((skill) => (
                          <span key={skill} className="rounded-full border border-[#1978e5]/20 bg-[#1978e5]/10 px-3 py-1.5 text-xs font-semibold text-[#1978e5]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {guide.bio && (
                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                      <div className="mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>description</span>
                        <h2 className="text-lg font-bold text-[#2d3b2a]">Guide Bio</h2>
                      </div>
                      <p className="text-sm leading-7 text-[#4b5563]">{guide.bio}</p>
                    </div>
                  )}

                  {/* Leave Dates */}
                  {(guide.leaveStartDate || guide.leaveEndDate) && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">event_busy</span>
                        <h2 className="text-lg font-bold text-[#2d3b2a]">Leave Period</h2>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <p className="font-semibold text-[#374151]">From</p>
                          <p className="text-[#6b7280]">{new Date(guide.leaveStartDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#374151]">To</p>
                          <p className="text-[#6b7280]">{new Date(guide.leaveEndDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                  {/* Contact */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>contact_mail</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Contact Details</h2>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="mb-1 font-semibold text-[#374151]">Email</p>
                        <p className="text-[#6b7280]">{guide.email}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-[#374151]">Phone</p>
                        <p className="text-[#6b7280]">{guide.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-[#374151]">Region</p>
                        <p className="text-[#6b7280]">{guide.region}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl border border-[#1978e5]/10 bg-[#1978e5]/5 p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">Guide Summary</h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Name", value: guide.fullName },
                        { label: "Experience", value: guide.experience || "—" },
                        { label: "Skills", value: `${guide.skills?.length || 0} listed` },
                        { label: "Reviews", value: guide.numReviews || 0 },
                        { label: "Rating", value: guide.averageRating > 0 ? `${guide.averageRating.toFixed(1)} / 5.0` : "No ratings yet" },
                        { label: "Status", value: guide.isActive ? "Active" : "Inactive" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-[#6b7280]">{label}</span>
                          <span className="font-semibold text-[#2d3b2a]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>task_alt</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Quick Actions</h2>
                    </div>
                    <div className="space-y-3">
                      <Link
                        to={`/agency/guides/${id}/edit`}
                        className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                      >
                        Edit Guide Details
                      </Link>
                      <Link
                        to="/agency/bookings"
                        className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                      >
                        View Assignments
                      </Link>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting ? "Removing..." : "Remove Guide"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}