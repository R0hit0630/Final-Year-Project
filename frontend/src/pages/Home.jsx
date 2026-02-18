// src/Pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      tag: "Adventure",
      title: "Annapurna Base Camp",
      days: "14 Days",
      price: "from $1,200",
      icon: "hiking",
      image:
        "https://images.unsplash.com/photo-1544735716-3e2b1e3f6f41?q=80&w=2000&auto=format&fit=crop",
      shift: false,
    },
    {
      tag: "Culture",
      title: "Kathmandu Valley",
      days: "5 Days",
      price: "from $650",
      icon: "temple_buddhist",
      image:
        "https://images.unsplash.com/photo-1544735716-6b3c0b5b0c22?q=80&w=2000&auto=format&fit=crop",
      shift: true,
    },
    {
      tag: "Relaxation",
      title: "Pokhara Retreat",
      days: "7 Days",
      price: "from $890",
      icon: "kayaking",
      image:
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop",
      shift: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#111921] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111921]/20 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#197fe6] text-[32px]">
              landscape
            </span>
            <span className="text-xl font-bold tracking-wide uppercase">
              Travolin
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <a href="#destinations" className="text-gray-200 hover:text-white text-sm font-medium transition">
              Destinations
            </a>
            <a href="#experiences" className="text-gray-200 hover:text-white text-sm font-medium transition">
              Experiences
            </a>
            <a href="#journal" className="text-gray-200 hover:text-white text-sm font-medium transition">
              Journal
            </a>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center justify-center h-9 px-5 rounded-lg bg-[#197fe6] hover:bg-[#197fe6]/90 text-white text-sm font-bold transition shadow-lg shadow-[#197fe6]/20"
          >
            Book Trip
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative w-full min-h-screen flex items-center justify-center pt-20">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1544735716-3e2b1e3f6f41?q=80&w=2400&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: "saturate(0.8) hue-rotate(-25deg) brightness(0.95)",
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(22,45,45,0.35),rgba(17,25,33,0.80))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,180,100,0.14)_0%,rgba(25,127,230,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,170,155,0.20)_0%,transparent_55%),radial-gradient(circle_at_70%_35%,rgba(90,140,130,0.18)_0%,transparent_60%)]" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl px-6 text-center flex flex-col items-center gap-8">
          <div className="flex items-center gap-3 text-[#197fe6]/90 uppercase tracking-[0.2em] text-xs">
            <span className="h-px w-8 bg-[#197fe6]/60" />
            Nepal Tourism Board
            <span className="h-px w-8 bg-[#197fe6]/60" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9]">
            The Mountains
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-light italic">
              Are Calling
            </span>
          </h1>

          <p className="max-w-xl text-gray-200 text-lg md:text-xl">
            Experience the soul of the Himalayas at the top of the world.
            A journey of breathtaking vistas and spiritual awakening awaits.
          </p>

          {/* Buttons */}
          <div className="mt-4 flex flex-col items-center gap-6">
            <button
              onClick={() => navigate("/register")}
              className="min-w-[170px] h-12 px-7 rounded-lg bg-[#197fe6] hover:bg-[#197fe6]/90 text-white text-[15px] font-bold transition shadow-xl shadow-[#197fe6]/25 border border-[#197fe6]/50"
            >
              Start Your Journey
            </button>

            <div className="flex flex-col items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
              <span className="text-xs uppercase tracking-widest text-white/60">
                Scroll to Explore
              </span>
              <span className="material-symbols-outlined text-white/80 text-[22px]">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute -bottom-6 left-0 w-full text-[#111921] leading-[0]">
          <svg
            className="w-full h-auto min-h-[110px] md:min-h-[170px]"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            <path
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L0,320Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </header>

      {/* Animation */}
      <style>
        {`
          @keyframes float {
            0%,100% { transform: translateY(0px); opacity: 0.75; }
            50% { transform: translateY(8px); opacity: 1; }
          }
        `}
      </style>

      {/* Main content */}
      <main className="relative z-20 bg-[#111921] pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">

          {/* Section Header */}
          <section id="destinations" className="flex flex-col md:flex-row justify-between items-end gap-10 py-12 border-b border-white/10 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Curated Expeditions
              </h2>
              <p className="text-gray-400 text-lg">
                From the lush valleys of Pokhara to the rugged peaks of the Annapurna Circuit, discover Nepal like never before.
              </p>
            </div>
          </section>

          {/* Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <article key={c.title} className={`group relative overflow-hidden rounded-xl h-[420px] cursor-pointer ${c.shift ? "md:translate-y-12" : ""}`}>
                <div className="absolute inset-0 bg-gray-900 transition-transform duration-700 group-hover:scale-105">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center gap-2 text-[#197fe6] text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-sm">
                      {c.icon}
                    </span>
                    {c.tag}
                  </div>
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-[#197fe6] transition-colors">
                    {c.title}
                  </h3>
                  <div className="flex justify-between items-center mt-4 border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-sm text-gray-300">{c.days}</span>
                    <span className="text-sm font-bold text-white">{c.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-8 pb-10 mt-20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 Travolin Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
