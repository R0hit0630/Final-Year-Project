import User from "../models/user.js";

// ✅ GET /api/users/me
export const getMyProfile = async (req, res) => {
  try {
    const u = req.user; // set by protect middleware

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

// ✅ PUT /api/users/me
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

    // basic fields
    if (typeof fullName === "string") user.fullName = fullName.trim();
    if (typeof phone === "string") user.phone = phone.trim();
    if (typeof location === "string") user.location = location.trim();
    if (typeof avatar === "string") user.avatar = avatar.trim();

    // preferences (safe init)
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

    // emergency contacts
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