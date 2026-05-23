import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE as API } from "../../config/api.js";
import defaultAvatar from "../../assets/default-avatar.jpg";

const PAGE_SIZE = 6;
const MAX_COMPARE = 4;

const norm = (value) => (value ?? "").toString().trim().toLowerCase();
const uniqSorted = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getToken = () => localStorage.getItem("token") || "";

const getStoredFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem("favoritePackages") || "[]");
  } catch {
    return [];
  }
};

const getStoredCompareIds = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("comparePackages") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildImageUrl = (imgPath) => {
  if (!imgPath) return defaultAvatar;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API}${imgPath}`;
};

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toLocaleString()}`;

const durationRange = (label) => {
  if (label === "1-5") return [1, 5];
  if (label === "6-10") return [6, 10];
  if (label === "11-15") return [11, 15];
  return [15, 999];
};

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function MultiSelectDropdown({
  options,
  selectedSet,
  onToggle,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const count = selectedSet.size;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-lg border border-[#e0e8dc] bg-white px-3 py-2 text-sm font-medium text-[#2d3b2a] transition-all hover:border-blue-500"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{count === 0 ? placeholder : `${count} selected`}</span>
        <span className="material-symbols-outlined text-[18px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-[#e0e8dc] bg-white p-2 shadow-lg">
          <div className="max-h-56 overflow-auto">
            {options.length === 0 ? (
              <div className="px-2 py-2 text-sm text-[#6b7280]">No options</div>
            ) : (
              options.map((opt) => {
                const active = selectedSet.has(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggle(opt)}
                    className={`w-full flex items-center justify-between rounded-lg px-2 py-2 text-left transition-all ${
                      active ? "bg-blue-50" : "hover:bg-[#f0f4ee]"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                          active
                            ? "border-blue-500 bg-blue-50"
                            : "border-[#e0e8dc] bg-white"
                        }`}
                      >
                        {active && (
                          <span className="material-symbols-outlined text-[16px] text-blue-600">
                            check
                          </span>
                        )}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[#eef2f0] pt-2">
            <span className="text-[11px] font-semibold text-[#94a3b8]">
              {count === 0 ? "No selection (shows all)" : `${count} selected`}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({
  regionOptions,
  activityOptions,
  difficultyOptions,
  selectedRegions,
  selectedActivities,
  selectedDifficulties,
  budget,
  setBudget,
  duration,
  setDuration,
  durationEnabled,
  setDurationEnabled,
  clearAll,
  toggleSet,
  setSelectedRegions,
  setSelectedActivities,
  setSelectedDifficulties,
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3b2a]">
          Filters
        </h3>
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-blue-600 hover:underline"
          type="button"
        >
          Clear All
        </button>
      </div>

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

      <div className="mb-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
          Budget (NPR)
        </h4>
        <div className="px-1">
          <input
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#e0e8dc] accent-blue-600"
            max="500000"
            min="5000"
            type="range"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-label="Budget slider"
          />
          <div className="mt-2 flex justify-between text-[10px] font-bold text-[#94a3b8]">
            <span>Rs. 5,000</span>
            <span className="text-blue-600">
              {formatCurrency(budget)}
              {budget >= 500000 ? "+" : ""}
            </span>
            <span>Rs. 500,000+</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
          Duration
        </h4>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">Apply duration filter</span>
          <button
            type="button"
            className="text-xs font-semibold text-blue-600"
            onClick={() => setDurationEnabled((prev) => !prev)}
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
                className={`rounded-lg border py-2 text-xs transition-all ${
                  active
                    ? "border-blue-500 bg-blue-50 font-bold text-blue-600"
                    : "border-[#e0e8dc] font-semibold text-[#4b5563] hover:border-blue-500 hover:bg-white"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

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

      <div className="mb-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#6b7280]">
          Difficulty
        </h4>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((level) => {
            const active = selectedDifficulties.has(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleSet(setSelectedDifficulties)(level)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-[#e0e8dc] text-[#4b5563] hover:border-blue-500 hover:bg-white"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) {
  const tags = Array.isArray(pkg.tags) ? pkg.tags : [];

  const tagClasses = {
    "Best Seller": "bg-blue-600/90",
    "Eco-Friendly": "bg-green-600/90",
    Popular: "bg-orange-500/90",
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-all hover:shadow-md ${
        isCompared ? "ring-blue-500" : "ring-black/5"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={pkg.img}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm ${
                tagClasses[tag] || "bg-blue-600/90"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            className={`h-8 w-8 rounded-full backdrop-blur-md transition-all ${
              isFavorite
                ? "bg-white text-red-500"
                : "bg-white/20 text-white hover:bg-white hover:text-red-500"
            }`}
            type="button"
            onClick={() => onToggleFavorite(pkg.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleCompare(pkg.id)}
            className={`rounded-full px-3 py-1 text-[11px] font-bold backdrop-blur-md transition-all ${
              isCompared
                ? "bg-blue-600 text-white"
                : "bg-white/90 text-[#2d3b2a] hover:bg-white"
            }`}
            aria-label={isCompared ? "Remove from compare" : "Add to compare"}
          >
            {isCompared ? "Selected" : "Compare"}
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {pkg.days} Days
          </div>
          <div className="flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
            <span className="material-symbols-outlined text-[14px]">
              trending_up
            </span>
            {pkg.difficulty}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#2d3b2a]">{pkg.title}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <span
              className="material-symbols-outlined text-[16px] text-yellow-400"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-xs font-bold text-[#2d3b2a]">
              {Number(pkg.rating || 0).toFixed(1)}
            </span>
            <span className="text-[10px] text-[#6b7280]">({pkg.reviews || 0})</span>
          </div>
        </div>

        <p className="mb-6 text-sm text-[#6b7280] line-clamp-2">
          Region:{" "}
          <span className="font-semibold text-[#2d3b2a]">
            {pkg.region || "N/A"}
          </span>{" "}
          • Activities:{" "}
          <span className="font-semibold text-[#2d3b2a]">
            {pkg.activities?.length ? pkg.activities.join(", ") : "N/A"}
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
              Starting from
            </span>
            <span className="text-xl font-bold text-[#2d3b2a]">
              {formatCurrency(pkg.price)}
            </span>
          </div>

          <Link
            to={`/packages/${pkg.id}`}
            className="rounded-lg bg-[#2d3b2a] px-5 py-2 text-center text-sm font-bold text-white transition-all hover:opacity-90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
        >
          <div className="aspect-[16/10] animate-pulse bg-[#e5e7eb]" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-[#e5e7eb]" />
            <div className="h-4 w-full animate-pulse rounded bg-[#e5e7eb]" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-[#e5e7eb]" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-8 w-24 animate-pulse rounded bg-[#e5e7eb]" />
              <div className="h-9 w-28 animate-pulse rounded bg-[#e5e7eb]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition-all ${
          page === 1
            ? "cursor-not-allowed border-[#e0e8dc] text-[#c1c7d0]"
            : "border-[#e0e8dc] text-[#6b7280] hover:border-blue-500 hover:text-blue-600"
        }`}
        type="button"
        disabled={page === 1}
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {start > 1 && (
        <>
          <button
            type="button"
            onClick={() => setPage(1)}
            className="h-10 w-10 rounded-lg text-sm font-bold text-[#4b5563] hover:bg-blue-50 hover:text-blue-600"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-sm text-[#94a3b8]">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${
            p === page
              ? "bg-blue-600 text-white"
              : "text-[#4b5563] hover:bg-blue-50 hover:text-blue-600"
          }`}
          type="button"
          onClick={() => setPage(p)}
          aria-label={`Go to page ${p}`}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-sm text-[#94a3b8]">...</span>
          )}
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            className="h-10 w-10 rounded-lg text-sm font-bold text-[#4b5563] hover:bg-blue-50 hover:text-blue-600"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition-all ${
          page === totalPages
            ? "cursor-not-allowed border-[#e0e8dc] text-[#c1c7d0]"
            : "border-[#e0e8dc] text-[#6b7280] hover:border-blue-500 hover:text-blue-600"
        }`}
        type="button"
        disabled={page === totalPages}
        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        aria-label="Next page"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}

export default function ExploreNepal() {
  const navigate = useNavigate();

  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 250);

  const [selectedRegions, setSelectedRegions] = useState(new Set());
  const [selectedActivities, setSelectedActivities] = useState(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState(new Set());
  const [budget, setBudget] = useState(500000);
  const [duration, setDuration] = useState("6-10");
  const [durationEnabled, setDurationEnabled] = useState(false);
  const [sortBy, setSortBy] = useState("Popularity");
  const [page, setPage] = useState(1);

  const [favoriteIds, setFavoriteIds] = useState(new Set(getStoredFavorites()));
  const [compareIds, setCompareIds] = useState(new Set(getStoredCompareIds()));

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
    setSelectedDifficulties(new Set());
    setBudget(500000);
    setDuration("6-10");
    setDurationEnabled(false);
    setSortBy("Popularity");
    setPage(1);
  };

  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      localStorage.setItem("favoritePackages", JSON.stringify([...next]));
      return next;
    });
  };

  const handleToggleCompare = (id) => {
    setCompareIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_COMPARE) {
          window.alert(`You can compare up to ${MAX_COMPARE} packages only.`);
          return prev;
        }
        next.add(id);
      }

      localStorage.setItem("comparePackages", JSON.stringify([...next]));
      return next;
    });
  };

  const handleCompareNow = () => {
    const ids = [...compareIds];

    if (ids.length < 2) {
      window.alert("Please select at least 2 packages to compare.");
      return;
    }

    navigate(`/compare-packages?ids=${ids.join(",")}`);
  };

  const handleClearCompare = () => {
    setCompareIds(new Set());
    localStorage.removeItem("comparePackages");
  };

  useEffect(() => {
    // [FLOW FEATURE: EXPLORE PAGE]
    // Step 1: Fetch all active package lists from backend to display on explore screen
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/packages`);
        if (!res.ok) throw new Error("Failed to fetch packages");

        const data = await res.json();

        const rawPackages = Array.isArray(data)
          ? data
          : Array.isArray(data?.packages)
          ? data.packages
          : Array.isArray(data?.data)
          ? data.data
          : [];

        // Step 2: Map raw database keys to frontend properties
        const mapped = rawPackages.map((p) => ({
          id: p._id || p.id,
          title: p.title ?? "",
          region: p.region ?? "",
          activities: Array.isArray(p.activities)
            ? p.activities
            : p.type
            ? [p.type]
            : [],
          days: Number(p.days ?? 0),
          difficulty: p.difficulty ?? "Moderate",
          price: Number(p.price ?? 0),
          rating: Number(p.averageRating ?? p.rating ?? 0),
          reviews: Number(p.numReviews ?? p.reviewsCount ?? p.reviews ?? 0),
          tags: Array.isArray(p.tags) ? p.tags : [],
          img: p.images?.[0]
            ? buildImageUrl(p.images[0])
            : p.image
            ? buildImageUrl(p.image)
            : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        }));

        setAllPackages(mapped);
      } catch (err) {
        console.error("Fetch packages error:", err);
        setAllPackages([]);
        setError("Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const regionOptions = useMemo(
    () => uniqSorted(allPackages.map((p) => p.region?.trim())),
    [allPackages]
  );

  const activityOptions = useMemo(
    () =>
      uniqSorted(
        allPackages.flatMap((p) => (p.activities || []).map((a) => a?.trim()))
      ),
    [allPackages]
  );

  const difficultyOptions = useMemo(() => {
    const base = ["Easy", "Moderate", "Hard"];
    const derived = allPackages.map((p) => p.difficulty?.toString().trim());
    return uniqSorted([...base, ...derived]);
  }, [allPackages]);

  const selectedRegionsNorm = useMemo(
    () => new Set([...selectedRegions].map(norm)),
    [selectedRegions]
  );

  const selectedActivitiesNorm = useMemo(
    () => new Set([...selectedActivities].map(norm)),
    [selectedActivities]
  );

  const selectedDifficultiesNorm = useMemo(
    () => new Set([...selectedDifficulties].map(norm)),
    [selectedDifficulties]
  );

  // [FLOW FEATURE: EXPLORE PAGE - FILTER & SORT]
  // Filters and sorts the fetched packages locally in the browser based on current user inputs
  const filtered = useMemo(() => {
    const query = norm(debouncedQ);
    const [dMin, dMax] = durationRange(duration);

    let list = allPackages.filter((p) => {
      const title = norm(p.title);
      const region = norm(p.region);
      const acts = (p.activities || []).map(norm);
      const difficulty = norm(p.difficulty);

      // Step 1: Text search match (matches title, region, or activities)
      const matchSearch =
        !query ||
        title.includes(query) ||
        region.includes(query) ||
        acts.some((a) => a.includes(query));

      // Step 2: Dropdown/button selection matches (region, activity, budget, duration, difficulty)
      const matchRegion =
        selectedRegions.size === 0 || selectedRegionsNorm.has(region);

      const matchActivity =
        selectedActivities.size === 0 ||
        acts.some((a) => selectedActivitiesNorm.has(a));

      const matchBudget = Number(p.price) <= budget;

      const matchDuration =
        !durationEnabled || (Number(p.days) >= dMin && Number(p.days) <= dMax);

      const matchDifficulty =
        selectedDifficulties.size === 0 ||
        selectedDifficultiesNorm.has(difficulty);

      return (
        matchSearch &&
        matchRegion &&
        matchActivity &&
        matchBudget &&
        matchDuration &&
        matchDifficulty
      );
    });

    // Step 3: Sort the filtered list based on the chosen dropdown option
    if (sortBy === "Price: Low to High") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "Duration") {
      list = [...list].sort((a, b) => a.days - b.days);
    } else {
      list = [...list].sort((a, b) => b.rating - a.rating); // Default/Popularity sort
    }

    return list;
  }, [
    allPackages,
    debouncedQ,
    selectedRegions,
    selectedActivities,
    selectedDifficulties,
    selectedRegionsNorm,
    selectedActivitiesNorm,
    selectedDifficultiesNorm,
    budget,
    duration,
    durationEnabled,
    sortBy,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedQ,
    selectedRegions,
    selectedActivities,
    selectedDifficulties,
    budget,
    duration,
    durationEnabled,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="flex flex-col h-full">
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 px-4 py-4 backdrop-blur-md md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:gap-6">
              <div className="relative max-w-2xl flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  search
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-xl border border-[#e0e8dc] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1"
                  placeholder="Search treks, regions, or activities..."
                  type="text"
                  aria-label="Search packages"
                />
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button
                  className="rounded-lg border border-[#e0e8dc] bg-white px-3 py-2 text-sm font-semibold text-[#2d3b2a] lg:hidden"
                  type="button"
                  onClick={() => setMobileFiltersOpen((prev) => !prev)}
                >
                  Filters
                </button>

                {compareIds.size > 0 && (
                  <div className="hidden items-center gap-2 md:flex">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      {compareIds.size} selected
                    </span>

                    {compareIds.size >= 2 && (
                      <button
                        type="button"
                        onClick={handleCompareNow}
                        className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                      >
                        Compare Now
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleClearCompare}
                      className="rounded-lg border border-[#e0e8dc] bg-white px-3 py-2 text-sm font-semibold text-[#2d3b2a] transition-all hover:border-blue-500 hover:text-blue-600"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="hidden h-8 w-px bg-[#e0e8dc] md:block" />

                <Link
                  to="/bookings"
                  className="rounded-lg bg-[#2d3b2a] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  My Bookings
                </Link>
              </div>
            </div>

            {compareIds.size > 0 && (
              <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 md:hidden">
                <div className="text-sm font-semibold text-blue-700">
                  {compareIds.size} package{compareIds.size > 1 ? "s" : ""} selected
                </div>
                <div className="flex items-center gap-2">
                  {compareIds.size >= 2 && (
                    <button
                      type="button"
                      onClick={handleCompareNow}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white"
                    >
                      Compare
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearCompare}
                    className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-[#2d3b2a]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </header>

          {mobileFiltersOpen && (
            <div className="border-b border-[#e0e8dc] bg-white px-4 py-4 lg:hidden">
              <FilterSection
                regionOptions={regionOptions}
                activityOptions={activityOptions}
                difficultyOptions={difficultyOptions}
                selectedRegions={selectedRegions}
                selectedActivities={selectedActivities}
                selectedDifficulties={selectedDifficulties}
                budget={budget}
                setBudget={setBudget}
                duration={duration}
                setDuration={setDuration}
                durationEnabled={durationEnabled}
                setDurationEnabled={setDurationEnabled}
                clearAll={clearAll}
                toggleSet={toggleSet}
                setSelectedRegions={setSelectedRegions}
                setSelectedActivities={setSelectedActivities}
                setSelectedDifficulties={setSelectedDifficulties}
              />
            </div>
          )}

          <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 md:px-8">
            <aside className="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
              <FilterSection
                regionOptions={regionOptions}
                activityOptions={activityOptions}
                difficultyOptions={difficultyOptions}
                selectedRegions={selectedRegions}
                selectedActivities={selectedActivities}
                selectedDifficulties={selectedDifficulties}
                budget={budget}
                setBudget={setBudget}
                duration={duration}
                setDuration={setDuration}
                durationEnabled={durationEnabled}
                setDurationEnabled={setDurationEnabled}
                clearAll={clearAll}
                toggleSet={toggleSet}
                setSelectedRegions={setSelectedRegions}
                setSelectedActivities={setSelectedActivities}
                setSelectedDifficulties={setSelectedDifficulties}
              />
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
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
                      className="flex items-center justify-center rounded-md bg-blue-50 p-1.5 text-blue-600"
                      type="button"
                      aria-label="Grid view"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        grid_view
                      </span>
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-[#e0e8dc] bg-white py-2 pl-3 pr-8 text-sm font-medium text-[#2d3b2a] outline-none"
                    aria-label="Sort packages"
                  >
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Duration</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                  {error}
                </div>
              ) : filtered.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-[#e0e8dc] bg-white p-8 text-center">
                  <p className="text-sm text-[#6b7280]">
                    No packages match your filters. Click{" "}
                    <span className="font-semibold">Clear All</span> to see everything.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    {paginated.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        isFavorite={favoriteIds.has(pkg.id)}
                        onToggleFavorite={handleToggleFavorite}
                        isCompared={compareIds.has(pkg.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                  />
                </>
              )}
            </div>
          </div>

          <footer className="mt-auto border-t border-[#e0e8dc] bg-white/50 px-8 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-[#94a3b8]">
                © {new Date().getFullYear()} Travolin. All adventures curated with ❤️ in Nepal.
              </p>
              <div className="flex items-center gap-6">
                <a
                  className="text-xs font-semibold text-[#6b7280] transition-colors hover:text-blue-600"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] transition-colors hover:text-blue-600"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] transition-colors hover:text-blue-600"
                  href="#"
                >
                  Help Center
                </a>
              </div>
            </div>
          </footer>
        </div>
    </div>
  );
}