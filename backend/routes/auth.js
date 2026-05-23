import express from "express";
import User from "../models/user.js";
import { protect, authorize } from "../middleware/auth.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();


// ─── REGISTER ─────────────────────────────────────────────────────────────────
// [FLOW FEATURE: REGISTRATION - BACKEND]
// POST /api/auth/register  (Public)
// Creates a new user or agency account.
// Admin accounts CANNOT be created via this endpoint (blocked for security).

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
    // Step 1: Validate all required fields are present
    if (!username || !email || !nationality || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Step 2: Block anyone trying to register as "admin" through this route
    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration is not allowed" });
    }

    // Step 3: Check database for existing email OR username to prevent duplicates
    const userExist = await User.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // Step 4: Sanitize role — anything that isn't "agency" defaults to "user"
    const safeRole = role === "agency" ? "agency" : "user";

    // Step 5: Create the new User document in the database
    // Agency-specific fields are only stored if role === "agency", otherwise left blank
    const user = await User.create({
      username,
      email,
      nationality,
      password, // Mongoose pre-save hook hashes this automatically
      role: safeRole,

      // Only store agency fields if role = agency
      agencyName: safeRole === "agency" ? agencyName || "" : "",
      agencyAddress: safeRole === "agency" ? agencyAddress || "" : "",
      agencyPhone: safeRole === "agency" ? agencyPhone || "" : "",
      agencyLogo: safeRole === "agency" ? agencyLogo || "" : "",
      agencyVerified: false,      // Agencies start unverified — admin must approve
      agencyVerifiedAt: null,
    });

    // Step 6: Generate a JWT token so the user is instantly logged in after registration
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

    // Handle MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // Handle Mongoose schema validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Server error" });
  }
});


// ─── LOGIN ────────────────────────────────────────────────────────────────────
// [FLOW FEATURE: LOGIN - BACKEND]
// POST /api/auth/login  (Public)
// Accepts an email OR a username as the "identifier" field.
// Returns a JWT token and basic profile data on success.

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Step 1: Look up user by email OR username
    // Note: password has select:false in schema — must explicitly request it here
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    // Step 2: Check that user exists and the password hash matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 3: Reject login if the account has been disabled by an admin
    if (user.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    // Step 4: Issue a signed JWT token with the user's ID embedded inside
    const token = generateToken(user._id);

    // Step 5: Return user data + token — frontend stores these in localStorage
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      nationality: user.nationality,
      role: user.role,
      // Only include agencyVerified field for agency accounts
      agencyVerified: user.role === "agency" ? user.agencyVerified : undefined,
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─── GET CURRENT USER (ME) ────────────────────────────────────────────────────
// [FLOW FEATURE: AUTH CHECK - BACKEND]
// GET /api/auth/me  (Private - requires valid JWT in Authorization header)
// Used by frontend on page load to refresh current user profile from the database.
// The "protect" middleware decodes the JWT, looks up the user, and attaches it to req.user.

router.get("/me", protect, async (req, res) => {
  return res.status(200).json(req.user);
});

// ─── ADMIN: LIST AGENCIES ─────────────────────────────────────────────────────
// [FLOW FEATURE: ADMIN PANEL - BACKEND]
// GET /api/auth/agencies?verified=true|false  (Private - Admin only)
// Returns a list of all agency accounts, optionally filtered by verification status.
// Used by the admin dashboard to review and approve pending agency applications.

router.get("/agencies", protect, authorize("admin"), async (req, res) => {
  try {
    const { verified } = req.query;

    // Build filter: always filter by role=agency, optionally by verification status
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


export default router;