import Guide from "../models/Guide.js";
import Booking from "../models/Booking.js";

// CREATE GUIDE
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

    if (!fullName || !email || !region) {
      return res.status(400).json({
        message: "Full name, email, and region are required",
      });
    }

    const existingGuide = await Guide.findOne({
      email: email.toLowerCase(),
      agency: req.user._id,
    });

    if (existingGuide) {
      return res.status(400).json({
        message: "Guide with this email already exists for this agency",
      });
    }

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

// GET ALL GUIDES OF LOGGED-IN AGENCY
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

// GET SINGLE GUIDE
export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findOne({
      _id: req.params.id,
      agency: req.user._id,
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

// UPDATE GUIDE
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

    const guide = await Guide.findOne({
      _id: req.params.id,
      agency: req.user._id,
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

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

    const hasLeaveDates =
      leaveStartDate !== undefined || leaveEndDate !== undefined;

    if (hasLeaveDates) {
      const nextLeaveStart = leaveStartDate ? new Date(leaveStartDate) : null;
      const nextLeaveEnd = leaveEndDate ? new Date(leaveEndDate) : null;

      if ((nextLeaveStart && !nextLeaveEnd) || (!nextLeaveStart && nextLeaveEnd)) {
        return res.status(400).json({
          message: "Both leave start date and leave end date are required",
        });
      }

      if (nextLeaveStart && nextLeaveEnd) {
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
        guide.leaveStartDate = null;
        guide.leaveEndDate = null;
      }
    }

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

// DELETE GUIDE
export const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findOne({
      _id: req.params.id,
      agency: req.user._id,
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

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