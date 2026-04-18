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


// 🔥 AUTO SYNC STATUS (FIXED)
const syncCompletedBookings = async () => {
  const now = new Date();

  // Completed
  await Booking.updateMany(
    {
      status: { $in: ["confirmed", "ongoing"] },
      endDate: { $lt: now },
    },
    {
      $set: { status: "completed" },
    }
  );

  // Ongoing
  await Booking.updateMany(
    {
      status: "confirmed",
      startDate: { $lte: now },
      endDate: { $gte: now },
    },
    {
      $set: { status: "ongoing" },
    }
  );
};


// ================= CREATE BOOKING =================
router.post("/", protect, async (req, res) => {
  try {
    const { packageId, travelers, startDate, notes } = req.body;

    if (!packageId || !travelers || !startDate) {
      return res.status(400).json({
        message: "packageId, travelers and startDate are required",
      });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (!pkg.isActive) {
      return res.status(400).json({ message: "Package is not available" });
    }

    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid start date" });
    }

    const totalPrice = Number(pkg.price) * Number(travelers);

    const end = new Date(start);
    end.setDate(end.getDate() + Number(pkg.days || 1) - 1);

    const booking = await Booking.create({
      user: req.user._id,
      package: pkg._id,
      travelers,
      startDate: start,
      endDate: end,
      totalPrice,
      notes: notes || "",
      status: "pending",
      paymentStatus: "pending",
      guide: null,
      guideAssigned: false,
    });

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


// ================= MY BOOKINGS =================
router.get("/my", protect, async (req, res) => {
  try {
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


// ================= 🔥 FIXED MY TRIPS =================
router.get("/my-trips", protect, async (req, res, next) => {
  // Sync before fetching
  try {
    await syncCompletedBookings();
    next();
  } catch (err) {
    next(err);
  }
}, getMyTrips);


// ================= AGENCY BOOKINGS =================
router.get("/agency", protect, requireRole("agency"), async (req, res) => {
  try {
    await syncCompletedBookings();

    const myPackages = await Package.find({
      agency: req.user._id,
      isActive: true,
    }).select("_id");

    const packageIds = myPackages.map((pkg) => pkg._id);

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


// ================= AGENCY STATS & DASHBOARD =================
router.get("/agency/dashboard", protect, requireRole("agency"), getAgencyDashboardData);
router.get("/agency/stats", protect, requireRole("agency"), getAgencyStats);


// ================= GET SINGLE BOOKING =================
router.get("/:id", protect, async (req, res) => {
  try {
    await syncCompletedBookings();

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
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


// ================= ASSIGN GUIDE =================
router.put("/:id/assign-guide", protect, requireRole("agency"), assignGuide);
router.put("/:id/complete", protect, requireRole("agency"), completeBooking);

// ================= CANCEL BOOKING =================
router.put("/:id/cancel", protect, cancelBookingByUser);

export default router;