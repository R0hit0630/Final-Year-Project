import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE as apiBase } from "../../config/api.js";

export default function AdminPayments() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  // [FLOW FEATURE: ADMIN PAYMENTS - FETCH BOOKINGS]
  // Fetches lists of all user bookings, including their price, transaction details, and refund status
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiBase}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  // [FLOW FEATURE: ADMIN PAYMENTS - REFUND PROCESS]
  // Processes a booking cancellation refund, changing its refundStatus from pending to processed on backend
  const handleProcessRefund = async (id) => {
    if (!window.confirm("Are you sure you want to process this refund? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiBase}/api/admin/bookings/${id}/refund`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings(); // Reload list to update display status
    } catch (error) {
      console.error("Process refund error:", error);
      alert(error.response?.data?.message || "Failed to process refund");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [apiBase]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const customer = booking.user?.fullName || booking.user?.username || "";
      const pkg = booking.package?.title || "";
      const matchesSearch = customer.toLowerCase().includes(search.toLowerCase()) ||
                            pkg.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || 
                            (statusFilter === "Paid" && booking.paymentStatus === "paid") || 
                            (statusFilter === "Refunded" && booking.paymentStatus === "refunded") || 
                            (statusFilter === "Pending" && booking.paymentStatus === "pending");
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const getStatusBadge = (status) => {
    if (status === "paid") {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    if (status === "refunded") {
      return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
    if (status === "pending") {
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  return (
    <main className="flex-1 p-6 md:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Payments</h1>
        <p className="mt-1 text-[#6b7280]">
          View payment history, pending payments, and refunds.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by customer or package"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none focus:border-primary/50"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
              <option value="Pending">Pending</option>
            </select>

            <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none">
              <option>All Methods</option>
              <option>eSewa</option>
              <option>Khalti</option>
              <option>Card</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold">Payment Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Customer
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Package
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Amount
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Date
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Method
                </th>
                <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Status
                </th>
                <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4">
                    <p className="font-semibold text-[#2d3b2a]">{booking.user?.fullName || booking.user?.username}</p>
                    <p className="text-xs text-[#6b7280]">{booking.user?.email}</p>
                  </td>
                  <td className="py-4 text-[#4b5563]">{booking.package?.title}</td>
                  <td className="py-4">
                    <p className="font-semibold text-[#2d3b2a]">रु {booking.totalPrice}</p>
                    {booking.status === "cancelled" && booking.refundAmount > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Refund: रु {booking.refundAmount}
                      </p>
                    )}
                  </td>
                  <td className="py-4 text-[#4b5563]">{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-[#4b5563]">eSewa</td>
                  <td className="py-4">
                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-bold",
                        getStatusBadge(booking.paymentStatus),
                      ].join(" ")}
                    >
                      {booking.paymentStatus}
                    </span>
                    {booking.status === "cancelled" && booking.refundAmount > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${booking.refundStatus === "processed" ? "bg-gray-500/10 text-gray-700 border-gray-500/20" : "bg-amber-500/10 text-amber-700 border-amber-500/20"}`}>
                          {booking.refundStatus === "processed" ? "Refund Processed" : "Refund Pending"}
                        </span>
                        {booking.refundStatus === "pending" && (
                          <button 
                            onClick={() => handleProcessRefund(booking._id)}
                            className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-blue-700"
                          >
                            Process
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold hover:bg-gray-50">
                      View
                    </button>
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