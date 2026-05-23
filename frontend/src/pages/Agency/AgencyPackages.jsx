import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config/api.js";

export default function AgencyPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };



  // [FLOW FEATURE: AGENCY PACKAGES - FETCH]
  // Loads all packages owned by this agency and maps them into display-ready card data
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");

        // Step 1: GET all packages scoped to the logged-in agency (/api/packages/mine)
        const res = await axios.get(`${API_BASE}/api/packages/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Step 2: Normalize response — API may return array directly or wrapped in object
        const rawPackages = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.packages)
          ? res.data.packages
          : [];

        // Step 3: Map raw DB fields into a flat object for rendering PackageCards
        const mappedPackages = rawPackages.map((p) => ({
          id: p._id,
          title: p.title || "Untitled Package",
          days: `${p.days || 0} Days`,
          location: p.region || "Unknown Region",
          price: `रु ${Number(p.price || 0).toLocaleString()}`,
          // Use first image if available, prefix with API_BASE if it's a relative path
          img:
            p.images && p.images.length > 0
              ? p.images[0].startsWith("http")
                ? p.images[0]
                : `${API_BASE}${p.images[0]}`
              : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
          status: p.isActive ? "Active" : "Inactive",
          pct: 60,
          bookings: 0,
          rating: 4.5,
          difficulty: p.difficulty || "Moderate",
          type: p.type || "Package",
        }));

        setPackages(mappedPackages);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // [FLOW FEATURE: AGENCY PACKAGES - DELETE]
  // Soft-deletes a package via the API, then filters it out of local state to update the UI
  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Package deleted successfully.");
      // Remove the deleted package from local state immediately (optimistic update)
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting package:", err);
      alert(err.response?.data?.message || "Failed to delete package.");
    }
  };


  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const pkgStatusBadge = (status) => {
    if (status === "Active")
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (status === "Inactive")
      return "bg-red-500/10 text-red-700 border-red-500/20";
    return "bg-blue-500/10 text-blue-700 border-blue-500/20";
  };

  // [FLOW FEATURE: AGENCY PACKAGES - SUMMARY STATS]
  // Derives header stat cards from the current packages list: totals, bookings, rating, and revenue potential
  const summaryStats = useMemo(
    () => [
      {
        label: "Total Packages",
        value: packages.length.toString(),
        sub: `${packages.filter((p) => p.status === "Active").length} Active`,
        icon: "hiking",
      },
      {
        label: "Total Bookings",
        value: packages.reduce((sum, p) => sum + (p.bookings || 0), 0).toString(),
        sub: "All Packages",
        icon: "book_online",
      },
      {
        label: "Avg. Rating",
        value: packages.length
          ? (
              packages.reduce((sum, p) => sum + (Number(p.rating) || 0), 0) /
              packages.length
            ).toFixed(1)
          : "0.0",
        sub: "/ 5.0",
        icon: "star",
      },
      {
        label: "Revenue Potential",
        // Strip non-numeric chars from the price string before summing
        value: `रु ${packages
          .reduce((sum, p) => {
            const amount = Number(String(p.price).replace(/[^0-9.]/g, "")) || 0;
            return sum + amount;
          }, 0)
          .toLocaleString()}`,
        sub: "Package Total",
        icon: "payments",
      },
    ],
    [packages]
  );

  const StatCard = ({ item }) => (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <span
          className="material-symbols-outlined text-6xl"
          style={{ color: COLORS.primary }}
        >
          {item.icon}
        </span>
      </div>
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#6b7280]">
        {item.label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#2d3b2a]">{item.value}</h3>
        <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>
      </div>
    </div>
  );

  const PackageCard = ({ p }) => (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative h-52 overflow-hidden">
        <img
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          src={p.img}
        />

        <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {p.days}
        </div>

        <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-white/20 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {p.type}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {p.location}
          </p>
          <h3 className="text-lg font-bold text-white">{p.title}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#6b7280]">
            Package Status
          </span>
          <span
            className={[
              "rounded-full border px-2 py-1 text-xs font-bold",
              pkgStatusBadge(p.status),
            ].join(" ")}
          >
            {p.status}
          </span>
        </div>

        <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full"
            style={{ width: `${p.pct}%`, backgroundColor: COLORS.primary }}
          />
        </div>

        <div className="mb-4 flex justify-between text-xs">
          <span className="text-[#2d3b2a]">{p.pct}% Full</span>
          <span className="text-[#6b7280]">Difficulty: {p.difficulty}</span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-[#f8fafc] p-3">
          <div>
            <p className="text-[11px] uppercase text-[#94a3b8]">Price</p>
            <p className="text-sm font-bold text-[#2d3b2a]">{p.price}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#94a3b8]">Bookings</p>
            <p className="text-sm font-bold text-[#2d3b2a]">{p.bookings}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#94a3b8]">Rating</p>
            <p className="text-sm font-bold text-[#2d3b2a]">{p.rating} ★</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-[#2d3b2a] transition-colors hover:bg-gray-50"
              type="button"
              onClick={() => navigate(`/agency/packages/${p.id}`)}
            >
              Edit Details
            </button>

            <button
              className="flex-1 rounded-lg border py-2 text-xs font-bold transition-colors"
              style={{
                color: COLORS.primary,
                backgroundColor: "rgba(25,120,229,0.08)",
                borderColor: "rgba(25,120,229,0.25)",
              }}
              type="button"
              onClick={() => navigate(`/agency/packages/${p.id}`)}
            >
              View Package
            </button>
          </div>

          <button
            className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
            type="button"
            onClick={() => handleDeletePackage(p.id)}
          >
            Delete Package
          </button>
        </div>
      </div>
    </div>
  );

  return (
            <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: COLORS.primary }}
              >
                terrain
              </span>
              <span className="text-lg font-bold text-[#2d3b2a]">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="tracking-tight text-3xl font-bold text-[#2d3b2a]">
                  My Packages
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Manage all your travel packages with the same agency dashboard style.
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

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {summaryStats.map((s) => (
                <StatCard key={s.label} item={s} />
              ))}
            </div>

            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#2d3b2a]">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: COLORS.primary }}
                  >
                    landscape
                  </span>
                  Package Collection
                </h2>

                <button
                  className="text-sm font-bold hover:underline"
                  style={{ color: COLORS.primary }}
                  type="button"
                >
                  View Analytics
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
                  <p className="text-sm font-medium text-[#6b7280]">Loading packages...</p>
                </div>
              ) : packages.length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
                  <span
                    className="material-symbols-outlined mb-3 text-5xl"
                    style={{ color: COLORS.primary }}
                  >
                    hiking
                  </span>
                  <h3 className="text-lg font-bold text-[#2d3b2a]">No packages found</h3>
                  <p className="mt-2 text-sm text-[#6b7280]">
                    Start by creating your first travel package.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/agency/add-package")}
                    className="mt-5 rounded-lg px-4 py-2 text-sm font-bold text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Add Package
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {packages.map((p) => (
                    <PackageCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-16 border-t border-[#e0e8dc] pb-8 pt-10 text-center">
              <p className="text-sm font-medium italic text-gray-400">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="mt-2 text-xs text-gray-300">
                © 2026 Travolin. Partner Agency Portal.
              </p>
            </div>
          </div>
        </main>
  );
}