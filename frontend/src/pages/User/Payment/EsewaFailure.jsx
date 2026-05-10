import { Link } from "react-router-dom";
import travelinLogo from "../../../assets/travolin-logo.png";

export default function EsewaFailure() {
  return (
    <div className="min-h-screen bg-[#f6f7f8] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">

        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-orange-400" />

        <div className="p-8 md:p-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
          </div>

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-4xl text-red-500" style={{fontVariationSettings:"'FILL' 1"}}>cancel</span>
          </div>

          <h1 className="text-2xl font-bold text-[#2d3b2a] mb-2">Payment Cancelled</h1>
          <p className="text-sm text-[#6b7280] leading-relaxed mb-8">
            Your payment was not completed. No charges have been made to your eSewa account.
            You can try again whenever you're ready.
          </p>

          {/* Info box */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">info</span>
              <div>
                <p className="text-sm font-semibold text-[#2d3b2a]">Your package is still available</p>
                <p className="text-sm text-[#6b7280] mt-0.5">The package hasn't been booked. Return to explore and try booking again.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/explore"
              className="flex-1 py-3 rounded-xl bg-[#197fe6] text-white text-sm font-bold hover:opacity-90 transition"
            >
              Back to Explore
            </Link>
            <a
              href="mailto:support@travolin.com"
              className="flex-1 py-3 rounded-xl border border-[#e0e8dc] text-[#6b7280] text-sm font-semibold hover:bg-[#f6f7f8] transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-[#94a3b8]">
        Powered by eSewa • Secured by Travolin
      </p>
    </div>
  );
}