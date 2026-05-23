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

// Every route here requires a valid login AND admin role
router.use(protect);
router.use(requireRole("admin"));

// Get overall system stats (total users, bookings, revenue)
router.get("/stats", getAdminStats);

// Get list of all users OR a single user's full details
router.get("/users", getAllUsers);
router.get("/users/:id/details", getUserDetailsAdmin);

// Enable or disable a user account
router.put("/users/:id/toggle-status", toggleUserStatus);

// Permanently delete a user account
router.delete("/users/:id", deleteUser);

// Get agencies waiting for admin approval
router.get("/agencies/pending", getPendingAgencies);

// Approve (verify) an agency application
router.put("/agencies/:id/verify", verifyAgency);

// View or delete any package in the system
router.get("/packages", getAllPackagesAdmin);
router.delete("/packages/:id", deletePackage);

// View all bookings in the system
router.get("/bookings", getAllBookingsAdmin);

// Process a refund for a cancelled booking
router.put("/bookings/:id/refund", processRefundAdmin);

export default router;
