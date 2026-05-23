import Guide from "../models/Guide.js";
import Booking from "../models/Booking.js";

// [FLOW FEATURE: GUIDE - CREATE]
// Creates a new guide record belonging to the currently logged-in agency
export const createGuide = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      region,
      experience,
      specialization,
      certification,
      languages,
      bio,
      skills,
      photo,
    } = req.body;

    // Step 1: Validate required fields before attempting creation
    if (!fullName || !email || !region) {
      return res.status(400).json({
        message: "Full name, email, and region are required",
      });
    }

    // Step 2: Check that this agency does not already have a guide with the same email
    const existingGuide = await Guide.findOne({
      email: email.toLowerCase(),
      agency: req.user._id,
    });

    if (existingGuide) {
      return res.status(400).json({
        message: "Guide with this email already exists for this agency",
      });
    }

    // Step 3: Save new guide to database, linking it to the agency via req.user._id
    const guide = await Guide.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      region,
      experience,
      specialization,
      certification,
      languages,
      bio,
      skills: Array.isArray(skills) ? skills : [],
      photo: photo || "",
      agency: req.user._id,
    });

    res.status(201).json({
      message: "Guide created successfully",
      guide,
    });
  } catch (error) {
    console.error("createGuide error:", error);
    res.status(500).json({
      message: "Server error while creating guide",
    });
  }
};

// [FLOW FEATURE: GUIDE - GET ALL BY AGENCY]
// Returns all guides belonging to the currently logged-in agency, sorted newest first
export const getMyGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ agency: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(guides);
  } catch (error) {
    console.error("getMyGuides error:", error);
    res.status(500).json({
      message: "Server error while fetching guides",
    });
  }
};

// [FLOW FEATURE: GUIDE - GET SINGLE]
// Fetches one guide by ID, scoped to the logged-in agency to prevent cross-agency access
export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findOne({
      _id: req.params.id,
      agency: req.user._id, // Ensure only the owning agency can view this guide
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.status(200).json(guide);
  } catch (error) {
    console.error("getGuideById error:", error);
    res.status(500).json({
      message: "Server error while fetching guide",
    });
  }
};

// [FLOW FEATURE: GUIDE - UPDATE]
// Updates a guide's profile fields and optionally sets a leave date range with conflict detection
export const updateGuide = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      region,
      experience,
      specialization,
      certification,
      languages,
      bio,
      skills,
      photo,
      isActive,
      leaveStartDate,
      leaveEndDate,
    } = req.body;

    // Step 1: Find the guide, ensuring it belongs to the requesting agency
    const guide = await Guide.findOne({
      _id: req.params.id,
      agency: req.user._id,
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Step 2: Apply the updated field values using nullish coalescing to preserve existing values
    guide.fullName = fullName ?? guide.fullName;
    guide.email = email ? email.toLowerCase() : guide.email;
    guide.phone = phone ?? guide.phone;
    guide.region = region ?? guide.region;
    guide.experience = experience ?? guide.experience;
    guide.specialization = specialization ?? guide.specialization;
    guide.certification = certification ?? guide.certification;
    guide.languages = languages ?? guide.languages;
    guide.bio = bio ?? guide.bio;
    guide.skills = Array.isArray(skills) ? skills : guide.skills;
    guide.photo = photo ?? guide.photo;

    if (typeof isActive === "boolean") {
      guide.isActive = isActive;
    }

    // Step 3: Handle leave date update if either date is provided
    const hasLeaveDates =
      leaveStartDate !== undefined || leaveEndDate !== undefined;

    if (hasLeaveDates) {
      const nextLeaveStart = leaveStartDate ? new Date(leaveStartDate) : null;
      const nextLeaveEnd = leaveEndDate ? new Date(leaveEndDate) : null;

      // Both dates must be present together — prevent partial leave range
      if ((nextLeaveStart && !nextLeaveEnd) || (!nextLeaveStart && nextLeaveEnd)) {
        return res.status(400).json({
          message: "Both leave start date and leave end date are required",
        });
      }

      if (nextLeaveStart && nextLeaveEnd) {
        // Step 4: Validate date integrity — reject NaN or invalid date strings
        if (Number.isNaN(nextLeaveStart.getTime()) || Number.isNaN(nextLeaveEnd.getTime())) {
          return res.status(400).json({
            message: "Invalid leave dates",
          });
        }

        if (nextLeaveStart > nextLeaveEnd) {
          return res.status(400).json({
            message: "Leave end date must be after leave start date",
          });
        }

        // Step 5: Check for booking conflicts — deny leave if guide has active trips during that window
        const conflictingBooking = await Booking.findOne({
          guide: guide._id,
          status: { $in: ["pending", "confirmed", "ongoing"] },
          startDate: { $lte: nextLeaveEnd },
          endDate: { $gte: nextLeaveStart },
        });

        if (conflictingBooking) {
          return res.status(400).json({
            message:
              "Guide already has an assigned trip during this leave period",
          });
        }

        guide.leaveStartDate = nextLeaveStart;
        guide.leaveEndDate = nextLeaveEnd;
      } else {
        // Clearing leave dates if both are passed as null/undefined
        guide.leaveStartDate = null;
        guide.leaveEndDate = null;
      }
    }

    // Step 6: Persist the updated guide document
    await guide.save();

    res.status(200).json({
      message: "Guide updated successfully",
      guide,
    });
  } catch (error) {
    console.error("updateGuide error:", error);
    res.status(500).json({
      message: "Server error while updating guide",
    });
  }
};

// [FLOW FEATURE: GUIDE - DELETE]
// Deletes a guide only if they have no active or upcoming bookings — prevents orphaned trips
export const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findOne({
      _id: req.params.id,
      agency: req.user._id, // Scoped to the owning agency
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Prevent deletion if guide has active or upcoming bookings
    const activeBookings = await Booking.countDocuments({
      guide: guide._id,
      status: { $in: ["pending", "confirmed", "ongoing"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: `Cannot delete guide: ${activeBookings} active booking(s) assigned. Reassign or complete them first.`,
      });
    }

    // Hard delete: permanently removes guide record from database
    await guide.deleteOne();

    res.status(200).json({
      message: "Guide deleted successfully",
    });
  } catch (error) {
    console.error("deleteGuide error:", error);
    res.status(500).json({
      message: "Server error while deleting guide",
    });
  }
};