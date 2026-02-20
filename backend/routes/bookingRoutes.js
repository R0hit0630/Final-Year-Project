import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create a booking
router.post("/", protect, async (req, res) => {
  try {
    const { packageId, travelers, startDate, notes } = req.body;

    const booking = await Booking.create({
      user: req.user._id, // comes from auth middleware
      package: packageId,
      travelers,
      startDate,
      notes,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Get bookings for logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("package", "title price")
      .populate("user", "username email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

export default router;