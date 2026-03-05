import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PackageDetails() {
  const { id } = useParams();
  const API = "http://localhost:5000";

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/packages/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPkg(data);
      } catch (e) {
        console.error(e);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e0e8dc] bg-white p-6 text-sm text-[#6b7280]">
          Loading package...
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e0e8dc] bg-white p-6">
          <p className="text-sm text-[#6b7280]">Package not found.</p>
          <Link to="/explore" className="mt-4 inline-block text-sm font-semibold text-blue-600">
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const cover = pkg.images?.[0] ? `${API}${pkg.images[0]}` : "https://via.placeholder.com/1200x600";

  return (
    <div className="min-h-screen bg-[#f6f7f8] p-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/explore" className="text-sm font-semibold text-blue-600">
          ← Back to Explore
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="aspect-[16/7] w-full overflow-hidden">
            <img src={cover} alt={pkg.title} className="h-full w-full object-cover" />
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#2d3b2a]">{pkg.title}</h1>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6b7280]">
              <span className="rounded-full border border-[#e0e8dc] bg-white px-3 py-1">
                Region: <b className="text-[#2d3b2a]">{pkg.region}</b>
              </span>
              <span className="rounded-full border border-[#e0e8dc] bg-white px-3 py-1">
                Type: <b className="text-[#2d3b2a]">{pkg.type}</b>
              </span>
              <span className="rounded-full border border-[#e0e8dc] bg-white px-3 py-1">
                Duration: <b className="text-[#2d3b2a]">{pkg.days} days</b>
              </span>
              <span className="rounded-full border border-[#e0e8dc] bg-white px-3 py-1">
                Difficulty: <b className="text-[#2d3b2a]">{pkg.difficulty}</b>
              </span>
            </div>

            <p className="mt-4 text-sm text-[#6b7280]">
              {pkg.description || "No description provided."}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                  Starting from
                </p>
                <p className="text-2xl font-bold text-[#2d3b2a]">${pkg.price?.toLocaleString()}</p>
              </div>

              <button
                type="button"
                className="rounded-xl bg-[#2d3b2a] px-5 py-3 text-sm font-bold text-white hover:opacity-95"
              >
                Book Now
              </button>
            </div>

            {Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#2d3b2a]">Itinerary</h2>
                <div className="mt-3 space-y-3">
                  {pkg.itinerary.map((it, idx) => (
                    <div key={idx} className="rounded-xl border border-[#e0e8dc] bg-[#fcfbf8] p-4">
                      <p className="text-sm font-bold text-[#2d3b2a]">
                        Day {idx + 1}: {it.title}
                      </p>
                      <p className="mt-1 text-sm text-[#6b7280]">{it.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(pkg.images) && pkg.images.length > 1 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#2d3b2a]">Gallery</h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {pkg.images.slice(1).map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-[#e0e8dc]">
                      <img src={`${API}${img}`} alt="gallery" className="h-40 w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}