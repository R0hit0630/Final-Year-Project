import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import defaultAvatar from "../../assets/default-avatar.jpg";

export default function AdminAgencies() {
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencyDetails, setAgencyDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (selectedAgency) {
      const fetchDetails = async () => {
        setDetailsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${apiBase}/api/admin/users/${selectedAgency._id}/details`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAgencyDetails(res.data.details);
        } catch (error) {
          console.error("Fetch details error:", error);
        } finally {
          setDetailsLoading(false);
        }
      };
      fetchDetails();
    } else {
      setAgencyDetails(null);
    }
  }, [selectedAgency, apiBase]);

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

  const normalizeImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    return `${apiBase}${value.startsWith("/") ? "" : "/"}${value}`;
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiBase}/api/admin/users/${id}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAgencies((prev) =>
        prev.map((agency) =>
          agency._id === id ? { ...agency, isActive: !currentStatus } : agency
        )
      );
    } catch (error) {
      console.error("Toggle status error:", error);
      alert(error.response?.data?.message || "Error toggling status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agency? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiBase}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgencies((prev) => prev.filter((agency) => agency._id !== id));
    } catch (error) {
      console.error("Delete agency error:", error);
      alert(error.response?.data?.message || "Error deleting agency");
    }
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
                        <div className="flex gap-2">
                          <span
                            className={[
                              "rounded-full border px-3 py-1 text-xs font-bold",
                              getStatusBadge(agency.agencyVerified),
                            ].join(" ")}
                          >
                            {agency.agencyVerified ? "Verified" : "Pending"}
                          </span>
                          {agency.isActive === false && (
                            <span className="rounded-full border px-3 py-1 text-xs font-bold bg-red-500/10 text-red-700 border-red-500/20">
                              Blocked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedAgency(agency)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold hover:bg-gray-50"
                            title="View Agency Details"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(agency._id, agency.isActive !== false)}
                            className={`rounded-lg border px-3 py-2 text-xs font-bold ${
                              agency.isActive !== false 
                                ? "border-red-200 bg-white text-red-600 hover:bg-red-50" 
                                : "border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {agency.isActive !== false ? "Block" : "Unblock"}
                          </button>
                          <button 
                            onClick={() => handleDelete(agency._id)}
                            className="rounded-lg border border-red-600 bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 hover:border-red-700"
                          >
                            Delete
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

      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedAgency(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            
            <div className="flex items-center gap-4 mb-6 pr-8">
              {selectedAgency.agencyLogo ? (
                <img 
                  src={selectedAgency.agencyLogo.startsWith("http") ? selectedAgency.agencyLogo : `${apiBase}${selectedAgency.agencyLogo.startsWith('/') ? '' : '/'}${selectedAgency.agencyLogo.replace(/\\/g, "/")}`} 
                  alt="Agency Logo" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/20 shadow-sm">
                  {(selectedAgency.agencyName || selectedAgency.username).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-[#2d3b2a] truncate max-w-[200px]">{selectedAgency.agencyName || selectedAgency.username}</h2>
                <p className="text-sm text-gray-500 truncate max-w-[200px]">{selectedAgency.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Joined:</span> <span className="font-semibold text-[#2d3b2a]">{new Date(selectedAgency.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Verification:</span> <span className={`font-semibold ${selectedAgency.agencyVerified ? "text-emerald-600" : "text-yellow-600"}`}>{selectedAgency.agencyVerified ? "Verified" : "Pending"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Status:</span> <span className={`font-semibold ${selectedAgency.isActive !== false ? "text-emerald-600" : "text-red-600"}`}>{selectedAgency.isActive !== false ? "Active" : "Blocked"}</span></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Submitted Credentials</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: 'license', label: 'Ministry of Tourism License', icon: 'description', colorClass: 'bg-blue-50 text-blue-600 border-blue-200' },
                    { key: 'insurance', label: 'Liability Insurance', icon: 'security', colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                    { key: 'vat', label: 'VAT Registration', icon: 'id_card', colorClass: 'bg-purple-50 text-purple-600 border-purple-200' },
                  ].map((c) => {
                    const hasDoc = selectedAgency.agencyCredentials?.[c.key];
                    return (
                      <div key={c.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded border ${c.colorClass}`}>
                            <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                          </div>
                          <span className="text-sm font-semibold text-[#2d3b2a]">{c.label}</span>
                        </div>
                        {hasDoc ? (
                          <a href={normalizeImageUrl(hasDoc)} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#1978e5] hover:underline flex items-center gap-1 bg-[#1978e5]/10 px-3 py-1.5 rounded-full border border-[#1978e5]/20 hover:bg-[#1978e5]/20 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            View PDF
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Missing</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {selectedAgency.agencyDescription && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{selectedAgency.agencyDescription}</p>
                </div>
              )}

              {detailsLoading ? (
                <div className="flex justify-center p-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : agencyDetails && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Performance & Stats</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center justify-center">
                      <span className="text-blue-700 text-xs font-semibold mb-1">Packages</span>
                      <span className="font-bold text-xl text-blue-900">{agencyDetails.packagesCount}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center justify-center">
                      <span className="text-blue-700 text-xs font-semibold mb-1">Guides</span>
                      <span className="font-bold text-xl text-blue-900">{agencyDetails.guidesCount}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex flex-col items-center justify-center">
                      <span className="text-blue-700 text-xs font-semibold mb-1">Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xl text-blue-900">{agencyDetails.averageRating}</span>
                        <span className="text-yellow-400 text-sm material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      </div>
                      <span className="text-[10px] text-gray-500">({agencyDetails.reviewsCount} reviews)</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-100 flex flex-col items-center justify-center">
                      <span className="text-emerald-700 text-xs font-semibold mb-1">Revenue</span>
                      <span className="font-bold text-lg text-emerald-900">${agencyDetails.revenue?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}