import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE as apiBase } from "../../config/api.js";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    recentUsers: [],
    recentAgencies: [],
    recentPayments: [],
  });

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get(`${apiBase}/api/admin/stats`, { headers }),
          axios.get(`${apiBase}/api/admin/users`, { headers }),
          axios.get(`${apiBase}/api/admin/bookings`, { headers }),
        ]);

        const allUsers = usersRes.data || [];
        const allBookings = bookingsRes.data || [];

        setData({
          stats: statsRes.data?.stats || {},
          recentUsers: allUsers.filter(u => u.role === "user").slice(0, 5),
          recentAgencies: allUsers.filter(u => u.role === "agency").slice(0, 5),
          recentPayments: allBookings.slice(0, 5),
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Users", value: data.stats.totalUsers || 0, icon: "group" },
      { label: "Total Agencies", value: data.stats.totalAgencies || 0, icon: "business" },
      { label: "Total Revenue", value: `Rs ${data.stats.totalRevenue || 0}`, icon: "payments" },
      { label: "Total Bookings", value: data.stats.totalBookings || 0, icon: "confirmation_number" },
    ],
    [data.stats]
  );

  const getStatusBadge = (status, role) => {
    if (status === true || status === "Paid" || status === "Approved" || status === "Active") {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    if (status === false && role === "agency") {
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
                    {data.recentUsers.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 last:border-0">
                        <td className="py-4">
                          <p className="font-semibold text-[#2d3b2a]">{user.fullName || user.username}</p>
                          <p className="text-xs text-[#6b7280]">{user.email}</p>
                        </td>
                        <td className="py-4 text-[#4b5563] capitalize">{user.role}</td>
                        <td className="py-4 text-[#4b5563]">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={["rounded-full border px-3 py-1 text-xs font-bold", getStatusBadge(user.isActive)].join(" ")}>
                            {user.isActive ? "Active" : "Blocked"}
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
                    {data.recentAgencies.map((agency) => (
                      <tr key={agency._id} className="border-b border-gray-100 last:border-0">
                        <td className="py-4">
                          <p className="font-semibold text-[#2d3b2a]">{agency.agencyName || agency.username}</p>
                          <p className="text-xs text-[#6b7280]">{agency.email}</p>
                        </td>
                        <td className="py-4 text-[#4b5563]">{new Date(agency.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={["rounded-full border px-3 py-1 text-xs font-bold", getStatusBadge(agency.agencyVerified, "agency")].join(" ")}>
                            {agency.agencyVerified ? "Verified" : "Pending"}
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
                  {data.recentPayments.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 font-semibold text-[#2d3b2a]">{booking.user?.fullName || booking.user?.username}</td>
                      <td className="py-4 text-[#4b5563]">{booking.package?.title}</td>
                      <td className="py-4 font-semibold text-[#2d3b2a]">Rs {booking.totalPrice}</td>
                      <td className="py-4 text-[#4b5563]">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={["rounded-full border px-3 py-1 text-xs font-bold", getStatusBadge(booking.paymentStatus === "paid" ? "Paid" : "Pending")].join(" ")}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </main>
  );
}