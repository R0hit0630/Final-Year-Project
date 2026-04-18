import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import travelinLogo from "../assets/travolin-logo.png";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition ${
      isActive(path)
        ? "text-white"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#0f1923]/95 backdrop-blur-xl border-white/10 shadow-lg shadow-black/10"
            : "bg-transparent backdrop-blur-sm border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="bg-white rounded-xl px-2 py-1 shadow-sm transition-transform group-hover:scale-105">
              <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <Link to="/destinations" className={linkClass("/destinations")}>
              Destinations
            </Link>
            <Link to="/about" className={linkClass("/about")}>
              About Us
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="h-10 px-5 rounded-xl text-white/80 text-sm font-semibold hover:text-white transition border border-white/10 hover:border-white/25 bg-white/5"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="h-10 px-6 rounded-xl bg-[#197fe6] hover:bg-[#1570d4] text-white text-sm font-bold transition shadow-lg shadow-[#197fe6]/25"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white/80 hover:text-white transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0f1923]/98 backdrop-blur-xl border-t border-white/10 px-6 pb-6 pt-4 space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-200 hover:text-white py-2"
            >
              Home
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-200 hover:text-white py-2"
            >
              Destinations
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-200 hover:text-white py-2"
            >
              About Us
            </Link>
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
                className="flex-1 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold"
              >
                Log In
              </button>
              <button
                onClick={() => { navigate("/register"); setMobileOpen(false); }}
                className="flex-1 py-3 rounded-xl bg-[#197fe6] text-white text-sm font-bold"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
