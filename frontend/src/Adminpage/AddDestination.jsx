import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ✅ Import Link

const AddDestination = () => {
  const [form, setForm] = useState({
    name: "",
    region: "",
    description: "",
    activities: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH DESTINATIONS ================= */
  const fetchDestinations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE IMAGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    if (!token) {
      alert("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("region", form.region);
    formData.append("description", form.description);
    formData.append("activities", form.activities);
    formData.append("image", image);

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/destinations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Destination added successfully");

      setForm({
        name: "",
        region: "",
        description: "",
        activities: "",
      });
      setImage(null);
      setPreview(null);

      fetchDestinations();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ================= FORM ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add Destination
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Destination Name"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="Region"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <input
              name="activities"
              value={form.activities}
              onChange={handleChange}
              placeholder="Activities (comma separated)"
              className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="md:col-span-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm"
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 h-48 rounded-lg object-cover shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
            >
              {loading ? "Adding..." : "Add Destination"}
            </button>
          </form>
        </div>

        {/* ================= DESTINATIONS LIST ================= */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            All Destinations
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Link
                to={`/packages/${dest._id}`} // ✅ Navigate to destination packages
                key={dest._id}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer">
                  {dest.images?.[0] && (
                    <img
                      src={dest.images[0].data}
                      alt={dest.name}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {dest.name}
                    </h3>

                    <p className="text-sm text-blue-600 mb-2">
                      {dest.region}
                    </p>

                    <p className="text-gray-600 text-sm mb-3">
                      {dest.description}
                    </p>

                    <div className="border-t pt-3 text-xs text-gray-500">
                      Posted by:{" "}
                      <span className="font-semibold text-gray-700">
                        {dest.agency?.username || "Unknown"}
                      </span>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddDestination;