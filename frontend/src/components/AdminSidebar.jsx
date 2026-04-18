import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

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
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e0e8dc] bg-white shadow-sm">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: COLORS.primary }}
          >
            admin_panel_settings
          </span>
        </div>
        <div>
          <h1 className="text-base font-bold">Travolin Admin</h1>
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: COLORS.primary }}
          >
            Control Panel
          </p>
        </div>
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
