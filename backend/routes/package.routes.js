// backend/routes/package.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createPackage,
  deletePackage,
  getAllPackages,
  getMyPackages,
  getMySinglePackage,
  getPublicPackages,
  getSinglePackage,
  updatePackage,
} from "../controllers/packageController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

// PUBLIC
router.get("/public", getPublicPackages);

// AGENCY
router.get("/mine", protect, getMyPackages);
router.get("/mine/:id", protect, getMySinglePackage);
router.post("/", protect, upload.array("images", 6), createPackage);
router.put("/:id", protect, upload.array("images", 6), updatePackage);
router.delete("/:id", protect, deletePackage);

// GENERAL
router.get("/", getAllPackages);
router.get("/:id", getSinglePackage);

export default router;