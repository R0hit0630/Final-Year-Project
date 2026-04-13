// src/Pages/AgencyProfile.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function AgencyProfile() {
  // ✅ Same palette as your previous light page
  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
    border: "#e0e8dc",
    muted: "#6b7280",
  };

  const sidebar = useMemo(
    () => [
      { label: "Overview", icon: "dashboard", to: "/agency", active: false },
      { label: "My Packages", icon: "hiking", to: "/agency/packages", active: true },
      { label: "Bookings", icon: "book_online", to: "/agency/bookings", active: false },
      { label: "Earnings", icon: "payments", to: "/agency/earnings", active: false },
      { label: "Guides", icon: "person", to: "/agency/guides", active: false },
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

  //  Edit Mode controls inputs
  const [editMode, setEditMode] = useState(true);

  //  Form state
  const [logo, setLogo] = useState(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo"
  );

  const [form, setForm] = useState({
    agencyName: "Summit Treks",
    tagline: "Premium Himalayan Bookings Since 2010",
    about:
      "Founded by veteran Sherpa guides, Summit Treks specializes in high-altitude expeditions and sustainable trekking experiences across the Nepal Himalayas. We prioritize safety, eco-friendly practices, and authentic cultural immersion for every adventurer.",
    email: "info@summittreks.com",
    phone: "+977 1-4423567",
    address: "Thamel Marg, Kathmandu 44600",
    instagram: "@summittreks_official",
    tripadvisor: "tripadvisor.com/summittreks",
  });

  const [credentials] = useState([
    { title: "Ministry of Tourism License", meta: "Exp: Dec 2024 • PDF", icon: "description" },
    { title: "Liability Insurance", meta: "Exp: Oct 2024 • PDF", icon: "security" },
    { title: "VAT Registration", meta: "Permanent • JPG", icon: "id_card" },
  ]);

  const [personnel] = useState([
    {
      name: "Pasang Sherpa",
      tag: "UIAGM Certified",
      role: "Lead Guide",
      ring: "ring-[#1978e5]/30",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCkq9GNaKqpDGcO3Q-iAHqaeaD-csCI09AA3Bi4WJwN8C59IqduOnyy6oGmD7fdoPbPowH7nR4oixmPYoBdqY5ufKzo-dJMWHY-s7hpmgOeSc26MxvMaiiTlNxLLTzHtW-PZkwqiW7Q9UxVPgh-05xx1LKg6hNJ7guUXp48VAfDTLKQwOHDPIlrQhAQ_zKXMXnR9Z1IT-iFv0nlzfs0O-Lvmv6rdrzXmZ9_ZV3gqPxLQwy2sOAt4x-JxNhKbdbO6E0hwyV-KKwc17AV",
    },
    {
      name: "Lakpa Dorje",
      tag: "High Altitude",
      role: "Senior Guide",
      ring: "ring-blue-500/30",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAF4lpmnU0L8RO6wxoVwHDstMYGlm13mtYnFtnz-YlEKe7jAiC2PEUUIdJlIiLl3IQyAqv4PeFeiAWh7voi8N1umHEzA9zLBIo0-Q_E14Thmz4Q-wPNX5oXl33U6ACotgzNlWqfjBBiDzqTQLxtb6LGgq2I97xZnvOFeX6waFoCHYL34KT5iGnVLQe1xejvim5igT-ORIMYqinzn1lwbTTTkAnOghcmAM4IrQ2kjQ0SDhj71e_pC40ob7k86mDBM7ODnSANwQ6Gni5C",
    },
  ]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const onLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo(url);
  };

  const onSave = () => {
    // later: call API here
    console.log("SAVE AGENCY PROFILE", { ...form, logo });
    alert("Saved (demo). Connect API later.");
  };

  const onDiscard = () => {
    // You can reset to initial values if you want
    alert("Discarded (demo).");
  };

  const Input = ({ label, icon, type = "text", value, onChange, accentTextClass = "" }) => (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase text-[#6b7280]">{label}</label>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#94a3b8] text-sm">
            {icon}
          </span>
        )}
        <input
          type={type}
          disabled={!editMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#2d3b2a] outline-none transition-all",
            icon ? "pl-9" : "",
            editMode ? "focus:border-[#1978e5] focus:ring-[#1978e5]" : "opacity-80 cursor-not-allowed bg-gray-50",
            accentTextClass,
          ].join(" ")}
        />
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden" style={{ background: COLORS.bgLight, color: COLORS.secondary }}>
      <div className="flex h-full w-full" style={{ background: COLORS.paper, ...paperTextureStyle }}>
        {/* Sidebar */}
        <aside
          className="hidden w-64 flex-col justify-between border-r lg:flex"
          style={{ borderColor: COLORS.border, background: "rgba(253,253,252,0.8)" }}
        >
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div
                className="relative h-12 w-12 overflow-hidden rounded-xl border shadow-sm bg-white"
                style={{ borderColor: COLORS.border }}
              >
                <img alt="Agency Logo" className="h-full w-full object-cover" src={logo} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight">Summit Treks</h1>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.primary }}>
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
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[#6b7280] group-hover:text-red-500 transition-colors">
                  logout
                </span>
                <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">
                  Log Out
                </span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile top */}
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 backdrop-blur-md shadow-sm lg:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: COLORS.primary }}>
                terrain
              </span>
              <span className="text-lg font-bold">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Agency Profile</h1>
                <p className="mt-1" style={{ color: COLORS.muted }}>
                  Manage your public presence and verification details.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Edit Mode ONLY (Preview removed) */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={editMode}
                    onChange={(e) => setEditMode(e.target.checked)}
                  />
                  <div
                    className="h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1978e5]/20
                               peer-checked:bg-[#1978e5] after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                               after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-300 after:transition-all peer-checked:after:translate-x-full"
                  />
                  <span className="ml-3 text-sm font-bold text-[#2d3b2a]">Edit Mode</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left / Main */}
              <div className="space-y-8 lg:col-span-2">
                {/* Hero / Profile */}
                <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(25,120,229,0.10)" }} />

                  <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
                    {/* Logo */}
                    <div className="shrink-0">
                      <div className="relative group">
                        <div className="h-32 w-32 overflow-hidden rounded-2xl border-2 border-gray-200 shadow-sm bg-white">
                          <img alt="Logo" className="h-full w-full object-cover" src={logo} />
                        </div>

                        {/* Upload overlay */}
                        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-white">photo_camera</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={!editMode}
                            onChange={onLogoChange}
                          />
                        </label>

                        <div className="absolute -bottom-2 -right-2 rounded-lg p-1.5 text-white shadow-lg" style={{ background: COLORS.primary }}>
                          <span className="material-symbols-outlined text-sm block">edit</span>
                        </div>
                      </div>
                    </div>

                    {/* Main fields */}
                    <div className="w-full space-y-5">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Agency Name
                        </label>
                        <input
                          disabled={!editMode}
                          value={form.agencyName}
                          onChange={(e) => setField("agencyName", e.target.value)}
                          className={[
                            "w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-lg font-bold outline-none transition-all",
                            editMode ? "focus:border-[#1978e5] focus:ring-[#1978e5]" : "opacity-80 cursor-not-allowed bg-gray-50",
                          ].join(" ")}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                          Tagline
                        </label>
                        <input
                          disabled={!editMode}
                          value={form.tagline}
                          onChange={(e) => setField("tagline", e.target.value)}
                          className={[
                            "w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm italic outline-none transition-all",
                            editMode ? "focus:border-[#1978e5] focus:ring-[#1978e5]" : "opacity-80 cursor-not-allowed bg-gray-50",
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div className="mt-8">
                    <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      <span className="material-symbols-outlined text-sm" style={{ color: COLORS.primary }}>
                        history_edu
                      </span>
                      About Us
                    </label>

                    <textarea
                      rows={4}
                      disabled={!editMode}
                      value={form.about}
                      onChange={(e) => setField("about", e.target.value)}
                      className={[
                        "w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-[#2d3b2a] outline-none transition-all",
                        editMode ? "focus:border-[#1978e5] focus:ring-[#1978e5]" : "opacity-80 cursor-not-allowed bg-gray-50",
                      ].join(" ")}
                    />
                    <div className="mt-2 flex justify-end text-xs text-[#94a3b8]">
                      <span>{Math.min(form.about.length, 500)}/500 characters</span>
                    </div>
                  </div>
                </div>

                {/* Contact + Social */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        contact_page
                      </span>
                      Contact Details
                    </h3>

                    <div className="space-y-4">
                      <Input label="Official Email" icon="mail" type="email" value={form.email} onChange={(v) => setField("email", v)} />
                      <Input label="Phone Number" icon="call" type="tel" value={form.phone} onChange={(v) => setField("phone", v)} />
                      <Input label="Head Office" icon="location_on" value={form.address} onChange={(v) => setField("address", v)} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined text-purple-500">share</span>
                      Social Presence
                    </h3>

                    <div className="space-y-4">
                      <Input
                        label="Instagram Profile"
                        icon="photo_camera"
                        value={form.instagram}
                        onChange={(v) => setField("instagram", v)}
                        accentTextClass="text-pink-600"
                      />
                      <Input
                        label="TripAdvisor URL"
                        icon="travel_explore"
                        value={form.tripadvisor}
                        onChange={(v) => setField("tripadvisor", v)}
                        accentTextClass="text-emerald-700"
                      />
                      <button
                        type="button"
                        className="w-full rounded-lg border border-dashed px-3 py-2 text-xs font-bold transition-colors"
                        style={{ borderColor: COLORS.primary, color: COLORS.primary, background: "rgba(25,120,229,0.04)" }}
                      >
                        <span className="material-symbols-outlined text-sm align-[-3px] mr-1">add</span>
                        Add Another Platform
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personnel */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined text-blue-500">groups</span>
                      Key Personnel
                    </h3>
                    <button type="button" className="text-xs font-bold hover:underline" style={{ color: COLORS.primary }}>
                      Manage All Guides
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {personnel.map((p) => (
                      <div key={p.name} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                        <img alt={p.name} src={p.avatar} className={`h-12 w-12 rounded-full object-cover ring-2 ${p.ring}`} />
                        <div>
                          <h4 className="text-sm font-bold">{p.name}</h4>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className="rounded border px-2 py-0.5 text-[10px] font-bold"
                              style={{ borderColor: "rgba(25,120,229,0.25)", background: "rgba(25,120,229,0.07)", color: COLORS.primary }}
                            >
                              {p.tag}
                            </span>
                            <span className="text-[10px] text-[#6b7280]">{p.role}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ Actions (match screenshot: big pill buttons) */}
                <div className="mt-10 flex justify-end gap-6 pb-2">
                  <button
                    type="button"
                    onClick={onDiscard}
                    className="h-14 min-w-[220px] rounded-2xl border border-gray-200 bg-white text-base font-semibold text-[#6b7280]
                               shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    Discard Changes
                  </button>

                  <button
                    type="button"
                    onClick={onSave}
                    className="h-14 min-w-[220px] rounded-2xl text-base font-bold text-white
                               shadow-lg transition-all hover:brightness-95"
                    style={{
                      background: "#1978e5",
                      boxShadow: "0 14px 30px rgba(25,120,229,0.25)",
                    }}
                  >
                    Save Profile
                  </button>
                </div>
              </div>

              {/* Right / Sidebar cards */}
              <div className="space-y-6 lg:col-span-1">
                {/* Verified */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ background: "rgba(25,120,229,0.08)", border: "1px solid rgba(25,120,229,0.25)" }}
                    >
                      <span className="material-symbols-outlined text-3xl" style={{ color: COLORS.primary }}>
                        verified
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold">Verified Partner</h3>
                    <p className="mb-4 text-xs" style={{ color: COLORS.muted }}>
                      Your agency meets all Travolin safety and quality standards.
                    </p>

                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-full rounded-full" style={{ background: COLORS.primary }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: COLORS.primary }}>
                      Verification Status: Active
                    </span>
                  </div>
                </div>

                {/* Credentials */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                      Credentials
                    </h3>
                    <button type="button" className="transition-colors" style={{ color: COLORS.primary }}>
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {credentials.map((c) => (
                      <div key={c.title} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition-all hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(25,120,229,0.08)", color: COLORS.primary }}>
                            <span className="material-symbols-outlined text-xl">{c.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{c.title}</p>
                            <p className="text-xs text-[#94a3b8]">{c.meta}</p>
                          </div>
                          <button type="button" className="text-[#94a3b8] hover:text-[#2d3b2a] transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Snapshot */}
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                    Performance Snapshot
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                      <div className="text-2xl font-bold">4.8</div>
                      <div className="mt-1 text-[10px] uppercase text-[#94a3b8]">Avg Rating</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                      <div className="text-2xl font-bold">1.2k</div>
                      <div className="mt-1 text-[10px] uppercase text-[#94a3b8]">Bookings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 border-t pb-8 pt-10 text-center" style={{ borderColor: COLORS.border }}>
              <p className="text-sm font-medium italic text-gray-400">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="mt-2 text-xs text-gray-300">© 2023 Travolin. Partner Agency Portal.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}