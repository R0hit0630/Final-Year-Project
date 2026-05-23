import Booking from "../models/Booking.js";
import Guide from "../models/Guide.js";
import Package from "../models/Package.js";

// ─── GET MY TRIPS ─────────────────────────────────────────────────────────────
// [FLOW FEATURE: MY TRIPS - BACKEND]
// GET /api/bookings/my-trips  (Private - requires logged-in user JWT)
// NOTE: Before this runs, the syncCompletedBookings middleware auto-updates statuses:
//   - "confirmed" trips whose startDate has passed → become "ongoing"
//   - "ongoing" trips whose endDate has passed     → become "completed"
export const getMyTrips = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Fetch all bookings for this user, with populated package and guide details
    const bookings = await Booking.find({ user: userId })
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone averageRating numReviews")
      .sort({ createdAt: -1 });

    const activeTrips = [];
    const pastTrips = [];

    // Step 2: Sort bookings into active (upcoming) and past (done/cancelled) lists
    for (const booking of bookings) {
      // Status is already synced by syncCompletedBookings middleware before this call
      const status = String(booking.status || "").toLowerCase();

      // Active = still in progress or upcoming
      if (["pending", "confirmed", "ongoing"].includes(status)) {
        activeTrips.push(booking);
      }

      // Past = finished or cancelled
      if (["completed", "cancelled"].includes(status)) {
        pastTrips.push(booking);
      }
    }

    // Return the most recent active trip as the primary "activeTrip"
    return res.json({
      activeTrip: activeTrips.length > 0 ? activeTrips[0] : null,
      activeTrips, // All active trips
      pastTrips,
    });
  } catch (error) {
    console.error("getMyTrips error:", error);
    return res.status(500).json({
      message: "Failed to fetch trips",
    });
  }
};

// ─── ASSIGN GUIDE ─────────────────────────────────────────────────────────────
// [FLOW FEATURE: GUIDE ASSIGNMENT - BACKEND]
// PUT /api/bookings/:id/assign-guide  (Private - Agency only)
// Called from the Agency dashboard to assign a guide to a confirmed booking.
// Checks: guide belongs to agency, guide is active, and no scheduling conflicts.
export const assignGuide = async (req, res) => {
  try {
    const { guideId } = req.body;

    if (!guideId) {
      return res.status(400).json({ message: "guideId is required" });
    }

    const booking = await Booking.findById(req.params.id).populate("package");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.package) {
      return res.status(404).json({ message: "Package not found for this booking" });
    }

    // Security: only the agency that owns the package can assign guides
    if (booking.package.agency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Step 1: Verify the guide exists and belongs to this agency
    const guide = await Guide.findOne({
      _id: guideId,
      agency: req.user._id,
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.isActive) {
      return res.status(400).json({ message: "Guide is inactive" });
    }

    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);

    // Step 2: Check if the guide is on approved leave during the trip dates
    if (guide.leaveStartDate && guide.leaveEndDate) {
      const leaveStart = new Date(guide.leaveStartDate);
      const leaveEnd = new Date(guide.leaveEndDate);

      if (bookingStart <= leaveEnd && bookingEnd >= leaveStart) {
        return res.status(400).json({
          message: "Guide is on leave during this trip",
        });
      }
    }

    // Step 3: Check if the guide is already assigned to another overlapping booking
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      guide: guide._id,
      status: { $in: ["pending", "confirmed", "ongoing"] },
      startDate: { $lte: bookingEnd },
      endDate: { $gte: bookingStart },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Guide already assigned to another booking in this period",
      });
    }

    // Step 4: Assign the guide and set booking status to "confirmed"
    booking.guide = guide._id;
    booking.guideAssigned = true;
    booking.status = "confirmed";

    await booking.save();

    // Return the fully populated booking for the agency dashboard to display
    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "username fullName email phone")
      .populate("package", "title region price days agency")
      .populate("guide", "name fullName email phone averageRating numReviews");

    return res.json({
      message: "Guide assigned successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("assignGuide error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── COMPLETE BOOKING ─────────────────────────────────────────────────────────
// [FLOW FEATURE: BOOKING STATUS - BACKEND]
// PUT /api/bookings/:id/complete  (Private - Agency only)
// Allows the agency to manually mark a booking as "completed"
// (status is also auto-updated by syncCompletedBookings middleware)
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("package");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the agency that owns the package can complete it
    if (booking.package.agency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Booking is already completed" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Cannot complete a cancelled booking" });
    }

    booking.status = "completed";
    await booking.save();

    return res.json({
      message: "Booking marked as completed",
      booking,
    });
  } catch (error) {
    console.error("completeBooking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── CANCEL BOOKING ───────────────────────────────────────────────────────────
// [FLOW FEATURE: CANCEL BOOKING - BACKEND]
// PUT /api/bookings/:id/cancel  (Private - User)
// Allows a traveler to cancel their own booking.
// If they already paid, a 70% refund amount is calculated and stored.
export const cancelBookingByUser = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Cannot cancel a trip that is already underway or finished
    if (["ongoing", "completed"].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel an ongoing or completed trip" });
    }

    // Refund logic: if the user already paid, store 70% of total as the refundAmount
    if (booking.paymentStatus === "paid") {
      booking.refundAmount = booking.totalPrice * 0.7; // 70% refund
      booking.refundStatus = "pending";
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({
      message: "Booking cancelled successfully. A 70% refund is being processed if you had already paid.",
      booking,
    });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ message: "Failed to cancel booking" });
  }
};

