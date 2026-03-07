import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  const avatar = "";
  const fullName = "Rohit";
  const role = "user";

  const [showPastBookings, setShowPastBookings] = useState(false);

  const navItems = useMemo(
    () => [
      { label: "My Trips", icon: "map", to: "/trips", active: true },
      { label: "Explore Nepal", icon: "explore", to: "/Explore" },
      { label: "Saved Destinations", icon: "favorite", to: "/saved" },
      { label: "Profile", icon: "person", to: "/profile" },
    ],
    []
  );

  const itinerary = useMemo(
    () => [
      {
        day: "01",
        title: "Arrival in Kathmandu",
        subtitle: "Transfer to hotel & welcome dinner",
        altitude: "1400m",
        details: ["Hotel Check-in", "Dinner Included", "Trip Briefing"],
        active: true,
      },
      {
        day: "02",
        title: "Fly to Lukla & Trek to Phakding",
        subtitle: "Scenic mountain flight and short trek",
        altitude: "2610m",
        details: ["8 km Distance", "3-4 hrs Trek", "Tea House Stay"],
      },
      {
        day: "03",
        title: "Trek to Namche Bazaar",
        subtitle: "Gateway to Everest region",
        altitude: "3440m",
        details: ["11 km Distance", "5-6 hrs Trek", "Steep Climb"],
      },
      {
        day: "04",
        title: "Acclimatization Day",
        subtitle: "Short hike to Everest View Hotel",
        altitude: "Rest Day",
        details: ["Panoramic Views", "Rest & Recovery", "Altitude Adjustment"],
      },
    ],
    []
  );

  const checklist = useMemo(
    () => [
      { label: "Submit Insurance Documents", checked: true },
      { label: "Gear Check Completed", checked: true },
      { label: "Physical Medical Report", checked: false },
      { label: "Flight Confirmation", checked: false },
    ],
    []
  );

  const pastBookings = useMemo(
    () => [
      {
        id: 1,
        title: "Annapurna Base Camp Trek",
        dates: "Sep 02 - Sep 10, 2025",
        duration: "9 Days",
        status: "Completed",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 2,
        title: "Pokhara Adventure Tour",
        dates: "Jun 15 - Jun 19, 2025",
        duration: "5 Days",
        status: "Completed",
        image:
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 3,
        title: "Chitwan Jungle Safari",
        dates: "Mar 10 - Mar 13, 2025",
        duration: "4 Days",
        status: "Completed",
        image:
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    []
  );

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
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[#6b7280] group-hover:text-red-500 transition-colors">
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
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-md px-8 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
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
                  className="relative rounded-full p-2 text-[#6b7280] hover:bg-primary/10 hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
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
            {/* Hero Card */}
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="relative h-[300px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
                  alt="Everest Base Camp Trek"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute left-0 right-0 bottom-0 p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                      Confirmed
                    </span>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#2d3b2a]">
                      Difficulty: Hard
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                        Everest Base Camp Trek
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
                        Experience the thrill of the Himalayas and manage your
                        complete journey from one place.
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
                      Oct 12 - Oct 26
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
                      15 Days
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
                      Confirmed
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
                    {pastBookings.length} completed trips
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {pastBookings.map((trip) => (
                    <div
                      key={trip.id}
                      className="overflow-hidden rounded-2xl border border-[#eef2f0] bg-[#fcfbf8] transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="h-44 w-full object-cover"
                      />

                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h4 className="text-base font-bold text-[#2d3b2a]">
                            {trip.title}
                          </h4>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                            {trip.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-[#6b7280]">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#1978e5]">
                              calendar_month
                            </span>
                            <span>{trip.dates}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-[#1978e5]">
                              schedule
                            </span>
                            <span>{trip.duration}</span>
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
                  ))}
                </div>
              </div>
            )}

            {/* Main grid */}
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
                      className="rounded-lg border border-[#e0e8dc] bg-white px-4 py-2 text-sm font-semibold text-[#4b5563] transition hover:bg-primary/5 hover:border-primary"
                    >
                      View Full Plan
                    </button>
                  </div>

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
                              {item.details.map((detail) => (
                                <span
                                  key={detail}
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
                      Namche
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
                      50% Ready
                    </span>
                  </div>

                  <div className="mb-6 h-2 w-full rounded-full bg-[#eaf0ec]">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: "50%", backgroundColor: COLORS.primary }}
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
                    className="mt-4 w-full rounded-lg border border-[#e0e8dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#4b5563] transition hover:bg-primary/5 hover:border-primary"
                  >
                    View Full Checklist
                  </button>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-auto border-t border-[#e0e8dc] bg-white/50 py-8 px-8">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#94a3b8]">
                © 2023 Travolin. All adventures curated with ❤️ in Nepal.
              </p>
              <div className="flex items-center gap-6">
                <a
                  className="text-xs font-semibold text-[#6b7280] hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] hover:text-primary transition-colors"
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