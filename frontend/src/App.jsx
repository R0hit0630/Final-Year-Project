import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

/* Wrapper to control Navbar visibility */
function Layout({ user, setUser, loading }) {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  if (loading) {
  return null; // prevents redirect during refresh
}


  return (
    <>
      {!hideNavbar && <Navbar user={user} setUser={setUser} />}

      <Routes>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route */}
        <Route
          path="/home"
          element={user ? <Home user={user} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) 
         {
            setLoading(false);
            return;
         }

      try {
        // call backend on 5000 (same as your login)
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
        localStorage.removeItem("token");
        setUser(null);
      }
      finally {
       setLoading(false);
}

    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Layout user={user} setUser={setUser} loading={loading} />
      {error && <p style={{ display: "none" }}>{error}</p>}
    </Router>
  );
}

export default App;
