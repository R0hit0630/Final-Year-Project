import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE as API } from "../config/api.js";
import defaultAvatar from "../assets/default-avatar.jpg";

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
};
const getToken = () => localStorage.getItem("token") || "";
const buildImageUrl = (imgPath) => {
  if (!imgPath) return defaultAvatar;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API}${imgPath}`;
};

const NAV_ITEMS = [
  { label: "My Trips",            icon: "map",     to: "/trips"   },
  { label: "Explore Nepal",       icon: "explore", to: "/explore" },
  { label: "Saved Destinations",  icon: "favorite",to: "/saved"   },
  { label: "Profile",             icon: "person",  to: "/profile" },
];

export default function UserLayout() {
  const location = useLocation();
  const [profile, setProfile] = useState(getStoredUser());

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    axios
      .get(`${API}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const d = res.data?.user || res.data?.data?.user || res.data?.data || res.data || {};
        setProfile(d);
      })
      .catch(() => {});
  }, []);

  const displayName = profile?.fullName || profile?.username || "Traveler";
  const displayRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User";
  const displayAvatar = buildImageUrl(profile?.avatar);

  return (
    <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
      <div className="flex h-full w-full bg-[#fcfbf8]">

        {/* Persistent sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            {/* User info */}
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-blue-100">
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src={displayAvatar}
                  onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-base font-bold leading-tight text-[#2d3b2a] truncate">
                  {displayName}
                </h1>
                <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive ? "bg-blue-50" : "hover:bg-[#f0f4ee]"
                    }`}
                  >
                    <span className={`material-symbols-outlined transition-colors ${
                      isActive ? "text-blue-600" : "text-[#6b7280] group-hover:text-blue-600"
                    }`}>
                      {item.icon}
                    </span>
                    <span className={`text-sm ${
                      isActive ? "font-semibold text-[#2d3b2a]" : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-6">
              <Link
                to="/logout"
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm"
              >
                <span className="material-symbols-outlined text-[#6b7280] transition-colors group-hover:text-red-500">logout</span>
                <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">Log Out</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f6f7f8]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
