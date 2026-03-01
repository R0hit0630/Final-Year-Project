import express from "express";
import User from "../models/user.js";
import { protect, authorize } from "../middleware/auth.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();


// REGISTER (PUBLIC)
// roles allowed: user, agency
// admin NOT allowed here

router.post("/register", async (req, res) => {
  const {
    username,
    email,
    nationality,
    password,
    role, // user | agency
    agencyName,
    agencyAddress,
    agencyPhone,
    agencyLogo,
  } = req.body;

  try {
    if (!username || !email || !nationality || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration is not allowed" });
    }

    // duplicate check (email OR username)
    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // user/agency
    const safeRole = role === "agency" ? "agency" : "user";

    const user = await User.create({
      username,
      email,
      nationality,
      password,
      role: safeRole,

      // only store agency fields if role = agency
      agencyName: safeRole === "agency" ? agencyName || "" : "",
      agencyAddress: safeRole === "agency" ? agencyAddress || "" : "",
      agencyPhone: safeRole === "agency" ? agencyPhone || "" : "",
      agencyLogo: safeRole === "agency" ? agencyLogo || "" : "",
      agencyVerified: false,
      agencyVerifiedAt: null,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      nationality: user.nationality,
      role: user.role,
      agencyVerified: user.agencyVerified,
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Server error" });
  }
});


// LOGIN (PUBLIC)
// identifier: email OR username

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // password is select:false -> must select it here
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      nationality: user.nationality,
      role: user.role,
      agencyVerified: user.role === "agency" ? user.agencyVerified : undefined,
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ME (PROTECTED)

router.get("/me", protect, async (req, res) => {
  return res.status(200).json(req.user);
});

// ADMIN: LIST AGENCIES (PENDING/VERIFIED)
// GET /api/auth/agencies?verified=true|false

router.get("/agencies", protect, authorize("admin"), async (req, res) => {
  try {
    const { verified } = req.query;

    const filter = { role: "agency" };
    if (verified === "true") filter.agencyVerified = true;
    if (verified === "false") filter.agencyVerified = false;

    const agencies = await User.find(filter).select(
      "username email nationality role agencyName agencyAddress agencyPhone agencyLogo agencyVerified agencyVerifiedAt createdAt"
    );

    return res.json({ count: agencies.length, agencies });
  } catch (err) {
    console.error("LIST AGENCIES ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ADMIN: VERIFY AGENCY
// PATCH /api/auth/verify-agency/:id

router.patch("/verify-agency/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const agency = await User.findById(req.params.id);

    if (!agency) return res.status(404).json({ message: "Agency not found" });
    if (agency.role !== "agency") {
      return res.status(400).json({ message: "This user is not an agency" });
    }

    agency.agencyVerified = true;
    agency.agencyVerifiedAt = new Date();
    await agency.save();

    return res.json({
      message: "Agency verified successfully",
      agency: {
        id: agency._id,
        username: agency.username,
        email: agency.email,
        agencyVerified: agency.agencyVerified,
        agencyVerifiedAt: agency.agencyVerifiedAt,
      },
    });
  } catch (err) {
    console.error("VERIFY AGENCY ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;