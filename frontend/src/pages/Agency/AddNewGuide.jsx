import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../config/api.js";

export default function AddNewGuide() {
  const navigate = useNavigate();

  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };



  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 2 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

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

  const [skills, setSkills] = useState([
    "High Altitude Trekking",
    "First Aid",
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // [FLOW FEATURE: AGENCY GUIDES - CREATE NEW]
  // Handles the form submission to upload the guide picture (if selected) and create a new guide record in the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      let photoUrl = "";

      // Step 1: If an image is selected, upload it first to get the URL
      if (selectedImage) {
        const imageData = new FormData();
        imageData.append("image", selectedImage);

        const uploadRes = await axios.post(
          `${API_BASE}/api/upload`,
          imageData
        );

        photoUrl = uploadRes.data.imageUrl;
      }

      // Step 2: Combine standard fields, skills array, and photo URL
      const payload = {
        ...form,
        skills,
        photo: photoUrl,
      };

      // Step 3: POST to /api/guides to save the guide under the agency's ownership
      const res = await axios.post(
        `${API_BASE}/api/guides`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Guide created:", res.data);
      alert("Guide added successfully");
      navigate("/agency/guides"); // Redirect back to guides list
    } catch (error) {
      console.error("Create guide error:", error);
      alert(error.response?.data?.message || "Failed to create guide");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
                <div className="mb-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/agency/guides")}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#4b5563] transition hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-base">
                      arrow_back
                    </span>
                    Back
                  </button>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#2d3b2a]">
                  Add New Guide
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Create a new guide profile with contact details and expertise.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/agency/guides")}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="add-guide-form"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 12px 30px rgba(25,120,229,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined text-sm">
                    {submitting ? "hourglass_top" : "save"}
                  </span>
                  {submitting ? "Saving..." : "Save Guide"}
                </button>
              </div>
            </div>

            <form id="add-guide-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        badge
                      </span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Enter guide name"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Region
                        </label>
                        <select
                          name="region"
                          value={form.region}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                          required
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

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        workspace_premium
                      </span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Professional Details</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Experience
                        </label>
                        <input
                          type="text"
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                          placeholder="e.g. 8+ Years"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={form.specialization}
                          onChange={handleChange}
                          placeholder="e.g. High Altitude Trekking"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Certification
                        </label>
                        <input
                          type="text"
                          name="certification"
                          value={form.certification}
                          onChange={handleChange}
                          placeholder="e.g. NMA / UIAA / IFMGA"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#374151]">
                          Languages
                        </label>
                        <input
                          type="text"
                          name="languages"
                          value={form.languages}
                          onChange={handleChange}
                          placeholder="e.g. English, Nepali, Hindi"
                          className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        psychology
                      </span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Skills & Expertise</h2>
                    </div>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Skill
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-full border border-[#1978e5]/20 bg-[#1978e5]/10 px-3 py-1.5 text-xs font-semibold text-[#1978e5]"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="flex items-center"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        description
                      </span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Guide Bio</h2>
                    </div>

                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Write a short profile about this guide..."
                      className="w-full rounded-xl border border-gray-200 bg-[#fcfbf8] px-4 py-3 text-sm outline-none transition focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/10"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                        image
                      </span>
                      <h2 className="text-lg font-bold text-[#2d3b2a]">Profile Image</h2>
                    </div>

                    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#fcfbf8] p-6 text-center">
                      <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#1978e5]/10">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span
                            className="material-symbols-outlined text-4xl"
                            style={{ color: COLORS.primary }}
                          >
                            person
                          </span>
                        )}
                      </div>

                      <p className="mb-2 text-sm font-semibold text-[#2d3b2a]">
                        Upload guide photo
                      </p>
                      <p className="mb-4 text-xs text-[#6b7280]">
                        PNG, JPG up to 20MB
                      </p>

                      <label
                        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#1978e5]/10 bg-[#1978e5]/5 p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">
                      Guide Summary
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Name</span>
                        <span className="font-semibold text-[#2d3b2a]">
                          {form.fullName || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Region</span>
                        <span className="font-semibold text-[#2d3b2a]">
                          {form.region || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#6b7280]">Skills</span>
                        <span className="font-semibold text-[#2d3b2a]">
                          {skills.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
  );
}