import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { protect } from "../middleware/auth.js";
import User from "../models/user.js";
import {
  getMyProfile,
  updateMyProfile,
  getMyAgencyProfile,
  updateMyAgencyProfile,
} from "../controllers/userProfileController.js";

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

// AVATAR
router.put("/me/avatar", protect, avatarUpload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;

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

// USER PROFILE
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// AGENCY PROFILE
router.get("/agency/me", protect, getMyAgencyProfile);
router.put("/agency/me", protect, updateMyAgencyProfile);

export default router;