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
import User from "./pages/User";
import Destination from "./pages/Destination";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check token on refresh
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
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

        {/* 🔐 AUTH ROUTES */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login setUser={setUser} />
            ) : (
              <Navigate to="/user" replace />
            )
          }
        />

        <Route
          path="/register"
          element={
            !user ? (
              <Register />
            ) : (
              <Navigate to="/user" replace />
            )
          }
        />

        {/* 🔒 PROTECTED ROUTE */}
        <Route
          path="/user"
          element={
            user ? (
              <User user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 🚫 Unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
