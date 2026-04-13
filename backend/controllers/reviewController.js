import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import Guide from "../models/Guide.js";
import User from "../models/user.js";

// helper: recalculate package rating
const updatePackageRating = async (packageId) => {
  if (!packageId) return;

  const reviews = await Review.find({
    package: packageId,
    type: "package",
  });

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

  const reviews = await Review.find({
    guide: guideId,
    type: "guide",
  });

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
    const {
      bookingId,
      packageRating,
      packageComment,
      guideRating,
      guideComment,
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to review this booking",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Only completed bookings can be reviewed",
      });
    }

    if (booking.isReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    const pkg = await Package.findById(booking.package).select("agency");

    if (!pkg) {
      return res.status(404).json({
        message: "Package not found for this booking",
      });
    }

    const createdReviews = [];

    // package review is required
    const parsedPackageRating = Number(packageRating);
    if (
      Number.isNaN(parsedPackageRating) ||
      parsedPackageRating < 1 ||
      parsedPackageRating > 5
    ) {
      return res.status(400).json({
        message: "Package rating must be between 1 and 5",
      });
    }

    const existingPackageReview = await Review.findOne({
      booking: booking._id,
      user: req.user._id,
      type: "package",
    });

    if (existingPackageReview) {
      return res.status(400).json({
        message: "Package review already exists for this booking",
      });
    }

    const packageReview = await Review.create({
      user: req.user._id,
      booking: booking._id,
      type: "package",
      package: booking.package,
      agency: pkg.agency || null,
      guide: null,
      rating: parsedPackageRating,
      comment: packageComment || "",
    });

    createdReviews.push(packageReview);

    // guide review is optional if no guide assigned, otherwise required
    if (booking.guide) {
      const parsedGuideRating = Number(guideRating);

      if (
        Number.isNaN(parsedGuideRating) ||
        parsedGuideRating < 1 ||
        parsedGuideRating > 5
      ) {
        return res.status(400).json({
          message: "Guide rating must be between 1 and 5",
        });
      }

      const existingGuideReview = await Review.findOne({
        booking: booking._id,
        user: req.user._id,
        type: "guide",
      });

      if (existingGuideReview) {
        return res.status(400).json({
          message: "Guide review already exists for this booking",
        });
      }

      const guideReview = await Review.create({
        user: req.user._id,
        booking: booking._id,
        type: "guide",
        package: null,
        agency: pkg.agency || null,
        guide: booking.guide,
        rating: parsedGuideRating,
        comment: guideComment || "",
      });

      createdReviews.push(guideReview);
    }

    booking.isReviewed = true;
    await booking.save();

    await updatePackageRating(booking.package);
    if (booking.guide) {
      await updateGuideRating(booking.guide);
    }
    if (pkg.agency) {
      await updateAgencyRating(pkg.agency);
    }

    res.status(201).json({
      message: "Review submitted successfully",
      reviews: createdReviews,
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
    const reviews = await Review.find({
      package: req.params.packageId,
      type: "package",
    })
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
    const reviews = await Review.find({
      guide: req.params.guideId,
      type: "guide",
    })
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