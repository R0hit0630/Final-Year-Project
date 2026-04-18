// src/pages/User/PackageDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const buildImageUrl = (imgPath) => {
  if (!imgPath) return defaultAvatar;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API}${imgPath}`;
};

const fallbackCover =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80";

function LoadingSkeleton() {
  return (
    <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
      <div className="flex h-full w-full bg-[#fcfbf8]">
        <main className="flex flex-1 items-center justify-center bg-[#f6f7f8] px-6">
          <div className="w-full max-w-2xl rounded-2xl border border-[#e0e8dc] bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-[#e5e7eb]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#e5e7eb]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#e5e7eb]" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PackageDetails() {
  const { id } = useParams();

  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [groupSize, setGroupSize] = useState(2);

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
    const fetchOne = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/packages/${id}`);
        if (!res.ok) throw new Error("Package not found");

        const data = await res.json();
        const packageData = data?.package || data?.data?.package || data?.data || data;

        if (!packageData || typeof packageData !== "object") {
          throw new Error("Invalid package data");
        }

        setPkg(packageData);
      } catch (err) {
        console.error("Fetch package error:", err);
        setPkg(null);
        setError("Package not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOne();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await fetch(`${API}/api/reviews/package/${id}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const navItems = useMemo(
    () => [
      { label: "My Trips", icon: "map", to: "/trips" },
      { label: "Explore Nepal", icon: "explore", to: "/explore" },
      { label: "Saved Destinations", icon: "favorite", to: "/saved" },
      { label: "Profile", icon: "person", to: "/profile" },
    ],
    []
  );

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

  const packageId = pkg?._id || pkg?.id || id;

  const cover = useMemo(() => {
    if (pkg?.images?.[0]) return buildImageUrl(pkg.images[0]);
    if (pkg?.image) return buildImageUrl(pkg.image);
    return fallbackCover;
  }, [pkg]);

  const galleryImages = useMemo(() => {
    if (!Array.isArray(pkg?.images)) return [];
    return pkg.images
      .slice(1)
      .filter(Boolean)
      .map((img) => buildImageUrl(img));
  }, [pkg]);

  const todayStr = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    return today.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    if (pkg && Array.isArray(pkg.availableDates) && pkg.availableDates.length > 0) {
      setSelectedDate(pkg.availableDates[0]);
    } else if (!selectedDate) {
      setSelectedDate(todayStr);
    }
  }, [pkg, todayStr]);

  const minGroupSize = Math.max(Number(pkg?.minGroupSize || 1), 1);
  const maxGroupSize = Math.max(Number(pkg?.maxGroupSize || 10), minGroupSize);

  useEffect(() => {
    setGroupSize((prev) => {
      if (prev < minGroupSize) return minGroupSize;
      if (prev > maxGroupSize) return maxGroupSize;
      return prev;
    });
  }, [minGroupSize, maxGroupSize]);

  const bestSeason = useMemo(() => {
    const region = (pkg?.region || "").toLowerCase();
    const type = (pkg?.type || "").toLowerCase();

    if (region.includes("everest") || region.includes("khumbu")) {
      return "Mar-May / Sep-Nov";
    }
    if (region.includes("annapurna")) {
      return "Mar-May / Sep-Dec";
    }
    if (region.includes("mustang")) {
      return "Mar-Nov";
    }
    if (type.includes("tour") || type.includes("cultural")) {
      return "Year Round";
    }

    return "Spring & Autumn";
  }, [pkg]);

  const highlights = useMemo(() => {
    if (!pkg) return [];

    return [
      `Explore ${pkg.region || "Nepal"} with a well-planned travel route`,
      `Enjoy a ${pkg.days || 0}-day ${pkg.type || "adventure"} experience`,
      `Ideal for ${pkg.difficulty || "moderate"} level travelers`,
      `Flexible group size from ${minGroupSize} to ${maxGroupSize} travelers`,
      "Local guidance, permits, and trip coordination included",
    ];
  }, [pkg, minGroupSize, maxGroupSize]);

  const includedItems = useMemo(() => {
    if (!pkg) return [];

    if (Array.isArray(pkg.includedItems) && pkg.includedItems.length > 0) {
      return pkg.includedItems;
    }

    return [
      "Airport / trip arrival coordination",
      "Required permits and entry fees",
      "Accommodation as per itinerary",
      "Professional English-speaking guide",
      `Group arrangement for ${minGroupSize}-${maxGroupSize} travelers`,
    ];
  }, [pkg, minGroupSize, maxGroupSize]);

  const excludedItems = useMemo(() => {
    if (Array.isArray(pkg?.excludedItems) && pkg?.excludedItems.length > 0) {
      return pkg.excludedItems;
    }

    return [
      "International airfare",
      "Travel insurance",
      "Personal trekking equipment",
      "Personal expenses",
      "Tips for guides and support staff",
    ];
  }, [pkg]);

  const subtotal = Number(pkg?.price || 0) * Number(groupSize || 1);
  const serviceFee = 50;
  const total = subtotal + serviceFee;

  const averageRating = Number(pkg?.averageRating || 0);
  const numReviews = Number(pkg?.numReviews || 0);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!pkg) {
    return (
      <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
        <div className="flex h-full w-full bg-[#fcfbf8]">
          <main className="flex flex-1 items-center justify-center bg-[#f6f7f8] px-6">
            <div className="w-full max-w-2xl rounded-2xl border border-[#e0e8dc] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6b7280]">
                {error || "Package not found."}
              </p>
              <Link
                to="/explore"
                className="mt-4 inline-block text-sm font-semibold text-blue-600"
              >
                ← Back to Explore
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
      <div className="flex h-full w-full bg-[#fcfbf8]">
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
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-[#f0f4ee]"
                >
                  <span className="material-symbols-outlined text-[#6b7280] transition-colors group-hover:text-blue-600">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-[#4b5563] group-hover:text-[#2d3b2a]">
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

        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f6f7f8]">
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 px-4 py-4 backdrop-blur-md md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-4">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e0e8dc] bg-white px-4 py-2 text-sm font-semibold text-[#2d3b2a] transition-all hover:border-blue-500 hover:text-blue-600"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  Back
                </Link>

                <div className="hidden md:block">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                    Package Details
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-[#2d3b2a]">{pkg.title}</h2>

                    {numReviews > 0 ? (
                      <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">
                        <span
                          className="material-symbols-outlined text-[16px] text-yellow-400"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-xs font-bold text-[#2d3b2a]">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-[#6b7280]">
                          ({numReviews})
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6b7280] shadow-sm ring-1 ring-black/5">
                        No ratings yet
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden h-8 w-px bg-[#e0e8dc] md:block" />
                <Link
                  to="/trips"
                  className="rounded-lg bg-[#2d3b2a] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 md:px-8">
            <div className="flex-1">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <img
                  src={cover}
                  alt={pkg.title}
                  className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                  onError={(e) => {
                    e.currentTarget.src = fallbackCover;
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                      {pkg.type || "Adventure"}
                    </span>
                    <span className="rounded-md bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                      {pkg.difficulty || "Moderate"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {pkg.title}
                    </h1>

                    {numReviews > 0 ? (
                      <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-md">
                        <span
                          className="material-symbols-outlined text-[18px] text-yellow-400"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-xs font-bold text-[#2d3b2a]">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-[#6b7280]">
                          ({numReviews})
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#6b7280] backdrop-blur-md">
                        No ratings yet
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      {pkg.region || "Nepal"}
                    </span>

                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      {pkg.days || 0} Days
                    </span>

                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        groups
                      </span>
                      {minGroupSize}-{maxGroupSize} Travelers
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Duration
                  </p>
                  <p className="mt-1 text-base font-bold text-[#2d3b2a]">
                    {pkg.days || 0} Days
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Difficulty
                  </p>
                  <p className="mt-1 text-base font-bold text-[#2d3b2a]">
                    {pkg.difficulty || "Moderate"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">category</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Type
                  </p>
                  <p className="mt-1 text-base font-bold text-[#2d3b2a]">
                    {pkg.type || "Adventure"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">wb_sunny</span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Best Season
                  </p>
                  <p className="mt-1 text-base font-bold text-[#2d3b2a]">
                    {bestSeason}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="mb-3 text-lg font-bold text-[#2d3b2a]">Overview</h3>
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  {pkg.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">Highlights</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-[20px] text-blue-600">
                        check_circle
                      </span>
                      <p className="text-sm text-[#4b5563]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 && (
                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#2d3b2a]">Itinerary</h3>
                    <button
                      type="button"
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Download PDF
                    </button>
                  </div>

                  <div className="relative space-y-6 border-l-2 border-[#e0e8dc] pl-6">
                    {pkg.itinerary.map((day, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-600 shadow-sm" />
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">
                          Day {i + 1}
                        </p>
                        <p className="text-base font-semibold text-[#2d3b2a]">
                          {day.title || `Itinerary Day ${i + 1}`}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
                          {day.details ||
                            day.description ||
                            "No details available for this day."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                    <span className="material-symbols-outlined text-green-500">
                      check_circle
                    </span>
                    What's Included
                  </h3>

                  <div className="space-y-3">
                    {includedItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                        <p className="text-sm text-[#6b7280]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                    <span className="material-symbols-outlined text-red-400">
                      cancel
                    </span>
                    What's Not Included
                  </h3>

                  <div className="space-y-3">
                    {excludedItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                        <p className="text-sm text-[#6b7280]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                      Traveler Reviews
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#2d3b2a]">
                      Customer Reviews
                    </h3>
                  </div>

                  {numReviews > 0 ? (
                    <div className="flex items-center gap-2 rounded-full bg-[#f8fafc] px-4 py-2">
                      <span
                        className="material-symbols-outlined text-[18px] text-yellow-400"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-sm font-bold text-[#2d3b2a]">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#6b7280]">
                        ({numReviews} reviews)
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-full bg-[#f8fafc] px-4 py-2 text-xs font-semibold text-[#6b7280]">
                      No ratings yet
                    </div>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[#eef2f0] p-4"
                      >
                        <div className="mb-3 h-4 w-24 animate-pulse rounded bg-[#e5e7eb]" />
                        <div className="mb-2 h-3 w-full animate-pulse rounded bg-[#e5e7eb]" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-[#e5e7eb]" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#d9e2ec] bg-[#fcfbf8] p-8 text-center">
                    <p className="text-sm font-semibold text-[#2d3b2a]">
                      No reviews yet
                    </p>
                    <p className="mt-1 text-sm text-[#6b7280]">
                      Be the first traveler to rate this package.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const reviewerName =
                        review?.user?.fullName ||
                        review?.user?.name ||
                        review?.user?.username ||
                        "Traveler";

                      const reviewerInitial = reviewerName.charAt(0).toUpperCase();

                      return (
                        <div
                          key={review._id}
                          className="rounded-xl border border-[#eef2f0] bg-[#fcfbf8] p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2d3b2a] text-sm font-bold text-white">
                              {reviewerInitial}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <h4 className="text-sm font-bold text-[#2d3b2a]">
                                    {reviewerName}
                                  </h4>
                                  <p className="text-xs text-[#94a3b8]">
                                    {review?.createdAt
                                      ? new Date(review.createdAt).toLocaleDateString(
                                          "en-GB",
                                          {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                          }
                                        )
                                      : "Recent review"}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-black/5">
                                  <span
                                    className="material-symbols-outlined text-[16px] text-yellow-400"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    star
                                  </span>
                                  <span className="text-xs font-bold text-[#2d3b2a]">
                                    {Number(review?.rating || 0).toFixed(1)}
                                  </span>
                                </div>
                              </div>

                              <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                                {review?.comment?.trim()
                                  ? review.comment
                                  : "The traveler left a rating without a written review."}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">Gallery</h3>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="overflow-hidden rounded-xl bg-[#f6f7f8]">
                        <img
                          src={img}
                          alt={`Gallery image ${i + 1}`}
                          className="h-52 w-full object-cover transition-transform duration-700 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = fallbackCover;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden w-[340px] shrink-0 lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="mb-6">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-[#6b7280]">
                      Starting From
                    </p>
                    <h2 className="mt-1 text-3xl font-bold text-[#2d3b2a]">
                      रु {Number(pkg.price || 0).toLocaleString()}
                    </h2>
                    <p className="text-xs text-[#6b7280]">per person</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#6b7280]">
                        Select Date
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                          calendar_month
                        </span>
                        {pkg && Array.isArray(pkg.availableDates) && pkg.availableDates.length > 0 ? (
                          <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-lg border border-[#e0e8dc] bg-[#f6f7f8] py-3 pl-10 pr-4 text-sm text-[#2d3b2a] outline-none transition-all focus:border-blue-500 focus:ring-1"
                            aria-label="Select date"
                          >
                            {pkg.availableDates.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="date"
                            min={todayStr}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-lg border border-[#e0e8dc] bg-[#f6f7f8] py-3 pl-10 pr-4 text-sm text-[#2d3b2a] outline-none transition-all focus:border-blue-500 focus:ring-1"
                            aria-label="Select trip date"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#6b7280]">
                        Guests
                      </label>

                      <div className="flex items-center justify-between rounded-lg border border-[#e0e8dc] bg-[#f6f7f8] px-3 py-2.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-[#2d3b2a]">
                          <span className="material-symbols-outlined text-[18px] text-[#6b7280]">
                            person
                          </span>
                          {groupSize} {groupSize === 1 ? "Traveler" : "Travelers"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setGroupSize((prev) => Math.max(minGroupSize, prev - 1))
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#2d3b2a] shadow-sm transition-all hover:bg-[#eef4fb]"
                            aria-label="Decrease guests"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              remove
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setGroupSize((prev) => Math.min(maxGroupSize, prev + 1))
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#2d3b2a] shadow-sm transition-all hover:bg-[#eef4fb]"
                            aria-label="Increase guests"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              add
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#f6f7f8] p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6b7280]">
                          रु {Number(pkg.price || 0).toLocaleString()} × {groupSize}
                        </span>
                        <span className="font-semibold text-[#2d3b2a]">
                          रु {subtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-[#6b7280]">Service Fee</span>
                        <span className="font-semibold text-[#2d3b2a]">
                          रु {serviceFee}
                        </span>
                      </div>

                      <div className="mt-3 border-t border-[#e0e8dc] pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2d3b2a]">Total</span>
                          <span className="text-lg font-bold text-blue-600">
                            रु {total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={getToken() ? `/pay/${packageId}` : "/login"}
                      state={{
                        packageId,
                        selectedDate,
                        groupSize,
                        pkg,
                        subtotal,
                        serviceFee,
                        total,
                      }}
                      className="block w-full rounded-lg bg-[#2d3b2a] px-5 py-3 text-center text-sm font-bold text-white transition-all hover:opacity-90"
                    >
                      Book Now
                    </Link>

                    <button
                      type="button"
                      className="w-full rounded-lg border border-[#e0e8dc] bg-white px-5 py-3 text-sm font-semibold text-[#2d3b2a] transition-all hover:border-blue-500 hover:text-blue-600"
                    >
                      Ask a Question
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <h3 className="mb-4 text-base font-bold text-[#2d3b2a]">
                    Why book this trip?
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-blue-600">
                        verified_user
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#2d3b2a]">
                          Trusted Booking
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          Secure and traveler-friendly booking experience.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-blue-600">
                        groups
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#2d3b2a]">
                          Flexible Group Size
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          Designed for {minGroupSize} to {maxGroupSize} travelers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 text-blue-600">
                        travel_explore
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#2d3b2a]">
                          Curated Nepal Experience
                        </p>
                        <p className="text-xs text-[#6b7280]">
                          Balanced itinerary, local support, and scenic routes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    Package Rating
                  </p>

                  <div className="mt-3">
                    {numReviews > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-[22px] text-yellow-400"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-2xl font-bold text-[#2d3b2a]">
                            {averageRating.toFixed(1)}
                          </span>
                          <span className="text-sm font-medium text-[#6b7280]">
                            ({numReviews} reviews)
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-[#6b7280]">
                          Travelers who completed this trip rated this package highly.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[22px] text-[#cbd5e1]">
                            star
                          </span>
                          <span className="text-base font-semibold text-[#6b7280]">
                            No ratings yet
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-[#6b7280]">
                          Be the first traveler to review this package after booking.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-8 md:px-8 lg:hidden">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#6b7280]">
                    Starting From
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-[#2d3b2a]">
                    रु {Number(pkg.price || 0).toLocaleString()}
                  </h2>
                  <p className="text-xs text-[#6b7280]">per person</p>
                </div>

                <Link
                  to={getToken() ? `/pay/${packageId}` : "/login"}
                  state={{
                    packageId,
                    selectedDate,
                    groupSize,
                    pkg,
                    subtotal,
                    serviceFee,
                    total,
                  }}
                  className="rounded-lg bg-[#2d3b2a] px-5 py-3 text-sm font-bold text-white"
                >
                  Book Now
                </Link>
              </div>
            </div>
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