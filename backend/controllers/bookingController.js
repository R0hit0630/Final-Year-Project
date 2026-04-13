import Booking from "../models/Booking.js";
import Guide from "../models/Guide.js";
import Package from "../models/Package.js";

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

    if (booking.package.agency.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

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

    if (guide.leaveStartDate && guide.leaveEndDate) {
      const leaveStart = new Date(guide.leaveStartDate);
      const leaveEnd = new Date(guide.leaveEndDate);

      if (bookingStart <= leaveEnd && bookingEnd >= leaveStart) {
        return res.status(400).json({
          message: "Guide is on leave during this trip",
        });
      }
    }

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

    booking.guide = guide._id;
    booking.guideAssigned = true;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "username fullName email phone")
      .populate("package", "title region price days agency")
      .populate("guide", "name fullName email phone");

    return res.json({
      message: "Guide assigned successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("assignGuide error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bookings/agency/stats
export const getAgencyStats = async (req, res) => {
  try {
    const agencyId = req.user._id;

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

    const totalBookings = await Booking.countDocuments({
      package: { $in: packageIds },
    });

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