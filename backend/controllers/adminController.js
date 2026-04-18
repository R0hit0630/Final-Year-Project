import User from "../models/user.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Guide from "../models/Guide.js";

// @desc    Get dashboard stats for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAgencies = await User.countDocuments({ role: "agency" });
    const totalPackages = await Package.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalGuides = await Guide.countDocuments();

    // Revenue calculation (totalPrice of all paid bookings minus refunds)
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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"} successfully`, isActive: user.isActive });
  } catch (error) {
    console.error("toggleUserStatus error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify agency
// @route   PUT /api/admin/agencies/:id/verify
// @access  Private/Admin
export const verifyAgency = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "agency") {
      return res.status(404).json({ message: "Agency not found" });
    }

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

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookingsAdmin = async (req, res) => {
  try {
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

// @desc    Get pending agency approvals
// @route   GET /api/admin/agencies/pending
// @access  Private/Admin
export const getPendingAgencies = async (req, res) => {
  try {
    const agencies = await User.find({ role: "agency", agencyVerified: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(agencies);
  } catch (error) {
    console.error("getPendingAgencies error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete package
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("deletePackage error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
