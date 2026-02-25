import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userProfileController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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

router.put("/me/avatar", protect, avatarUpload.single("avatar"), async (req, res) => {
});

// GET /api/users/me
router.get("/me", protect, getMyProfile);

// PUT /api/users/me
router.put("/me", protect, updateMyProfile);

export default router;