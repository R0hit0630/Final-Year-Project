import { Link } from "react-router-dom";
import travelinLogo from "../assets/travolin-logo.png";

// [FLOW FEATURE: NOT FOUND - 404 PAGE]
// Catch-all page rendered by the router for any URL that doesn't match a defined route.
// Offers two recovery CTAs: go back to Home or browse /explore packages.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111921] text-white flex flex-col items-center justify-center p-6 text-center">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(25,127,230,0.12)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link to="/">
            <div className="bg-white rounded-xl px-2 py-1 shadow-md">
              <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
            </div>
          </Link>
        </div>

        {/* 404 */}
        <div className="mb-6">
          <p className="text-[120px] md:text-[160px] font-black leading-none text-white/5 select-none">404</p>
          <div className="relative -mt-16 md:-mt-20">
            <span className="material-symbols-outlined text-[64px] text-[#197fe6]" style={{fontVariationSettings:"'FILL' 1"}}>travel_explore</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Lost in the Himalayas?</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on the trail.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="px-8 py-3 rounded-xl bg-[#197fe6] hover:bg-[#1570d4] text-white font-bold transition shadow-lg shadow-[#197fe6]/25"
          >
            Back to Home
          </Link>
          <Link
            to="/explore"
            className="px-8 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold transition"
          >
            Explore Nepal
          </Link>
        </div>
      </div>
    </div>
  );
}
