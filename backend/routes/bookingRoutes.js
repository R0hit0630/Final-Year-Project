import express from "express";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import {
  assignGuide,
  completeBooking,
  getAgencyStats,
  getAgencyDashboardData,
  cancelBookingByUser,
  getMyTrips
} from "../controllers/bookingController.js";

const router = express.Router();


// ─── AUTO STATUS SYNC MIDDLEWARE ──────────────────────────────────────────────
// [FLOW FEATURE: STATUS AUTO-SYNC]
// This function runs BEFORE every booking read endpoint.
// It updates booking statuses in the database based on real dates — no cron job needed.
//   - "confirmed" trips where startDate has arrived  → become "ongoing"
//   - "ongoing" or "confirmed" trips where endDate passed → become "completed"
// This means statuses are always fresh when the user views their trips.
const syncCompletedBookings = async () => {
  const now = new Date();

  // Step 1: confirmed → ongoing (trip has started but not yet ended)
  await Booking.updateMany(
    {
      status: "confirmed",
      startDate: { $lte: now }, // start date is in the past or today
      endDate: { $gte: now },   // end date is still in the future
    },
    {
      $set: { status: "ongoing" },
    }
  );

  // Step 2: confirmed or ongoing → completed (trip end date has fully passed)
  await Booking.updateMany(
    {
      status: { $in: ["confirmed", "ongoing"] },
      endDate: { $lt: now }, // end date is now in the past
    },
    {
      $set: { status: "completed" },
    }
  );
};


// ─── CREATE BOOKING (PAY LATER) ───────────────────────────────────────────────
// [FLOW FEATURE: BOOKING - PAY LATER]
// POST /api/bookings  (Private - User)
// Creates a direct "pending" booking without going through eSewa.
// Used by the "Book Now, Pay Later" button on the PayWithEsewa page.
router.post("/", protect, async (req, res) => {
  try {
    const { packageId, travelers, startDate, notes } = req.body;

    // Step 1: Validate required fields
    if (!packageId || !travelers || !startDate) {
      return res.status(400).json({
        message: "packageId, travelers and startDate are required",
      });
    }

    // Step 2: Verify the package exists and is active
    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (!pkg.isActive) {
      return res.status(400).json({ message: "Package is not available" });
    }

    // Step 3: Parse the start date
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid start date" });
    }

    // Step 4: Calculate total price and trip end date from the package duration
    const totalPrice = Number(pkg.price) * Number(travelers);

    const end = new Date(start);
    end.setDate(end.getDate() + Number(pkg.days || 1) - 1);

    // Step 5: Create the Booking document with "pending" status (no payment yet)
    const booking = await Booking.create({
      user: req.user._id,
      package: pkg._id,
      travelers,
      startDate: start,
      endDate: end,
      totalPrice,
      notes: notes || "",
      status: "pending",
      paymentStatus: "pending", // No payment taken — Pay Later path
      guide: null,
      guideAssigned: false,
    });

    // Step 6: Return the booking with populated package and guide details
    const populatedBooking = await Booking.findById(booking._id)
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone");

    return res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ message: "Booking failed" });
  }
});


// ─── MY BOOKINGS (simple list) ────────────────────────────────────────────────
// [FLOW FEATURE: MY BOOKINGS]
// GET /api/bookings/my  (Private - User)
// Runs the status sync, then returns all bookings for the logged-in user as a flat list.
router.get("/my", protect, async (req, res) => {
  try {
    // Sync statuses before reading so the user always sees accurate states
    await syncCompletedBookings();

    const bookings = await Booking.find({ user: req.user._id })
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone")
      .sort({ startDate: -1 });

    return res.json(bookings);
  } catch (err) {
    console.error("Fetch my bookings error:", err);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


// ─── MY TRIPS (structured active + past) ─────────────────────────────────────
// [FLOW FEATURE: MY TRIPS]
// GET /api/bookings/my-trips  (Private - User)
// Syncs statuses first, then delegates to getMyTrips controller
// which splits bookings into activeTrip and pastTrips for the My Trips page.
router.get("/my-trips", protect, async (req, res, next) => {
  try {
    await syncCompletedBookings(); // Always sync before reading trips
    next();                         // Pass to getMyTrips controller below
  } catch (err) {
    next(err);
  }
}, getMyTrips);


// ─── AGENCY BOOKINGS ──────────────────────────────────────────────────────────
// [FLOW FEATURE: AGENCY DASHBOARD - BOOKINGS LIST]
// GET /api/bookings/agency  (Private - Agency only)
// Returns all bookings made for this agency's packages.
// Sync runs first so agency sees up-to-date statuses.
router.get("/agency", protect, requireRole("agency"), async (req, res) => {
  try {
    await syncCompletedBookings();

    // Find all packages that belong to this agency (active only)
    const myPackages = await Package.find({
      agency: req.user._id,
      isActive: true,
    }).select("_id");

    const packageIds = myPackages.map((pkg) => pkg._id);

    // Fetch all bookings for those packages with traveler, package, guide info
    const bookings = await Booking.find({
      package: { $in: packageIds },
    })
      .populate("user", "username fullName email phone")
      .populate("package", "title region price days agency")
      .populate("guide", "name fullName email phone")
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (err) {
    console.error("Fetch agency bookings error:", err);
    return res.status(500).json({ message: "Failed to fetch agency bookings" });
  }
});


// ─── AGENCY STATS & DASHBOARD ─────────────────────────────────────────────────
// [FLOW FEATURE: AGENCY DASHBOARD]
// GET /api/bookings/agency/dashboard  → Full dashboard payload (stats, packages, departures)
// GET /api/bookings/agency/stats      → Summary stats only (total bookings + avg rating)
router.get("/agency/dashboard", protect, requireRole("agency"), getAgencyDashboardData);
router.get("/agency/stats", protect, requireRole("agency"), getAgencyStats);


// ─── GET SINGLE BOOKING ───────────────────────────────────────────────────────
// [FLOW FEATURE: BOOKING DETAIL]
// GET /api/bookings/:id  (Private - User)
// Returns a single booking by ID, only if it belongs to the logged-in user.
router.get("/:id", protect, async (req, res) => {
  try {
    await syncCompletedBookings();

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id, // Security: only return if this user owns the booking
    })
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json(booking);
  } catch (err) {
    console.error("Fetch booking details error:", err);
    return res.status(500).json({ message: "Failed to fetch booking details" });
  }
});


// ─── ASSIGN GUIDE / COMPLETE BOOKING ─────────────────────────────────────────
// [FLOW FEATURE: GUIDE ASSIGNMENT]
// PUT /api/bookings/:id/assign-guide  → Agency assigns a guide to a booking
// PUT /api/bookings/:id/complete      → Agency manually marks booking as completed
router.put("/:id/assign-guide", protect, requireRole("agency"), assignGuide);
router.put("/:id/complete", protect, requireRole("agency"), completeBooking);

// ─── CANCEL BOOKING ───────────────────────────────────────────────────────────
// [FLOW FEATURE: CANCEL BOOKING]
// PUT /api/bookings/:id/cancel  (Private - User only)
// User cancels their own booking. 70% refund is calculated if payment was made.
router.put("/:id/cancel", protect, requireRole("user"), cancelBookingByUser);

export default router;