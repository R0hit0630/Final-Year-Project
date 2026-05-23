import express from "express";
import {
  createGuide,
  getMyGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
} from "../controllers/guideController.js";

import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

// All guide routes are agency-only — only a logged-in agency can manage guides

// Create a new guide under this agency
router.post("/", protect, requireRole("agency"), createGuide);

// Get all guides that belong to this agency
router.get("/mine", protect, requireRole("agency"), getMyGuides);

// Get a single guide by ID (must belong to this agency)
router.get("/:id", protect, requireRole("agency"), getGuideById);

// Update a guide's details
router.put("/:id", protect, requireRole("agency"), updateGuide);

// Remove a guide from this agency
router.delete("/:id", protect, requireRole("agency"), deleteGuide);

export default router;