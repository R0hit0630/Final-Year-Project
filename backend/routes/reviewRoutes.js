import express from "express";
import {
  createReview,
  getPackageReviews,
  getGuideReviews,
  getAgencyReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create package + guide review after completed trip
router.post("/", protect, createReview);

// Public review lists
router.get("/package/:packageId", getPackageReviews);
router.get("/guide/:guideId", getGuideReviews);
router.get("/agency/:agencyId", getAgencyReviews);

export default router;