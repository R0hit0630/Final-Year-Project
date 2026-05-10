import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "./config/api.js";

// Layouts
import PublicLayout from "./components/PublicLayout.jsx";
import UserLayout from "./components/UserLayout.jsx";
import AgencyLayout from "./components/AgencyLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

// Public pages
import Home from "./pages/Home";
import Destination from "./pages/Destination";
import AboutUS from "./pages/AboutUS";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User pages
import ExploreNepal from "./pages/User/ExploreNepal";
import PackageDetails from "./pages/User/PackageDetails";
import MyTrip from "./pages/User/MyTrip";
import SavedDestinations from "./pages/User/SavedDestinations";
import ComparePackages from "./pages/User/ComparePackages";
import Profile from "./pages/User/profile";

// Agency pages
import AgencyDashboard from "./pages/Agency/AgencyDashboard";
import AgencyProfile from "./pages/Agency/AgencyProfile";
import AddPackageAgency from "./pages/Agency/AddPackage";
import AgencyGuides from "./pages/Agency/AgencyGuides";
import AgencyPackages from "./pages/Agency/AgencyPackages";
import AgencyPending from "./pages/Agency/AgencyPending";
import AddNewGuide from "./pages/Agency/AddNewGuide";
import AgencyBookings from "./pages/Agency/AgencyBookings";
import AgencyGuideProfile from "./pages/Agency/AgencyGuideProfile";
import EditGuide from "./pages/Agency/EditGuide";
import AgencyPackageDetails from "./pages/Agency/AgencyPackageDetails";
import AgencyEarnings from "./pages/Agency/AgencyEarnings";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAgencies from "./pages/Admin/AdminAgencies";
import AdminPayments from "./pages/Admin/AdminPayments";
import AdminApprovals from "./pages/Admin/AdminApprovals";

// Payment pages
import PayWithEsewa from "./pages/User/Payment/PayWithEsewa";
import EsewaSuccess from "./pages/User/Payment/EsewaSuccess";
import EsewaFailure from "./pages/User/Payment/EsewaFailure";

// 404
import NotFound from "./pages/NotFound";

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
  // Unverified agency users should always go to pending, regardless of what route they tried
  if (user.role === "agency" && user.agencyVerified === false) {
    return <Navigate to="/agency/pending" replace />;
  }
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const LogoutRoute = ({ onLogout }) => {
  useEffect(() => { onLogout(); }, [onLogout]);
  return <Navigate to="/" replace />;
};

// Redirect logged-in users away from public-only pages
const PublicRoute = ({ user, children }) => {
  if (!user) return children;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "agency") {
    return user.agencyVerified
      ? <Navigate to="/agency" replace />
      : <Navigate to="/agency/pending" replace />;
  }
  return <Navigate to="/explore" replace />;
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
      if (!token) { setLoading(false); return; }
      try {
        const res = await axios.get(`${API_BASE}/api/users/me`, {
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
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Branded loading splash instead of blank white screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-[#197fe6]/30 border-t-[#197fe6] animate-spin" />
          <p className="text-sm text-white/50 font-medium tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* ── PUBLIC ROUTES (with PublicNavbar + Footer) ─────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicRoute user={user}><Home user={user} /></PublicRoute>} />
          <Route path="/destinations" element={<Destination />} />
          <Route path="/about" element={<AboutUS />} />
        </Route>

        {/* ── STANDALONE AUTH PAGES (No Navbar/Footer) ─────────────── */}
        <Route path="/login" element={<PublicRoute user={user}><Login setUser={setUser} /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute user={user}><Register setUser={setUser} /></PublicRoute>} />


        {/* Package details — accessible to all (public + logged-in users) */}
        <Route path="/packages/:id" element={<PackageDetails />} />

        {/* Logout */}
        <Route path="/logout" element={<LogoutRoute onLogout={logout} />} />

        {/* Agency pending — standalone page */}
        <Route path="/agency/pending" element={<AgencyPending />} />

        {/* ── USER ROUTES (with UserLayout sidebar) ──────────────────── */}
        <Route
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/explore" element={<ExploreNepal />} />
          <Route path="/trips" element={<MyTrip />} />
          <Route path="/saved" element={<SavedDestinations />} />
          <Route path="/compare-packages" element={<ComparePackages />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ── AGENCY ROUTES (with AgencyLayout sidebar) ──────────────── */}
        <Route
          element={
            <ProtectedRoute user={user} roles={["agency"]}>
              <AgencyLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/agency" element={<AgencyDashboard />} />
          <Route path="/agency/profile" element={<AgencyProfile />} />
          <Route path="/agency/add-package" element={<AddPackageAgency />} />
          <Route path="/agency/packages" element={<AgencyPackages />} />
          <Route path="/agency/packages/:id" element={<AgencyPackageDetails />} />
          <Route path="/agency/guides" element={<AgencyGuides />} />
          <Route path="/agency/guides/add" element={<AddNewGuide />} />
          <Route path="/agency/guides/:id" element={<AgencyGuideProfile />} />
          <Route path="/agency/guides/:id/edit" element={<EditGuide />} />
          <Route path="/agency/bookings" element={<AgencyBookings />} />
          <Route path="/agency/earnings" element={<AgencyEarnings />} />
        </Route>

        {/* ── ADMIN ROUTES (with AdminLayout sidebar) ────────────────── */}
        <Route
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/agencies" element={<AdminAgencies />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
        </Route>

        {/* ── PAYMENT ROUTES ─────────────────────────────────────────── */}
        <Route
          path="/pay/:id"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <PayWithEsewa />
            </ProtectedRoute>
          }
        />
        <Route path="/payment/esewa/success" element={<EsewaSuccess />} />
        <Route path="/payment/esewa/failure" element={<EsewaFailure />} />

        {/* ── 404 ────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;