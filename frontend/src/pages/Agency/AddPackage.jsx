// src/pages/Agency/AddPackage.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddPackage() {
  const navigate = useNavigate();

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

  const sidebar = useMemo(
    () => [
      { label: "Overview", icon: "dashboard", to: "/agency" },
      { label: "My Packages", icon: "hiking", to: "/agency/packages" },
      { label: "Bookings", icon: "book_online", to: "/agency/bookings" },
      { label: "Guides", icon: "groups", to: "/agency/guides" },
      { label: "Earnings", icon: "payments", to: "/agency/earnings" },
      { label: "Profile", icon: "settings_account_box", to: "/agency/profile" },
    ],
    []
  );

  // -----------------------
  // Form state
  // -----------------------
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("Everest Region");
  const [type, setType] = useState("High Altitude Trekking");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");
  const [difficulty, setDifficulty] = useState("Hard");
  const [description, setDescription] = useState("");
  const [confirmSafety, setConfirmSafety] = useState(true);

  // ✅ group size range
  const [minGroupSize, setMinGroupSize] = useState(1);
  const [maxGroupSize, setMaxGroupSize] = useState(10);

  const regions = [
    "Everest Region",
    "Annapurna Circuit",
    "Mustang Kingdom",
    "Langtang Valley",
    "Chitwan National Park",
  ];
  const types = [
    "High Altitude Trekking",
    "Luxury Safari",
    "Cultural Immersion",
    "Spiritual Retreat",
  ];

  const [itinerary, setItinerary] = useState([
    { title: "Kathmandu Arrival & Briefing", details: "" },
    {
      title: "Charter Flight to Pokhara",
      details:
        "Transfer to the domestic terminal for a breathtaking 25-minute flight past the Annapurna and Manaslu ranges...",
    },
  ]);

  // -----------------------
  // Images
  // -----------------------
  const [images, setImages] = useState([]); // File[]
  const [imagePreviews, setImagePreviews] = useState([]); // string[]

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // max 6 images
    const next = [...images, ...files].slice(0, 6);

    // cleanup old previews to avoid memory leaks
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setImages(next);
    setImagePreviews(next.map((f) => URL.createObjectURL(f)));

    // allow picking same file again
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------
  // Submit (ONE endpoint: /api/packages with FormData)
  // -----------------------
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

  const getToken = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u?.token) return u.token;
    } catch {
      // ignore
    }
    const t = localStorage.getItem("token");
    return t || "";
  };

  const handleLaunch = async () => {
    setError("");

    if (!confirmSafety) return;
    if (!title.trim()) return setError("Please enter expedition title.");
    if (!price || Number(price) <= 0) return setError("Please enter valid price.");
    if (!days || Number(days) <= 0) return setError("Please enter valid duration (days).");
    if (!images.length) return setError("Please select at least 1 image (max 6).");

    const minG = Number(minGroupSize);
    const maxG = Number(maxGroupSize);
    if (!Number.isFinite(minG) || minG < 1) return setError("Min group size must be >= 1.");
    if (!Number.isFinite(maxG) || maxG < minG)
      return setError("Max group size must be >= min group size.");

    const token = getToken();
    if (!token) return setError("You are not logged in. Please login as agency.");

    try {
      setSaving(true);

      const fd = new FormData();

      // ✅ files must be appended with key "images"
      images.forEach((file) => fd.append("images", file));

      // ✅ fields
      fd.append("title", title);
      fd.append("region", region);
      fd.append("type", type);
      fd.append("price", String(Number(price)));
      fd.append("days", String(Number(days)));
      fd.append("difficulty", difficulty);
      fd.append("description", description || "");

      // ✅ group size range
      fd.append("minGroupSize", String(minG));
      fd.append("maxGroupSize", String(maxG));

      // ✅ itinerary as JSON string
      fd.append("itinerary", JSON.stringify(itinerary || []));

      await axios.post(`${API_BASE}/api/packages`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Expedition launched successfully!");
    } catch (err) {
      console.error("LAUNCH ERROR:", err);
      setError(err?.response?.data?.message || "Failed to launch expedition.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]">
        <aside className="hidden w-64 flex-col justify-between border-r border-[#e0e8dc] bg-white/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl border border-[#e0e8dc] bg-white shadow-sm overflow-hidden">
                <img
                  alt="Agency"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold text-[#2d3b2a] leading-tight">
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
                  className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-[#f0f4ee]"
                >
                  <span className="material-symbols-outlined text-[#6b7280] group-hover:text-[#1978e5] transition-colors">
                    {i.icon}
                  </span>
                  <span className="text-sm font-medium text-[#4b5563] group-hover:text-[#2d3b2a]">
                    {i.label}
                  </span>
                </Link>
              ))}
              <div className="group flex items-center gap-3 rounded-xl px-4 py-3 bg-[#1978e5]/10">
                <span className="material-symbols-outlined text-[#1978e5]">
                  add_circle
                </span>
                <span className="text-sm font-semibold text-[#1978e5]">
                  Add Package
                </span>
              </div>
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
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e0e8dc] px-6 md:px-8 py-5">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2d3b2a] tracking-tight">
                  Craft a New Expedition
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
                  Design a premium journey through Nepal
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Go back
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto w-full max-w-5xl px-6 md:px-8 py-10 pb-20 space-y-8">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-[#2d3b2a]">
                  Basic Information
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  Define the core identity of your expedition
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Expedition Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#2d3b2a] placeholder:text-gray-300 focus:border-[#1978e5]"
                    placeholder="e.g., Hidden Valleys of Upper Mustang"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Experience Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Logistics */}
            <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-[#2d3b2a]">
                  Logistics & Details
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  Set the price, duration and difficulty level
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Base Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm">
                      $
                    </span>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      type="number"
                      className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-4 py-3 text-sm"
                      placeholder="1299"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Duration (Days)
                  </label>
                  <input
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    type="number"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                    placeholder="14"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex gap-2">
                    {["Hard", "Moderate", "Easy"].map((d) => {
                      const active = difficulty === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={[
                            "flex-1 rounded-xl border px-3 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors",
                            active
                              ? "text-white border-transparent"
                              : "text-[#6b7280] border-gray-200 hover:border-[#1978e5]/40 hover:text-[#2d3b2a]",
                          ].join(" ")}
                          style={active ? { backgroundColor: COLORS.primary } : undefined}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ✅ NEW: Group size range */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                    Group Size Range
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                        Minimum Travelers
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={minGroupSize}
                        onChange={(e) => setMinGroupSize(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                        Maximum Travelers
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={maxGroupSize}
                        onChange={(e) => setMaxGroupSize(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#94a3b8]">
                    Example: Solo = 1–1, Couple = 2–2, Small group = 2–6, Large group = 7–15
                  </p>
                </div>
              </div>
            </section>

            {/* Narrative */}
            <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-[#2d3b2a]">The Narrative</h3>
                <p className="text-sm text-[#94a3b8]">Tell the story of this journey</p>
              </div>

              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-2">
                Expedition Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm leading-relaxed"
                placeholder="Describe the atmosphere, the spiritual essence, and the physical challenges..."
              />
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-[#2d3b2a]">Images</h3>
                <p className="text-sm text-[#94a3b8]">Upload up to 6 photos</p>
              </div>

              <div className="flex items-center gap-3">
                <label
                  className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Choose Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onPickImages}
                  />
                </label>

                <span className="text-xs text-[#94a3b8]">
                  {images.length ? `${images.length} selected` : "No images selected"}
                </span>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((src, idx) => (
                    <div
                      key={src}
                      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                        aria-label="Remove"
                      >
                        <span className="material-symbols-outlined text-[18px] text-red-500">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Itinerary */}
            <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2d3b2a]">Daily Itinerary</h3>
                  <p className="text-sm text-[#94a3b8]">Map out the day-by-day schedule</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setItinerary((prev) => [...prev, { title: "", details: "" }])
                  }
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: COLORS.primary }}
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Day
                </button>
              </div>

              <div className="space-y-4">
                {itinerary.map((d, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: COLORS.secondary }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </div>

                        <input
                          value={d.title}
                          onChange={(e) => {
                            const v = e.target.value;
                            setItinerary((prev) =>
                              prev.map((x, i) => (i === idx ? { ...x, title: v } : x))
                            );
                          }}
                          className="w-full bg-transparent text-sm font-bold text-[#2d3b2a] outline-none"
                          placeholder="Day title..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setItinerary((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-[#94a3b8] hover:text-red-500 transition-colors"
                        aria-label="Delete day"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>

                    <textarea
                      value={d.details}
                      onChange={(e) => {
                        const v = e.target.value;
                        setItinerary((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, details: v } : x))
                        );
                      }}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                      placeholder="Activities for the day..."
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Confirm + Actions */}
            <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmSafety}
                  onChange={(e) => setConfirmSafety(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1978e5] focus:ring-[#1978e5]/30"
                />
                <span className="text-sm text-[#4b5563]">
                  I confirm this expedition meets Travolin's safety and eco-sustainability
                  standards.
                </span>
              </label>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/agency")}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-[#2d3b2a] hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLaunch}
                  className="flex-1 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.secondary }}
                  disabled={!confirmSafety || saving}
                >
                  {saving ? "Launching..." : "Launch Expedition"}
                </button>
              </div>
            </section>

            <div className="pb-10 text-center text-xs text-gray-300">
              © {new Date().getFullYear()} Travolin • Partner Agency Portal
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}