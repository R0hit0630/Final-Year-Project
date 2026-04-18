import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminAgencies() {
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiBase}/api/admin/users?role=agency`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgencies(res.data || []);
    } catch (error) {
      console.error("Fetch agencies error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [apiBase]);

  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const name = agency.agencyName || agency.username || "";
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                            agency.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || 
                            (statusFilter === "Approved" && agency.agencyVerified) || 
                            (statusFilter === "Pending" && !agency.agencyVerified);
      return matchesSearch && matchesStatus;
    });
  }, [agencies, search, statusFilter]);

  const getStatusBadge = (verified) => {
    if (verified) {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#2d3b2a]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Manage Agencies</h1>
            <p className="mt-1 text-[#6b7280]">
              View and manage registered agencies.
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
                  placeholder="Search by agency or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none focus:border-primary/50"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">Agency Records</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      Agency
                    </th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      Joined
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
                  {filteredAgencies.map((agency) => (
                    <tr key={agency._id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4">
                        <p className="font-semibold text-[#2d3b2a]">{agency.agencyName || agency.username}</p>
                        <p className="text-xs text-[#6b7280]">{agency.email}</p>
                      </td>
                      <td className="py-4 text-[#4b5563]">{new Date(agency.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-bold",
                            getStatusBadge(agency.agencyVerified),
                          ].join(" ")}
                        >
                          {agency.agencyVerified ? "Verified" : "Pending"}
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