import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config/api.js";
import defaultAvatar from "../../assets/default-avatar.jpg";

const getToken = () => localStorage.getItem("token");

export default function EditGuide() {
  const navigate = useNavigate();
  const { id } = useParams();

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
    bgLight: "#f6f7f8",
    paper: "#fcfbf8",
  };

  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    region: "",
    experience: "",
    specialization: "",
    certification: "",
    languages: "",
    bio: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [existingPhoto, setExistingPhoto] = useState("");

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const token = getToken();
        if (!token) { navigate("/login"); return; }

        const res = await axios.get(`${API_BASE}/api/guides/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const g = res.data;

        setForm({
          fullName: g.fullName || "",
          email: g.email || "",
          phone: g.phone || "",
          region: g.region || "",
          experience: g.experience || "",
          specialization: g.specialization || "",
          certification: g.certification || "",
          languages: g.languages || "",
          bio: g.bio || "",
        });

        setSkills(Array.isArray(g.skills) ? g.skills : []);

        if (g.photo) {
          const photoUrl = g.photo.startsWith("http")
            ? g.photo
            : `${API_BASE}${g.photo.startsWith("/") ? "" : "/"}${g.photo.replace(/\\/g, "/")}`;
          setExistingPhoto(photoUrl);
          setPreviewImage(photoUrl);
        }
      } catch (err) {
        console.error("fetchGuide error:", err);
        setPageError(err?.response?.data?.message || "Failed to load guide data.");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) fetchGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) { setSkillInput(""); return; }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // [FLOW FEATURE: AGENCY GUIDES - UPDATE]
  // Submits updated guide details, optionally uploading a new profile picture if chosen
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = getToken();
      let photoUrl = existingPhoto;

      // Step 1: If a new photo is selected, upload it first to get the URL
      if (selectedImage) {
        const imageData = new FormData();
        imageData.append("image", selectedImage);
        const uploadRes = await axios.post(`${API_BASE}/api/upload`, imageData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        photoUrl =
          uploadRes.data?.imageUrl ||
          uploadRes.data?.url ||
          uploadRes.data?.path ||
          existingPhoto;
      }

      // Step 2: PUT the payload to /api/guides/:id to update details and credentials in DB
      await axios.put(
        `${API_BASE}/api/guides/${id}`,
        { ...form, skills, photo: photoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Guide updated successfully");
      navigate(`/agency/guides/${id}`); // Return to guide profile details page
    } catch (err) {
      console.error("Update guide error:", err);
      alert(err?.response?.data?.message || "Failed to update guide");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm border border-gray-100 text-center">
          <div className="text-lg font-bold text-[#2d3b2a]">Loading guide data...</div>
          <div className="mt-2 text-sm text-[#6b7280]">Please wait</div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8]">
        <div className="rounded-xl bg-red-50 border border-red-200 p-8 text-center max-w-md">
          <span className="material-symbols-outlined block text-4xl text-red-400 mb-2">error</span>
          <p className="text-red-600 font-semibold">{pageError}</p>
          <button
            onClick={() => navigate("/agency/guides")}
            className="mt-4 text-sm text-blue-600 underline"
          >
            Go back to Guides
          </button>
        </div>
      </div>
    );
  }

  return (
            <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile bar */}
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: COLORS.primary }}>terrain</span>
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
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/agency/guides/${id}`)}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#4b5563] transition hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Profile
                  </button>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-[#2d3b2a]">Edit Guide</h1>
                <p className="mt-1 text-[#6b7280]">Update guide information, expertise, and photo.</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/agency/guides/${id}`)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-guide-form"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: COLORS.primary, boxShadow: "0 12px 30px rgba(25,120,229,0.18)" }}
                >
                  <span className="material-symbols-outlined text-sm">
                    {submitting ? "hourglass_top" : "save"}
                  </span>
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <form id="edit-guide-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Left / Main */}
                <div className="space-y-6 xl:col-span-2">
                  {/* Basic Info */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>badge</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Basic Information</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Full Name</label>
                        <input
                          type="text" name="fullName" value={form.fullName} onChange={handleChange}
                          placeholder="Enter guide name" required
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Email Address</label>
                        <input
                          type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="Enter email" required
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Phone Number</label>
                        <input
                          type="text" name="phone" value={form.phone} onChange={handleChange}
                          placeholder="Enter phone number"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Region</label>
                        <select
                          name="region" value={form.region} onChange={handleChange} required
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        >
                          <option value="">Select region</option>
                          <option value="Everest / Khumbu">Everest / Khumbu</option>
                          <option value="Annapurna">Annapurna</option>
                          <option value="Langtang">Langtang</option>
                          <option value="Manaslu">Manaslu</option>
                          <option value="Dolpo">Dolpo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>workspace_premium</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Professional Details</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Experience</label>
                        <input
                          type="text" name="experience" value={form.experience} onChange={handleChange}
                          placeholder="e.g. 8+ Years"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Specialization</label>
                        <input
                          type="text" name="specialization" value={form.specialization} onChange={handleChange}
                          placeholder="e.g. High Altitude Trekking"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Certification</label>
                        <input
                          type="text" name="certification" value={form.certification} onChange={handleChange}
                          placeholder="e.g. NMA / UIAA / IFMGA"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">Languages</label>
                        <input
                          type="text" name="languages" value={form.languages} onChange={handleChange}
                          placeholder="e.g. English, Nepali, Hindi"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>psychology</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Skills &amp; Expertise</h2>
                    </div>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text" value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      />
                      <button
                        type="button" onClick={addSkill}
                        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Skill
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.length > 0 ? skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-full border border-[#1978e5]/20 bg-[#1978e5]/10 px-3 py-1.5 text-xs font-semibold text-[#1978e5]"
                        >
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="flex items-center">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </span>
                      )) : (
                        <span className="text-sm text-[#94a3b8]">No skills added yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>description</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Guide Bio</h2>
                    </div>
                    <textarea
                      name="bio" value={form.bio} onChange={handleChange} rows="6"
                      placeholder="Write a short profile about this guide..."
                      className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                    />
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Profile Image */}
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>image</span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Profile Image</h2>
                    </div>
                    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#fcfbf8] p-6 text-center">
                      <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200">
                        <img
                          src={previewImage || defaultAvatar}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                        />
                      </div>
                      <p className="mb-2 text-sm font-semibold text-[#2d3b2a]">
                        {previewImage ? "Change photo" : "Upload guide photo"}
                      </p>
                      <p className="mb-4 text-xs text-[#6b7280]">PNG, JPG up to 20MB</p>
                      <label
                        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Choose File
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl border border-[#1978e5]/10 bg-[#1978e5]/5 p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">Guide Summary</h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "Name", value: form.fullName || "—" },
                        { label: "Region", value: form.region || "—" },
                        { label: "Experience", value: form.experience || "—" },
                        { label: "Skills", value: `${skills.length} listed` },
                        { label: "Certification", value: form.certification || "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-[#6b7280]">{label}</span>
                          <span className="max-w-[60%] truncate text-right font-semibold text-[#2d3b2a]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
  );
}
