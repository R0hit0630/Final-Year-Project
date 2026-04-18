import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("token") || "";

export default function PayWithEsewa() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state?.packageId || !state?.selectedDate || !state?.groupSize || !state?.total) {
      navigate(`/packages/${id}`);
    }
  }, [state, id, navigate]);

  const handleEsewaPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API}/api/payments/esewa/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: state.packageId,
          selectedDate: state.selectedDate,
          groupSize: state.groupSize,
          subtotal: state.subtotal,
          serviceFee: state.serviceFee,
          total: state.total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to initiate payment");
      }

      const payment = data.payment;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payment.payment_url;

      Object.entries(payment.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment initiation failed");
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
            <span className="font-semibold">रु {Number(state.subtotal || 0).toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Service Fee</span>
            <span className="font-semibold">रु {Number(state.serviceFee || 0).toLocaleString()}</span>
          </div>

          <div className="border-t pt-4 flex justify-between text-lg">
            <span className="font-bold text-[#2d3b2a]">Total</span>
            <span className="font-bold text-green-600">रु {Number(state.total || 0).toLocaleString()}</span>
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
          {loading ? "Redirecting to eSewa..." : "Pay with eSewa"}
        </button>
      </div>
    </div>
  );
}