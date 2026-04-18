import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Destination from "./pages/Destination";
import User from "./pages/User/User";
import Profile from "./pages/User/profile";
import ExploreNepal from "./pages/User/ExploreNepal";
import PackageDetails from "./pages/User/PackageDetails";
import MyTrip from "./pages/User/MyTrip";
import SavedDestinations from "./pages/User/SavedDestinations";
import ComparePackages from "./pages/User/ComparePackages";

import AgencyDashboard from "./pages/Agency/AgencyDashboard";
import AgencyProfile from "./pages/Agency/AgencyProfile";
import AddPackageAgency from "./pages/Agency/AddPackage";
import AgencyGuides from "./pages/Agency/AgencyGuides";
import AgencyPackages from "./pages/Agency/AgencyPackages";
import AgencyPending from "./pages/Agency/AgencyPending";
import AddNewGuide from "./pages/Agency/AddNewGuide";
import AgencyBookings from "./pages/Agency/AgencyBookings";
import AgencyGuideProfile from "./pages/Agency/AgencyGuideProfile";
import AgencyPackageDetails from "./pages/Agency/AgencyPackageDetails";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAgencies from "./pages/Admin/AdminAgencies";
import AdminPayments from "./pages/Admin/AdminPayments";
import AdminApprovals from "./pages/Admin/AdminApprovals";

import PayWithEsewa from "./pages/User/Payment/PayWithEsewa";
import EsewaSuccess from "./pages/User/Payment/EsewaSuccess";
import EsewaFailure from "./pages/User/Payment/EsewaFailure";

// -------- Helpers --------
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ user, roles, children }) => {
  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "agency" && user.agencyVerified === false) {
    return <Navigate to="/agency/pending" replace />;
  }

  return children;
};

// Logout route component
const LogoutRoute = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Navigate to="/" replace />;
};

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("comparePackages");
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data;

        const normalized = {
          id: u._id || u.id,
          username: u.username,
          email: u.email,
          role: u.role,
          agencyVerified: u.agencyVerified ?? null,
        };

        localStorage.setItem("user", JSON.stringify(normalized));
        setUser(normalized);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/destinations" element={<Destination />} />
        <Route path="/explore" element={<ExploreNepal />} />
        <Route path="/packages/:id" element={<PackageDetails />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* LOGOUT */}
        <Route path="/logout" element={<LogoutRoute onLogout={logout} />} />

        {/* AGENCY PENDING */}
        <Route path="/agency/pending" element={<AgencyPending />} />

        {/* USER ROUTES */}
        <Route
          path="/user"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <User user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <MyTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <SavedDestinations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/compare-packages"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <ComparePackages />
            </ProtectedRoute>
          }
        />

        {/* AGENCY ROUTES */}
        <Route
          path="/agency"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/profile"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/add-package"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AddPackageAgency />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/packages"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyPackages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/guides"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyGuides />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/guides/add"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AddNewGuide />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/bookings"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/guides/:id"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyGuideProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agency/packages/:id"
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyPackageDetails />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/agencies"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminAgencies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminApprovals />
            </ProtectedRoute>
          }
        />

        {/* PAYMENT ROUTES */}
        <Route path="/pay/:id" element={<PayWithEsewa />} />
        <Route path="/payment/esewa/success" element={<EsewaSuccess />} />
        <Route path="/payment/esewa/failure" element={<EsewaFailure />} />

        {/* UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;