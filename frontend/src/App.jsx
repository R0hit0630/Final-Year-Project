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
import User from "./pages/User";
import Destination from "./pages/Destination";

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
      
      <Routes>
  {/* Landing page (PUBLIC) */}
  <Route path="/" element={<Home user={user} />} />

  {/* Auth routes */}
  <Route
    path="/login"
    element={!user ? <Login setUser={setUser} /> : <Navigate to="/user" replace />}
  />
  <Route
    path="/register"
    element={!user ? <Register /> : <Navigate to="/user" replace />}
  />

  {/* Protected page after login */}
  <Route
    path="/user"
    element={user ? <User /> : <Navigate to="/login" replace />}
  />

  {/*Destination page*/}
  <Route
  path="/destinations"
  element={<Destination />}
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
