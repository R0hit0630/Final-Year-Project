import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="relative bg-[#0a1018] text-white overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#197fe6]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <span className="material-symbols-outlined text-[#197fe6] text-[28px] transition-transform group-hover:scale-110">
                landscape
              </span>
              <span className="text-lg font-bold tracking-wide uppercase">
                Travolin
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your gateway to the Himalayas. Curated trekking adventures and
              cultural expeditions across Nepal.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-sm text-gray-300 hover:text-white transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Account
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-300 hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#197fe6]">
                  location_on
                </span>
                Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#197fe6]">
                  mail
                </span>
                hello@travolin.com
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#197fe6]">
                  call
                </span>
                +977 1-4XXXXXX
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Travolin. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
