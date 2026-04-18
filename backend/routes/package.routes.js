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

// PUBLIC
router.get("/public", getPublicPackages);

// COMPARE (must be before /:id)
router.get("/compare", comparePackages);

// AGENCY
router.get("/mine", protect, requireRole("agency"), getMyPackages);
router.get("/mine/:id", protect, requireRole("agency"), getMySinglePackage);
router.post("/", protect, requireRole("agency"), createPackage);
router.put("/:id", protect, requireRole("agency"), updatePackage);
router.delete("/:id", protect, requireRole("agency"), deletePackage);

// GENERAL
router.get("/", getAllPackages);
router.get("/:id", getSinglePackage);

export default router;