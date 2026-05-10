import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE as apiBase } from "../../config/api.js";
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

  const [showPastBookings, setShowPastBookings] = useState(false);

  const [userData, setUserData] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewTrip, setReviewTrip] = useState(null);

  const [packageRating, setPackageRating] = useState(0);
  const [guideRating, setGuideRating] = useState(0);

  const [packageHoverRating, setPackageHoverRating] = useState(0);
  const [guideHoverRating, setGuideHoverRating] = useState(0);

  const [packageComment, setPackageComment] = useState("");
  const [guideComment, setGuideComment] = useState("");

  const [submittingReview, setSubmittingReview] = useState(false);

  const token = localStorage.getItem("token");
  const autoOpenedReviewRef = useRef(false);



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

  useEffect(() => {
    fetchData();
  }, [token]);

  const canReviewTrip = (trip) =>
    String(trip?.status || "").toLowerCase() === "completed" && !trip?.isReviewed;

  const hasReviewedTrip = (trip) =>
    String(trip?.status || "").toLowerCase() === "completed" && !!trip?.isReviewed;

  const openReviewModal = (trip) => {
    setReviewTrip(trip);
    setPackageRating(0);
    setGuideRating(0);
    setPackageHoverRating(0);
    setGuideHoverRating(0);
    setPackageComment("");
    setGuideComment("");
  };

  const closeReviewModal = () => {
    if (submittingReview) return;
    setReviewTrip(null);
    setPackageRating(0);
    setGuideRating(0);
    setPackageHoverRating(0);
    setGuideHoverRating(0);
    setPackageComment("");
    setGuideComment("");
  };

  useEffect(() => {
    if (loading) return;
    if (reviewTrip) return;
    if (autoOpenedReviewRef.current) return;

    const firstUnreviewedCompletedTrip = pastTrips.find((trip) => canReviewTrip(trip));

    if (firstUnreviewedCompletedTrip) {
      setShowPastBookings(true);
      openReviewModal(firstUnreviewedCompletedTrip);
      autoOpenedReviewRef.current = true;
    }
  }, [loading, pastTrips, reviewTrip]);

  const fullName =
    userData?.fullName ||
    userData?.nameShort ||
    userData?.username ||
    "User";

  const avatar = userData?.avatar || "";
  const role = userData?.role || "user";

  const activePackage = activeTrip?.package || null;

  // Safe helper: handles both legacy absolute URLs and relative paths
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path; // already absolute
    return `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const heroImage = buildImageUrl(activePackage?.images?.[0])
    ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80";

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

    if (value === "ongoing") {
      return "bg-purple-100 text-purple-700";
    }
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

  const getStatusTextClasses = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "ongoing") return "text-purple-600";
    if (value === "confirmed") return "text-emerald-600";
    if (value === "completed") return "text-blue-600";
    if (value === "pending") return "text-amber-600";
    if (value === "cancelled") return "text-red-600";

    return "text-slate-600";
  };

  const getStatusIconBgClasses = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "ongoing") return "bg-purple-50";
    if (value === "confirmed") return "bg-emerald-50";
    if (value === "completed") return "bg-blue-50";
    if (value === "pending") return "bg-amber-50";
    if (value === "cancelled") return "bg-red-50";

    return "bg-slate-50";
  };

  const getStatusIconClasses = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "ongoing") return "text-purple-600";
    if (value === "confirmed") return "text-emerald-600";
    if (value === "completed") return "text-blue-600";
    if (value === "pending") return "text-amber-600";
    if (value === "cancelled") return "text-red-600";

    return "text-slate-600";
  };

  const displayStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const guideName =
    activeTrip?.guide?.name ||
    activeTrip?.guide?.fullName ||
    "Assigned Guide";

  const guideEmail = activeTrip?.guide?.email || "Not available";
  const guidePhone = activeTrip?.guide?.phone || "Not available";

  const getGuideImage = () => {
    const guide = activeTrip?.guide;
    const src = guide?.photo || guide?.avatar || guide?.image;
    return buildImageUrl(src) || defaultAvatar;
  };

  const markTripReviewedLocally = (tripId) => {
    setActiveTrip((prev) =>
      prev && prev._id === tripId ? { ...prev, isReviewed: true } : prev
    );

    setPastTrips((prev) =>
      prev.map((trip) =>
        trip._id === tripId ? { ...trip, isReviewed: true } : trip
      )
    );
  };

  const handleCancelTrip = async () => {
    if (!activeTrip?._id) return;
    
    const confirmMsg = activeTrip.paymentStatus === "paid" 
      ? "Are you sure you want to cancel this booking? Since you have already paid, you will receive a 70% refund."
      : "Are you sure you want to cancel this booking?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await axios.put(
        `${apiBase}/api/bookings/${activeTrip._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking cancelled successfully.");
      fetchData();
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err?.response?.data?.message || "Failed to cancel booking.");
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTrip?._id) return;

    if (!packageRating) {
      alert("Please rate the package.");
      return;
    }

    if (reviewTrip?.guide && !guideRating) {
      alert("Please rate the guide.");
      return;
    }

    try {
      setSubmittingReview(true);

      await axios.post(
        `${apiBase}/api/reviews`,
        {
          bookingId: reviewTrip._id,
          packageRating,
          packageComment,
          guideRating: reviewTrip?.guide ? guideRating : null,
          guideComment: reviewTrip?.guide ? guideComment : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      markTripReviewedLocally(reviewTrip._id);
      closeReviewModal();
      alert("Review submitted successfully.");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err?.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (
    currentRating,
    currentHover,
    setRating,
    setHover,
    keyPrefix
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (currentHover || currentRating);

          return (
            <button
              key={`${keyPrefix}-${star}`}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition hover:scale-110"
            >
              <span
                className={`material-symbols-outlined text-[32px] ${
                  active ? "text-yellow-400" : "text-[#d1d5db]"
                }`}
                style={{
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                star
              </span>
            </button>
          );
        })}
      </div>
    );
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
            to="/explore"
            className="mt-5 inline-flex rounded-lg bg-[#1978e5] px-4 py-2 text-sm font-semibold text-white"
          >
            Explore Nepal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
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
              {!activeTrip || ["completed", "cancelled"].includes(String(activeTrip.status || "").toLowerCase()) ? (
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
                    to="/explore"
                    className="mt-6 inline-flex rounded-xl bg-[#1978e5] px-5 py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    Explore Nepal
                  </Link>
                </div>
              ) : (
                <>
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
                            <div className="flex items-center gap-3 flex-wrap">
                              <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                                {activePackage?.title || "Your Trip"}
                              </h2>

                              <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1">
                                <span
                                  className="material-symbols-outlined text-[18px] text-yellow-400"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                                <span className="text-xs font-bold text-[#2d3b2a]">
                                  {Number(activePackage?.averageRating || 0).toFixed(1)}
                                </span>
                                <span className="text-[10px] text-[#6b7280]">
                                  ({activePackage?.numReviews || 0})
                                </span>
                              </div>
                            </div>

                            <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
                              {activePackage?.description ||
                                `Get ready for your ${activePackage?.region || "Nepal"} adventure and manage your entire journey in one place.`}
                            </p>
                          </div>

                          {["pending", "confirmed"].includes(String(activeTrip.status || "").toLowerCase()) && (
                            <button
                              type="button"
                              onClick={handleCancelTrip}
                              className="rounded-xl border border-red-400 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-100 shadow-sm transition hover:bg-red-500/20"
                            >
                              Cancel Trip
                            </button>
                          )}

                          {canReviewTrip(activeTrip) && (
                            <button
                              type="button"
                              onClick={() => openReviewModal(activeTrip)}
                              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#2d3b2a] shadow-sm transition hover:opacity-90"
                            >
                              Rate Now
                            </button>
                          )}

                          {hasReviewedTrip(activeTrip) && (
                            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-700">
                              <span className="material-symbols-outlined text-[18px]">
                                check_circle
                              </span>
                              Reviewed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

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
                          <h3
                            className={`mt-2 text-lg font-bold ${getStatusTextClasses(
                              activeTrip.status
                            )}`}
                          >
                            {displayStatus(activeTrip.status)}
                          </h3>
                        </div>
                        <div
                          className={`rounded-xl p-3 ${getStatusIconBgClasses(
                            activeTrip.status
                          )}`}
                        >
                          <span
                            className={`material-symbols-outlined ${getStatusIconClasses(
                              activeTrip.status
                            )}`}
                          >
                            verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                      {pastTrips.length} {pastTrips.length === 1 ? "trip" : "trips"}
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
                        const image = buildImageUrl(pkg?.images?.[0])
                          ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

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

                                {trip.status === "cancelled" && trip.refundAmount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-red-500">
                                      payments
                                    </span>
                                    <span className="text-red-500 font-medium">Refunded: रु {trip.refundAmount}</span>
                                  </div>
                                )}
                              </div>

                              {canReviewTrip(trip) ? (
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(trip)}
                                  className="mt-4 w-full rounded-xl bg-[#1978e5] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                  Rate Now
                                </button>
                              ) : hasReviewedTrip(trip) ? (
                                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                                  <span className="material-symbols-outlined text-[18px]">
                                    check_circle
                                  </span>
                                  Reviewed
                                </div>
                              ) : (
                                <a
                                  href={`/packages/${trip.package?._id}`}
                                  className="mt-4 block w-full rounded-xl border border-[#e0e8dc] bg-white px-4 py-2.5 text-sm font-semibold text-center text-[#4b5563] transition hover:border-primary hover:bg-primary/5"
                                >
                                  View Package
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTrip && (
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
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

                  <div className="flex flex-col gap-6 lg:col-span-4">
                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                      <h3 className="mb-4 flex items-center gap-2 font-bold">
                        <span className="material-symbols-outlined text-[#1978e5]">
                          hiking
                        </span>
                        Assigned Guide
                      </h3>

                      {!activeTrip?.guideAssigned || !activeTrip?.guide ? (
                        <div className="text-center">
                          <div className="mb-3 flex justify-center">
                            <span className="material-symbols-outlined text-4xl text-amber-500">
                              schedule
                            </span>
                          </div>

                          <h4 className="font-semibold text-[#2d3b2a]">
                            Guide not assigned yet
                          </h4>
                          <p className="mt-1 text-sm text-[#6b7280]">
                            Your guide will be assigned by the agency soon.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4">
                            <img
                              src={getGuideImage()}
                              alt={guideName}
                              className="h-16 w-16 rounded-full object-cover border border-[#e0e8dc]"
                            />
                            <div>
                              <h4 className="font-bold text-[#2d3b2a]">
                                {guideName}
                              </h4>

                              <div className="mt-1 flex items-center gap-1">
                                <span
                                  className="material-symbols-outlined text-[18px] text-yellow-400"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                                <span className="text-sm font-semibold text-[#2d3b2a]">
                                  {Number(activeTrip?.guide?.averageRating || 0).toFixed(1)}
                                </span>
                                <span className="text-xs text-[#6b7280]">
                                  ({activeTrip?.guide?.numReviews || 0})
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-[#6b7280]">
                                {guideEmail}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-[#6b7280]">Phone</span>
                              <span className="font-semibold text-[#2d3b2a]">
                                {guidePhone}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-[#6b7280]">Status</span>
                              <span className="font-semibold text-emerald-600">
                                Assigned
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-xl border border-dashed border-[#d9e2ec] bg-[#fcfbf8] p-3 text-sm text-[#6b7280]">
                            Chat feature is not available yet.
                          </div>
                        </>
                      )}
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-bold">
                          <span className="material-symbols-outlined text-[#1978e5]">
                            partly_cloudy_day
                          </span>
                          Weather
                        </h3>
                        <span className="text-sm font-semibold text-[#6b7280]">
                          {activePackage?.region || "Destination"}
                        </span>
                      </div>

                      <div className="rounded-2xl border border-dashed border-[#d9e2ec] bg-[#fcfbf8] p-5 text-center">
                        <div className="mb-2 flex justify-center">
                          <span className="material-symbols-outlined text-4xl text-[#94a3b8]">
                            cloud_off
                          </span>
                        </div>
                        <p className="font-semibold text-[#2d3b2a]">
                          Weather feature not added yet
                        </p>
                        <p className="mt-1 text-sm text-[#6b7280]">
                          Live weather data will appear here once you connect the
                          weather API.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-bold">
                          <span className="material-symbols-outlined text-[#1978e5]">
                            checklist
                          </span>
                          Preparation
                        </h3>
                        <span className="text-xs font-bold text-[#94a3b8]">
                          Not Added
                        </span>
                      </div>

                      <div className="rounded-2xl border border-dashed border-[#d9e2ec] bg-[#fcfbf8] p-5 text-center">
                        <div className="mb-2 flex justify-center">
                          <span className="material-symbols-outlined text-4xl text-[#94a3b8]">
                            task_alt
                          </span>
                        </div>
                        <p className="font-semibold text-[#2d3b2a]">
                          Preparation checklist not available yet
                        </p>
                        <p className="mt-1 text-sm text-[#6b7280]">
                          Add checklist data from backend later if you want users
                          to track documents, gear, flights, and readiness.
                        </p>
                      </div>
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
      {reviewTrip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#2d3b2a]">
                  Rate Your Trip
                </h3>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Share your experience for{" "}
                  <span className="font-semibold text-[#2d3b2a]">
                    {reviewTrip?.package?.title || "this package"}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-lg p-2 text-[#6b7280] transition hover:bg-[#f3f4f6]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#e0e8dc] p-5">
                <p className="mb-3 text-base font-bold text-[#2d3b2a]">
                  Rate Package
                </p>

                {renderStars(
                  packageRating,
                  packageHoverRating,
                  setPackageRating,
                  setPackageHoverRating,
                  "package"
                )}

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-[#2d3b2a]">
                    Package Comment
                  </label>
                  <textarea
                    value={packageComment}
                    onChange={(e) => setPackageComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Write about the package, itinerary, activities, and overall experience..."
                    className="w-full rounded-xl border border-[#e0e8dc] px-4 py-3 text-sm text-[#2d3b2a] outline-none transition focus:border-[#1978e5]"
                  />
                </div>
              </div>

              {reviewTrip?.guide && (
                <div className="rounded-2xl border border-[#e0e8dc] p-5">
                  <p className="mb-3 text-base font-bold text-[#2d3b2a]">
                    Rate Guide
                  </p>

                  {renderStars(
                    guideRating,
                    guideHoverRating,
                    setGuideRating,
                    setGuideHoverRating,
                    "guide"
                  )}

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-[#2d3b2a]">
                      Guide Comment
                    </label>
                    <textarea
                      value={guideComment}
                      onChange={(e) => setGuideComment(e.target.value)}
                      rows={4}
                      maxLength={500}
                      placeholder="Write about the guide’s behavior, helpfulness, and support..."
                      className="w-full rounded-xl border border-[#e0e8dc] px-4 py-3 text-sm text-[#2d3b2a] outline-none transition focus:border-[#1978e5]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-xl border border-[#e0e8dc] px-4 py-2.5 text-sm font-semibold text-[#4b5563] transition hover:bg-[#f8fafc]"
                disabled={submittingReview}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="rounded-xl bg-[#1978e5] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}