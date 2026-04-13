import { Link } from "react-router-dom";

export default function EsewaFailure() {
  return (
    <div className="min-h-screen bg-[#f6f7f8] px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 text-center">
        <h1 className="text-2xl font-bold text-red-500">Payment Failed</h1>
        <p className="mt-4 text-sm text-[#6b7280]">
          Your payment was cancelled or could not be completed.
        </p>

        <div className="mt-6">
          <Link
            to="/explore"
            className="inline-block rounded-lg bg-[#2d3b2a] px-5 py-3 text-sm font-bold text-white"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    </div>
  );
}