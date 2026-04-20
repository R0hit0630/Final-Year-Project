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

    const updateData = {};
    if (typeof fullName === "string") updateData.fullName = fullName.trim();
    if (typeof phone === "string") updateData.phone = phone.trim();
    if (typeof location === "string") updateData.location = location.trim();
    if (typeof avatar === "string") updateData.avatar = avatar.trim();

    if (typeof difficulty === "string") {
      updateData["preferences.difficulty"] = difficulty;
    }

    if (Array.isArray(interests)) {
      updateData["preferences.interests"] = interests
        .map((t) => String(t).trim().replace(/^#/, ""))
        .filter(Boolean)
        .slice(0, 20);
    }

    if (Array.isArray(emergencyContacts)) {
      updateData.emergencyContacts = emergencyContacts
        .map((c) => ({
          name: String(c?.name || "").trim(),
          phone: String(c?.phone || "").trim(),
        }))
        .filter((c) => c.name && c.phone)
        .slice(0, 10);
    }

    await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });

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
      agencyCredentials: user.agencyCredentials || { license: "", insurance: "", vat: "" },
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
      agencyCredentials,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "agency") {
      return res.status(403).json({ message: "Only agency can update this profile" });
    }

    const updateData = {};
    if (typeof agencyName === "string") updateData.agencyName = agencyName.trim();
    if (typeof tagline === "string") updateData.tagline = tagline.trim();
    if (typeof about === "string") updateData.about = about.trim();
    if (typeof phone === "string") updateData.agencyPhone = phone.trim();
    if (typeof address === "string") updateData.agencyAddress = address.trim();
    if (typeof instagram === "string") updateData.instagram = instagram.trim();
    if (typeof tripadvisor === "string") updateData.tripadvisor = tripadvisor.trim();
    if (typeof logo === "string") updateData.agencyLogo = logo.trim();

    if (agencyCredentials) {
      if (typeof agencyCredentials.license === "string") updateData["agencyCredentials.license"] = agencyCredentials.license;
      if (typeof agencyCredentials.insurance === "string") updateData["agencyCredentials.insurance"] = agencyCredentials.insurance;
      if (typeof agencyCredentials.vat === "string") updateData["agencyCredentials.vat"] = agencyCredentials.vat;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });

    return res.json({
      message: "Agency profile updated successfully",
      agency: {
        id: updatedUser._id,
        agencyName: updatedUser.agencyName,
        tagline: updatedUser.tagline,
        about: updatedUser.about,
        email: updatedUser.email,
        phone: updatedUser.agencyPhone,
        address: updatedUser.agencyAddress,
        instagram: updatedUser.instagram,
        tripadvisor: updatedUser.tripadvisor,
        logo: updatedUser.agencyLogo,
        isVerified: updatedUser.agencyVerified,
        agencyVerifiedAt: updatedUser.agencyVerifiedAt,
      },
    });
  } catch (err) {
    console.error("updateMyAgencyProfile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};