import express from "express";
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
  cancelPendingPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// user must be logged in to start payment
router.post("/esewa/initiate", protect, initiateEsewaPayment);

// do NOT protect verify route, because user comes back from eSewa
router.post("/esewa/verify", verifyEsewaPayment);

// Cancel a dangling pending booking when payment fails/is cancelled by user
// No auth required because user is returning from eSewa redirect (no token)
router.delete("/esewa/cancel-pending/:transactionUuid", cancelPendingPayment);

export default router;