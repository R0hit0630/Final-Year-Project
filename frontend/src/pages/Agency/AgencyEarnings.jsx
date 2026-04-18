import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AgencySidebar from "../../components/AgencySidebar";

export default function AgencyEarnings() {
  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.get(`${apiBase}/api/bookings/agency`, config);
      const bookingsData = res.data?.bookings || res.data || [];
      
      // Filter only paid or refunded bookings for earnings
      const validBookings = bookingsData.filter(b => ["paid", "refunded"].includes(b.paymentStatus));
      const enrichedBookings = validBookings.map(b => {
        const isCancelled = b.status === "cancelled";
        const earnedAmount = isCancelled ? (b.totalPrice - (b.refundAmount || 0)) : b.totalPrice;
        return { ...b, earnedAmount, isCancelled };
      });
      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Failed to load earnings data");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.earnedAmount || 0), 0);
    const totalTransactions = bookings.length;
    
    // Calculate this month's earnings
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthlyEarnings = bookings
      .filter(b => new Date(b.createdAt) >= firstDayOfMonth)
      .reduce((sum, b) => sum + (b.earnedAmount || 0), 0);

    return [
      {
        label: "Total Earnings",
        value: `रु ${totalEarnings.toLocaleString()}`,
        icon: "account_balance_wallet",
      },
      {
        label: "Monthly Revenue",
        value: `रु ${monthlyEarnings.toLocaleString()}`,
        sub: "This month",
        icon: "trending_up",
      },
      {
        label: "Paid Transactions",
        value: totalTransactions,
        sub: "Successful payments",
        icon: "receipt_long",
      },
    ];
  }, [bookings]);

  const StatCard = ({ item }) => (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm flex items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1978e5]/10">
        <span
          className="material-symbols-outlined text-3xl"
          style={{ color: COLORS.primary }}
        >
          {item.icon}
        </span>
      </div>
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-wider text-[#6b7280]">
          {item.label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-[#2d3b2a]">{item.value}</h3>
          {item.sub && (
            <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>
          )}
        </div>
      </div>
    </div>
  );

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `रु ${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]" style={paperTextureStyle}>
        <AgencySidebar />

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: COLORS.primary }}
              >
                terrain
              </span>
              <span className="text-lg font-bold text-[#2d3b2a]">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#2d3b2a]">
                  Agency Earnings
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Track your revenue and successful payment transactions.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-700"
                  style={{
                    backgroundColor: "#3fa10e",
                    boxShadow: "0 12px 30px rgba(63,161,14,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export Statement
                </button>
              </div>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {stats.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: COLORS.primary }}
                  >
                    payments
                  </span>
                  Transaction History
                </h3>
              </div>

              {loading ? (
                <div className="py-10 text-center text-sm font-medium text-[#6b7280]">
                  Loading earnings data...
                </div>
              ) : error ? (
                <div className="py-10 text-center text-sm font-medium text-red-600">
                  {error}
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-10 text-center text-sm font-medium text-[#6b7280]">
                  No paid transactions found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Transaction ID / Ref
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Date
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Customer
                        </th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Package
                        </th>
                        <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Amount Earned
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-sm">
                      {bookings.map((row) => (
                        <tr
                          key={row._id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                        >
                          <td className="py-4">
                            <p className="font-mono text-xs font-semibold text-[#2d3b2a]">
                              {row.transactionUuid || row._id}
                            </p>
                            <span className="mt-1 inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              eSewa
                            </span>
                          </td>

                          <td className="py-4 text-[#4b5563]">
                            {formatDate(row.createdAt)}
                          </td>

                          <td className="py-4">
                            <p className="font-medium text-[#2d3b2a]">
                              {row.user?.name || row.user?.username || "User"}
                            </p>
                            <p className="text-xs text-[#6b7280]">
                              {row.user?.email || "-"}
                            </p>
                          </td>

                          <td className="py-4 text-[#4b5563]">
                            {row.package?.title || "Package"}
                            <p className="text-xs text-[#94a3b8]">
                              {row.travelers} Travelers
                            </p>
                            {row.isCancelled && (
                              <span className="mt-1 inline-block rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                Cancelled (70% Refunded)
                              </span>
                            )}
                          </td>

                          <td className="py-4 text-right">
                            <p className={`font-bold text-lg ${row.isCancelled ? 'text-amber-600' : 'text-[#3fa10e]'}`}>
                              +{formatPrice(row.earnedAmount)}
                            </p>
                            {row.isCancelled && (
                              <p className="text-xs text-red-500 line-through">
                                {formatPrice(row.totalPrice)}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