// ─── GET AGENCY STATS ─────────────────────────────────────────────────────────
// [FLOW FEATURE: AGENCY DASHBOARD]
// GET /api/bookings/agency/stats  (Private - Agency)
// Returns summary counts: total bookings and weighted average rating across all packages
export const getAgencyStats = async (req, res) => {
  try {
    const agencyId = req.user._id;

    // Step 1: Get all packages owned by this agency
    const packages = await Package.find({ agency: agencyId }).select(
      "_id averageRating numReviews"
    );

    if (!packages.length) {
      return res.json({
        totalBookings: 0,
        avgRating: 0,
      });
    }

    const packageIds = packages.map((pkg) => pkg._id);

    // Step 2: Count all bookings made for any of this agency's packages
    const totalBookings = await Booking.countDocuments({
      package: { $in: packageIds },
    });

    // Step 3: Calculate weighted average rating across all packages
    let weightedRatingSum = 0;
    let totalReviews = 0;

    for (const pkg of packages) {
      const avg = Number(pkg.averageRating || 0);
      const reviews = Number(pkg.numReviews || 0);

      weightedRatingSum += avg * reviews;
      totalReviews += reviews;
    }

    const avgRating =
      totalReviews > 0
        ? Number((weightedRatingSum / totalReviews).toFixed(1))
        : 0;

    return res.json({
      totalBookings,
      avgRating,
    });
  } catch (error) {
    console.error("getAgencyStats error:", error);
    return res.status(500).json({ message: "Failed to fetch agency stats" });
  }
};

// ─── GET AGENCY DASHBOARD DATA ────────────────────────────────────────────────
// [FLOW FEATURE: AGENCY DASHBOARD]
// GET /api/bookings/agency/dashboard  (Private - Agency)
// Builds the full dashboard payload: stats cards, package occupancy, and upcoming departures
export const getAgencyDashboardData = async (req, res) => {
  try {
    const agencyId = req.user._id;

    // 1. Fetch Packages owned by this agency
    const packages = await Package.find({ agency: agencyId });
    const packageIds = packages.map((pkg) => pkg._id);

    // 2. Fetch all Bookings for those packages (with traveler, package, guide details)
    const bookings = await Booking.find({ package: { $in: packageIds } })
      .populate("user", "username fullName email phone avatar profileImage")
      .populate("package", "title days price maxGroupSize images")
      .populate("guide", "name fullName avatar photo");

    // 3. Fetch Active Guides count for this agency
    const activeGuidesCount = await Guide.countDocuments({
      agency: agencyId,
      isActive: true,
    });

    // --- CALCULATE STATS ---
    const totalBookings = bookings.length;

    // Monthly Revenue: total of paid bookings from the first day of this month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let monthlyRevenue = 0;
    let weightedRatingSum = 0;
    let totalReviews = 0;

    for (const b of bookings) {
      if (
        b.paymentStatus === "paid" &&
        new Date(b.createdAt) >= firstDayOfMonth
      ) {
        // Deduct refund amount if cancelled (keep what was retained)
        const earned = b.status === "cancelled" ? (b.totalPrice - (b.refundAmount || 0)) : b.totalPrice;
        monthlyRevenue += Number(earned || 0);
      }
    }

    // Weighted average rating across all packages
    for (const pkg of packages) {
      const avg = Number(pkg.averageRating || 0);
      const reviews = Number(pkg.numReviews || 0);
      weightedRatingSum += avg * reviews;
      totalReviews += reviews;
    }

    const avgRating = totalReviews > 0 ? Number((weightedRatingSum / totalReviews).toFixed(1)) : 0;

    const stats = {
      totalBookings,
      monthlyRevenue,
      avgRating,
      activeGuides: activeGuidesCount,
    };

    // --- FORMAT PACKAGES ---
    // Calculate occupancy percentage based on active travelers vs maxGroupSize
    const packageStats = packages.map((pkg) => {
      const pkgBookings = bookings.filter(
        (b) =>
          b.package?._id.toString() === pkg._id.toString() &&
          ["pending", "confirmed", "ongoing"].includes(b.status)
      );

      // Find the next upcoming departure date
      const upcoming = pkgBookings
        .filter((b) => new Date(b.startDate) >= new Date())
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      const nextDeparture = upcoming.length > 0 ? upcoming[0].startDate : null;
      
      const totalTravelers = pkgBookings.reduce((sum, b) => sum + (b.travelers || 1), 0);
      const capacity = Math.max(Number(pkg.maxGroupSize || 10), 1);
      // Cap occupancy percentage at 100%
      const pct = Math.min(Math.round((totalTravelers / capacity) * 100), 100);

      return {
        _id: pkg._id,
        title: pkg.title,
        days: `${pkg.days} Days`,
        img: pkg.images?.[0] || "",
        // Label packages as High Demand, Steady, or Available based on occupancy
        status: pct > 80 ? "High Demand" : pct > 40 ? "Steady" : "Available",
        pct: pct,
        next: nextDeparture ? new Date(nextDeparture).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A",
      };
    });

    // --- FORMAT DEPARTURES ---
    // List the next 10 upcoming active bookings for the departures table
    const upcomingBookings = bookings
      .filter((b) => ["pending", "confirmed", "ongoing"].includes(b.status))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 10); // Limit to top 10

    const departures = upcomingBookings.map((b) => {
      return {
        _id: b._id,
        pkg: b.package?.title || "Unknown Package",
        group: `Grp-${b._id.toString().slice(-4).toUpperCase()}`,
        date: b.startDate ? new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
        guide: b.guide ? { 
          name: b.guide.fullName || b.guide.name, 
          avatar: b.guide.photo || b.guide.avatar || "" 
        } : null,
        clients: {
          avatars: b.user ? [b.user.profileImage || b.user.avatar || ""] : [],
          extra: b.travelers > 1 ? `+${b.travelers - 1}` : null
        },
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
      };
    });

    return res.json({
      stats,
      packages: packageStats,
      departures,
    });
  } catch (error) {
    console.error("getAgencyDashboardData error:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};