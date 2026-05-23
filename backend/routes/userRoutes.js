import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import User from "../models/user.js";
import {
  getMyProfile,
  updateMyProfile,
  getMyAgencyProfile,
  updateMyAgencyProfile,
} from "../controllers/userProfileController.js";

const router = express.Router();

// Make sure the uploads folder exists before saving files
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure where and how avatar images are saved on disk
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to the uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Name the file using the user ID and current timestamp so it's unique
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});

// Set up the avatar upload handler (max 5MB, images only)
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

// Upload a new profile photo — saves file to disk and updates user's avatar field
router.put("/me/avatar", protect, avatarUpload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Build the public URL path for the saved file
    const filePath = `/uploads/${req.file.filename}`;

    // Find the user and save the new avatar path
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = filePath;
    await user.save();

    return res.json({
      message: "Avatar updated successfully",
      avatar: filePath,
    });
  } catch (err) {
    console.error("avatar upload error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get or update the logged-in user's personal profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// Get or update the logged-in agency's business profile (agency accounts only)
router.get("/agency/me", protect, requireRole("agency"), getMyAgencyProfile);
router.put("/agency/me", protect, requireRole("agency"), updateMyAgencyProfile);

export default router;