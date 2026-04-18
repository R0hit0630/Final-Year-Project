// src/Pages/AgencyDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AgencySidebar from "../../components/AgencySidebar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Converts relative image paths to full URLs
const buildImageUrl = (imgPath) => {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API_BASE_URL}${imgPath}`;
};

export default function AgencyDashboard() {
  const API_BASE = API_BASE_URL;
  const getToken = () => localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  const [packages, setPackages] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [completingId, setCompletingId] = useState("");

  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/bookings/agency/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setStats([
          {
            label: "Total Bookings",
            value: data.stats.totalBookings.toString(),
            icon: "book_online",
          },
          {
            label: "Monthly Revenue",
            value: `रु ${data.stats.monthlyRevenue.toLocaleString()}`,
            icon: "payments",
          },
          {
            label: "Average Rating",
            value: data.stats.avgRating.toFixed(1),
            sub: "/ 5.0",
            stars: data.stats.avgRating,
            icon: "star",
          },
          {
            label: "Active Guides",
            value: data.stats.activeGuides.toString(),
            sub: "available",
            icon: "groups",
          },
        ]);

        setPackages(data.packages || []);
        setDepartures(data.departures || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompleteTrip = async (bookingId) => {
    if (!window.confirm("Mark this trip as completed?")) return;

    try {
      setCompletingId(bookingId);
      const token = getToken();
      await axios.put(`${API_BASE}/api/bookings/${bookingId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Trip completed!");
      window.location.reload(); // Refresh to update all stats
    } catch (err) {
      console.error(err);
      alert("Failed to complete trip");
    } finally {
      setCompletingId("");
    }
  };

  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const badgeForStatus = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "confirmed") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (s === "pending") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    if (s === "ongoing") return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  };

  const pkgStatusBadge = (status) => {
    if (status === "High Demand") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (status === "Steady") return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-800 border-yellow-500/20";
  };

  const StatCard = ({ item }) => (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-6xl" style={{ color: COLORS.primary }}>
          {item.icon}
        </span>
      </div>
      <p className="text-sm font-bold uppercase tracking-wider text-[#6b7280] mb-2">
        {item.label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#2d3b2a]">{item.value}</h3>
        {item.sub && <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>}
      </div>
      {item.stars != null && (
        <div className="mt-2 flex">
          {[1, 2, 3, 4, 5].map((i) => {
            const icon = item.stars >= i ? "star" : item.stars >= i - 0.5 ? "star_half" : "star";
            const muted = item.stars < i - 0.5;
            return (
              <span
                key={i}
                className={[
                  "material-symbols-outlined text-sm",
                  muted ? "text-gray-300" : "text-yellow-500",
                ].join(" ")}
              >
                {icon}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );

  const PackageCard = ({ p }) => (
    <div className="rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="h-48 overflow-hidden relative">
        {buildImageUrl(p.img) ? (
          <img
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            src={buildImageUrl(p.img)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-gray-300">landscape</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
          {p.days}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <h3 className="text-lg font-bold text-white">{p.title}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase font-bold text-[#6b7280]">Booking Status</span>
          <span
            className={[
              "text-xs font-bold px-2 py-1 rounded-full border",
              pkgStatusBadge(p.status),
            ].join(" ")}
          >
            {p.status}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full"
            style={{ width: `${p.pct}%`, backgroundColor: COLORS.primary }}
          />
        </div>

        <div className="flex justify-between text-xs mb-4">
          <span className="text-[#2d3b2a]">{p.pct}% Booked</span>
          <span className="text-[#6b7280]">Next: {p.next}</span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/agency/packages`}
            className="flex-1 py-2 rounded-lg bg-white hover:bg-gray-50 text-xs font-bold text-[#2d3b2a] border border-gray-200 transition-colors text-center"
          >
            View Package
          </Link>
          <Link
            to="/agency/bookings"
            className="flex-1 py-2 rounded-lg text-xs font-bold border transition-colors text-center"
            style={{
              color: COLORS.primary,
              backgroundColor: "rgba(25,120,229,0.08)",
              borderColor: "rgba(25,120,229,0.25)",
            }}
          >
            Manage Bookings
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]" style={paperTextureStyle}>
        {/* Sidebar */}
        <AgencySidebar />

        {/* Main */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 backdrop-blur-md shadow-sm lg:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: COLORS.primary }}>
                terrain
              </span>
              <span className="text-lg font-bold text-[#2d3b2a]">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#2d3b2a] tracking-tight">
                  Agency Dashboard
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Here's a live overview of your operations today.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/agency/add-package")}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 12px 30px rgba(25,120,229,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Package
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex w-full items-center justify-center p-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-600">
                <span className="material-symbols-outlined text-4xl block mb-2">error</span>
                {error}
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {stats.map((s) => (
                    <StatCard key={s.label} item={s} />
                  ))}
                </div>

                {/* Packages */}
                {packages.length > 0 && (
                  <div className="mb-10">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-xl font-bold text-[#2d3b2a]">
                        <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                          landscape
                        </span>
                        My Packages
                      </h2>
                      <Link
                        className="text-sm font-bold hover:underline"
                        style={{ color: COLORS.primary }}
                        to="/agency/packages"
                      >
                        View All Packages
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {packages.slice(0, 3).map((p) => (
                        <PackageCard key={p._id || p.title} p={p} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Group Departures */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        calendar_month
                      </span>
                      Upcoming Bookings
                    </h3>
                    <Link
                      to="/agency/bookings"
                      className="text-sm font-bold hover:underline"
                      style={{ color: COLORS.primary }}
                    >
                      View All
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Package</th>
                          <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Start Date</th>
                          <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Lead Guide</th>
                          <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Travelers</th>
                          <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Status</th>
                          <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-[#6b7280]">Action</th>
                        </tr>
                      </thead>

                      <tbody className="text-sm">
                        {departures.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-10 text-center text-[#6b7280]">
                              <span className="material-symbols-outlined block text-4xl text-gray-300 mb-2">calendar_month</span>
                              No upcoming bookings yet.
                            </td>
                          </tr>
                        ) : (
                          departures.map((r) => (
                            <tr
                              key={r._id || r.group}
                              className="group border-b border-gray-100 transition-colors hover:bg-gray-50"
                            >
                              <td className="py-4 font-medium text-[#2d3b2a]">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                    {buildImageUrl(packages.find((p) => p.title === r.pkg)?.img) ? (
                                      <img
                                        alt={r.pkg}
                                        className="h-full w-full object-cover"
                                        src={buildImageUrl(packages.find((p) => p.title === r.pkg)?.img)}
                                      />
                                    ) : (
                                      <span className="material-symbols-outlined text-gray-300">landscape</span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold">{r.pkg}</p>
                                    <p className="text-xs text-[#94a3b8]">{r.group}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 text-[#4b5563]">{r.date}</td>

                              <td className="py-4">
                                {r.guide ? (
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center ring-1 ring-gray-200 overflow-hidden">
                                      {r.guide.avatar ? (
                                        <img alt="Guide" className="h-full w-full object-cover" src={r.guide.avatar} />
                                      ) : (
                                        <span className="material-symbols-outlined text-sm text-gray-400">person</span>
                                      )}
                                    </div>
                                    <span className="text-[#4b5563]">{r.guide.name}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs italic text-[#94a3b8]">Unassigned</span>
                                )}
                              </td>

                              <td className="py-4 text-[#4b5563]">
                                {r.clients?.extra
                                  ? `${r.clients.extra.replace("+", "")} travelers`
                                  : "1 traveler"}
                              </td>

                              <td className="py-4">
                                <span
                                  className={[
                                    "rounded border px-2 py-1 text-xs font-bold",
                                    badgeForStatus(r.status),
                                  ].join(" ")}
                                >
                                  {r.status}
                                </span>
                              </td>

                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {["Confirmed", "Ongoing"].includes(r.status) && (
                                    <button
                                      onClick={() => handleCompleteTrip(r._id)}
                                      disabled={completingId === r._id}
                                      className="text-blue-600 hover:text-blue-800 transition-colors"
                                      title="Mark as Completed"
                                    >
                                      <span className="material-symbols-outlined text-sm">check_circle</span>
                                    </button>
                                  )}
                                  <Link
                                    to="/agency/bookings"
                                    className="text-[#94a3b8] hover:text-[#1978e5] transition-colors"
                                    aria-label="View booking"
                                  >
                                    <span className="material-symbols-outlined">edit_square</span>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-16 border-t border-[#e0e8dc] pb-8 pt-10 text-center">
              <p className="text-sm font-medium italic text-gray-400">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="mt-2 text-xs text-gray-300">© {new Date().getFullYear()} Travolin. Partner Agency Portal.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}