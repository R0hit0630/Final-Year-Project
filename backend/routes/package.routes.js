import express from "express";
import multer from "multer";
import Package from "../models/Package.js";
import Destination from "../models/Destination.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ===========================
   MULTER MEMORY STORAGE
=========================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

/* ===========================
   CREATE PACKAGE
=========================== */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      destination,
      title,
      description,
      price,
      durationDays,
      groupType,
      tripType,
    } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const dest = await Destination.findById(destination);
    if (!dest || !dest.isActive)
      return res.status(404).json({ message: "Destination not found" });

    const pkg = await Package.create({
      agency: req.user._id,
      destination,
      title,
      description,
      price,
      durationDays,
      groupType,
      tripType,
      images: [
        {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      ],
    });

    res.status(201).json({ message: "Package created", id: pkg._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   GET ALL PACKAGES
=========================== */
router.get("/", async (req, res) => {
  try {
    const items = await Package.find({ isActive: true })
      .populate("destination", "name region")
      .populate("agency", "username email")
      .sort("-createdAt");

    const formatted = items.map((item) => {
      const obj = item.toObject();

      obj.images = obj.images.map((img) => ({
        contentType: img.contentType,
        data: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      }));

      return obj;
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   GET SINGLE PACKAGE
=========================== */
router.get("/:id", async (req, res) => {
  try {
    const item = await Package.findById(req.params.id)
      .populate("destination", "name region")
      .populate("agency", "username email");

    if (!item || !item.isActive)
      return res.status(404).json({ message: "Not found" });

    const obj = item.toObject();

    obj.images = obj.images.map((img) => ({
      contentType: img.contentType,
      data: `data:${img.contentType};base64,${img.data.toString("base64")}`,
    }));

    res.json(obj);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// GET PACKAGES BY DESTINATION ID
router.get("/destination/:id", async (req, res) => {
  try {
    const packages = await Package.find({ destination: req.params.id, isActive: true })
      .populate("destination", "name region")
      .populate("agency", "username email");

    const formatted = packages.map((item) => {
      const obj = item.toObject();
      obj.images = obj.images.map((img) => ({
        contentType: img.contentType,
        data: `data:${img.contentType};base64,${img.data.toString("base64")}`,
      }));
      return obj;
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   SOFT DELETE
=========================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Package.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Package deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;