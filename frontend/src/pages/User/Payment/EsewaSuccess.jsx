import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE as API } from "../../../config/api.js";
import travelinLogo from "../../../assets/travolin-logo.png";

export default function EsewaSuccess() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your payment…");
  const [verified, setVerified] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // [FLOW FEATURE: ESEWA PAYMENT VERIFICATION]
  // Runs automatically on mount to extract and verify the base64 payload from eSewa redirect
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Step 1: Retrieve the "data" query parameter sent by eSewa's success callback
        const dataParam = params.get("data");
        if (!dataParam) throw new Error("Missing eSewa response data");

        // Step 2: Post the base64-encoded response payload to our backend verify API
        const res = await fetch(`${API}/api/payments/esewa/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataParam }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Payment verification failed");

        // Step 3: Set verified status and store the confirmed booking info returned by the server
        setVerified(true);
        setMessage("Your booking has been confirmed!");
        setBookingDetails(data?.booking || null);
      } catch (err) {
        setVerified(false);
        setMessage(err.message || "Verification failed. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [params]);

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">

        {/* Top accent */}
        <div className={`h-1.5 w-full ${verified ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" : "bg-gradient-to-r from-red-400 to-red-500"}`} />

        <div className="p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
          </div>

          {/* Status icon */}
          <div className="flex flex-col items-center text-center mb-6">
            {loading ? (
              <>
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <div className="h-8 w-8 rounded-full border-4 border-[#197fe6]/30 border-t-[#197fe6] animate-spin" />
                </div>
                <h1 className="text-xl font-bold text-[#2d3b2a]">Verifying Payment</h1>
                <p className="text-sm text-[#6b7280] mt-1">Please wait while we confirm with eSewa…</p>
              </>
            ) : verified ? (
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h1 className="text-2xl font-bold text-[#2d3b2a]">Booking Confirmed!</h1>
                <p className="text-sm text-emerald-600 font-medium mt-1">{message}</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                </div>
                <h1 className="text-2xl font-bold text-[#2d3b2a]">Verification Failed</h1>
                <p className="text-sm text-red-500 font-medium mt-1">{message}</p>
              </>
            )}
          </div>

          {/* Booking details */}
          {!loading && verified && bookingDetails && (
            <div className="rounded-2xl border border-[#e0e8dc] bg-[#fcfbf8] p-5 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Booking Summary</h3>
              <div className="space-y-2">
                {bookingDetails.package?.title && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Package</span>
                    <span className="font-semibold text-[#2d3b2a] text-right max-w-[60%]">{bookingDetails.package.title}</span>
                  </div>
                )}
                {bookingDetails.totalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Amount Paid</span>
                    <span className="font-bold text-emerald-600">रु {Number(bookingDetails.totalPrice).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Payment Status</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="material-symbols-outlined text-[14px]">check</span>Paid via eSewa
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Support note for failure */}
          {!loading && !verified && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 mb-6">
              <p className="text-sm text-[#6b7280]">
                Your payment may have gone through but we couldn't verify it. Please{" "}
                <a href="mailto:support@travolin.com" className="font-semibold text-[#197fe6] underline">
                  contact our support team
                </a>{" "}
                with your eSewa transaction ID.
              </p>
            </div>
          )}

          {/* CTAs */}
          {!loading && (
            <div className="flex flex-col sm:flex-row gap-3">
              {verified ? (
                <>
                  <Link
                    to="/trips"
                    className="flex-1 text-center py-3 rounded-xl bg-[#2d3b2a] text-white text-sm font-bold hover:opacity-90 transition"
                  >
                    View My Trips
                  </Link>
                  <Link
                    to="/explore"
                    className="flex-1 text-center py-3 rounded-xl border border-[#e0e8dc] text-[#2d3b2a] text-sm font-semibold hover:bg-[#f6f7f8] transition"
                  >
                    Explore More
                  </Link>
                </>
              ) : (
                <Link
                  to="/explore"
                  className="flex-1 text-center py-3 rounded-xl bg-[#197fe6] text-white text-sm font-bold hover:opacity-90 transition"
                >
                  Back to Explore
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs text-[#94a3b8]">
        Powered by eSewa • Secured by Travolin
      </p>
    </div>
  );
}