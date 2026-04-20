// src/Pages/AgencyProfile.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AgencySidebar from "../../components/AgencySidebar";

const Input = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  accentTextClass = "",
  disabled = false,
  editMode = true,
}) => (
  <div>
    <label className="mb-1 block text-xs font-bold uppercase text-[#6b7280]">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#94a3b8] text-sm">
          {icon}
        </span>
      )}
      <input
        type={type}
        disabled={disabled || !editMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[#2d3b2a] outline-none transition-all",
          icon ? "pl-9" : "",
          editMode && !disabled
            ? "focus:border-[#1978e5] focus:ring-[#1978e5]"
            : "opacity-80 cursor-not-allowed bg-gray-50",
          accentTextClass,
        ].join(" ")}
      />
    </div>
  </div>
);

export default function AgencyProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const API_BASE = "http://localhost:5000";

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

  const FALLBACK_LOGO =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
        <rect width="220" height="220" rx="28" fill="#f3f6f1"/>
        <circle cx="110" cy="88" r="34" fill="#dbe7f7"/>
        <rect x="50" y="138" width="120" height="18" rx="9" fill="#dbe7f7"/>
        <rect x="68" y="165" width="84" height="14" rx="7" fill="#e5edf9"/>
      </svg>
    `);

  const FALLBACK_GUIDE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
        <rect width="140" height="140" rx="70" fill="#f3f6f1"/>
        <circle cx="70" cy="52" r="24" fill="#dbe7f7"/>
        <rect x="32" y="88" width="76" height="20" rx="10" fill="#dbe7f7"/>
      </svg>
    `);



  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const initialForm = {
    agencyName: "",
    tagline: "",
    about: "",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    tripadvisor: "",
  };

  const [editMode, setEditMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [logo, setLogo] = useState("");
  const [initialLogo, setInitialLogo] = useState("");

  const [form, setForm] = useState(initialForm);
  const [initialSavedForm, setInitialSavedForm] = useState(initialForm);

  const [verified, setVerified] = useState(false);
  const [stats, setStats] = useState({
    avgRating: 0,
    totalBookings: 0,
  });

  const [credentials, setCredentials] = useState({
    license: "",
    insurance: "",
    vat: "",
  });
  const [initialCredentials, setInitialCredentials] = useState({
    license: "",
    insurance: "",
    vat: "",
  });
  const [uploadingDoc, setUploadingDoc] = useState("");

  const [personnel, setPersonnel] = useState([]);

  const token = localStorage.getItem("token");

  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const normalizeImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("data:image")) return value;
    if (value.startsWith("blob:")) return value;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    if (value.startsWith("/uploads/")) return `${API_BASE}${value}`;
    if (value.startsWith("uploads/")) return `${API_BASE}/${value}`;
    if (value.startsWith("/")) return `${API_BASE}${value}`;
    return `${API_BASE}/${value}`;
  };

  const setField = (key, value) => {
    if (key === "about" && value.length > 500) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchAgencyProfile = async () => {
    const res = await axios.get(`${API_BASE}/api/users/agency/me`, authConfig);
    const data = res.data || {};

    const mappedForm = {
      agencyName: data.agencyName || "",
      tagline: data.tagline || "",
      about: data.about || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      instagram: data.instagram || "",
      tripadvisor: data.tripadvisor || "",
    };

    const mappedCredentials = {
      license: data.agencyCredentials?.license || "",
      insurance: data.agencyCredentials?.insurance || "",
      vat: data.agencyCredentials?.vat || "",
    };

    const mappedLogo = normalizeImageUrl(data.logo || "");

    setForm(mappedForm);
    setInitialSavedForm(mappedForm);
    setCredentials(mappedCredentials);
    setInitialCredentials(mappedCredentials);
    setLogo(mappedLogo || FALLBACK_LOGO);
    setInitialLogo(mappedLogo || FALLBACK_LOGO);
    setVerified(Boolean(data.isVerified));
  };

  const fetchAgencyStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/bookings/agency/stats`, authConfig);
      setStats({
        avgRating: Number(res.data?.avgRating || 0),
        totalBookings: Number(res.data?.totalBookings || 0),
      });
    } catch (error) {
      console.error("Failed to load agency stats:", error);
      setStats({
        avgRating: 0,
        totalBookings: 0,
      });
    }
  };

  const fetchGuides = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/guides/mine`, authConfig);
      const guides = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.guides)
        ? res.data.guides
        : [];

      const mapped = guides.slice(0, 4).map((guide, index) => ({
        name: guide.name || guide.fullName || "Guide",
        tag: guide.specialization || guide.expertise || guide.language || "Agency Guide",
        role: guide.role || "Guide",
        ring: index % 2 === 0 ? "ring-[#1978e5]/30" : "ring-blue-500/30",
        avatar: normalizeImageUrl(guide.avatar || guide.image || guide.photo || "") || FALLBACK_GUIDE,
      }));

      setPersonnel(mapped);
    } catch (error) {
      console.error("Failed to load guides:", error);
      setPersonnel([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchAgencyProfile(), fetchAgencyStats(), fetchGuides()]);
      } catch (error) {
        console.error("Failed to load agency profile page:", error);
        alert(error?.response?.data?.message || "Failed to load agency profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadAll();
    } else {
      navigate("/login");
    }
  }, [token]);

  const onLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let previewUrl = "";

    try {
      setUploadingLogo(true);

      previewUrl = URL.createObjectURL(file);
      setLogo(previewUrl);

      const body = new FormData();
      body.append("image", file);


      const uploadRes = await axios.post(`${API_BASE}/api/upload`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedPath =
        uploadRes.data?.url ||
        uploadRes.data?.imageUrl ||
        uploadRes.data?.image ||
        uploadRes.data?.path ||
        uploadRes.data?.filePath ||
        uploadRes.data?.filename ||
        "";

      if (!uploadedPath) {
        throw new Error("Upload succeeded but no file path returned");
      }

      const finalLogo = normalizeImageUrl(uploadedPath);
      setLogo(finalLogo);
    } catch (error) {
      console.error("Logo upload failed:", error);
      alert(error?.response?.data?.message || error.message || "Failed to upload logo");
      setLogo(initialLogo || FALLBACK_LOGO);
    } finally {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setUploadingLogo(false);
    }
  };

  const onDocumentUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(type);

      const body = new FormData();
      body.append("document", file);

      const uploadRes = await axios.post(`${API_BASE}/api/upload/document`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedPath =
        uploadRes.data?.documentUrl ||
        uploadRes.data?.url ||
        uploadRes.data?.path ||
        "";

      if (!uploadedPath) {
        throw new Error("Upload succeeded but no file path returned");
      }

      setCredentials(prev => ({ ...prev, [type]: uploadedPath }));
    } catch (error) {
      console.error(`${type} upload failed:`, error);
      alert(error?.response?.data?.message || error.message || `Failed to upload ${type}`);
    } finally {
      setUploadingDoc("");
    }
  };

  const onSave = async () => {
    try {
      setSaving(true);

      const cleanLogo =
        logo.startsWith("blob:") || logo.startsWith("data:image")
          ? ""
          : logo.replace(API_BASE, "");

      const payload = {
        agencyName: form.agencyName,
        tagline: form.tagline,
        about: form.about,
        phone: form.phone,
        address: form.address,
        instagram: form.instagram,
        tripadvisor: form.tripadvisor,
        logo: cleanLogo,
        agencyCredentials: credentials,
      };

      const res = await axios.put(`${API_BASE}/api/users/agency/me`, payload, authConfig);

      setInitialSavedForm({ ...form });
      setInitialLogo(logo || FALLBACK_LOGO);
      setInitialCredentials({ ...credentials });
      setVerified(Boolean(res.data?.agency?.isVerified ?? verified));

      alert(res.data?.message || "Agency profile updated successfully");
    } catch (error) {
      console.error("Save agency profile failed:", error);
      alert(error?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const onDiscard = () => {
    setForm(initialSavedForm);
    setLogo(initialLogo || FALLBACK_LOGO);
    setCredentials(initialCredentials);
  };

  const onLogout = () => {
    navigate("/logout");
  };

  const formatBookings = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return String(count);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: COLORS.bgLight }}
      >
        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm border border-gray-100 text-center">
          <div className="text-lg font-bold text-[#2d3b2a]">Loading profile...</div>
          <div className="mt-2 text-sm text-[#6b7280]">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full overflow-hidden"
      style={{ background: COLORS.bgLight, color: COLORS.secondary }}
    >
      <div
        className="flex h-full w-full"
        style={{ background: COLORS.paper, ...paperTextureStyle }}
      >
        <AgencySidebar />

        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 backdrop-blur-md shadow-sm lg:hidden">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: COLORS.primary }}
              >
                terrain
              </span>
              <span className="text-lg font-bold">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Agency Profile
                </h1>
                <p className="mt-1" style={{ color: COLORS.muted }}>
                  Manage your public presence and verification details.
                </p>
              </div>

              <div className="flex items-center gap-3">
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
                  <span className="ml-3 text-sm font-bold text-[#2d3b2a]">
                    Edit Mode
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm relative overflow-hidden">
                  <div
                    className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                    style={{ background: "rgba(25,120,229,0.10)" }}
                  />

                  <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row">
                    <div className="shrink-0">
                      <div className="relative group">
                        <div className="h-32 w-32 overflow-hidden rounded-2xl border-2 border-gray-200 shadow-sm bg-white">
                          <img
                            alt="Logo"
                            className="h-full w-full object-cover"
                            src={logo || FALLBACK_LOGO}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_LOGO;
                            }}
                          />
                        </div>

                        <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-white">
                            {uploadingLogo ? "hourglass_top" : "photo_camera"}
                          </span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={!editMode || uploadingLogo}
                            onChange={onLogoChange}
                          />
                        </label>

                        <div
                          className="absolute -bottom-2 -right-2 rounded-lg p-1.5 text-white shadow-lg"
                          style={{ background: COLORS.primary }}
                        >
                          <span className="material-symbols-outlined text-sm block">
                            edit
                          </span>
                        </div>
                      </div>
                    </div>

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
                            editMode
                              ? "focus:border-[#1978e5] focus:ring-[#1978e5]"
                              : "opacity-80 cursor-not-allowed bg-gray-50",
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
                            editMode
                              ? "focus:border-[#1978e5] focus:ring-[#1978e5]"
                              : "opacity-80 cursor-not-allowed bg-gray-50",
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ color: COLORS.primary }}
                      >
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
                        editMode
                          ? "focus:border-[#1978e5] focus:ring-[#1978e5]"
                          : "opacity-80 cursor-not-allowed bg-gray-50",
                      ].join(" ")}
                    />
                    <div className="mt-2 flex justify-end text-xs text-[#94a3b8]">
                      <span>{Math.min(form.about.length, 500)}/500 characters</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                      <span
                        className="material-symbols-outlined"
                        style={{ color: COLORS.primary }}
                      >
                        contact_page
                      </span>
                      Contact Details
                    </h3>

                    <div className="space-y-4">
                      <Input
                        label="Official Email"
                        icon="mail"
                        type="email"
                        value={form.email}
                        onChange={(v) => setField("email", v)}
                        disabled
                        editMode={editMode}
                      />
                      <Input
                        label="Phone Number"
                        icon="call"
                        type="tel"
                        value={form.phone}
                        onChange={(v) => setField("phone", v)}
                        editMode={editMode}
                      />
                      <Input
                        label="Head Office"
                        icon="location_on"
                        value={form.address}
                        onChange={(v) => setField("address", v)}
                        editMode={editMode}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined text-purple-500">
                        share
                      </span>
                      Social Presence
                    </h3>

                    <div className="space-y-4">
                      <Input
                        label="Instagram URL"
                        icon="link"
                        value={form.instagram}
                        onChange={(v) => setField("instagram", v)}
                        accentTextClass="text-pink-600"
                        editMode={editMode}
                      />
                      <Input
                        label="TripAdvisor URL"
                        icon="travel_explore"
                        value={form.tripadvisor}
                        onChange={(v) => setField("tripadvisor", v)}
                        accentTextClass="text-emerald-700"
                        editMode={editMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <span className="material-symbols-outlined text-blue-500">
                        groups
                      </span>
                      Key Personnel
                    </h3>
                    <Link
                      to="/agency/guides"
                      className="text-xs font-bold hover:underline"
                      style={{ color: COLORS.primary }}
                    >
                      Manage All Guides
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {personnel.length > 0 ? (
                      personnel.map((p) => (
                        <div
                          key={`${p.name}-${p.role}`}
                          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
                        >
                          <img
                            alt={p.name}
                            src={p.avatar || FALLBACK_GUIDE}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_GUIDE;
                            }}
                            className={`h-12 w-12 rounded-full object-cover ring-2 ${p.ring}`}
                          />
                          <div>
                            <h4 className="text-sm font-bold">{p.name}</h4>
                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              <span
                                className="rounded border px-2 py-0.5 text-[10px] font-bold"
                                style={{
                                  borderColor: "rgba(25,120,229,0.25)",
                                  background: "rgba(25,120,229,0.07)",
                                  color: COLORS.primary,
                                }}
                              >
                                {p.tag}
                              </span>
                              <span className="text-[10px] text-[#6b7280]">
                                {p.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-2 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-[#6b7280]">
                        No guides found yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex justify-end gap-6 pb-2 flex-wrap">
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
                    disabled={saving}
                    className="h-14 min-w-[220px] rounded-2xl text-base font-bold text-white
                               shadow-lg transition-all hover:brightness-95 disabled:opacity-70"
                    style={{
                      background: "#1978e5",
                      boxShadow: "0 14px 30px rgba(25,120,229,0.25)",
                    }}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-1">
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{
                        background: "rgba(25,120,229,0.08)",
                        border: "1px solid rgba(25,120,229,0.25)",
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-3xl"
                        style={{ color: COLORS.primary }}
                      >
                        verified
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold">
                      {verified ? "Verified Partner" : "Partner Agency"}
                    </h3>
                    <p className="mb-4 text-xs" style={{ color: COLORS.muted }}>
                      {verified
                        ? "Your agency meets all Travolin safety and quality standards."
                        : "Your agency verification is pending admin approval."}
                    </p>

                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: COLORS.primary,
                          width: verified ? "100%" : "55%",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      Verification Status: {verified ? "Active" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className="text-sm font-bold uppercase tracking-wide"
                      style={{ color: COLORS.muted }}
                    >
                      Credentials
                    </h3>
                    <button
                      type="button"
                      className="transition-colors"
                      style={{ color: COLORS.primary }}
                    >
                      <span className="material-symbols-outlined text-sm">
                        add_circle
                      </span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "license", title: "Ministry of Tourism License", icon: "description" },
                      { key: "insurance", title: "Liability Insurance", icon: "security" },
                      { key: "vat", title: "VAT Registration", icon: "id_card" },
                    ].map((c) => (
                      <div
                        key={c.key}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition-all hover:bg-gray-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: "rgba(25,120,229,0.08)", color: COLORS.primary }}
                          >
                            <span className="material-symbols-outlined text-xl">{c.icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{c.title}</p>
                            <p className="truncate text-xs text-[#94a3b8]">
                              {credentials[c.key] ? "Document Uploaded" : "Not uploaded yet"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {credentials[c.key] && (
                            <a
                              href={normalizeImageUrl(credentials[c.key])}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-[#1978e5] hover:underline flex items-center gap-1 bg-[#1978e5]/10 px-3 py-1.5 rounded-full border border-[#1978e5]/20 hover:bg-[#1978e5]/20 transition-colors whitespace-nowrap"
                            >
                              <span className="material-symbols-outlined text-[14px]">visibility</span>
                              View PDF
                            </a>
                          )}

                          <label
                            className={`relative cursor-pointer transition-all flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 border border-gray-200 ${
                              editMode && uploadingDoc !== c.key ? "text-[#94a3b8] hover:text-[#1978e5] hover:bg-[#1978e5]/10 hover:border-[#1978e5]/30" : "opacity-50 pointer-events-none"
                            }`}
                            title={editMode ? "Upload Document" : "Enable Edit Mode to upload"}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {uploadingDoc === c.key ? "hourglass_top" : "upload_file"}
                            </span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              disabled={!editMode || uploadingDoc === c.key}
                              onChange={(e) => onDocumentUpload(e, c.key)}
                            />
                          </label>
                        </div>
                        
                        <div className={`absolute inset-x-0 bottom-0 h-0.5 ${credentials[c.key] ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <h4
                    className="mb-4 text-xs font-bold uppercase tracking-wider"
                    style={{ color: COLORS.muted }}
                  >
                    Performance Snapshot
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                      <div className="text-2xl font-bold">
                        {Number(stats.avgRating || 0).toFixed(1)}
                      </div>
                      <div className="mt-1 text-[10px] uppercase text-[#94a3b8]">
                        Avg Rating
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white p-3">
                      <div className="text-2xl font-bold">
                        {formatBookings(stats.totalBookings)}
                      </div>
                      <div className="mt-1 text-[10px] uppercase text-[#94a3b8]">
                        Bookings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mt-16 border-t pb-8 pt-10 text-center"
              style={{ borderColor: COLORS.border }}
            >
              <p className="text-sm font-medium italic text-gray-400">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="mt-2 text-xs text-gray-300">
                © 2023 Travolin. Partner Agency Portal.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}