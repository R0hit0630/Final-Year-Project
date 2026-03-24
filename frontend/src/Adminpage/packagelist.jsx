import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";

const DestinationPackages = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- added
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    travelers: 1,
    startDate: "",
    notes: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/packages/destination/${id}`)
      .then((res) => setPackages(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!selectedPackage) return;

    try {
      await axios.post(
        "http://localhost:5000/api/bookings", // make sure this matches your backend route
        {
          packageId: selectedPackage._id,
          ...bookingForm,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to /history after successful booking
      navigate("/history");
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center mb-8">Packages</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {pkg.images?.[0] && (
                <img
                  src={pkg.images[0].data}
                  alt={pkg.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold">{pkg.title}</h3>
                <p className="text-gray-600">{pkg.destination?.name}</p>
                <p className="text-sm text-gray-500">
                  Agency: {pkg.agency?.username}
                </p>
                <p className="mt-2 text-blue-600 font-semibold">${pkg.price}</p>
                <button
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-600 text-xl font-bold"
                onClick={() => setSelectedPackage(null)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">
                Book {selectedPackage.title}
              </h2>
              <form onSubmit={submitBooking} className="space-y-3">
                <input
                  type="number"
                  name="travelers"
                  placeholder="Number of Travelers"
                  value={bookingForm.travelers}
                  onChange={handleBookingChange}
                  className="w-full border p-2 rounded-lg"
                  min={1}
                  required
                />
                <input
                  type="date"
                  name="startDate"
                  value={bookingForm.startDate}
                  onChange={handleBookingChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  value={bookingForm.notes}
                  onChange={handleBookingChange}
                  className="w-full border p-2 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DestinationPackages;