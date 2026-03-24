import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../../assets/default-avatar.jpg";

export default function MyTrips() {
  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
    border: "#e0e8dc",
    muted: "#6b7280",
    muted2: "#94a3b8",
  };

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [showPastBookings, setShowPastBookings] = useState(false);

  const [userData, setUserData] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const navItems = useMemo(
    () => [
      { label: "My Trips", icon: "map", to: "/trips", active: true },
      { label: "Explore Nepal", icon: "explore", to: "/Explore" },
      { label: "Saved Destinations", icon: "favorite", to: "/saved" },
      { label: "Profile", icon: "person", to: "/profile" },
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Please log in to view your trips.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [userRes, tripsRes] = await Promise.all([
          axios.get(`${apiBase}/api/users/me`, config),
          axios.get(`${apiBase}/api/bookings/my-trips`, config),
        ]);

        setUserData(userRes.data || null);
        setActiveTrip(tripsRes.data?.activeTrip || null);
        setPastTrips(tripsRes.data?.pastTrips || []);
      } catch (err) {
        console.error("Failed to load trips:", err);
        setError(
          err?.response?.data?.message || "Failed to load trip details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBase, token]);

  const fullName =
    userData?.fullName ||
    userData?.nameShort ||
    userData?.username ||
    "User";

  const avatar = userData?.avatar || "";
  const role = userData?.role || "user";

  const activePackage = activeTrip?.package || null;

  const heroImage = activePackage?.images?.[0]
    ? `${apiBase}${activePackage.images[0]}`
    : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80";

  const itinerary = useMemo(() => {
    const items = activePackage?.itinerary || [];

    if (!items.length) return [];

    return items.map((item, index) => ({
      day: String(index + 1).padStart(2, "0"),
      title: item.title || `Day ${index + 1}`,
      subtitle: item.details || "Trip activity details",
      altitude: activePackage?.region || "Nepal",
      details: item.details
        ? item.details
            .split(",")
            .map((text) => text.trim())
            .filter(Boolean)
        : ["Guided activity", "Accommodation included", "Daily support"],
      active: index === 0,
    }));
  }, [activePackage]);

  const checklist = useMemo(
    () => [
      { label: "Submit Insurance Documents", checked: true },
      { label: "Gear Check Completed", checked: true },
      { label: "Physical Medical Report", checked: false },
      { label: "Flight Confirmation", checked: false },
    ],
    []
  );

  const checklistProgress = useMemo(() => {
    const completed = checklist.filter((item) => item.checked).length;
    return Math.round((completed / checklist.length) * 100);
  }, [checklist]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "TBD";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "TBD";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (start, end) => {
    if (!start && !end) return "TBD";
    if (start && !end) return formatDate(start);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getStatusBadgeClasses = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "confirmed") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (value === "completed") {
      return "bg-blue-100 text-blue-700";
    }
    if (value === "pending") {
      return "bg-amber-100 text-amber-700";
    }
    if (value === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const displayStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm border border-[#e0e8dc]">
          <p className="text-sm font-semibold text-[#2d3b2a]">
            Loading your trips...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-600">Unable to load trips</h2>
          <p className="mt-2 text-sm text-[#6b7280]">{error}</p>
          <Link
            to="/Explore"
            className="mt-5 inline-flex rounded-lg bg-[#1978e5] px-4 py-2 text-sm font-semibold text-white"
          >
            Explore Nepal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
      <div className="flex h-full w-full bg-[#fcfbf8]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-primary/20">
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src={avatar ? `${apiBase}${avatar}` : defaultAvatar}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#2d3b2a] text-base font-bold leading-tight">
                  {(fullName || "User").split(" ").slice(0, 2).join(" ")}
                </h1>
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: COLORS.primary }}
                >
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={[
                    "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    item.active ? "bg-primary/10" : "hover:bg-[#f0f4ee]",
                  ].join(" ")}
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className={[
                      "material-symbols-outlined transition-colors",
                      item.active
                        ? "text-primary"
                        : "text-[#6b7280] group-hover:text-primary",
                    ].join(" ")}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={[
                      "text-sm",
                      item.active
                        ? "font-semibold text-[#2d3b2a]"
                        : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <Link
                to="/logout"
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm"
              >
                <span className="material-symbols-outlined text-[#6b7280] transition-colors group-hover:text-red-500">
                  logout
                </span>
                <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">
                  Log Out
                </span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f6f7f8]">
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 px-8 py-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-primary/10 md:flex">
                  <span className="material-symbols-outlined text-primary">
                    map
                  </span>
                </div>
                <div className="leading-tight">
                  <h1 className="text-lg font-extrabold text-[#2d3b2a]">
                    My Trips
                  </h1>
                  <p className="text-xs text-[#6b7280]">
                    View your itinerary, trip details, and preparation progress
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="relative rounded-full p-2 text-[#6b7280] transition-colors hover:bg-primary/10 hover:text-primary"
                  type="button"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                </button>
                <div className="h-8 w-px bg-[#e0e8dc]" />
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: COLORS.secondary }}
                  type="button"
                  onClick={() => setShowPastBookings(!showPastBookings)}
                >
                  {showPastBookings ? "Hide Past Bookings" : "Past Bookings"}
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-8 py-8">
            {!activeTrip ? (
              <div className="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    travel_explore
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#2d3b2a]">
                  No active trip yet
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-[#6b7280]">
                  You don’t have any current or upcoming trip right now. Explore
                  packages and book your next adventure in Nepal.
                </p>
                <Link
                  to="/Explore"
                  className="mt-6 inline-flex rounded-xl bg-[#1978e5] px-5 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Explore Nepal
                </Link>
              </div>
            ) : (
              <>
                {/* Hero Card */}
                <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
                  <div className="relative h-[300px] w-full">
                    <img
                      src={heroImage}
                      alt={activePackage?.title || "Trip"}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${getStatusBadgeClasses(
                            activeTrip.status
                          )}`}
                        >
                          {displayStatus(activeTrip.status)}
                        </span>
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#2d3b2a]">
                          Difficulty: {activePackage?.difficulty || "Moderate"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                            {activePackage?.title || "Your Trip"}
                          </h2>
                          <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
                            {activePackage?.description ||
                              `Get ready for your ${activePackage?.region || "Nepal"} adventure and manage your entire journey in one place.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top summary cards */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase text-[#6b7280]">
                          Travel Dates
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-[#2d3b2a]">
                          {formatDateRange(activeTrip.startDate, activeTrip.endDate)}
                        </h3>
                      </div>
                      <div className="rounded-xl bg-primary/10 p-3">
                        <span className="material-symbols-outlined text-primary">
                          calendar_month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase text-[#6b7280]">
                          Duration
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-[#2d3b2a]">
                          {activePackage?.days || 0} Days
                        </h3>
                      </div>
                      <div className="rounded-xl bg-primary/10 p-3">
                        <span className="material-symbols-outlined text-primary">
                          schedule
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase text-[#6b7280]">
                          Booking Status
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-emerald-600">
                          {displayStatus(activeTrip.status)}
                        </h3>
                      </div>
                      <div className="rounded-xl bg-emerald-50 p-3">
                        <span className="material-symbols-outlined text-emerald-600">
                          verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Past Bookings */}
            {showPastBookings && (
              <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                    <span className="material-symbols-outlined text-[#1978e5]">
                      history
                    </span>
                    Past Bookings
                  </h3>
                  <span className="text-sm font-medium text-[#6b7280]">
                    {pastTrips.length} completed trips
                  </span>
                </div>

                {!pastTrips.length ? (
                  <div className="rounded-2xl border border-dashed border-[#d9e2ec] bg-[#fcfbf8] p-8 text-center">
                    <p className="text-sm text-[#6b7280]">
                      No past bookings found yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {pastTrips.map((trip) => {
                      const pkg = trip.package || {};
                      const image = pkg?.images?.[0]
                        ? `${apiBase}${pkg.images[0]}`
                        : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

                      return (
                        <div
                          key={trip._id}
                          className="overflow-hidden rounded-2xl border border-[#eef2f0] bg-[#fcfbf8] transition hover:-translate-y-1 hover:shadow-md"
                        >
                          <img
                            src={image}
                            alt={pkg?.title || "Trip"}
                            className="h-44 w-full object-cover"
                          />

                          <div className="p-5">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <h4 className="text-base font-bold text-[#2d3b2a]">
                                {pkg?.title || "Trip"}
                              </h4>
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${getStatusBadgeClasses(
                                  trip.status || "completed"
                                )}`}
                              >
                                {displayStatus(trip.status || "completed")}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm text-[#6b7280]">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#1978e5]">
                                  calendar_month
                                </span>
                                <span>
                                  {formatDateRange(trip.startDate, trip.endDate)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-[#1978e5]">
                                  schedule
                                </span>
                                <span>{pkg?.days || 0} Days</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="mt-4 w-full rounded-xl border border-[#e0e8dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b5563] transition hover:border-primary hover:bg-primary/5"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Main grid */}
            {activeTrip && (
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left */}
                <div className="lg:col-span-8">
                  <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-bold">
                        <span className="material-symbols-outlined text-[#1978e5]">
                          timeline
                        </span>
                        Trip Itinerary
                      </h3>

                      <button
                        type="button"
                        className="rounded-lg border border-[#e0e8dc] bg-white px-4 py-2 text-sm font-semibold text-[#4b5563] transition hover:border-primary hover:bg-primary/5"
                      >
                        View Full Plan
                      </button>
                    </div>

                    {!itinerary.length ? (
                      <div className="rounded-2xl border border-dashed border-[#d9e2ec] bg-[#fcfbf8] p-8 text-center">
                        <p className="text-sm text-[#6b7280]">
                          No itinerary added for this package yet.
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-5 top-0 h-full w-[2px] bg-[#e8eef6]" />

                        <div className="space-y-6">
                          {itinerary.map((item) => (
                            <div key={item.day} className="relative pl-14">
                              <div
                                className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold ${
                                  item.active
                                    ? "border-[#1978e5] bg-[#1978e5] text-white"
                                    : "border-[#d9e2ec] bg-white text-[#6b7280]"
                                }`}
                              >
                                {item.day}
                              </div>

                              <div className="rounded-2xl border border-black/5 bg-[#fcfbf8] p-5">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <h4 className="text-base font-bold text-[#2d3b2a]">
                                      {item.title}
                                    </h4>
                                    <p className="mt-1 text-sm text-[#6b7280]">
                                      {item.subtitle}
                                    </p>
                                  </div>

                                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                    {item.altitude}
                                  </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {item.details.map((detail, idx) => (
                                    <span
                                      key={`${item.day}-${idx}`}
                                      className="rounded-full border border-[#e0e8dc] bg-white px-3 py-1 text-xs font-medium text-[#4b5563]"
                                    >
                                      {detail}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                  {/* Guide */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-bold">
                      <span className="material-symbols-outlined text-[#1978e5]">
                        hiking
                      </span>
                      Lead Guide
                    </h3>

                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                        alt="Guide"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-[#2d3b2a]">Mingma Sherpa</h4>
                        <p className="text-sm text-[#6b7280]">
                          Certified Himalayan Guide
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f3f6f1] p-3 text-center">
                        <p className="text-lg font-bold text-[#2d3b2a]">12</p>
                        <p className="text-[11px] uppercase text-[#6b7280]">
                          Summits
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#f3f6f1] p-3 text-center">
                        <p className="text-lg font-bold text-[#2d3b2a]">15 yrs</p>
                        <p className="text-[11px] uppercase text-[#6b7280]">
                          Experience
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-95"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      Message Guide
                    </button>
                  </div>

                  {/* Weather */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-bold">
                        <span className="material-symbols-outlined text-[#1978e5]">
                          partly_cloudy_day
                        </span>
                        Live Weather
                      </h3>
                      <span className="text-sm font-semibold text-[#6b7280]">
                        {activePackage?.region || "Namche"}
                      </span>
                    </div>

                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-extrabold text-[#2d3b2a]">
                        -2°
                      </span>
                      <span className="mb-1 text-sm text-[#6b7280]">C</span>
                    </div>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Feels Like</span>
                        <span className="font-semibold text-[#2d3b2a]">-5°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Wind</span>
                        <span className="font-semibold text-[#2d3b2a]">
                          12 km/h NW
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Humidity</span>
                        <span className="font-semibold text-[#2d3b2a]">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Visibility</span>
                        <span className="font-semibold text-[#2d3b2a]">10 km</span>
                      </div>
                    </div>
                  </div>

                  {/* Preparation */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-bold">
                        <span className="material-symbols-outlined text-[#1978e5]">
                          checklist
                        </span>
                        Preparation
                      </h3>
                      <span className="text-xs font-bold text-primary">
                        {checklistProgress}% Ready
                      </span>
                    </div>

                    <div className="mb-6 h-2 w-full rounded-full bg-[#eaf0ec]">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${checklistProgress}%`,
                          backgroundColor: COLORS.primary,
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      {checklist.map((item) => (
                        <label
                          key={item.label}
                          className="flex items-center gap-3 rounded-xl border border-[#eef2f0] bg-[#fcfbf8] p-3"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            readOnly
                            className="h-4 w-4 accent-[#1978e5]"
                          />
                          <span
                            className={`text-sm ${
                              item.checked
                                ? "text-[#94a3b8] line-through"
                                : "text-[#2d3b2a]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="mt-4 w-full rounded-lg border border-[#e0e8dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b5563] transition hover:border-primary hover:bg-primary/5"
                    >
                      View Full Checklist
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-auto border-t border-[#e0e8dc] bg-white/50 px-8 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-[#94a3b8]">
                © 2023 Travolin. All adventures curated with ❤️ in Nepal.
              </p>
              <div className="flex items-center gap-6">
                <a
                  className="text-xs font-semibold text-[#6b7280] transition-colors hover:text-primary"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] transition-colors hover:text-primary"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] transition-colors hover:text-primary"
                  href="#"
                >
                  Help Center
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}