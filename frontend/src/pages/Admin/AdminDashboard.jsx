import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const sidebar = useMemo(
    () => [
      { label: "Dashboard", icon: "dashboard", to: "/admin/dashboard", active: true },
      { label: "Users", icon: "group", to: "/admin/users", active: false },
      { label: "Agencies", icon: "business", to: "/admin/agencies", active: false },
      { label: "Payments", icon: "payments", to: "/admin/payments", active: false },
      { label: "Approvals", icon: "fact_check", to: "/admin/approvals", active: false },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: "Total Users", value: "1,248", delta: "8.2%", deltaUp: true, icon: "group" },
      { label: "Total Agencies", value: "86", delta: "4.1%", deltaUp: true, icon: "business" },
      { label: "Pending Approvals", value: "12", sub: "need action", icon: "fact_check" },
      { label: "Total Payments", value: "$58.4k", sub: "this month", icon: "payments" },
    ],
    []
  );

  const recentUsers = useMemo(
    () => [
      { name: "John Smith", email: "john@gmail.com", role: "User", joined: "Apr 10, 2026", status: "Active" },
      { name: "Emily Carter", email: "emily@gmail.com", role: "User", joined: "Apr 11, 2026", status: "Active" },
      { name: "David Lee", email: "david@gmail.com", role: "User", joined: "Apr 12, 2026", status: "Blocked" },
    ],
    []
  );

  const recentAgencies = useMemo(
    () => [
      { name: "Summit Treks", email: "summit@gmail.com", joined: "Apr 09, 2026", verified: "Approved" },
      { name: "Himalayan Quest", email: "quest@gmail.com", joined: "Apr 11, 2026", verified: "Pending" },
      { name: "Nepal Trail Co.", email: "trail@gmail.com", joined: "Apr 12, 2026", verified: "Pending" },
    ],
    []
  );

  const recentPayments = useMemo(
    () => [
      { customer: "John Smith", packageName: "Everest Base Camp Trek", amount: "$1,200", date: "Apr 10, 2026", status: "Paid" },
      { customer: "Sophia Brown", packageName: "Langtang Valley Trek", amount: "$850", date: "Apr 11, 2026", status: "Pending" },
      { customer: "Liam Wilson", packageName: "Annapurna Circuit", amount: "$1,500", date: "Apr 12, 2026", status: "Paid" },
    ],
    []
  );

  const getStatusBadge = (status) => {
    if (status === "Active" || status === "Approved" || status === "Paid") {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    if (status === "Pending") {
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  const StatCard = ({ item }) => (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="absolute right-4 top-4 opacity-10">
        <span
          className="material-symbols-outlined text-6xl"
          style={{ color: COLORS.primary }}
        >
          {item.icon}
        </span>
      </div>

      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#6b7280]">
        {item.label}
      </p>

      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#2d3b2a]">{item.value}</h3>

        {item.delta && (
          <span
            className={[
              "flex items-center gap-1 text-xs font-bold",
              item.deltaUp ? "text-emerald-600" : "text-red-600",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-sm">
              {item.deltaUp ? "arrow_upward" : "arrow_downward"}
            </span>
            {item.delta}
          </span>
        )}

        {item.sub && (
          <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#2d3b2a]">
      <div className="flex min-h-screen">
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
            {sidebar.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={[
                  "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                  item.active
                    ? "bg-[#1978e5]/10 hover:bg-[#1978e5]/20"
                    : "hover:bg-[#f0f4ee]",
                ].join(" ")}
              >
                <span
                  className={
                    item.active
                      ? "material-symbols-outlined text-[#1978e5]"
                      : "material-symbols-outlined text-[#6b7280]"
                  }
                >
                  {item.icon}
                </span>
                <span
                  className={
                    item.active
                      ? "font-semibold text-[#2d3b2a]"
                      : "font-medium text-[#4b5563]"
                  }
                >
                  {item.label}
                </span>
              </Link>
            ))}
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

        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-[#6b7280]">
                Manage agencies, users, approvals, payments, and system activity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/agencies")}
                className="flex items-center gap-2 rounded-lg bg-[#1978e5] px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90"
              >
                <span className="material-symbols-outlined text-sm">business</span>
                Manage Agencies
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#2d3b2a] hover:bg-gray-50"
              >
                Manage Users
              </button>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/admin/approvals")}
              className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1978e5]">fact_check</span>
                <h3 className="text-lg font-bold">Approve Agencies</h3>
              </div>
              <p className="text-sm text-[#6b7280]">
                Review and approve pending agency registrations.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/payments")}
              className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1978e5]">payments</span>
                <h3 className="text-lg font-bold">Review Payments</h3>
              </div>
              <p className="text-sm text-[#6b7280]">
                Check payment records, pending transactions, and payment history.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#1978e5]">group</span>
                <h3 className="text-lg font-bold">Manage Users</h3>
              </div>
              <p className="text-sm text-[#6b7280]">
                View users, block accounts, and monitor activity.
              </p>
            </button>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Users</h3>
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="text-sm font-bold text-[#1978e5] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Name</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Role</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Joined</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.email} className="border-b border-gray-100 last:border-0">
                        <td className="py-4">
                          <p className="font-semibold text-[#2d3b2a]">{user.name}</p>
                          <p className="text-xs text-[#6b7280]">{user.email}</p>
                        </td>
                        <td className="py-4 text-[#4b5563]">{user.role}</td>
                        <td className="py-4 text-[#4b5563]">{user.joined}</td>
                        <td className="py-4">
                          <span className={["rounded-full border px-3 py-1 text-xs font-bold", getStatusBadge(user.status)].join(" ")}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Agencies</h3>
                <button
                  type="button"
                  onClick={() => navigate("/admin/agencies")}
                  className="text-sm font-bold text-[#1978e5] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Agency</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Joined</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAgencies.map((agency) => (
                      <tr key={agency.email} className="border-b border-gray-100 last:border-0">
                        <td className="py-4">
                          <p className="font-semibold text-[#2d3b2a]">{agency.name}</p>
                          <p className="text-xs text-[#6b7280]">{agency.email}</p>
                        </td>
                        <td className="py-4 text-[#4b5563]">{agency.joined}</td>
                        <td className="py-4">
                          <span className={["rounded-full border px-3 py-1 text-xs font-bold", getStatusBadge(agency.verified)].join(" ")}>
                            {agency.verified}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent Payments</h3>
              <button
                type="button"
                onClick={() => navigate("/admin/payments")}
                className="text-sm font-bold text-[#1978e5] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Customer</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Package</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Amount</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Date</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 font-semibold text-[#2d3b2a]">{payment.customer}</td>
                      <td className="py-4 text-[#4b5563]">{payment.packageName}</td>
                      <td className="py-4 font-semibold text-[#2d3b2a]">{payment.amount}</td>
                      <td className="py-4 text-[#4b5563]">{payment.date}</td>
                      <td className="py-4">
                        <span className={["rounded-full border px-3 py-1 text-xs font-bold", getStatusBadge(payment.status)].join(" ")}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}