import React, { useEffect, useState } from "react";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";


const History = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/booking/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch booking history");
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Booking History</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-lg p-4 space-y-2"
              >
                <h3 className="text-xl font-semibold">
                  {booking.package?.title || "Package Deleted"}
                </h3>
                <p>
                  <span className="font-medium">Price:</span> $
                  {booking.package?.price || "-"}
                </p>
                <p>
                  <span className="font-medium">Travelers:</span>{" "}
                  {booking.travelers}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(booking.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {booking.status}
                </p>
                {booking.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {booking.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;