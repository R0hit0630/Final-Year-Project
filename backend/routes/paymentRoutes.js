import express from "express";
import {
  initiateEsewaPayment,
  verifyEsewaPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/esewa/initiate", protect, initiateEsewaPayment);
router.post("/esewa/verify", protect, verifyEsewaPayment);

export default router;