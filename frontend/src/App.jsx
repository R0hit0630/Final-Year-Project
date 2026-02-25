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
import Userhome from "./pages/User/Userhome";
import History from "./pages/User/History";
import Profile from "./pages/User/profile";
import ExploreNepal from "./pages/User/ExploreNepal";

import AgencyDashboard from "./pages/Agency/AgencyDashboard";
import AgencyProfile from "./pages/Agency/AgencyProfile";

// Admin pages (your current admin pages)
import AddDestination from "./Adminpage/AddDestination";
import AddPackage from "./Adminpage/Addpackage";
import DestinationPackages from "./Adminpage/packagelist";
import AgencyPending from "./pages/Agency/AgencyPending";

// OPTIONAL: create unauthorized page if you want
// import Unauthorized from "./pages/Unauthorized";

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
    return <Navigate to="/" replace />; // or /unauthorized
  }

  // ✅ block unverified agency from agency pages
  if (user.role === "agency" && user.agencyVerified === false) {
    return <Navigate to="/agency/pending" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  // 🔐 Validate token on refresh using /api/auth/me
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

        // res.data is full user object from backend
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

  // 🛑 Prevent flicker before auth check
  if (loading) return null;

  return (
    <Router>
      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/destinations" element={<Destination />} />
        <Route path="/packages/:id" element={<DestinationPackages />} />
        <Route path="/explore" element={<ExploreNepal />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register"element={!user ? <Register setUser={setUser} /> : <Navigate to="/" replace />}
        />

        {/* ✅ Agency pending approval */}
        <Route path="/agency/pending" element={<AgencyPending />} />

        {/* 🔒 USER ROUTES (only role=user) */}
        <Route
          path="/user"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <User user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userhome"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <Userhome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute user={user} roles={["user"]}>
              <History />
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

        {/* 🔒 AGENCY ROUTES (only agency, verified) */}
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

        {/* 🔒 ADMIN ROUTES (only admin) */}
        <Route
          path="/adddestination"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AddDestination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addpackage"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AddPackage />
            </ProtectedRoute>
          }
        />

        {/* 🚫 Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;