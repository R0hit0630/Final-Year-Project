import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

import pokharaImg from "../assets/pokhara.jpg";
import annapurnaImg from "../assets/annapurna.jpg";
import mustangImg from "../assets/mustang.jpg";
import everestImg from "../assets/everest.jpg";

export default function Destination() {
  const navigate = useNavigate();
  const destinations = [
    {
      name: "Pokhara",
      subtitle: "Reflections of Serenity",
      description:
        "Nestled beside the tranquil Phewa Lake, Pokhara offers a gateway to the Annapurna Circuit.",
      location: "Phewa Lake",
      coordinates: "28.2096° N, 83.9595° E",
      image: pokharaImg,
      themeColor: "#197fe6",
    },
    {
      name: "Annapurna",
      subtitle: "The Heart of the Himalayas",
      description:
        "A majestic sanctuary of snow-capped peaks and deep gorges.",
      location: "Machhapuchhre",
      coordinates: "28.4972° N, 83.9483° E",
      image: annapurnaImg,
      themeColor: "#197fe6",
    },
    {
      name: "Mustang",
      subtitle: "The Forbidden Kingdom",
      description:
        "Discover the ancient mysteries of the Last Forbidden Kingdom.",
      location: "Upper Mustang",
      coordinates: "29.0667° N, 83.9500° E",
      image: mustangImg,
      themeColor: "#d97706",
    },
    {
      name: "Everest",
      subtitle: "The Roof of the World",
      description:
        "Soar above the clouds and stand amidst giants.",
      location: "Mount Everest",
      coordinates: "27.9881° N, 86.9250° E",
      image: everestImg,
      themeColor: "#197fe6",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = destinations.length;
  const current = destinations[currentIndex];

  /* ---------- Smooth Slide Logic ---------- */
  // Move to the next or previous destination index in the array
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % total);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + total) % total);

  /* ---------- Premium Smooth Scroll ---------- */
  // [FLOW FEATURE: DESTINATION SLIDER - WHEEL SCROLL]
  // Listens to wheel scroll events and transitions the slider index smoothly with a lock timer to prevent spamming
  const scrollLock = useRef(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollLock.current) return;

      if (Math.abs(e.deltaY) < 40) return;

      scrollLock.current = true;

      // Transition slides based on mouse wheel direction
      if (e.deltaY > 0) nextSlide();
      else prevSlide();

      // Debounce window to let the slide animation finish
      setTimeout(() => {
        scrollLock.current = false;
      }, 900);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  /* ---------- Mobile Swipe ---------- */
  const touchStart = useRef(0);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 60) return;

    if (diff > 0) nextSlide();
    else prevSlide();
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <PublicNavbar />
      {/* ===== BACKGROUND SLIDER WITH PARALLAX ===== */}
      <div
        className="absolute inset-0 flex transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `${total * 100}vw`,
          transform: `translateX(-${currentIndex * 100}vw)`,
        }}
      >
        {destinations.map((item, i) => (
          <div
            key={i}
            className="w-screen h-screen flex-shrink-0 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out"
              style={{
                backgroundImage: `url(${item.image})`,
                transform:
                  i === currentIndex ? "scale(1)" : "scale(1.08)",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
          </div>
        ))}
      </div>

      {/* ===== ARROWS ===== */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20
                   w-14 h-14 rounded-full border border-white/30
                   bg-black/40 backdrop-blur-md flex items-center justify-center
                   hover:bg-white/10 transition-all duration-300"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20
                   w-14 h-14 rounded-full border border-white/30
                   bg-black/40 backdrop-blur-md flex items-center justify-center
                   hover:bg-white/10 transition-all duration-300"
      >
        →
      </button>

      {/* ===== CENTER CONTENT ===== */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        <div className="flex items-center gap-3 mb-6">
          <span
            className="w-10 h-[1px]"
            style={{ backgroundColor: current.themeColor }}
          />
          <span
            className="uppercase text-xs tracking-[0.4em] font-semibold"
            style={{ color: current.themeColor }}
          >
            Nepal
          </span>
          <span
            className="w-10 h-[1px]"
            style={{ backgroundColor: current.themeColor }}
          />
        </div>

        <h1
          key={current.name}
          className="text-6xl md:text-8xl lg:text-[9rem] font-extrabold uppercase transition-all duration-700"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {current.name}
        </h1>

        <p
          key={current.subtitle}
          className="italic text-xl md:text-3xl mt-6 transition-opacity duration-700"
        >
          {current.subtitle}
        </p>

        <p className="max-w-2xl mt-8 text-white/80 leading-relaxed">
          {current.description}
        </p>

        <button
          onClick={() => navigate("/explore")}
          className="mt-12 px-12 py-4 border border-white/30 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 uppercase tracking-widest text-sm">
          Explore Packages
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-12 py-8 bg-black/40 backdrop-blur-lg">

        <div className="flex justify-between text-xs uppercase tracking-wider text-white/40 mb-3">
          {destinations.map((d, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="transition-colors duration-300 hover:text-white"
              style={{
                color:
                  i === currentIndex
                    ? current.themeColor
                    : undefined,
              }}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="h-[2px] w-full bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${((currentIndex + 1) / total) * 100}%`,
              backgroundColor: current.themeColor,
            }}
          />
        </div>

        <div className="mt-4 text-sm text-white/70 flex justify-between">
          <div>
            <p className="font-semibold">{current.location}</p>
            <p className="text-xs">{current.coordinates}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
