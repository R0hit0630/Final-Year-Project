// backend/routes/package.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Package from "../models/Package.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * Ensure uploads folder exists
 */
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Multer disk storage (saves to /uploads)
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname || "") || "").toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB each
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

// ===========================
// CREATE PACKAGE (MULTI IMAGES)
// POST /api/packages
// form-data:
//  - images (multiple image files)
//  - title, region, type, price, days, difficulty, description
//  - minGroupSize, maxGroupSize
//  - itinerary (JSON string) optional
// ===========================
router.post("/", protect, upload.array("images", 6), async (req, res) => {
  try {
    const {
      title,
      region,
      type,
      price,
      days,
      difficulty,
      description,
      itinerary,
      minGroupSize,
      maxGroupSize,
    } = req.body;

    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });
    if (!region?.trim()) return res.status(400).json({ message: "Region is required" });
    if (!type?.trim()) return res.status(400).json({ message: "Type is required" });

    const nPrice = Number(price);
    const nDays = Number(days);
    if (!nPrice || nPrice <= 0)
      return res.status(400).json({ message: "Valid price is required" });
    if (!nDays || nDays <= 0)
      return res.status(400).json({ message: "Valid days is required" });

    // ✅ group size validation
    const minG = Number(minGroupSize ?? 1);
    const maxG = Number(maxGroupSize ?? 10);

    if (!Number.isFinite(minG) || minG < 1) {
      return res.status(400).json({ message: "Min group size must be >= 1" });
    }
    if (!Number.isFinite(maxG) || maxG < minG) {
      return res
        .status(400)
        .json({ message: "Max group size must be >= min group size" });
    }

    // Images => URLs saved in DB
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: "At least 1 image is required" });
    }
    const imageUrls = files.map((f) => `/uploads/${f.filename}`);

    // itinerary can come as JSON string in form-data
    let parsedItinerary = [];
    if (itinerary) {
      try {
        parsedItinerary =
          typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;
        if (!Array.isArray(parsedItinerary)) parsedItinerary = [];
      } catch {
        parsedItinerary = [];
      }
    }

    const pkg = await Package.create({
      agency: req.user._id,
      title: title.trim(),
      region: region.trim(),
      type: type.trim(),
      price: nPrice,
      days: nDays,
      difficulty: difficulty || "Moderate",
      description: description || "",
      images: imageUrls,
      itinerary: parsedItinerary,
      minGroupSize: minG,
      maxGroupSize: maxG,
    });

    return res.status(201).json({ message: "Package created", package: pkg });
  } catch (err) {
    console.error("CREATE PACKAGE ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

// ===========================
// GET ALL PACKAGES
// GET /api/packages
// ===========================
router.get("/", async (req, res) => {
  try {
    const items = await Package.find({ isActive: true })
      .populate("agency", "username email")
      .sort("-createdAt");

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================
// GET SINGLE PACKAGE
// GET /api/packages/:id
// ===========================
router.get("/:id", async (req, res) => {
  try {
    const item = await Package.findById(req.params.id).populate(
      "agency",
      "username email"
    );

    if (!item || !item.isActive) return res.status(404).json({ message: "Not found" });

    res.json(item);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// ===========================
// SOFT DELETE
// DELETE /api/packages/:id
// ===========================
router.delete("/:id", protect, async (req, res) => {
  try {
    await Package.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Package deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;