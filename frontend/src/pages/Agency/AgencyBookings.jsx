import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE as apiBase } from "../../config/api.js";

export default function AgencyBookings() {
  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };

  const [bookings, setBookings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedGuides, setSelectedGuides] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState("");
  const [completingId, setCompletingId] = useState("");
  const [error, setError] = useState("");
  const [guidesError, setGuidesError] = useState("");



  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      setGuidesError("");

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const bookingsPromise = axios.get(`${apiBase}/api/bookings/agency`, config);
      const guidesPromise = axios.get(`${apiBase}/api/guides/mine`, config);

      const [bookingsResult, guidesResult] = await Promise.allSettled([
        bookingsPromise,
        guidesPromise,
      ]);

      if (bookingsResult.status === "fulfilled") {
        const bookingsData =
          bookingsResult.value.data?.bookings || bookingsResult.value.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } else {
        console.error("Error loading bookings:", bookingsResult.reason);
        setError(
          bookingsResult.reason?.response?.data?.message ||
            "Failed to load bookings"
        );
        setBookings([]);
      }

      if (guidesResult.status === "fulfilled") {
        const guidesData =
          guidesResult.value.data?.guides || guidesResult.value.data || [];
        setGuides(Array.isArray(guidesData) ? guidesData : []);
      } else {
        console.error("Error loading guides:", guidesResult.reason);
        setGuidesError("Guide list could not be loaded.");
        setGuides([]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Failed to load page data");
      setBookings([]);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGuideSelect = (bookingId, guideId) => {
    setSelectedGuides((prev) => ({
      ...prev,
      [bookingId]: guideId,
    }));
  };

  const handleAssignGuide = async (bookingId) => {
    try {
      const guideId = selectedGuides[bookingId];

      if (!guideId) {
        alert("Please select a guide first");
        return;
      }

      setAssigningId(bookingId);
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiBase}/api/bookings/${bookingId}/assign-guide`,
        { guideId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Guide assigned successfully");
      await fetchData();
    } catch (error) {
      console.error("Assign guide error:", error);
      alert(error?.response?.data?.message || "Failed to assign guide");
    } finally {
      setAssigningId("");
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    if (!window.confirm("Are you sure you want to mark this trip as completed?")) {
      return;
    }

    try {
      setCompletingId(bookingId);
      const token = localStorage.getItem("token");

      await axios.put(
        `${apiBase}/api/bookings/${bookingId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Trip marked as completed successfully");
      await fetchData();
    } catch (error) {
      console.error("Complete trip error:", error);
      alert(error?.response?.data?.message || "Failed to complete trip");
    } finally {
      setCompletingId("");
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    return [
      {
        label: "Total Bookings",
        value: total,
        icon: "book_online",
      },
      {
        label: "Pending Approval",
        value: pending,
        sub: "need review",
        icon: "schedule",
      },
      {
        label: "Confirmed Trips",
        value: confirmed,
        sub: "active bookings",
        icon: "check_circle",
      },
      {
        label: "Cancelled",
        value: cancelled,
        sub: "this season",
        icon: "cancel",
      },
    ];
  }, [bookings]);

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

        {item.sub && (
          <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>
        )}
      </div>
    </div>
  );

  const getBookingBadge = (status) => {
    if (status === "confirmed") {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    if (status === "pending") {
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
    if (status === "completed") {
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    }
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  const getPaymentBadge = (status) => {
    if (status === "paid") {
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    }
    if (status === "pending") {
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
    return "bg-stone-500/10 text-stone-700 border-stone-500/20";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `रु ${Number(amount).toLocaleString()}`;
  };

  const isCurrentlyOnLeave = (guide) => {
    if (!guide?.leaveStartDate || !guide?.leaveEndDate) return false;
    const now = new Date();
    const start = new Date(guide.leaveStartDate);
    const end = new Date(guide.leaveEndDate);
    return now >= start && now <= end;
  };

  const getGuideConflictStatus = (guide, booking) => {
    if (!guide) {
      return { available: false, reason: "Invalid guide" };
    }

    if (!guide.isActive) {
      return { available: false, reason: "Inactive" };
    }

    const bookingStart = booking?.startDate ? new Date(booking.startDate) : null;
    const bookingEnd = booking?.endDate ? new Date(booking.endDate) : null;

    if (!bookingStart || !bookingEnd) {
      return { available: false, reason: "Invalid trip dates" };
    }

    if (guide.leaveStartDate && guide.leaveEndDate) {
      const leaveStart = new Date(guide.leaveStartDate);
      const leaveEnd = new Date(guide.leaveEndDate);

      if (bookingStart <= leaveEnd && bookingEnd >= leaveStart) {
        return { available: false, reason: "On leave" };
      }
    }

    const hasConflict = bookings.some((otherBooking) => {
      if (!otherBooking?._id || otherBooking._id === booking._id) return false;
      if (!otherBooking.guide?._id) return false;
      if (otherBooking.guide._id !== guide._id) return false;
      if (!["pending", "confirmed", "ongoing"].includes(otherBooking.status)) {
        return false;
      }

      const otherStart = otherBooking.startDate
        ? new Date(otherBooking.startDate)
        : null;
      const otherEnd = otherBooking.endDate ? new Date(otherBooking.endDate) : null;

      if (!otherStart || !otherEnd) return false;

      return otherStart <= bookingEnd && otherEnd >= bookingStart;
    });

    if (hasConflict) {
      return { available: false, reason: "Busy on another trip" };
    }

    return { available: true, reason: "Available" };
  };

  const getAvailableGuidesForBooking = (booking) => {
    return guides.filter((guide) => getGuideConflictStatus(guide, booking).available);
  };

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
                <h1 className="text-3xl font-bold tracking-tight text-[#2d3b2a]">
                  Agency Bookings
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Track who booked, when they booked, and assign guides to confirmed trips.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 12px 30px rgba(25,120,229,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export Bookings
                </button>
              </div>
            </div>

            {guidesError && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {guidesError} Booking list is still available.
              </div>
            )}

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: COLORS.primary }}
                  >
                    receipt_long
                  </span>
                  Booking Records
                </h3>

                <div className="flex gap-2">
                  <button
                    className="rounded p-1 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#2d3b2a]"
                    type="button"
                    aria-label="Filter"
                  >
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button
                    className="rounded p-1 text-[#6b7280] transition-colors hover:bg-gray-100 hover:text-[#2d3b2a]"
                    type="button"
                    aria-label="More"
                  >
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-10 text-center text-sm font-medium text-[#6b7280]">
                  Loading bookings...
                </div>
              ) : error ? (
                <div className="py-10 text-center text-sm font-medium text-red-600">
                  {error}
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-10 text-center text-sm font-medium text-[#6b7280]">
                  No bookings found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Customer
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Package
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Booked On
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Travel Date
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          End Date
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Travelers
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Amount
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Payment
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Booking
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Guide
                        </th>
                        <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-sm">
                      {bookings.map((row) => {
                        const availableGuides = getAvailableGuidesForBooking(row);

                        return (
                          <tr
                            key={row._id}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="py-4">
                              <div>
                                <p className="font-semibold text-[#2d3b2a]">
                                  {row.user?.name || row.user?.username || "User"}
                                </p>
                                <p className="text-xs text-[#6b7280]">
                                  {row.user?.email || "-"}
                                </p>
                                <p className="text-xs text-[#94a3b8]">
                                  {row.user?.phone || "-"}
                                </p>
                              </div>
                            </td>

                            <td className="py-4 font-medium text-[#2d3b2a]">
                              {row.package?.title || row.package?.name || "Package"}
                            </td>

                            <td className="py-4 text-[#4b5563]">
                              {formatDate(row.createdAt)}
                            </td>

                            <td className="py-4 text-[#4b5563]">
                              {formatDate(row.startDate)}
                            </td>

                            <td className="py-4 text-[#4b5563]">
                              {formatDate(row.endDate)}
                            </td>

                            <td className="py-4 text-[#4b5563]">{row.travelers}</td>

                            <td className="py-4">
                              <p className={`font-semibold ${row.status === 'cancelled' ? 'text-amber-600' : 'text-[#2d3b2a]'}`}>
                                {formatPrice(row.status === "cancelled" ? (row.totalPrice - (row.refundAmount || 0)) : row.totalPrice)}
                              </p>
                              {row.status === "cancelled" && (
                                <p className="text-xs text-red-500 line-through">
                                  {formatPrice(row.totalPrice)}
                                </p>
                              )}
                            </td>

                            <td className="py-4">
                              <span
                                className={[
                                  "rounded-full border px-3 py-1 text-xs font-bold capitalize",
                                  getPaymentBadge(row.paymentStatus),
                                ].join(" ")}
                              >
                                {row.paymentStatus}
                              </span>
                            </td>

                            <td className="py-4">
                              <span
                                className={[
                                  "rounded-full border px-3 py-1 text-xs font-bold capitalize",
                                  getBookingBadge(row.status),
                                ].join(" ")}
                              >
                                {row.status}
                              </span>
                            </td>

                            <td className="py-4">
                              {row.guideAssigned && row.guide ? (
                                <div>
                                  <p className="font-semibold text-[#2d3b2a]">
                                    {row.guide?.name || row.guide?.fullName || "Assigned"}
                                  </p>
                                  <p className="text-xs text-[#6b7280]">
                                    {row.guide?.email || ""}
                                  </p>
                                  {isCurrentlyOnLeave(row.guide) && (
                                    <p className="text-xs font-medium text-yellow-700">
                                      Currently on leave
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs font-medium text-amber-600">
                                  Not assigned
                                </span>
                              )}
                            </td>

                            <td className="py-4 text-right">
                              {["pending", "confirmed"].includes(row.status) &&
                              !row.guideAssigned ? (
                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex items-center justify-end gap-2">
                                    <select
                                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#2d3b2a] outline-none"
                                      value={selectedGuides[row._id] || ""}
                                      onChange={(e) =>
                                        handleGuideSelect(row._id, e.target.value)
                                      }
                                      disabled={availableGuides.length === 0}
                                    >
                                      <option value="">
                                        {availableGuides.length === 0
                                          ? "No available guides"
                                          : "Select Guide"}
                                      </option>

                                      {availableGuides.map((guide) => (
                                        <option key={guide._id} value={guide._id}>
                                          {guide.name || guide.fullName || "Guide"}
                                        </option>
                                      ))}
                                    </select>

                                    <button
                                      type="button"
                                      onClick={() => handleAssignGuide(row._id)}
                                      disabled={
                                        assigningId === row._id ||
                                        availableGuides.length === 0 ||
                                        !selectedGuides[row._id]
                                      }
                                      className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {assigningId === row._id ? "Assigning..." : "Assign"}
                                    </button>
                                  </div>

                                  {availableGuides.length === 0 && (
                                    <span className="text-xs font-medium text-red-600">
                                      No guides available for these dates
                                    </span>
                                  )}
                                </div>
                              ) : row.guideAssigned && ["confirmed", "ongoing"].includes(row.status) ? (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteTrip(row._id)}
                                  disabled={completingId === row._id}
                                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                                >
                                  {completingId === row._id ? "Processing..." : "Complete Trip"}
                                </button>
                              ) : row.guideAssigned ? (
                                <span className="text-xs font-semibold text-emerald-600">
                                  Guide assigned
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#2d3b2a] transition-colors hover:bg-gray-50"
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {guides.length > 0 && (
              <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">
                  Guide Availability Overview
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {guides.map((guide) => {
                    const currentlyOnLeave = isCurrentlyOnLeave(guide);

                    return (
                      <div
                        key={guide._id}
                        className="rounded-xl border border-gray-200 bg-[#fcfbf8] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#2d3b2a]">
                              {guide.name || guide.fullName || "Guide"}
                            </p>
                            <p className="text-xs text-[#6b7280]">
                              {guide.email || "-"}
                            </p>
                          </div>

                          {!guide.isActive ? (
                            <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                              Inactive
                            </span>
                          ) : currentlyOnLeave ? (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                              On Leave
                            </span>
                          ) : (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                              Available
                            </span>
                          )}
                        </div>

                        {guide.leaveStartDate && guide.leaveEndDate && (
                          <p className="mt-2 text-xs text-[#6b7280]">
                            Leave: {formatDate(guide.leaveStartDate)} -{" "}
                            {formatDate(guide.leaveEndDate)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-2 border-t border-[#e5e7eb] pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
              <p>Agency booking management overview</p>
              <p>Updated for guide assignment flow</p>
            </div>
          </div>
        </main>
  );
}