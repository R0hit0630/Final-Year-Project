import express from "express";
import {
  createReview,
  getPackageReviews,
  getGuideReviews,
  getAgencyReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Submit a review for a completed trip — user must be logged in
// Handles both package and guide ratings in one request
router.post("/", protect, createReview);

// Get all reviews for a specific package (shown on the package details page)
router.get("/package/:packageId", getPackageReviews);

// Get all reviews for a specific guide (shown on the guide profile)
router.get("/guide/:guideId", getGuideReviews);

// Get all reviews associated with a specific agency
router.get("/agency/:agencyId", getAgencyReviews);

export default router;