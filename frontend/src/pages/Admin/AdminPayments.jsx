import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function AdminPayments() {
  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const sidebar = useMemo(
    () => [
      { label: "Dashboard", icon: "dashboard", to: "/admin/dashboard", active: false },
      { label: "Users", icon: "group", to: "/admin/users", active: false },
      { label: "Agencies", icon: "business", to: "/admin/agencies", active: false },
      { label: "Payments", icon: "payments", to: "/admin/payments", active: true },
      { label: "Approvals", icon: "fact_check", to: "/admin/approvals", active: false },
    ],
    []
  );

  const payments = useMemo(
    () => [
      {
        id: "PAY-1001",
        customer: "John Smith",
        email: "john@gmail.com",
        packageName: "Everest Base Camp Trek",
        amount: "$1,200",
        date: "Apr 10, 2026",
        method: "eSewa",
        status: "Paid",
      },
      {
        id: "PAY-1002",
        customer: "Sophia Brown",
        email: "sophia@gmail.com",
        packageName: "Langtang Valley Trek",
        amount: "$850",
        date: "Apr 11, 2026",
        method: "Khalti",
        status: "Pending",
      },
      {
        id: "PAY-1003",
        customer: "Liam Wilson",
        email: "liam@gmail.com",
        packageName: "Annapurna Circuit",
        amount: "$1,500",
        date: "Apr 12, 2026",
        method: "Card",
        status: "Paid",
      },
      {
        id: "PAY-1004",
        customer: "Emily Carter",
        email: "emily@gmail.com",
        packageName: "Manaslu Circuit Trek",
        amount: "$990",
        date: "Apr 13, 2026",
        method: "eSewa",
        status: "Refunded",
      },
    ],
    []
  );

  const getStatusBadge = (status) => {
    if (status === "Paid") {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    if (status === "Pending") {
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

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
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] py-3 pl-11 pr-4 text-sm outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none">
                  <option>All Status</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Refunded</option>
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
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4">
                        <p className="font-semibold text-[#2d3b2a]">{payment.customer}</p>
                        <p className="text-xs text-[#6b7280]">{payment.email}</p>
                      </td>
                      <td className="py-4 text-[#4b5563]">{payment.packageName}</td>
                      <td className="py-4 font-semibold text-[#2d3b2a]">{payment.amount}</td>
                      <td className="py-4 text-[#4b5563]">{payment.date}</td>
                      <td className="py-4 text-[#4b5563]">{payment.method}</td>
                      <td className="py-4">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-bold",
                            getStatusBadge(payment.status),
                          ].join(" ")}
                        >
                          {payment.status}
                        </span>
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
      </div>
    </div>
  );
}