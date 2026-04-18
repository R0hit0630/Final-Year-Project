import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const buildImageUrl = (imgPath) => {
  if (!imgPath) return "https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo";
  if (imgPath.startsWith("http")) return imgPath;
  return `${API_BASE_URL}${imgPath}`;
};

export default function AgencySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [agency, setAgency] = useState(null);

  const COLORS = {
    primary: "#1978e5",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/users/agency/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgency(res.data);
      } catch (err) {
        console.error("Error fetching agency profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    { label: "Overview", icon: "dashboard", to: "/agency" },
    { label: "My Packages", icon: "hiking", to: "/agency/packages" },
    { label: "Bookings", icon: "book_online", to: "/agency/bookings" },
    { label: "Earnings", icon: "payments", to: "/agency/earnings" },
    { label: "Guides", icon: "person", to: "/agency/guides" },
    { label: "Profile", icon: "settings_account_box", to: "/agency/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="hidden w-64 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex h-screen sticky top-0">
      <div className="flex h-full flex-col p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#e0e8dc] bg-white shadow-sm">
            <img
              alt="Agency Logo"
              className="h-full w-full object-cover"
              src={buildImageUrl(agency?.logo)}
            />
          </div>

          <div className="flex flex-col overflow-hidden">
            <h1 className="text-base font-bold leading-tight text-[#2d3b2a] truncate">
              {agency?.agencyName || "Loading..."}
            </h1>
            <p
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: COLORS.primary }}
            >
              Partner Agency
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((i) => {
            const isActive = location.pathname === i.to;
            return (
              <Link
                key={i.label}
                to={i.to}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive ? "bg-[#1978e5]/10" : "hover:bg-[#f0f4ee]"
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-colors ${
                    isActive ? "text-[#1978e5]" : "text-[#6b7280] group-hover:text-[#1978e5]"
                  }`}
                >
                  {i.icon}
                </span>
                <span
                  className={`text-sm ${
                    isActive ? "font-semibold text-[#2d3b2a]" : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]"
                  }`}
                >
                  {i.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[#6b7280] transition-colors group-hover:text-red-500">
              logout
            </span>
            <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
