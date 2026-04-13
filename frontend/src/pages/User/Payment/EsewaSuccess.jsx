import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("token") || "";

export default function EsewaSuccess() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = getToken();
        const dataParam = params.get("data");

        if (!dataParam) {
          throw new Error("Missing eSewa response data");
        }

        const res = await fetch(`${API}/api/payments/esewa/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: dataParam }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Payment verification failed");
        }

        setVerified(true);
        setMessage("Payment verified and booking created successfully.");
      } catch (err) {
        console.error(err);
        setVerified(false);
        setMessage(err.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params]);

  return (
    <div className="min-h-screen bg-[#f6f7f8] px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 text-center">
        <h1 className="text-2xl font-bold text-[#2d3b2a]">
          {loading ? "Please wait..." : verified ? "Payment Successful" : "Payment Verification Failed"}
        </h1>

        <p className={`mt-4 text-sm ${verified ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>

        <div className="mt-6">
          <Link
            to="/bookings"
            className="inline-block rounded-lg bg-[#2d3b2a] px-5 py-3 text-sm font-bold text-white"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}