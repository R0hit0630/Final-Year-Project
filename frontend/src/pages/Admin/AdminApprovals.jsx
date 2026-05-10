import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE as apiBase } from "../../config/api.js";

export default function AdminApprovals() {
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);
  const [search, setSearch] = useState("");

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiBase}/api/admin/agencies/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovals(res.data || []);
    } catch (error) {
      console.error("Fetch approvals error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [apiBase]);

  const handleApprove = async (agencyId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiBase}/api/admin/agencies/${agencyId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Agency approved successfully!");
      fetchApprovals();
    } catch (error) {
      alert("Failed to approve agency");
    }
  };

  const filteredApprovals = useMemo(() => {
    return approvals.filter(item => {
      const name = item.agencyName || item.username || "";
      return name.toLowerCase().includes(search.toLowerCase()) ||
             item.email.toLowerCase().includes(search.toLowerCase());
    });
  }, [approvals, search]);

  const getStatusBadge = (verified) => {
    if (verified) {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    }
    return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  };

  const normalizeImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    return `${apiBase}${value.startsWith("/") ? "" : "/"}${value}`;
  };

  const renderCredentials = (item) => {
    const creds = item.agencyCredentials;
    if (!creds || (!creds.license && !creds.insurance && !creds.vat)) {
      return <span className="text-xs text-gray-400 italic">None uploaded</span>;
    }

    return (
      <div className="flex gap-2">
        {creds.license && (
          <a href={normalizeImageUrl(creds.license)} target="_blank" rel="noreferrer" title="Ministry of Tourism License" className="flex items-center justify-center h-8 w-8 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-[16px]">description</span>
          </a>
        )}
        {creds.insurance && (
          <a href={normalizeImageUrl(creds.insurance)} target="_blank" rel="noreferrer" title="Liability Insurance" className="flex items-center justify-center h-8 w-8 rounded border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-[16px]">security</span>
          </a>
        )}
        {creds.vat && (
          <a href={normalizeImageUrl(creds.vat)} target="_blank" rel="noreferrer" title="VAT Registration" className="flex items-center justify-center h-8 w-8 rounded border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-[16px]">id_card</span>
          </a>
        )}
      </div>
    );
  };

  return (
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] py-3 pl-11 pr-4 text-sm outline-none focus:border-primary/50"
                />
              </div>

              <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none focus:border-primary/50">
                <option>All Status</option>
                <option>Pending</option>
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
                  {filteredApprovals.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 last:border-0">
                      <td className="py-4">
                        <p className="font-semibold text-[#2d3b2a]">{item.agencyName || item.username}</p>
                        <p className="text-xs text-[#6b7280]">{item.email}</p>
                      </td>
                      <td className="py-4 text-[#4b5563]">{item.fullName || "N/A"}</td>
                      <td className="py-4 text-[#4b5563]">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-[#4b5563]">{renderCredentials(item)}</td>
                      <td className="py-4">
                        <span
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-bold",
                            getStatusBadge(item.agencyVerified),
                          ].join(" ")}
                        >
                          {item.agencyVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(item._id)}
                            className="rounded-lg bg-[#1978e5] px-3 py-2 text-xs font-bold text-white hover:opacity-90"
                          >
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
  );
}