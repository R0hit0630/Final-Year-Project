import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE as API } from "../../../config/api.js";

const getToken = () => localStorage.getItem("token") || "";

export default function PayWithEsewa() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!state?.packageId || !state?.selectedDate || !state?.groupSize || !state?.total) {
      navigate(`/packages/${id}`);
    }
  }, [state, id, navigate]);

  useEffect(() => {
    if (paymentData) {
      console.log("Payment data ready, submitting form...");
      document.getElementById("esewa-form").submit();
    }
  }, [paymentData]);

  const handleEsewaPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const subtotalNum = Math.round(Number(state?.subtotal || 0));
      const serviceFeeNum = Math.round(Number(state?.serviceFee || 0));
      const totalNum = Math.round(Number(state?.total || 0));
      const expectedTotal = subtotalNum + serviceFeeNum;

      if (
        Number.isNaN(subtotalNum) ||
        Number.isNaN(serviceFeeNum) ||
        Number.isNaN(totalNum)
      ) {
        setError("Invalid payment values. Please refresh and try again.");
        return;
      }

      if (expectedTotal !== totalNum) {
        setError(
          `Invalid payment total. Expected रु ${expectedTotal.toLocaleString()}, but got रु ${totalNum.toLocaleString()}. Please refresh and try again.`
        );
        return;
      }

      const payload = {
        packageId: state.packageId,
        selectedDate: state.selectedDate,
        groupSize: Number(state.groupSize),
        subtotal: subtotalNum,
        serviceFee: serviceFeeNum,
        total: totalNum,
      };

      console.log("Initiating eSewa payment payload:", payload);

      const res = await fetch(`${API}/api/payments/esewa/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Initiate eSewa response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to initiate payment");
      }

      const payment = data?.payment;
      if (!payment?.payment_url || !payment?.fields) {
        throw new Error("Invalid payment response from server");
      }

      setPaymentData(payment);
    } catch (err) {
      console.error("handleEsewaPayment error:", err);
      setError(
        err.message ||
          "Payment initiation failed. If eSewa is unavailable, please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayLater = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      let parsedStartDate = state.selectedDate;
      if (typeof state.selectedDate === "string" && state.selectedDate.includes(" - ")) {
        parsedStartDate = state.selectedDate.split(" - ")[0].trim();
      }

      const payload = {
        packageId: state.packageId,
        travelers: Number(state.groupSize),
        startDate: parsedStartDate,
        notes: `Subtotal: ${state.subtotal || 0}, Service Fee: ${state.serviceFee || 0}`,
      };

      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create booking");
      }

      // Bypass eSewa success and go straight to trips
      navigate("/trips");
    } catch (err) {
      console.error("handlePayLater error:", err);
      setError(err.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-[#f6f7f8] px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#2d3b2a]">Confirm Booking</h1>
          <Link
            to={`/packages/${id}`}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Back
          </Link>
        </div>

        <div className="space-y-4 text-sm text-[#4b5563]">
          <div className="flex justify-between">
            <span>Package</span>
            <span className="font-semibold">{state?.pkg?.title}</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span className="font-semibold">{state.selectedDate}</span>
          </div>

          <div className="flex justify-between">
            <span>Guests</span>
            <span className="font-semibold">{state.groupSize}</span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">
              रु {Number(state.subtotal || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Service Fee</span>
            <span className="font-semibold">
              रु {Number(state.serviceFee || 0).toLocaleString()}
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between text-lg">
            <span className="font-bold text-[#2d3b2a]">Total</span>
            <span className="font-bold text-green-600">
              रु {Number(state.total || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          onClick={handleEsewaPayment}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay with eSewa"}
        </button>

        <div className="relative mt-4 mb-4 flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 flex-shrink-0 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={handlePayLater}
          disabled={loading}
          className="w-full rounded-lg border-2 border-[#2d3b2a] bg-white px-5 py-3 text-sm font-bold text-[#2d3b2a] hover:bg-gray-50 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Book Now, Pay Later"}
        </button>

        {paymentData && (
          <form
            id="esewa-form"
            method="POST"
            action={paymentData.payment_url}
            className="hidden"
          >
            {Object.entries(paymentData.fields).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={String(value)} />
            ))}
          </form>
        )}
      </div>
    </div>
  );
}