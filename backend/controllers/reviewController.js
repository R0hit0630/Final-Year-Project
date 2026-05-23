import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import Guide from "../models/Guide.js";
import User from "../models/user.js";

// ─── RATING AGGREGATION HELPERS ──────────────────────────────────────────────
// These functions are called automatically after every new review is created.
// They recalculate the average star rating stored on the Package, Guide, and Agency records.

// [HELPER] Recalculates and saves the average rating on the Package document
const updatePackageRating = async (packageId) => {
  if (!packageId) return;

  // Find all package-type reviews linked to this packageId
  const reviews = await Review.find({
    package: packageId,
    type: "package",
  });

  const numReviews = reviews.length;
  // Sum all ratings and divide by count to get the new average
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  // Save the new averageRating and numReviews back to the Package document
  await Package.findByIdAndUpdate(packageId, {
    averageRating,
    numReviews,
  });
};

// [HELPER] Recalculates and saves the average rating on the Guide document
const updateGuideRating = async (guideId) => {
  if (!guideId) return;

  // Find all guide-type reviews linked to this guideId
  const reviews = await Review.find({
    guide: guideId,
    type: "guide",
  });

  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  // Save the new averageRating and numReviews back to the Guide document
  await Guide.findByIdAndUpdate(guideId, {
    averageRating,
    numReviews,
  });
};

// [HELPER] Recalculates and saves the average rating on the Agency (User) document
const updateAgencyRating = async (agencyId) => {
  if (!agencyId) return;

  // Find ALL reviews associated with this agency regardless of type
  const reviews = await Review.find({ agency: agencyId });

  const numReviews = reviews.length;
  const averageRating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  // Save the new averageRating and numReviews back to the Agency user document
  await User.findByIdAndUpdate(agencyId, {
    averageRating,
    numReviews,
  });
};

// ─── CREATE REVIEW ────────────────────────────────────────────────────────────
// [FLOW FEATURE: REVIEWS - BACKEND]
// POST /api/reviews  (Private - requires logged-in user JWT)
// Called after a trip is completed. Creates Review documents for the package
// and optionally the guide, then triggers rating recalculation helpers above.
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

    // Step 1: Load the booking and verify it belongs to the logged-in user
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Security check: only the traveler who made the booking can review it
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to review this booking",
      });
    }

    // Step 2: Only allow reviews for completed trips
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Only completed bookings can be reviewed",
      });
    }

    // Step 3: Prevent duplicate reviews
    if (booking.isReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    // Step 4: Load the package to get its agency owner ID for rating updates
    const pkg = await Package.findById(booking.package).select("agency");

    if (!pkg) {
      return res.status(404).json({
        message: "Package not found for this booking",
      });
    }

    const createdReviews = [];

    // Step 5a: Validate and create the PACKAGE review (always required)
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

    // Prevent double-creating a package review for the same booking
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

    // Create the Package Review document in the database
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

    // Step 5b: If a guide was assigned to this booking, also create a GUIDE review
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

      // Create the Guide Review document in the database
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

    // Step 6: Mark the booking as reviewed so it can't be reviewed again
    booking.isReviewed = true;
    await booking.save();

    // Step 7: Trigger all rating recalculation helpers to update averages
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

// ─── GET PACKAGE REVIEWS ──────────────────────────────────────────────────────
// [FLOW FEATURE: REVIEWS DISPLAY]
// GET /api/reviews/package/:packageId  (Public)
// Returns all reviews for a package, sorted by newest first, with reviewer info attached
export const getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      package: req.params.packageId,
      type: "package",
    })
      // Populate reviewer's name, username, email, and avatar for display on the page
      .populate("user", "fullName username email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("getPackageReviews error:", error);
    res.status(500).json({
      message: "Server error while fetching package reviews",
    });
  }
};

// ─── GET GUIDE REVIEWS ────────────────────────────────────────────────────────
// [FLOW FEATURE: GUIDE PROFILE]
// GET /api/reviews/guide/:guideId  (Public)
// Returns all guide-type reviews for the given guide, newest first
export const getGuideReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      guide: req.params.guideId,
      type: "guide",
    })
      .populate("user", "fullName username email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("getGuideReviews error:", error);
    res.status(500).json({
      message: "Server error while fetching guide reviews",
    });
  }
};

// ─── GET AGENCY REVIEWS ───────────────────────────────────────────────────────
// [FLOW FEATURE: AGENCY PROFILE]
// GET /api/reviews/agency/:agencyId  (Public)
// Returns all reviews associated with the agency (across all its packages)
export const getAgencyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ agency: req.params.agencyId })
      .populate("user", "fullName username email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("getAgencyReviews error:", error);
    res.status(500).json({
      message: "Server error while fetching agency reviews",
    });
  }
};