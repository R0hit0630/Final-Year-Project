import User from "../models/user.js";

// ==============================
// USER PROFILE
// ==============================

// GET /api/users/me
export const getMyProfile = async (req, res) => {
  try {
    const u = req.user;

    return res.json({
      id: u._id,
      role: u.role,

      nameShort: u.fullName?.trim()
        ? u.fullName.trim().split(" ").slice(0, 2).join(" ")
        : u.username,

      fullName: u.fullName || u.username || "",
      username: u.username,
      email: u.email,
      phone: u.phone || "",
      location: u.location || "",
      avatar: u.avatar || "",

      level: `LEVEL ${u.level ?? 1}`,
      tier: u.tier || "EXPLORER",

      difficulty: u.preferences?.difficulty || "Challenging",
      interests: u.preferences?.interests || [],
      emergencyContacts: u.emergencyContacts || [],
      nationality: u.nationality || "",
    });
  } catch (err) {
    console.error("getMyProfile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/me
export const updateMyProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      location,
      avatar,
      difficulty,
      interests,
      emergencyContacts,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof fullName === "string") user.fullName = fullName.trim();
    if (typeof phone === "string") user.phone = phone.trim();
    if (typeof location === "string") user.location = location.trim();
    if (typeof avatar === "string") user.avatar = avatar.trim();

    user.preferences = user.preferences || {};

    if (typeof difficulty === "string") {
      user.preferences.difficulty = difficulty;
    }

    if (Array.isArray(interests)) {
      user.preferences.interests = interests
        .map((t) => String(t).trim().replace(/^#/, ""))
        .filter(Boolean)
        .slice(0, 20);
    }

    if (Array.isArray(emergencyContacts)) {
      user.emergencyContacts = emergencyContacts
        .map((c) => ({
          name: String(c?.name || "").trim(),
          phone: String(c?.phone || "").trim(),
        }))
        .filter((c) => c.name && c.phone)
        .slice(0, 10);
    }

    await user.save();

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("updateMyProfile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// AGENCY PROFILE
// ==============================

// GET /api/users/agency/me
export const getMyAgencyProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (user.role !== "agency") {
      return res.status(403).json({ message: "Only agency can access this profile" });
    }

    return res.json({
      id: user._id,
      role: user.role,
      agencyName: user.agencyName || "",
      tagline: user.tagline || "",
      about: user.about || "",
      email: user.email || "",
      phone: user.agencyPhone || "",
      address: user.agencyAddress || "",
      instagram: user.instagram || "",
      tripadvisor: user.tripadvisor || "",
      logo: user.agencyLogo || "",
      isVerified: user.agencyVerified || false,
      agencyVerifiedAt: user.agencyVerifiedAt || null,
    });
  } catch (err) {
    console.error("getMyAgencyProfile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/agency/me
export const updateMyAgencyProfile = async (req, res) => {
  try {
    const {
      agencyName,
      tagline,
      about,
      phone,
      address,
      instagram,
      tripadvisor,
      logo,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "agency") {
      return res.status(403).json({ message: "Only agency can update this profile" });
    }

    if (typeof agencyName === "string") user.agencyName = agencyName.trim();
    if (typeof tagline === "string") user.tagline = tagline.trim();
    if (typeof about === "string") user.about = about.trim();
    if (typeof phone === "string") user.agencyPhone = phone.trim();
    if (typeof address === "string") user.agencyAddress = address.trim();
    if (typeof instagram === "string") user.instagram = instagram.trim();
    if (typeof tripadvisor === "string") user.tripadvisor = tripadvisor.trim();
    if (typeof logo === "string") user.agencyLogo = logo.trim();

    await user.save();

    return res.json({
      message: "Agency profile updated successfully",
      agency: {
        id: user._id,
        agencyName: user.agencyName,
        tagline: user.tagline,
        about: user.about,
        email: user.email,
        phone: user.agencyPhone,
        address: user.agencyAddress,
        instagram: user.instagram,
        tripadvisor: user.tripadvisor,
        logo: user.agencyLogo,
        isVerified: user.agencyVerified,
        agencyVerifiedAt: user.agencyVerifiedAt,
      },
    });
  } catch (err) {
    console.error("updateMyAgencyProfile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};