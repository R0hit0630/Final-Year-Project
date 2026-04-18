import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import travelinLogo from "../assets/travolin-logo.png";

export default function AdminSidebar() {
  const location = useLocation();

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", icon: "dashboard", to: "/admin/dashboard" },
      { label: "Users", icon: "group", to: "/admin/users" },
      { label: "Agencies", icon: "business", to: "/admin/agencies" },
      { label: "Payments", icon: "payments", to: "/admin/payments" },
      { label: "Approvals", icon: "fact_check", to: "/admin/approvals" },
    ],
    []
  );

  return (
    <aside className="hidden w-64 border-r border-[#e0e8dc] bg-white lg:flex lg:flex-col lg:p-6">
      <div className="mb-10 flex flex-col gap-3">
        <img src={travelinLogo} alt="Travolin" className="h-10 w-auto" />
        <p
          className="text-xs uppercase tracking-wider font-semibold"
          style={{ color: COLORS.primary }}
        >
          Admin Control Panel
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={[
                "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                isActive
                  ? "bg-[#1978e5]/10 hover:bg-[#1978e5]/20"
                  : "hover:bg-[#f0f4ee]",
              ].join(" ")}
            >
              <span
                className={
                  isActive
                    ? "material-symbols-outlined text-[#1978e5]"
                    : "material-symbols-outlined text-[#6b7280]"
                }
              >
                {item.icon}
              </span>
              <span
                className={
                  isActive
                    ? "font-semibold text-[#2d3b2a]"
                    : "font-medium text-[#4b5563]"
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <Link
          to="/logout"
          className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm"
        >
          <span className="material-symbols-outlined text-[#6b7280] group-hover:text-red-500">
            logout
          </span>
          <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">
            Log Out
          </span>
        </Link>
      </div>
    </aside>
  );
}
