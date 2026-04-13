import express from "express";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { assignGuide } from "../controllers/bookingController.js";

const router = express.Router();

// Create booking
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
    end.setDate(end.getDate() + Number(pkg.days || 0) - 1);

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

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Get all bookings for logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone")
      .sort({ startDate: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch my bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Get current trip + past trips for MyTrips page
router.get("/my-trips", protect, async (req, res) => {
  try {
    const now = new Date();

    const bookings = await Booking.find({
      user: req.user._id,
      status: { $ne: "cancelled" },
    })
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone")
      .sort({ startDate: 1, createdAt: -1 });

    let activeTrip = null;

    for (const booking of bookings) {
      const start = booking.startDate ? new Date(booking.startDate) : null;
      const end = booking.endDate ? new Date(booking.endDate) : null;

      const isCurrentOrUpcoming =
        booking.status === "confirmed" &&
        ((start && start >= now) || (start && end && start <= now && end >= now));

      if (isCurrentOrUpcoming) {
        activeTrip = booking;
        break;
      }
    }

    const pastTrips = bookings.filter((booking) => {
      const end = booking.endDate ? new Date(booking.endDate) : null;
      const start = booking.startDate ? new Date(booking.startDate) : null;

      return (
        booking.status === "completed" ||
        (end && end < now) ||
        (!end && start && start < now)
      );
    });

    res.json({
      activeTrip,
      pastTrips,
    });
  } catch (err) {
    console.error("Fetch my trips error:", err);
    res.status(500).json({ message: "Failed to fetch my trips" });
  }
});

// Get all bookings for agency
router.get("/agency", protect, requireRole("agency"), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username name email phone")
      .populate("package", "title name region price days")
      .populate("guide", "name fullName email phone")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    console.error("Fetch agency bookings error:", err);
    res.status(500).json({ message: "Failed to fetch agency bookings" });
  }
});

// Get single booking details
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate("package", "title region price days difficulty images itinerary")
      .populate("guide", "name fullName email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Fetch booking details error:", err);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
});

// Assign guide to booking
router.put(
  "/:id/assign-guide",
  protect,
  requireRole("agency"),
  assignGuide
);

export default router;