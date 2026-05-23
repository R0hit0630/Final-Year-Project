import User from "../models/user.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Guide from "../models/Guide.js";
import Review from "../models/Review.js";

// [FLOW FEATURE: ADMIN - DASHBOARD STATS]
// @desc    Get dashboard stats for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // Step 1: Count totals for each entity type from the database
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAgencies = await User.countDocuments({ role: "agency" });
    const totalPackages = await Package.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const totalGuides = await Guide.countDocuments();

    // Step 2: Calculate total platform revenue from paid bookings
    // For cancelled bookings, only count the portion retained (totalPrice - refundAmount)
    const revenueBookings = await Booking.find({ paymentStatus: { $in: ["paid", "refunded"] } });
    const totalRevenue = revenueBookings.reduce((acc, curr) => {
      const earned = curr.status === "cancelled" ? (curr.totalPrice - (curr.refundAmount || 0)) : curr.totalPrice;
      return acc + (earned || 0);
    }, 0);

    res.json({
      stats: {
        totalUsers,
        totalAgencies,
        totalPackages,
        totalBookings,
        totalGuides,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - GET ALL USERS]
// @desc    Get all users, optionally filtered by role query param (?role=agency)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    // If a role filter is provided (e.g. ?role=agency), scope the query, otherwise return all
    const query = role ? { role } : {};
    
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - TOGGLE USER STATUS]
// @desc    Toggle user active status (block/unblock)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Flip the isActive boolean — if true becomes false (blocked), and vice versa
    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"} successfully`, isActive: user.isActive });
  } catch (error) {
    console.error("toggleUserStatus error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - VERIFY AGENCY]
// @desc    Set agencyVerified = true so the agency can access their dashboard
// @route   PUT /api/admin/agencies/:id/verify
// @access  Private/Admin
export const verifyAgency = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // Guard: ensure the user exists and is actually an agency account
    if (!user || user.role !== "agency") {
      return res.status(404).json({ message: "Agency not found" });
    }

    // Mark the agency as verified and record the timestamp
    user.agencyVerified = true;
    user.agencyVerifiedAt = new Date();
    await user.save();

    res.json({ message: "Agency verified successfully", agencyVerified: true });
  } catch (error) {
    console.error("verifyAgency error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all packages
// @route   GET /api/admin/packages
// @access  Private/Admin
export const getAllPackagesAdmin = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("agency", "username agencyName email")
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    console.error("getAllPackagesAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - ALL BOOKINGS]
// @desc    Get all bookings with populated user, package, and guide fields
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookingsAdmin = async (req, res) => {
  try {
    // Populate references to show human-readable names rather than raw IDs in the response
    const bookings = await Booking.find()
      .populate("user", "username fullName email")
      .populate("package", "title price agency")
      .populate("guide", "name fullName")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("getAllBookingsAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - PENDING AGENCIES]
// @desc    Return all agencies where agencyVerified = false (awaiting admin approval)
// @route   GET /api/admin/agencies/pending
// @access  Private/Admin
export const getPendingAgencies = async (req, res) => {
  try {
    const agencies = await User.find({ role: "agency", agencyVerified: false })
      .select("-password") // Never expose password hash in response
      .sort({ createdAt: -1 });
    res.json(agencies);
  } catch (error) {
    console.error("getPendingAgencies error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - DELETE USER]
// @desc    Permanently deletes a user with cascading cleanup to preserve referential integrity
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protect admin accounts from deletion
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin" });
    }

    const userId = user._id;

    // Cascade cleanup to preserve data integrity
    if (user.role === "user") {
      // Nullify user reference in bookings (keep booking history intact, just detach the user)
      await Booking.updateMany({ user: userId }, { $set: { user: null } });
      // Remove this user's reviews
      await Review.deleteMany({ user: userId });
    }

    if (user.role === "agency") {
      // Soft-delete all packages owned by this agency (isActive = false, not hard delete)
      await Package.updateMany({ agency: userId }, { $set: { isActive: false } });
      // Deactivate all guides belonging to this agency
      await Guide.updateMany({ agency: userId }, { $set: { isActive: false } });
      // Remove agency's reviews
      await Review.deleteMany({ agency: userId });
    }

    // Step: Permanently remove the user account after cascade cleanup is done
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Soft-delete package (set isActive = false)
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Soft delete — keeps booking history intact
    pkg.isActive = false;
    await pkg.save();
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("deletePackage error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - USER/AGENCY DETAILS]
// @desc    Returns role-specific detail stats for any user or agency (booking count, revenue, ratings)
// @route   GET /api/admin/users/:id/details
// @access  Private/Admin
export const getUserDetailsAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let details = {};

    if (user.role === "user") {
      // For travelers: count total bookings made
      const bookedPackagesCount = await Booking.countDocuments({ user: user._id });
      details = { bookedPackagesCount };
    } else if (user.role === "agency") {
      // For agencies: calculate packages, guides, revenue, and rating stats
      const packagesCount = await Package.countDocuments({ agency: user._id });
      const guidesCount = await Guide.countDocuments({ agency: user._id });
      
      // Step: Get all package IDs for this agency to calculate booking revenue
      const packages = await Package.find({ agency: user._id }).select("_id");
      const packageIds = packages.map(p => p._id);

      // Revenue: sum paid bookings; for cancelled ones, only count the retained portion
      const agencyBookings = await Booking.find({ package: { $in: packageIds }, paymentStatus: { $in: ["paid", "refunded"] } });
      const revenue = agencyBookings.reduce((acc, curr) => {
        const earned = curr.status === "cancelled" ? (curr.totalPrice - (curr.refundAmount || 0)) : curr.totalPrice;
        return acc + (earned || 0);
      }, 0);

      // Rating: average all reviews submitted for this agency's packages
      const reviews = await Review.find({ agency: user._id, type: "package" });
      const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

      details = { packagesCount, guidesCount, revenue, averageRating, reviewsCount: reviews.length };
    }

    res.json({ user, details });
  } catch (error) {
    console.error("getUserDetailsAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// [FLOW FEATURE: ADMIN - PROCESS REFUND]
// @desc    Marks a pending refund as processed and updates the payment status to 'refunded'
// @route   PUT /api/admin/bookings/:id/refund
// @access  Private/Admin
export const processRefundAdmin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Guard 1: Only cancelled bookings are eligible for a refund
    if (booking.status !== "cancelled") {
      return res.status(400).json({ message: "Booking is not cancelled" });
    }

    // Guard 2: There must be an actual pending refund amount to process
    if (booking.refundStatus !== "pending" || !booking.refundAmount) {
      return res.status(400).json({ message: "No pending refund for this booking" });
    }

    // Update both refundStatus and paymentStatus to reflect the completed refund
    booking.refundStatus = "processed";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.json({ message: "Refund processed successfully", booking });
  } catch (error) {
    console.error("processRefundAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
