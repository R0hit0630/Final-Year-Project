import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AgencySidebar from "../../components/AgencySidebar";

export default function AgencyPackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    region: "",
    type: "",
    price: "",
    days: "",
    difficulty: "Moderate",
    description: "",
    minGroupSize: 1,
    maxGroupSize: 10,
    itinerary: [],
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/packages/mine/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const pkg = res.data?.package || res.data;

        setForm({
          title: pkg.title || "",
          region: pkg.region || "",
          type: pkg.type || "",
          price: pkg.price || "",
          days: pkg.days || "",
          difficulty: pkg.difficulty || "Moderate",
          description: pkg.description || "",
          minGroupSize: pkg.minGroupSize || 1,
          maxGroupSize: pkg.maxGroupSize || 10,
          itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [],
        });

        setPreviewImages(
          (pkg.images || []).map((img) =>
            img.startsWith("http") ? img : `http://localhost:5000${img}`
          )
        );
      } catch (err) {
        console.error("Error loading package:", err);
        setMessage("Failed to load package.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, itinerary: updated };
    });
  };

  const addItineraryItem = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { title: "", details: "" }],
    }));
  };

  const removeItineraryItem = (index) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "itinerary") {
          formData.append("itinerary", JSON.stringify(form.itinerary));
        } else {
          formData.append(key, form[key]);
        }
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      const res = await axios.put(
        `http://localhost:5000/api/packages/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data?.message || "Package updated successfully.");
    } catch (err) {
      console.error("Error updating package:", err);
      setMessage(err.response?.data?.message || "Failed to update package.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] p-10 text-center">
        <p className="text-sm font-medium text-[#6b7280]">Loading package...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-[#2d3b2a]">
      <div className="flex min-h-screen">
        <AgencySidebar />
        
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agency Package Details</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              View and edit your package details here.
            </p>
          </div>

          <Link
            to="/agency/packages"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold"
          >
            Back
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {previewImages.length > 0 ? (
            previewImages.map((img, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <img
                  src={img}
                  alt={`Package ${index + 1}`}
                  className="h-56 w-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-black/5 bg-white p-8 text-sm text-[#6b7280]">
              No images available.
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Region</label>
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Type</label>
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Difficulty</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Price (रु)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Days</label>
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Min Group Size</label>
              <input
                type="number"
                name="minGroupSize"
                value={form.minGroupSize}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Max Group Size</label>
              <input
                type="number"
                name="maxGroupSize"
                value={form.maxGroupSize}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold">Description</label>
            <textarea
              rows="5"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold">
              Replace Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            />
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-semibold">Itinerary</label>
              <button
                type="button"
                onClick={addItineraryItem}
                className="rounded-lg bg-[#1978e5] px-3 py-2 text-xs font-bold text-white"
              >
                Add Day
              </button>
            </div>

            <div className="space-y-4">
              {form.itinerary.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-[#6b7280]">
                  No itinerary added yet.
                </div>
              ) : (
                form.itinerary.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-[#fafafa] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#2d3b2a]">
                        Day {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItineraryItem(index)}
                        className="text-xs font-bold text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 block text-sm font-semibold">Title</label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) =>
                          handleItineraryChange(index, "title", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                        placeholder="Day title"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">Details</label>
                      <textarea
                        rows="3"
                        value={item.details || ""}
                        onChange={(e) =>
                          handleItineraryChange(index, "details", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none"
                        placeholder="Day details"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#1978e5] px-5 py-3 text-sm font-bold text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/agency/packages")}
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
          </div>
        </main>
      </div>
    </div>
  );
}