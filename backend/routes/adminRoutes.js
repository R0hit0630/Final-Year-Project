import express from "express";
import { protect } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  verifyAgency,
  getPendingAgencies,
  deleteUser,
  deletePackage,
  getAllPackagesAdmin,
  getAllBookingsAdmin,
  getUserDetailsAdmin,
  processRefundAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes here require admin role
router.use(protect);
router.use(requireRole("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/users/:id/details", getUserDetailsAdmin);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/agencies/pending", getPendingAgencies);
router.put("/agencies/:id/verify", verifyAgency);
router.get("/packages", getAllPackagesAdmin);
router.delete("/packages/:id", deletePackage);
router.get("/bookings", getAllBookingsAdmin);
router.put("/bookings/:id/refund", processRefundAdmin);

export default router;
