import express from "express";
import {
  createPackage,
  deletePackage,
  getAllPackages,
  getMyPackages,
  getMySinglePackage,
  getPublicPackages,
  getSinglePackage,
  updatePackage,
  comparePackages,
} from "../controllers/packageController.js";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// Public routes — anyone can access without login
router.get("/public", getPublicPackages);   // Search and filter packages (used on Explore page)
router.get("/compare", comparePackages);    // Compare 2–4 packages side by side

// Agency-only routes — only logged-in agencies can manage packages
router.get("/mine", protect, requireRole("agency"), getMyPackages);         // Get all packages owned by this agency
router.get("/mine/:id", protect, requireRole("agency"), getMySinglePackage); // Get one specific package owned by this agency
router.post("/", protect, requireRole("agency"), createPackage);             // Create a new package
router.put("/:id", protect, requireRole("agency"), updatePackage);           // Edit an existing package
router.delete("/:id", protect, requireRole("agency"), deletePackage);        // Soft-delete a package

// General public routes
router.get("/", getAllPackages);       // Get all active packages (no filters)
router.get("/:id", getSinglePackage); // Get a single package by its ID

export default router;