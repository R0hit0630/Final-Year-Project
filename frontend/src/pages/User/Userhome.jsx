import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

const Userhome = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all destinations
  const fetchDestinations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/destinations");
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading destinations...</p>
      </div>
    );
  }

  return (<>
  <UserNavbar></UserNavbar>
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Explore Destinations
        </h2>

        {destinations.length === 0 ? (
          <p className="text-gray-600">No destinations available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Link to={`/packages/${dest._id}`} key={dest._id}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer">
                  {dest.images?.[0] && (
                    <img
                      src={dest.images[0].data} // directly use data from backend
                      alt={dest.name}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {dest.name}
                    </h3>

                    <p className="text-sm text-blue-600 mb-2">{dest.region}</p>

                    <p className="text-gray-600 text-sm mb-3">
                      {dest.description.length > 100
                        ? dest.description.substring(0, 100) + "..."
                        : dest.description}
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
        )}
      </div>
    </div>
    </>
  );
};

export default Userhome;