import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AgencyGuides() {
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [expertise, setExpertise] = useState("All Expertise");
  const [loading, setLoading] = useState(true);
  const [leaveDrafts, setLeaveDrafts] = useState({});

  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };

  const sidebar = useMemo(
    () => [
      { label: "Overview", icon: "dashboard", to: "/agency", active: false },
      { label: "My Packages", icon: "hiking", to: "/agency/packages", active: false },
      { label: "Bookings", icon: "book_online", to: "/agency/bookings", active: false },
      { label: "Earnings", icon: "payments", to: "/agency/earnings", active: false },
      { label: "Guides", icon: "person", to: "/agency/guides", active: true },
      { label: "Profile", icon: "settings_account_box", to: "/agency/profile", active: false },
    ],
    []
  );

  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const toInputDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 10);
  };

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/guides/mine", getAuthConfig());

      if (Array.isArray(res.data)) {
        setGuides(res.data);
        const initialDrafts = {};
        res.data.forEach((guide) => {
          initialDrafts[guide._id] = {
            leaveStartDate: toInputDate(guide.leaveStartDate),
            leaveEndDate: toInputDate(guide.leaveEndDate),
          };
        });
        setLeaveDrafts(initialDrafts);
      } else {
        setGuides([]);
      }
    } catch (error) {
      console.error("Failed to load guides:", error);
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleLeaveChange = (guideId, field, value) => {
    setLeaveDrafts((prev) => ({
      ...prev,
      [guideId]: {
        ...prev[guideId],
        [field]: value,
      },
    }));
  };

  const handleSaveLeave = async (guide) => {
    try {
      const token = localStorage.getItem("token");
      const draft = leaveDrafts[guide._id] || {
        leaveStartDate: "",
        leaveEndDate: "",
      };

      if (!draft.leaveStartDate || !draft.leaveEndDate) {
        alert("Please select both leave start and leave end dates");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/guides/${guide._id}`,
        {
          leaveStartDate: draft.leaveStartDate,
          leaveEndDate: draft.leaveEndDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Leave dates saved successfully");
      await fetchGuides();
    } catch (error) {
      console.error("Save leave error:", error);
      alert(error?.response?.data?.message || "Failed to save leave dates");
    }
  };

  const handleClearLeave = async (guide) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/guides/${guide._id}`,
        {
          leaveStartDate: null,
          leaveEndDate: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Leave cleared successfully");
      await fetchGuides();
    } catch (error) {
      console.error("Clear leave error:", error);
      alert(error?.response?.data?.message || "Failed to clear leave");
    }
  };

  const isCurrentlyOnLeave = (guide) => {
    if (!guide.leaveStartDate || !guide.leaveEndDate) return false;
    const now = new Date();
    const start = new Date(guide.leaveStartDate);
    const end = new Date(guide.leaveEndDate);
    return now >= start && now <= end;
  };

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        (guide.fullName || "").toLowerCase().includes(q) ||
        (guide.region || "").toLowerCase().includes(q) ||
        (guide.specialization || "").toLowerCase().includes(q) ||
        (guide.certification || "").toLowerCase().includes(q) ||
        (Array.isArray(guide.skills) &&
          guide.skills.some((skill) => (skill || "").toLowerCase().includes(q)));

      const matchesRegion =
        region === "All Regions" ||
        (guide.region || "").toLowerCase().includes(region.toLowerCase());

      const matchesExpertise =
        expertise === "All Expertise" ||
        (guide.specialization || "").toLowerCase().includes(expertise.toLowerCase()) ||
        (guide.certification || "").toLowerCase().includes(expertise.toLowerCase()) ||
        (Array.isArray(guide.skills) &&
          guide.skills.some((skill) =>
            (skill || "").toLowerCase().includes(expertise.toLowerCase())
          ));

      return matchesSearch && matchesRegion && matchesExpertise;
    });
  }, [guides, search, region, expertise]);

  const stats = useMemo(() => {
    return {
      totalGuides: filteredGuides.length,
      activeGuides: filteredGuides.filter((g) => g.isActive).length,
      onLeaveGuides: filteredGuides.filter((g) => isCurrentlyOnLeave(g)).length,
      inactiveGuides: filteredGuides.filter((g) => !g.isActive).length,
    };
  }, [filteredGuides]);

  const recentAssignments = useMemo(() => {
    return filteredGuides.slice(0, 4).map((guide, index) => ({
      guide: guide.fullName || "Unnamed Guide",
      region: guide.region || "Unknown Region",
      date: new Date(Date.now() + index * 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      clients: index + 2,
      status: isCurrentlyOnLeave(guide)
        ? "On Leave"
        : !guide.isActive
        ? "Inactive"
        : "Available",
    }));
  }, [filteredGuides]);

  const statCards = useMemo(
    () => [
      {
        label: "Total Guides",
        value: stats.totalGuides,
        delta: "Live",
        deltaUp: true,
        icon: "groups",
      },
      {
        label: "Active Guides",
        value: stats.activeGuides,
        delta: "Current",
        deltaUp: true,
        icon: "verified",
      },
      {
        label: "On Leave",
        value: stats.onLeaveGuides,
        delta: "Auto",
        deltaUp: true,
        icon: "event_busy",
      },
      {
        label: "Inactive",
        value: stats.inactiveGuides,
        delta: "Status",
        deltaUp: false,
        icon: "block",
      },
    ],
    [stats]
  );

  const getAssignmentBadge = (status) => {
    if (status === "On Leave") {
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    }
    if (status === "Inactive") {
      return "bg-red-500/10 text-red-700 border-red-500/20";
    }
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const StatCard = ({ item }) => (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="absolute right-0 top-0 p-4 opacity-10">
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
      </div>
    </div>
  );

  const GuideCard = ({ guide }) => {
    const currentlyOnLeave = isCurrentlyOnLeave(guide);

    const statusLabel = !guide.isActive
      ? "Inactive"
      : currentlyOnLeave
      ? "On Leave"
      : "Available";

    const statusClass = !guide.isActive
      ? "bg-red-500/10 text-red-700 border-red-500/20"
      : currentlyOnLeave
      ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";

    const draft = leaveDrafts[guide._id] || {
      leaveStartDate: "",
      leaveEndDate: "",
    };

    return (
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="relative h-52 overflow-hidden">
          <img
            src={guide.photo || "https://via.placeholder.com/400x300?text=Guide"}
            alt={guide.fullName || "Guide"}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-lg font-bold text-white">
              {guide.fullName || "Unnamed Guide"}
            </h3>
            <p className="text-sm text-white/90">
              {guide.region || "Unknown Region"}
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#6b7280]">
              Experience
            </span>
            <span className="rounded-lg bg-[#1978e5]/10 px-2 py-1 text-xs font-bold text-[#1978e5]">
              {guide.experience || "N/A"}
            </span>
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <span
              className={[
                "rounded-full border px-3 py-1 text-xs font-bold",
                statusClass,
              ].join(" ")}
            >
              {statusLabel}
            </span>

            {guide.leaveStartDate && guide.leaveEndDate && (
              <span className="text-[11px] font-medium text-[#6b7280]">
                {formatDate(guide.leaveStartDate)} - {formatDate(guide.leaveEndDate)}
              </span>
            )}
          </div>

          <div className="mb-2 text-sm font-medium text-[#4b5563]">
            {guide.specialization || "No specialization"}
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {Array.isArray(guide.skills) && guide.skills.length > 0 ? (
              guide.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-[#4b5563]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-[#4b5563]">
                No skills
              </span>
            )}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-2">
            <input
              type="date"
              value={draft.leaveStartDate}
              onChange={(e) =>
                handleLeaveChange(guide._id, "leaveStartDate", e.target.value)
              }
              disabled={!guide.isActive}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#2d3b2a] outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
            />
            <input
              type="date"
              value={draft.leaveEndDate}
              onChange={(e) =>
                handleLeaveChange(guide._id, "leaveEndDate", e.target.value)
              }
              disabled={!guide.isActive}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#2d3b2a] outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/agency/guides/${guide._id}`)}
              className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-[#2d3b2a] transition-colors hover:bg-gray-50"
            >
              View
            </button>

            <button
              type="button"
              onClick={() => handleSaveLeave(guide)}
              disabled={!guide.isActive}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Save Leave
            </button>

            <button
              type="button"
              onClick={() => handleClearLeave(guide)}
              disabled={!guide.isActive}
              className="flex-1 rounded-lg bg-yellow-600 py-2 text-xs font-bold text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]" style={paperTextureStyle}>
        <aside className="hidden w-64 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#e0e8dc] bg-white shadow-sm">
                <img
                  alt="Agency Logo"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight text-[#2d3b2a]">
                  Summit Treks
                </h1>
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: COLORS.primary }}
                >
                  Partner Agency
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {sidebar.map((i) => (
                <Link
                  key={i.label}
                  to={i.to}
                  className={[
                    "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    i.active ? "bg-[#1978e5]/10 hover:bg-[#1978e5]/20" : "hover:bg-[#f0f4ee]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "material-symbols-outlined transition-colors",
                      i.active ? "text-[#1978e5]" : "text-[#6b7280] group-hover:text-[#1978e5]",
                    ].join(" ")}
                  >
                    {i.icon}
                  </span>

                  <span
                    className={[
                      "text-sm",
                      i.active
                        ? "font-semibold text-[#2d3b2a]"
                        : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]",
                    ].join(" ")}
                  >
                    {i.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <Link
                to="/logout"
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm"
              >
                <span className="material-symbols-outlined text-[#6b7280] transition-colors group-hover:text-red-500">
                  logout
                </span>
                <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">
                  Log Out
                </span>
              </Link>
            </div>
          </div>
        </aside>

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
                  Agency Guides
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Manage guide expertise, profiles, and leave schedules.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/agency/guides/add")}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 12px 30px rgba(25,120,229,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add New Guide
                </button>
              </div>
            </div>

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>

            <div className="mb-8 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search guides by name or region"
                    className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none"
                  >
                    <option>All Regions</option>
                    <option>Everest</option>
                    <option>Annapurna</option>
                    <option>Langtang</option>
                    <option>Manaslu</option>
                  </select>

                  <select
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2d3b2a] outline-none"
                  >
                    <option>All Expertise</option>
                    <option>Medical</option>
                    <option>Technical Trekking</option>
                    <option>Photography</option>
                    <option>Wellness</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#2d3b2a]">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: COLORS.primary }}
                  >
                    badge
                  </span>
                  Guide Directory
                </h2>

                <span
                  className="text-sm font-bold"
                  style={{ color: COLORS.primary }}
                >
                  {filteredGuides.length} Guides
                </span>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
                  <p className="text-[#6b7280]">Loading guides...</p>
                </div>
              ) : filteredGuides.length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
                  <p className="text-[#6b7280]">No guides found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredGuides.map((guide) => (
                    <GuideCard key={guide._id} guide={guide} />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: COLORS.primary }}
                  >
                    calendar_month
                  </span>
                  Guide Status Overview
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Guide
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Region
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Dates
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Clients
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm">
                    {recentAssignments.length > 0 ? (
                      recentAssignments.map((row, index) => (
                        <tr
                          key={`${row.guide}-${row.date}-${index}`}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-4 font-semibold text-[#2d3b2a]">
                            {row.guide}
                          </td>
                          <td className="py-4 text-[#4b5563]">{row.region}</td>
                          <td className="py-4 text-[#4b5563]">{row.date}</td>
                          <td className="py-4 text-[#4b5563]">{row.clients}</td>
                          <td className="py-4">
                            <span
                              className={[
                                "rounded-full border px-3 py-1 text-xs font-bold",
                                getAssignmentBadge(row.status),
                              ].join(" ")}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-[#6b7280]">
                          No guide status found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 border-t border-[#e5e7eb] pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
              <p>Agency guide management overview</p>
              <p>Leave works automatically by date range</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}