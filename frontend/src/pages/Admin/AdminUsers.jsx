import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminUsers() {
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${apiBase}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [apiBase]);

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiBase}/api/admin/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Failed to toggle user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiBase}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.fullName || user.username || "").toLowerCase().includes(search.toLowerCase()) ||
                            user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || 
                            (statusFilter === "Active" && user.isActive) || 
                            (statusFilter === "Blocked" && !user.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const getStatusBadge = (isActive) => {
    if (isActive) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#2d3b2a]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="mt-1 text-[#6b7280]">View, monitor, and manage user accounts.</p>
          </div>

          <div className="mb-8 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by name or email"
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
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">User Records</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Name</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Role</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Joined</th>
                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">Status</th>
                    <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-[#6b7280]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
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
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleToggleStatus(user._id)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold hover:bg-gray-50"
                            title={user.isActive ? "Block User" : "Unblock User"}
                          >
                            {user.isActive ? "Block" : "Unblock"}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                            title="Delete User"
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
    </div>
  );
}