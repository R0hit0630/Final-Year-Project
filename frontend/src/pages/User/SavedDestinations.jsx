// src/pages/User/SavedDestinations.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/default-avatar.jpg";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

const buildImageUrl = (imgPath) => {
  if (!imgPath) return defaultAvatar;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API}${imgPath}`;
};

const fallbackCover =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";

const norm = (value) => (value ?? "").toString().trim().toLowerCase();

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

function SavedPackageCard({ pkg, onRemove }) {
  const tags = Array.isArray(pkg.tags) ? pkg.tags : [];

  const tagClasses = {
    "Best Seller": "bg-blue-600/90",
    "Eco-Friendly": "bg-green-600/90",
    Popular: "bg-orange-500/90",
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          alt={pkg.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={pkg.img}
          onError={(e) => {
            e.currentTarget.src = fallbackCover;
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

        <button
          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white text-red-500 backdrop-blur-md transition-all hover:scale-105"
          type="button"
          onClick={() => onRemove(pkg.id)}
          aria-label="Remove from saved destinations"
        >
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </button>

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
            <span className="text-xs font-bold text-[#2d3b2a]">{pkg.rating}</span>
            <span className="text-[10px] text-[#6b7280]">({pkg.reviews})</span>
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
              Rs. {pkg.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRemove(pkg.id)}
              className="rounded-lg border border-[#e0e8dc] px-4 py-2 text-sm font-semibold text-[#4b5563] transition-all hover:border-red-300 hover:text-red-500"
            >
              Remove
            </button>

            <Link
              to={`/packages/${pkg.id}`}
              className="rounded-lg bg-[#2d3b2a] px-5 py-2 text-center text-sm font-bold text-white transition-all hover:opacity-90"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavedDestinations() {
  const [allPackages, setAllPackages] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set(getStoredFavorites()));
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest Saved");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setProfileLoading(true);

        const token = getToken();
        const storedUser = getStoredUser();

        if (storedUser) setCurrentUser(storedUser);
        if (!token) return;

        const res = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch current user");

        const data = await res.json();
        const fetchedUser = data?.user || data?.data?.user || data?.data || data;

        if (fetchedUser && typeof fetchedUser === "object") {
          setCurrentUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        }
      } catch (err) {
        console.error("Fetch current user error:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/packages/public`);
        if (!res.ok) throw new Error("Failed to fetch packages");

        const data = await res.json();

        const rawPackages = Array.isArray(data)
          ? data
          : Array.isArray(data?.packages)
          ? data.packages
          : Array.isArray(data?.data)
          ? data.data
          : [];

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
          rating: Number(p.rating ?? 4.8),
          reviews: Number(p.reviewsCount ?? p.reviews ?? 0),
          tags: Array.isArray(p.tags) ? p.tags : [],
          img: p.images?.[0]
            ? buildImageUrl(p.images[0])
            : p.image
            ? buildImageUrl(p.image)
            : fallbackCover,
        }));

        setAllPackages(mapped);
      } catch (err) {
        console.error("Fetch packages error:", err);
        setError("Failed to load saved destinations.");
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const syncFavorites = () => {
      setFavoriteIds(new Set(getStoredFavorites()));
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, []);

  const handleRemoveFavorite = (id) => {
    const updated = [...favoriteIds].filter((item) => item !== id);
    localStorage.setItem("favoritePackages", JSON.stringify(updated));
    setFavoriteIds(new Set(updated));
  };

  const handleClearAll = () => {
    localStorage.setItem("favoritePackages", JSON.stringify([]));
    setFavoriteIds(new Set());
  };

  const validSavedPackages = useMemo(() => {
    return allPackages.filter((pkg) => favoriteIds.has(pkg.id));
  }, [allPackages, favoriteIds]);

  const savedPackages = useMemo(() => {
    const query = norm(search);

    let filtered = validSavedPackages.filter((pkg) => {
      if (!query) return true;

      return (
        norm(pkg.title).includes(query) ||
        norm(pkg.region).includes(query) ||
        (pkg.activities || []).some((a) => norm(a).includes(query))
      );
    });

    if (sortBy === "Price: Low to High") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "Duration") {
      filtered = [...filtered].sort((a, b) => a.days - b.days);
    } else if (sortBy === "Name") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = [...filtered];
    }

    return filtered;
  }, [validSavedPackages, search, sortBy]);

  const navItems = [
    { label: "My Trips", icon: "map", to: "/trips" },
    { label: "Explore Nepal", icon: "explore", to: "/explore" },
    { label: "Saved Destinations", icon: "favorite", to: "/saved", active: true },
    { label: "Profile", icon: "person", to: "/profile" },
  ];

  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    "Traveler";

  const displayRole = currentUser?.role || "User";

  const displayAvatar = buildImageUrl(
    currentUser?.avatar ||
      currentUser?.profileImage ||
      currentUser?.image ||
      currentUser?.photo
  );

  return (
    <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
      <div className="flex h-full w-full bg-[#fcfbf8]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-blue-100">
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src={displayAvatar}
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight text-[#2d3b2a]">
                  {profileLoading ? "Loading..." : displayName}
                </h1>
                <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                  {displayRole}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    item.active ? "bg-blue-50" : "hover:bg-[#f0f4ee]"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-colors ${
                      item.active
                        ? "text-blue-600"
                        : "text-[#6b7280] group-hover:text-blue-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-sm ${
                      item.active
                        ? "font-semibold text-[#2d3b2a]"
                        : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]"
                    }`}
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
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 px-4 py-4 backdrop-blur-md md:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#2d3b2a]">
                  Saved Destinations
                </h1>
                <p className="text-sm text-[#6b7280]">
                  Keep track of the places you want to visit next.
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <Link
                  to="/explore"
                  className="rounded-lg border border-[#e0e8dc] bg-white px-4 py-2 text-sm font-semibold text-[#2d3b2a] transition-all hover:border-blue-500 hover:text-blue-600"
                >
                  Explore More
                </Link>

                <Link
                  to="/trips"
                  className="rounded-lg bg-[#2d3b2a] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  My Trips
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
            {/* Top Controls */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-xl">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search saved places..."
                  className="w-full rounded-xl border border-[#e0e8dc] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-[#e0e8dc] bg-white py-2 pl-3 pr-8 text-sm font-medium text-[#2d3b2a] outline-none"
                >
                  <option>Newest Saved</option>
                  <option>Name</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Duration</option>
                </select>

                {validSavedPackages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded-lg border border-[#e0e8dc] bg-white px-4 py-2 text-sm font-semibold text-[#4b5563] transition-all hover:border-red-300 hover:text-red-500"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  Total Saved
                </p>
                <p className="mt-2 text-2xl font-bold text-[#2d3b2a]">
                  {validSavedPackages.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  Showing
                </p>
                <p className="mt-2 text-2xl font-bold text-[#2d3b2a]">
                  {savedPackages.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  Wishlist Status
                </p>
                <p className="mt-2 text-base font-bold text-blue-600">
                  {validSavedPackages.length > 0 ? "Active" : "Empty"}
                </p>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                {error}
              </div>
            ) : validSavedPackages.length === 0 ? (
              <div className="rounded-2xl border border-[#e0e8dc] bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </div>
                <h2 className="text-xl font-bold text-[#2d3b2a]">
                  No saved destinations yet
                </h2>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Start exploring Nepal and save the destinations you love.
                </p>
                <Link
                  to="/explore"
                  className="mt-6 inline-block rounded-lg bg-[#2d3b2a] px-5 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                >
                  Browse Packages
                </Link>
              </div>
            ) : savedPackages.length === 0 ? (
              <div className="rounded-2xl border border-[#e0e8dc] bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-bold text-[#2d3b2a]">
                  No matching saved destinations
                </h2>
                <p className="mt-2 text-sm text-[#6b7280]">
                  Try a different search or sort option.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {savedPackages.map((pkg) => (
                  <SavedPackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            )}
          </div>

          <footer className="mt-auto border-t border-[#e0e8dc] bg-white/50 px-4 py-8 md:px-8">
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
        </main>
      </div>
    </div>
  );
}