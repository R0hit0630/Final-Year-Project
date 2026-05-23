import express from "express";
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
  cancelPendingPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Start an eSewa payment — user must be logged in
// Creates a pending booking + pending payment, returns the eSewa form URL and signed fields
router.post("/esewa/initiate", protect, initiateEsewaPayment);

// Verify an eSewa payment after the user returns from the eSewa payment page
// No login required — eSewa redirects the user back and frontend sends the data here
router.post("/esewa/verify", verifyEsewaPayment);

// Cancel a pending booking if the user cancelled or failed the eSewa payment
// No login required — called after a failed/cancelled eSewa flow
router.delete("/esewa/cancel-pending/:transactionUuid", cancelPendingPayment);

export default router;