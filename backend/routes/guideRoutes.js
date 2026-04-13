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

// ONLY agency can access
router.post("/", protect, requireRole("agency"), createGuide);
router.get("/mine", protect, requireRole("agency"), getMyGuides);
router.get("/:id", protect, requireRole("agency"), getGuideById);
router.put("/:id", protect, requireRole("agency"), updateGuide);
router.delete("/:id", protect, requireRole("agency"), deleteGuide);

export default router;