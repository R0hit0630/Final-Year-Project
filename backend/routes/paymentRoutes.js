import express from "express";
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// user must be logged in to start payment
router.post("/esewa/initiate", protect, initiateEsewaPayment);

// do NOT protect verify route, because user comes back from eSewa
router.post("/esewa/verify", verifyEsewaPayment);

export default router;