// src/pages/User/ExploreNepal.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

// helpers (robust filtering)
const norm = (s) => (s ?? "").toString().trim().toLowerCase();
const uniqSorted = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();

export default function ExploreNepal() {
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

  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/packages`);
        const data = await res.json();

        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: p._id,
          title: p.title ?? "",
          region: p.region ?? "",
          // ✅ DB doesn't have activities => map type -> activities
          activities: p.type ? [p.type] : [],
          days: Number(p.days ?? 0),
          difficulty: p.difficulty ?? "Moderate",
          price: Number(p.price ?? 0),
          // UI placeholders (not in DB)
          rating: 4.8,
          reviews: "—",
          tags: [],
          img: p.images?.[0]
            ? `${API}${p.images[0]}`
            : "https://via.placeholder.com/800x600",
        }));

        setAllPackages(mapped);
      } catch (e) {
        console.error("Fetch packages error:", e);
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // ----------- FILTER STATE -----------
  // ✅ Build dropdown options from DB values (trim/case safe)
  const regionOptions = useMemo(() => {
    return uniqSorted(allPackages.map((p) => p.region).map((r) => r?.trim()));
  }, [allPackages]);

  const activityOptions = useMemo(() => {
    return uniqSorted(
      allPackages.flatMap((p) => (p.activities || []).map((a) => a?.trim()))
    );
  }, [allPackages]);

  const [q, setQ] = useState("");
  const [selectedRegions, setSelectedRegions] = useState(new Set()); // stores original strings (display)
  const [selectedActivities, setSelectedActivities] = useState(new Set()); // stores original strings (display)

  // ✅ Budget: set to 5000 by default (means "no limit" in our logic)
  const [budget, setBudget] = useState(5000);

  // ✅ Duration off by default (show all durations until user enables)
  const [duration, setDuration] = useState("6-10");
  const [durationEnabled, setDurationEnabled] = useState(false);

  const [sortBy, setSortBy] = useState("Popularity");

  const toggleSet = (setter) => (value) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const clearAll = () => {
    setQ("");
    setSelectedRegions(new Set());
    setSelectedActivities(new Set());
    setBudget(5000);
    setDuration("6-10");
    setDurationEnabled(false);
    setSortBy("Popularity");
  };

  const durationRange = (label) => {
    if (label === "1-5") return [1, 5];
    if (label === "6-10") return [6, 10];
    if (label === "11-15") return [11, 15];
    return [16, 999];
  };

  // ✅ normalized sets so filter works even with case/space differences
  const selectedRegionsNorm = useMemo(
    () => new Set([...selectedRegions].map(norm)),
    [selectedRegions]
  );
  const selectedActivitiesNorm = useMemo(
    () => new Set([...selectedActivities].map(norm)),
    [selectedActivities]
  );

  // ✅ MAIN filter (fixed)
  const filtered = useMemo(() => {
    const query = norm(q);

    const regionsActive = selectedRegions.size > 0;
    const activitiesActive = selectedActivities.size > 0;
    const durationActive = durationEnabled;

    const [dMin, dMax] = durationRange(duration);

    let list = allPackages.filter((p) => {
      const title = norm(p.title);
      const region = norm(p.region);
      const acts = (p.activities || []).map(norm);

      const matchSearch =
        !query ||
        title.includes(query) ||
        region.includes(query) ||
        acts.some((a) => a.includes(query));

      const matchRegion = !regionsActive || selectedRegionsNorm.has(region);

      const matchActivity =
        !activitiesActive || acts.some((a) => selectedActivitiesNorm.has(a));

      // ✅ budget filter: if slider at 5000 => no limit
      const matchBudget = budget >= 5000 ? true : Number(p.price) <= budget;

      const matchDuration =
        !durationActive || (Number(p.days) >= dMin && Number(p.days) <= dMax);

      return (
        matchSearch && matchRegion && matchActivity && matchBudget && matchDuration
      );
    });

    // sorting
    if (sortBy === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "Duration") list = [...list].sort((a, b) => a.days - b.days);

    return list;
  }, [
    allPackages,
    q,
    selectedRegions,
    selectedActivities,
    selectedRegionsNorm,
    selectedActivitiesNorm,
    budget,
    duration,
    durationEnabled,
    sortBy,
  ]);

  const navItems = useMemo(
    () => [
      { label: "My Trips", icon: "map", to: "/trips" },
      { label: "Explore Nepal", icon: "explore", to: "/explore", active: true },
      { label: "Saved Destinations", icon: "favorite", to: "/saved" },
      { label: "Profile", icon: "person", to: "/profile" },
    ],
    []
  );

  // ✅ Custom multi-select dropdown
  function MultiSelectDropdown({
    options,
    selectedSet,
    onToggle,
    placeholder = "Select...",
  }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const onDoc = (e) => {
        if (!ref.current) return;
        if (!ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const count = selectedSet.size;

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-lg border border-[#e0e8dc] bg-white px-3 py-2 text-sm font-medium text-[#2d3b2a] hover:border-primary transition-all"
        >
          <span>{count === 0 ? placeholder : `${count} selected`}</span>
          <span className="material-symbols-outlined text-[18px]">
            {open ? "expand_less" : "expand_more"}
          </span>
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-[#e0e8dc] bg-white shadow-lg p-2">
            <div className="max-h-56 overflow-auto">
              {options.map((opt) => {
                const active = selectedSet.has(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggle(opt)}
                    className={[
                      "w-full flex items-center justify-between rounded-lg px-2 py-2 text-left transition-all",
                      active ? "bg-primary/10" : "hover:bg-[#f0f4ee]",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span
                        className={[
                          "inline-flex h-4 w-4 items-center justify-center rounded border",
                          active
                            ? "border-primary bg-primary/10"
                            : "border-[#e0e8dc] bg-white",
                        ].join(" ")}
                      >
                        {active && (
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            check
                          </span>
                        )}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-[#eef2f0] pt-2">
              <span className="text-[11px] font-semibold text-[#94a3b8]">
                {count === 0 ? "No selection (shows all)" : `${count} selected`}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const TagPill = ({ text, variant }) => {
    const map = {
      primary: "bg-primary/90",
      secondary: "bg-secondary/80",
      orange: "bg-orange-500/90",
    };
    return (
      <span
        className={[
          "rounded-md px-2 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm uppercase",
          map[variant] || map.primary,
        ].join(" ")}
      >
        {text}
      </span>
    );
  };

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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#2d3b2a] text-base font-bold leading-tight">
                  Arjun K.
                </h1>
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: COLORS.primary }}
                >
                  Explorer
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
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-md px-8 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  search
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-xl border border-[#e0e8dc] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[--p] focus:ring-1"
                  style={{ ["--p"]: COLORS.primary }}
                  placeholder="Search treks, regions, or activities..."
                  type="text"
                />
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
                >
                  My Bookings
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto w-full max-w-7xl px-8 py-8 flex gap-8">
            {/* Filters */}
            <aside className="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3b2a]">
                    Filters
                  </h3>
                  <button
                    onClick={clearAll}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: COLORS.primary }}
                    type="button"
                  >
                    Clear All
                  </button>
                </div>

                {/* Region */}
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
                    Region
                  </h4>
                  <MultiSelectDropdown
                    options={regionOptions}
                    selectedSet={selectedRegions}
                    onToggle={toggleSet(setSelectedRegions)}
                    placeholder="All Regions"
                  />
                </div>

                {/* Budget */}
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
                    Budget (USD)
                  </h4>
                  <div className="px-1">
                    <input
                      className="w-full h-1.5 bg-[#e0e8dc] rounded-lg appearance-none cursor-pointer accent-[--p]"
                      style={{ ["--p"]: COLORS.primary }}
                      max="5000"
                      min="200"
                      type="range"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-[#94a3b8]">
                      <span>$200</span>
                      <span style={{ color: COLORS.primary }}>
                        ${budget.toLocaleString()}
                        {budget >= 5000 ? "+" : ""}
                      </span>
                      <span>$5,000+</span>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
                    Duration
                  </h4>

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-[#6b7280]">
                      Apply duration filter
                    </span>
                    <button
                      type="button"
                      className="text-xs font-semibold"
                      style={{ color: COLORS.primary }}
                      onClick={() => setDurationEnabled((v) => !v)}
                    >
                      {durationEnabled ? "On" : "Off"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "1-5", label: "1-5 Days" },
                      { key: "6-10", label: "6-10 Days" },
                      { key: "11-15", label: "11-15 Days" },
                      { key: "15+", label: "15+ Days" },
                    ].map((d) => {
                      const active = durationEnabled && duration === d.key;
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => {
                            setDurationEnabled(true);
                            setDuration(d.key);
                          }}
                          className={[
                            "rounded-lg py-2 text-xs transition-all border",
                            active
                              ? "bg-primary/10 border-primary/20 font-bold text-primary"
                              : "border-[#e0e8dc] font-semibold text-[#4b5563] hover:bg-white hover:border-primary",
                          ].join(" ")}
                          style={!active ? { borderColor: COLORS.border } : undefined}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
                    Activities
                  </h4>
                  <MultiSelectDropdown
                    options={activityOptions}
                    selectedSet={selectedActivities}
                    onToggle={toggleSet(setSelectedActivities)}
                    placeholder="All Activities"
                  />
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#2d3b2a]">All Packages</h2>
                  <p className="text-sm text-[#6b7280]">
                    Found{" "}
                    <span className="font-bold text-[#2d3b2a]">{filtered.length}</span>{" "}
                    experiences matching your criteria
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="flex rounded-lg border border-[#e0e8dc] bg-white p-1">
                    <button
                      className="flex items-center justify-center rounded-md bg-primary/10 p-1.5 text-primary"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        grid_view
                      </span>
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border-[#e0e8dc] bg-white py-2 pl-3 pr-8 text-sm font-medium text-[#2d3b2a] outline-none"
                  >
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Duration</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div className="mb-6 rounded-2xl border border-[#e0e8dc] bg-white p-6 text-sm text-[#6b7280]">
                  Loading packages...
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={p.img}
                      />

                      <div className="absolute left-3 top-3 flex flex-col gap-2">
                        {p.tags.includes("Best Seller") && (
                          <TagPill text="Best Seller" variant="primary" />
                        )}
                        {p.tags.includes("Eco-Friendly") && (
                          <TagPill text="Eco-Friendly" variant="secondary" />
                        )}
                        {p.tags.includes("Popular") && (
                          <TagPill text="Popular" variant="orange" />
                        )}
                      </div>

                      <button
                        className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white hover:text-red-500"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>

                      <div className="absolute bottom-3 left-3 flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>{" "}
                          {p.days} Days
                        </div>
                        <div className="flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                          <span className="material-symbols-outlined text-[14px]">
                            trending_up
                          </span>{" "}
                          {p.difficulty}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#2d3b2a]">{p.title}</h3>
                        <div className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[16px] text-yellow-400"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-xs font-bold text-[#2d3b2a]">{p.rating}</span>
                          <span className="text-[10px] text-[#6b7280]">({p.reviews})</span>
                        </div>
                      </div>

                      <p className="mb-6 text-sm text-[#6b7280] line-clamp-2">
                        Region:{" "}
                        <span className="font-semibold text-[#2d3b2a]">{p.region}</span>{" "}
                        • Activities:{" "}
                        <span className="font-semibold text-[#2d3b2a]">
                          {p.activities.join(", ")}
                        </span>
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium text-[#6b7280] uppercase tracking-wider">
                            Starting from
                          </span>
                          <span className="text-xl font-bold text-[#2d3b2a]">
                            ${p.price.toLocaleString()}
                          </span>
                        </div>

                        <Link
                          to={`/packages/${p.id}`}
                          className="rounded-lg px-5 py-2 text-sm font-bold text-white transition-all"
                          style={{ backgroundColor: COLORS.secondary, textAlign: "center" }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!loading && filtered.length === 0 && (
                <div className="mt-10 rounded-2xl border border-[#e0e8dc] bg-white p-8 text-center">
                  <p className="text-sm text-[#6b7280]">
                    No packages match your filters. Click{" "}
                    <span className="font-semibold">Clear All</span> to see everything.
                  </p>
                </div>
              )}

              {/* Pagination UI (static) */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e0e8dc] bg-white text-[#6b7280] hover:border-primary hover:text-primary transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  className="h-10 w-10 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                  type="button"
                >
                  1
                </button>
                <button
                  className="h-10 w-10 rounded-lg border border-transparent text-sm font-bold text-[#4b5563] hover:bg-primary/10 hover:text-primary transition-all"
                  type="button"
                >
                  2
                </button>
                <button
                  className="h-10 w-10 rounded-lg border border-transparent text-sm font-bold text-[#4b5563] hover:bg-primary/10 hover:text-primary transition-all"
                  type="button"
                >
                  3
                </button>
                <span className="px-2 text-[#94a3b8]">...</span>
                <button
                  className="h-10 w-10 rounded-lg border border-transparent text-sm font-bold text-[#4b5563] hover:bg-primary/10 hover:text-primary transition-all"
                  type="button"
                >
                  12
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e0e8dc] bg-white text-[#6b7280] hover:border-primary hover:text-primary transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
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