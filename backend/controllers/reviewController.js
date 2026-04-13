import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import Guide from "../models/Guide.js";
import User from "../models/user.js";

// helper: recalculate package rating
const updatePackageRating = async (packageId) => {
  const reviews = await Review.find({ package: packageId });

  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  await Package.findByIdAndUpdate(packageId, {
    averageRating,
    numReviews,
  });
};

// helper: recalculate guide rating
const updateGuideRating = async (guideId) => {
  if (!guideId) return;

  const reviews = await Review.find({ guide: guideId });

  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  await Guide.findByIdAndUpdate(guideId, {
    averageRating,
    numReviews,
  });
};

// helper: recalculate agency rating
const updateAgencyRating = async (agencyId) => {
  if (!agencyId) return;

  const reviews = await Review.find({ agency: agencyId });

  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  await User.findByIdAndUpdate(agencyId, {
    averageRating,
    numReviews,
  });
};

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        message: "Booking ID and rating are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // make sure logged-in user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to review this booking",
      });
    }

    // only completed booking can be reviewed
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Only completed bookings can be reviewed",
      });
    }

    // prevent duplicate review
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    const newReview = await Review.create({
      user: req.user._id,
      booking: booking._id,
      package: booking.package,
      agency: booking.agency,
      guide: booking.guide || null,
      rating,
      comment: comment || "",
    });

    // mark booking reviewed
    booking.isReviewed = true;
    await booking.save();

    // update averages
    await updatePackageRating(booking.package);
    if (booking.guide) await updateGuideRating(booking.guide);
    if (booking.agency) await updateAgencyRating(booking.agency);

    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(500).json({
      message: "Server error while creating review",
    });
  }
};

// GET PACKAGE REVIEWS
export const getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId })
      .populate("user", "name username email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("getPackageReviews error:", error);
    res.status(500).json({
      message: "Server error while fetching package reviews",
    });
  }
};

// GET GUIDE REVIEWS
export const getGuideReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ guide: req.params.guideId })
      .populate("user", "name username email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("getGuideReviews error:", error);
    res.status(500).json({
      message: "Server error while fetching guide reviews",
    });
  }
};

// GET AGENCY REVIEWS
export const getAgencyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ agency: req.params.agencyId })
      .populate("user", "name username email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("getAgencyReviews error:", error);
    res.status(500).json({
      message: "Server error while fetching agency reviews",
    });
  }
};