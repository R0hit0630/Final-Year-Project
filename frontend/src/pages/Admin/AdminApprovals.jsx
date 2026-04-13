import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function AdminApprovals() {
  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const sidebar = useMemo(
    () => [
      { label: "Dashboard", icon: "dashboard", to: "/admin/dashboard", active: false },
      { label: "Users", icon: "group", to: "/admin/users", active: false },
      { label: "Agencies", icon: "business", to: "/admin/agencies", active: false },
      { label: "Payments", icon: "payments", to: "/admin/payments", active: false },
      { label: "Approvals", icon: "fact_check", to: "/admin/approvals", active: true },
    ],
    []
  );

  const approvals = useMemo(
    () => [
      {
        id: "APR-1001",
        agencyName: "Himalayan Quest",
        email: "quest@gmail.com",
        owner: "Nabin Shrestha",
        submitted: "Apr 11, 2026",
        document: "Business License",
        status: "Pending",
      },
      {
        id: "APR-1002",
        agencyName: "Peak Adventures",
        email: "peak@gmail.com",
        owner: "Rajan Gurung",
        submitted: "Apr 12, 2026",
        document: "PAN Certificate",
        status: "Pending",
      },
      {
        id: "APR-1003",
        agencyName: "Snow Trails",
        email: "snow@gmail.com",
        owner: "Milan Tamang",
        submitted: "Apr 13, 2026",
        document: "Company Registration",
        status: "Reviewed",
      },
    ],
    []
  );

  const getStatusBadge = (status) => {
    if (status === "Reviewed") {
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    }
    if (status === "Approved") {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
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
            <h1 className="text-3xl font-bold">Agency Approvals</h1>
            <p className="mt-1 text-[#6b7280]">
              Review pending agency requests and verify submitted documents.
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
                  placeholder="Search by agency or owner"
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] py-3 pl-11 pr-4 text-sm outline-none"
                />
              </div>

              <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none">
                <option>All Status</option>
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Approved</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">Approval Requests</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      Agency
                    </th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      Owner
                    </th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      Submitted
                    </th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      Document
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
                  {approvals.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4">
                        <p className="font-semibold text-[#2d3b2a]">{item.agencyName}</p>
                        <p className="text-xs text-[#6b7280]">{item.email}</p>
                      </td>
                      <td className="py-4 text-[#4b5563]">{item.owner}</td>
                      <td className="py-4 text-[#4b5563]">{item.submitted}</td>
                      <td className="py-4 text-[#4b5563]">{item.document}</td>
                      <td className="py-4">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-bold",
                            getStatusBadge(item.status),
                          ].join(" ")}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold hover:bg-gray-50">
                            Review
                          </button>
                          <button className="rounded-lg bg-[#1978e5] px-3 py-2 text-xs font-bold text-white hover:opacity-90">
                            Approve
                          </button>
                        </div>
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