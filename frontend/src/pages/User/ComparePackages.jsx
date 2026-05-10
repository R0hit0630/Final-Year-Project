import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE as API } from "../../config/api.js";
import defaultAvatar from "../../assets/default-avatar.jpg";

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

const getStoredCompareIds = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("comparePackages") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5" />
      <div className="h-[420px] animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-black/5" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-[#e0e8dc] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <span className="material-symbols-outlined text-[30px]">balance</span>
      </div>
      <h2 className="mt-4 text-xl font-bold text-[#2d3b2a]">
        No packages selected
      </h2>
      <p className="mt-2 text-sm text-[#6b7280]">
        Select at least 2 packages from Explore Nepal to compare them side by
        side.
      </p>
      <Link
        to="/explore"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2d3b2a] px-5 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[18px]">
          travel_explore
        </span>
        Go to Explore
      </Link>
    </div>
  );
}

function CompareCard({ pkg, onRemove }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={pkg.img}
          alt={pkg.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        <button
          type="button"
          onClick={() => onRemove(pkg.id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#2d3b2a] shadow-sm backdrop-blur-md transition-all hover:text-red-500"
          aria-label={`Remove ${pkg.title} from comparison`}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
            {pkg.type || "Package"}
          </span>
          <span className="rounded-md bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
            {pkg.difficulty || "Moderate"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#2d3b2a]">{pkg.title}</h3>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#f8fafc] px-3 py-1">
            <span
              className="material-symbols-outlined text-[16px] text-yellow-400"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-xs font-bold text-[#2d3b2a]">
              {Number(pkg.rating || 0).toFixed(1)}
            </span>
            <span className="text-[10px] text-[#6b7280]">
              ({pkg.reviews || 0})
            </span>
          </div>
        </div>

        <p className="text-sm text-[#6b7280]">
          {pkg.region || "N/A"} • {pkg.days || 0} Days
        </p>
      </div>
    </div>
  );
}

export default function ComparePackages() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [profileLoading, setProfileLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryIds = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const idsFromQuery = (params.get("ids") || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    return idsFromQuery.length > 0 ? idsFromQuery : getStoredCompareIds();
  }, [location.search]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setProfileLoading(true);

        const token = getToken();
        const storedUser = getStoredUser();

        if (storedUser) setCurrentUser(storedUser);
        if (!token) return;

        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
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

        if (!queryIds.length) {
          setPackages([]);
          return;
        }

        if (queryIds.length < 2) {
          setPackages([]);
          return;
        }

        const res = await fetch(
          `${API}/api/packages/compare?ids=${queryIds.join(",")}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch compare data");
        }

        const data = await res.json();

        const mapped = (data.packages || []).map((p) => ({
          id: p._id || p.id,
          title: p.title ?? "",
          region: p.region ?? "",
          type: p.type ?? "",
          days: Number(p.days ?? 0),
          difficulty: p.difficulty ?? "Moderate",
          price: Number(p.price ?? 0),
          rating: Number(p.averageRating ?? p.rating ?? 0),
          reviews: Number(p.numReviews ?? p.reviewsCount ?? p.reviews ?? 0),
          minGroupSize: Number(p.minGroupSize ?? 1),
          maxGroupSize: Number(p.maxGroupSize ?? 10),
          description: p.description ?? "",
          itinerary: Array.isArray(p.itinerary) ? p.itinerary : [],
          includedItems: Array.isArray(p.includedItems)
            ? p.includedItems
            : [],
          excludedItems: Array.isArray(p.excludedItems)
            ? p.excludedItems
            : [],
          activities: Array.isArray(p.activities)
            ? p.activities
            : p.type
            ? [p.type]
            : [],
          img: p.images?.[0]
            ? buildImageUrl(p.images[0])
            : p.image
            ? buildImageUrl(p.image)
            : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        }));

        setPackages(mapped);
      } catch (err) {
        console.error("Compare fetch error:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [queryIds]);

  const handleRemove = (id) => {
    const current = getStoredCompareIds().filter((pkgId) => pkgId !== id);
    localStorage.setItem("comparePackages", JSON.stringify(current));

    if (current.length < 2) {
      navigate("/explore");
      return;
    }

    navigate(`/compare-packages?ids=${current.join(",")}`);
  };

  const handleClearAll = () => {
    localStorage.removeItem("comparePackages");
    navigate("/explore");
  };


  const comparisonRows = [
    {
      label: "Region",
      render: (pkg) => pkg.region || "N/A",
    },
    {
      label: "Package Type",
      render: (pkg) => pkg.type || "N/A",
    },
    {
      label: "Price",
      render: (pkg) => `Rs. ${Number(pkg.price || 0).toLocaleString()}`,
    },
    {
      label: "Duration",
      render: (pkg) => `${pkg.days || 0} Days`,
    },
    {
      label: "Difficulty",
      render: (pkg) => pkg.difficulty || "N/A",
    },
    {
      label: "Rating",
      render: (pkg) =>
        pkg.reviews > 0
          ? `${Number(pkg.rating || 0).toFixed(1)} / 5 (${pkg.reviews})`
          : "No ratings yet",
    },
    {
      label: "Group Size",
      render: (pkg) => `${pkg.minGroupSize} - ${pkg.maxGroupSize} Travelers`,
    },
    {
      label: "Activities",
      render: (pkg) =>
        pkg.activities?.length ? pkg.activities.join(", ") : "N/A",
    },
    {
      label: "Description",
      render: (pkg) => pkg.description || "No description provided.",
      longText: true,
    },
    {
      label: "Included",
      render: (pkg) =>
        pkg.includedItems?.length
          ? pkg.includedItems.join(", ")
          : "Not specified",
      longText: true,
    },
    {
      label: "Excluded",
      render: (pkg) =>
        pkg.excludedItems?.length
          ? pkg.excludedItems.join(", ")
          : "Not specified",
      longText: true,
    },
    {
      label: "Itinerary Days",
      render: (pkg) =>
        pkg.itinerary?.length ? `${pkg.itinerary.length} day plan` : "Not added",
    },
  ];

  return (
        <div className="flex flex-1 flex-col overflow-y-auto bg-[#f6f7f8]">
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

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                    Package Comparison
                  </p>
                  <h1 className="text-lg font-bold text-[#2d3b2a]">
                    Compare Travel Packages
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {packages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded-lg border border-[#e0e8dc] bg-white px-4 py-2 text-sm font-semibold text-[#2d3b2a] transition-all hover:border-blue-500 hover:text-blue-600"
                  >
                    Clear All
                  </button>
                )}

                <Link
                  to="/bookings"
                  className="rounded-lg bg-[#2d3b2a] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
            {loading ? (
              <LoadingSkeleton />
            ) : packages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {packages.map((pkg) => (
                    <CompareCard key={pkg.id} pkg={pkg} onRemove={handleRemove} />
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                  <div className="border-b border-[#eef2f0] px-6 py-5">
                    <h2 className="text-lg font-bold text-[#2d3b2a]">
                      Side-by-Side Comparison
                    </h2>
                    <p className="mt-1 text-sm text-[#6b7280]">
                      Compare the most important details before booking.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-[#fcfbf8]">
                          <th className="min-w-[190px] border-b border-[#eef2f0] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#94a3b8]">
                            Feature
                          </th>
                          {packages.map((pkg) => (
                            <th
                              key={pkg.id}
                              className="min-w-[260px] border-b border-[#eef2f0] px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#94a3b8]"
                            >
                              {pkg.title}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {comparisonRows.map((row) => (
                          <tr key={row.label} className="align-top">
                            <td className="border-b border-[#eef2f0] bg-[#fcfbf8] px-6 py-4 text-sm font-bold text-[#2d3b2a]">
                              {row.label}
                            </td>

                            {packages.map((pkg) => (
                              <td
                                key={`${row.label}-${pkg.id}`}
                                className={`border-b border-[#eef2f0] px-6 py-4 text-sm text-[#4b5563] ${
                                  row.longText ? "leading-relaxed" : ""
                                }`}
                              >
                                {row.render(pkg)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <h3 className="text-base font-bold text-[#2d3b2a]">
                    Ready to book?
                  </h3>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    After comparing the packages, open the details page of your
                    preferred option and continue with booking.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {packages.map((pkg) => (
                      <Link
                        key={pkg.id}
                        to={`/packages/${pkg.id}`}
                        className="rounded-lg bg-[#2d3b2a] px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90"
                      >
                        View {pkg.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="mt-auto border-t border-[#e0e8dc] bg-white/50 px-8 py-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-[#94a3b8]">
                © {new Date().getFullYear()} Travolin. All adventures curated
                with ❤️ in Nepal.
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
  );
}