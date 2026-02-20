import React, { useEffect, useState } from "react";
import axios from "axios";

const AddPackage = () => {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState({
    destination: "",
    title: "",
    description: "",
    price: "",
    durationDays: "",
    groupType: "group", // default value
    tripType: "tour",   // default value
  });

  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/destinations")
      .then((res) => setDestinations(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/packages", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Package created!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Add Package
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination */}
          <select
            name="destination"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Destination</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.region})
              </option>
            ))}
          </select>

          {/* Title */}
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          {/* Duration Days */}
          <input
            type="number"
            name="durationDays"
            placeholder="Duration Days"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          {/* Group Type */}
          <select
            name="groupType"
            value={form.groupType}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          >
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
            <option value="group">Group</option>
          </select>

          {/* Trip Type */}
          <select
            name="tripType"
            value={form.tripType}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          >
            <option value="trek">Trek</option>
            <option value="hiking">Hiking</option>
            <option value="tour">Tour</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="wildlife">Wildlife</option>
          </select>

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Create Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;