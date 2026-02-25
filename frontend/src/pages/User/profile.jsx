import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../../assets/default-avatar.jpg";

export default function Profile() {
  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
    border: "#e0e8dc",
    muted: "#6b7280",
    muted2: "#94a3b8",
  };

  const navItems = useMemo(
    () => [
      { label: "My Trips", icon: "map", to: "/trips" },
      { label: "Explore Nepal", icon: "explore", to: "/explore" },
      { label: "Saved Destinations", icon: "favorite", to: "/saved" },
      { label: "Profile", icon: "person", to: "/profile", active: true },
    ],
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");



  // Form state (backend-driven)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // readonly (still show)
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");

  const [role, setRole] = useState("user");
  const [level, setLevel] = useState("LEVEL 1");
  const [tier, setTier] = useState("EXPLORER");

  const [difficulty, setDifficulty] = useState("Challenging");
  const [interests, setInterests] = useState([]);

  const [contacts, setContacts] = useState([]);

  const handleAvatarUpload = async (file) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await axios.put(
      `${apiBase}/api/users/me/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAvatar(data.avatar);
    setMsg("Avatar updated successfully");
  } catch (err) {
    setErr(err?.response?.data?.message || "Upload failed");
  }
};

  // Keep original snapshot for Discard
  const [original, setOriginal] = useState(null);

  const token = localStorage.getItem("token"); // ✅ adjust if needed
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Load profile
  useEffect(() => {
    const load = async () => {
      setErr("");
      setMsg("");
      setLoading(true);
      try {
        const { data } = await axios.get(`${apiBase}/api/users/me`, {
          headers: authHeaders,
        });

        setFullName(data.fullName || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setAvatar(data.avatar || "");
        setRole(data.role || "user");
        setLevel(data.level || "LEVEL 1");
        setTier(data.tier || "EXPLORER");

        setDifficulty(data.difficulty || "Challenging");
        setInterests(Array.isArray(data.interests) ? data.interests : []);
        setContacts(
          Array.isArray(data.emergencyContacts) ? data.emergencyContacts : []
        );

        setOriginal({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          avatar: data.avatar || "",
          role: data.role || "user",
          level: data.level || "LEVEL 1",
          tier: data.tier || "EXPLORER",
          difficulty: data.difficulty || "Challenging",
          interests: Array.isArray(data.interests) ? data.interests : [],
          contacts: Array.isArray(data.emergencyContacts)
            ? data.emergencyContacts
            : [],
        });
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
            "Failed to load profile. Please login again."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiBase, authHeaders]);

  const removeInterest = (tag) =>
    setInterests((prev) => prev.filter((t) => t !== tag));

  const discard = () => {
    if (!original) return;
    setFullName(original.fullName);
    setEmail(original.email);
    setPhone(original.phone);
    setLocation(original.location);
    setAvatar(original.avatar);
    setRole(original.role);
    setLevel(original.level);
    setTier(original.tier);
    setDifficulty(original.difficulty);
    setInterests(original.interests);
    setContacts(original.contacts);
    setMsg("");
    setErr("");
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    setErr("");
    try {
      await axios.put(
        `${apiBase}/api/users/me`,
        {
          fullName,
          phone,
          location,
          avatar,
          difficulty,
          interests,
          emergencyContacts: contacts,
        },
        { headers: authHeaders }
      );

      setMsg("Profile saved successfully.");
      setOriginal({
        fullName,
        email,
        phone,
        location,
        avatar,
        role,
        level,
        tier,
        difficulty,
        interests,
        contacts,
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  // UI helpers (keep same look)
  const badges = useMemo(
    () => [
      { title: "Mountain Climber", sub: "15 Expeditions", icon: "mountain_flag" },
      {
        title: "Cultural Seeker",
        sub: "8 Heritage Sites",
        icon: "temple_hindu",
        primary: true,
      },
      { title: "Jungle King", sub: "Safari Pro", icon: "forest", accent: true },
      { title: "Sky Diver", sub: "Locked", icon: "lock", locked: true },
    ],
    []
  );

  return (
    <div className="h-screen w-full overflow-hidden font-['Inter'] text-[#2d3b2a]">
      <div className="flex h-full w-full bg-[#fcfbf8]">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-primary/20">
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src={avatar ? `${apiBase}${avatar}` : defaultAvatar}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#2d3b2a] text-base font-bold leading-tight">
                  {(fullName || "User").split(" ").slice(0, 2).join(" ")}
                </h1>
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: COLORS.primary }}
                >
                  {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={[
                    "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    item.active ? "bg-primary/10" : "hover:bg-[#f0f4ee]",
                  ].join(" ")}
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className={[
                      "material-symbols-outlined transition-colors",
                      item.active
                        ? "text-primary"
                        : "text-[#6b7280] group-hover:text-primary",
                    ].join(" ")}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={[
                      "text-sm",
                      item.active
                        ? "font-semibold text-[#2d3b2a]"
                        : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]",
                    ].join(" ")}
                  >
                    {item.label}
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
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f6f7f8]">
          <header className="sticky top-0 z-40 border-b border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-md px-8 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                </div>
                <div className="leading-tight">
                  <h1 className="text-lg font-extrabold text-[#2d3b2a]">
                    My Profile
                  </h1>
                  <p className="text-xs text-[#6b7280]">
                    Manage your Himalayan adventures and settings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="relative rounded-full p-2 text-[#6b7280] hover:bg-primary/10 hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                </button>
                <div className="h-8 w-px bg-[#e0e8dc]" />
                <button
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: COLORS.secondary }}
                  type="button"
                >
                  My Trips
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-8 py-8">
            {(loading || err || msg) && (
              <div className="mb-6">
                {loading && (
                  <div className="rounded-2xl border border-[#e0e8dc] bg-white p-4 text-sm text-[#6b7280]">
                    Loading profile...
                  </div>
                )}
                {err && (
                  <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600">
                    {err}
                  </div>
                )}
                {msg && (
                  <div className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm text-emerald-700">
                    {msg}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left */}
              <div className="flex flex-col gap-8 lg:col-span-4">
                <div className="flex flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
                  <div className="relative mb-4">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#f3f6f1] shadow-inner">
                      <img
                        alt="Profile Large"
                        className="h-full w-full object-cover"
                        src={
                              avatar
                                ? `${apiBase}${avatar}`
                                : defaultAvatar
                            }
                      />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleAvatarUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        id="avatarUpload"
                      />

                      <label
                        htmlFor="avatarUpload"
                        className="absolute bottom-1 right-1 rounded-full bg-[#1978e5] p-2 text-white shadow-lg cursor-pointer hover:bg-[#3fa10e]"
                      >
                        <span className="material-symbols-outlined text-base">
                          photo_camera
                        </span>
                      </label>
                  </div>

                  <h2 className="text-xl font-bold">{fullName || "User"}</h2>
                  <p className="text-sm text-[#6b7280]">{email}</p>

                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full border border-[#1978e5]/10 bg-[#f3f6f1] px-3 py-1 text-xs font-bold text-[#1978e5]">
                      {level}
                    </span>
                    <span className="rounded-full bg-[#2d3b2a] px-3 py-1 text-xs font-bold text-white">
                      {tier}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold">
                      <span className="material-symbols-outlined text-[#1978e5]">
                        military_tech
                      </span>
                      Explorer Badges
                    </h3>
                    <Link className="text-xs font-semibold text-[#1978e5]" to="/badges">
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {badges.map((b) => (
                      <div
                        key={b.title}
                        className={[
                          "flex flex-col items-center rounded-xl p-3 text-center",
                          b.locked
                            ? "border border-dashed border-gray-300 bg-white opacity-60"
                            : "border border-black/5 bg-[#f3f6f1]/50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "material-symbols-outlined mb-2 text-3xl",
                            b.locked
                              ? "text-gray-300"
                              : b.accent
                              ? "text-[#b45309]"
                              : b.primary
                              ? "text-[#1978e5]"
                              : "text-[#2d3b2a]",
                          ].join(" ")}
                        >
                          {b.icon}
                        </span>
                        <span
                          className={[
                            "text-xs font-bold",
                            b.locked ? "text-gray-400" : "text-[#2d3b2a]",
                          ].join(" ")}
                        >
                          {b.title}
                        </span>
                        <span
                          className={[
                            "text-[10px] uppercase tracking-tighter",
                            b.locked ? "text-gray-400" : "text-gray-500",
                          ].join(" ")}
                        >
                          {b.sub}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-6 lg:col-span-8">
                <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                    <span className="material-symbols-outlined text-[#1978e5]">
                      settings
                    </span>
                    Account Settings
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-[#6b7280]">
                        Full Name
                      </label>
                      <input
                        className="w-full rounded-lg border border-[#e0e8dc] bg-white text-sm outline-none transition-all focus:border-[--p] focus:ring-1"
                        style={{ ["--p"]: COLORS.primary }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-[#6b7280]">
                        Email Address
                      </label>
                      <input
                        className="w-full rounded-lg border border-[#e0e8dc] bg-white text-sm outline-none opacity-80"
                        value={email}
                        readOnly
                        type="email"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-[#6b7280]">
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded-lg border border-[#e0e8dc] bg-white text-sm outline-none transition-all focus:border-[--p] focus:ring-1"
                        style={{ ["--p"]: COLORS.primary }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-[#6b7280]">
                        Location
                      </label>
                      <input
                        className="w-full rounded-lg border border-[#e0e8dc] bg-white text-sm outline-none transition-all focus:border-[--p] focus:ring-1"
                        style={{ ["--p"]: COLORS.primary }}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                  <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                    <span className="material-symbols-outlined text-[#1978e5]">
                      hiking
                    </span>
                    Travel Preferences
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-xs font-bold uppercase text-[#6b7280]">
                        Preferred Difficulty Level
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {["Easy", "Moderate", "Challenging", "Extreme"].map((d) => {
                          const active = difficulty === d;
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDifficulty(d)}
                              className={[
                                "rounded-lg px-4 py-2 text-sm transition-all border",
                                active
                                  ? "bg-primary/10 border-primary/20 font-bold text-primary"
                                  : "border-[#e0e8dc] bg-white font-semibold text-[#4b5563] hover:bg-primary/5 hover:border-primary",
                              ].join(" ")}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-3 block text-xs font-bold uppercase text-[#6b7280]">
                        Interest Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full border border-black/5 bg-[#f3f6f1] px-3 py-1 text-xs font-medium text-[#2d3b2a]"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeInterest(tag)}
                              className="material-symbols-outlined text-sm transition-colors hover:text-red-500"
                              aria-label={`Remove ${tag}`}
                            >
                              close
                            </button>
                          </span>
                        ))}

                        <button
                          type="button"
                          className="rounded-full border border-dashed px-3 py-1 text-xs font-bold hover:bg-primary/5 transition-all"
                          style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                          onClick={() => {
                            const v = prompt("Add interest tag (no #):");
                            if (!v) return;
                            const clean = v.trim().replace(/^#/, "");
                            if (!clean) return;
                            setInterests((prev) =>
                              prev.includes(clean) ? prev : [...prev, clean]
                            );
                          }}
                        >
                          + Add Interest
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined text-red-500">
                        contact_emergency
                      </span>
                      Emergency Contacts
                    </h3>

                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-bold hover:underline"
                      style={{ color: COLORS.primary }}
                      onClick={() => {
                        const name = prompt("Contact name:");
                        const phone = prompt("Contact phone:");
                        if (!name || !phone) return;
                        setContacts((prev) => [
                          ...prev,
                          { name: name.trim(), phone: phone.trim() },
                        ]);
                      }}
                    >
                      <span className="material-symbols-outlined text-sm">
                        add_circle
                      </span>
                      Add New
                    </button>
                  </div>

                  <div className="space-y-3">
                    {contacts.map((c, idx) => (
                      <div
                        key={`${c.name}-${idx}`}
                        className="flex items-center justify-between rounded-xl border border-[#eef2f0] bg-white p-4 transition-colors hover:bg-primary/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                            <span className="material-symbols-outlined text-xl text-red-500">
                              person
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{c.name}</p>
                            <p className="text-xs text-[#6b7280]">{c.phone}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="text-gray-400 transition-colors hover:text-red-500"
                          aria-label={`Delete ${c.name}`}
                          onClick={() =>
                            setContacts((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    ))}
                    {contacts.length === 0 && (
                      <div className="rounded-xl border border-[#e0e8dc] bg-white p-4 text-sm text-[#6b7280]">
                        No emergency contacts yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={discard}
                    className="rounded-lg border border-[#e0e8dc] bg-white px-6 py-2.5 text-sm font-bold text-[#6b7280] transition-all hover:bg-primary/5 hover:border-primary"
                    disabled={saving}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    className="rounded-lg px-10 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-60"
                    style={{ backgroundColor: COLORS.primary }}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-auto border-t border-[#e0e8dc] bg-white/50 py-8 px-8">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#94a3b8]">
                © 2023 Travolin. All adventures curated with ❤️ in Nepal.
              </p>
              <div className="flex items-center gap-6">
                <a
                  className="text-xs font-semibold text-[#6b7280] hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-xs font-semibold text-[#6b7280] hover:text-primary transition-colors"
                  href="#"
                >
                  Help Center
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}