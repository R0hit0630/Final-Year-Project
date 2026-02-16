import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegionsOverview() {
  const navigate = useNavigate();

  // Optional: smooth scroll for internal anchor links
  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const cards = [
    {
      id: "everest",
      size: "large",
      title: "Everest Region",
      desc: "Home to the world's highest peak, Khumbu offers dramatic mountain scenery and legendary Sherpa hospitality.",
      chips: ["Trekking", "High Altitude"],
      badge: "24+ Packages",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBIXOu6kyfLutgxqWPj3jpXeLUZlJlKsMh6AOJQSnrDorHTEKt4jLjZpEawNG4Vd7XP1W5iiAoCoRkN6qlNlAuD0XM7k5Z6szdqLJoFT8A2AiAISfzun0Wq_PKNY3uc5yx4tYpbSFHAOhbptcGFn25baYm1dDNA_HQEa_SAw3gndYyAkxKhhEL6bX6DwZ1T6svikAnupAzVtvyKNLlmNASUBJ4js_za0XRe0gE3dk1f6HyXBTc3kbvB17b38AhcEfVNjpo3cbl0EU",
    },
    {
      id: "annapurna",
      size: "normal",
      title: "Annapurna Region",
      desc: "Stunning lakes, villages, and a skyline of iconic peaks.",
      badge: "18 Packages available",
      chipSingle: "Diverse Landscape",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH52c9ec6Jf-d89tqx_rj5GhEhUhYh-A5B_D6gu0RSebxZjb2FWUMIDDV5Q3DXvQxDmm74LmH-hxjZdKmoF4xdF_J0SGlX1VkTY052YdjIgWs2zPc4ogo9ThW09sqVntk033QWRKatduNDBKDchBgWbfJM11jiv0c1ymZGaGNFZa37J3uxv4y84HTRY9AsLuKGErCZL4moddvsSM7uNUCcZa9MZrNGxaayTs1sL2ovAZcWEkNpabhVD867iKbMtQB0cJOFLKt39Tk",
    },
    {
      id: "kathmandu",
      size: "wide",
      title: "Kathmandu Valley",
      desc: "Discover UNESCO heritage sites showcasing centuries of Newari art and architecture.",
      chipSingle: "Culture & Heritage",
      cta: "Explore Heritage",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_9ZJHiVD_h4AFpkLeQHStdNPOPW3a85jUcr15wciLejO1-Y1Ns55ob7l4uLwGRWmzfX5yn4mFExCQSw3KLc9wkBTYZMr28Px-jHKHNBgQWPt3v9z_EPDLrrRUlSoGzITyH-8cRuBDtCjb1xsAFJPDy-_R9XmTdT9CkRstkNwujr68DMxrwegZiJgbr_z2iY1t1nCuOsKci9uDm_lBZflDvN-2-6nvxxHz0mfS0rOD-d1Wl-ROwG_oCwgmcLwxjzXH163xYpj9XgA",
    },
    {
      id: "terai",
      size: "normal",
      title: "Terai Plains",
      desc: "Jungles of Chitwan & Lumbini birthplaces.",
      chipSingle: "Wildlife",
      badge: "12 Packages",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgyVx3OF7wy7xfk-JwFAIcGZ8xyPAtq37hoNyNL6bawOP1PJs-QssepXJTedkd5NywQAg6m9CWf55HsBqISxV8cBi5qRtNt_hjc7EtNAAW_NbSzwLP9cdmU1BQSH15Nh2ki2v8LumwO6i9GR0LJjZvKsNIKFoDbRJypdStP-0wyqc0ahgMfZ7_OinYOcP16ZnhEDa_cwz_1WMdlxD62aPhudzR51Ts4c5obPmOwV1AT0i4A-M9QcKgLSj55bLHXyoQWvSDQXbQJSs",
    },
    {
      id: "langtang",
      size: "large",
      title: "Langtang Valley",
      desc: 'The "Valley of Glaciers" offers spectacular views, rich Tamang culture, and diverse alpine flora just a day\'s drive from the capital.',
      chipSingle: "Hidden Gems",
      priceBox: { title: "Start from $850", sub: "8 Days Trekking" },
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP1pNjBgQsq6GC0gg6-cPbjnSMlUDlXynS5VFlbCfpLXuvtJHH4nr9DrUzK3w0RbfQQRH-fQ-VTLnvffY6zAtGvwfcNgvl2M0jpEOnI_1o4VE1YfDPT5Y8_0GEXB8_0ddAuXixV7LniDXq2yZ65OYRYn06EIsTidlx3ZgYhmffHzmttYCbiwSlaTHWfEbvLvl3AIrE6A8KYzs-qZ3k0uOMTIGBXqYmw34_DDqnYZ0zV2TbrZhcll3Wl8_ZT1tsWNMLHBV7eEoblgE",
    },
    {
      id: "mustang",
      size: "normal",
      title: "Upper Mustang",
      desc: "Limited permits • Remote Tibetan-style desert & monasteries.",
      chipSingle: "Forbidden Kingdom",
      badge: "Limited Permits • 6 Packages",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6oi8ERsjS8btnzDAHgSCMMsSg0fS4Ajiiz2-gjsT3xZAmRGIp5G4l5wNqICEHtR8DrD82Jkjfr9_8I90Z3iv8CEeyO1NtC0f_B1nWPtpgSKZf6X3EfR9xsyTkHjuKGDkcjwZvmvvlbWYSHzAMGNHFJ9AkA6UOg5jQPtQu1TJb93bBSj7QbmweysAxEUMvww7L-YZ5XThXX1wRj2NoUxeFyhru_hDG7J9B6Jt-d9kDH81XI5GOrtR686Zpj9oCICWZQPwDUxm4svc",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      {/* Header / Navigation (as requested) */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-emerald-200/60 dark:border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-400 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white">terrain</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tighter">
              TRAVOLIN
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              className="font-medium hover:text-emerald-500 transition-colors"
              href="#destinations"
            >
              Destinations
            </a>
            <a
              className="font-medium hover:text-emerald-500 transition-colors"
              href="#destinations"
            >
              Packages
            </a>
            <a
              className="font-medium hover:text-emerald-500 transition-colors"
              href="#map"
            >
              Adventure
            </a>
            <a
              className="font-medium hover:text-emerald-500 transition-colors"
              href="#footer"
            >
              About Us
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2.5 font-semibold hover:text-emerald-500 transition-colors"
            >
              Sign up
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-900 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-300/40"
            >
              Book a Trip
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative pt-28 pb-14 md:pt-32 md:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold mb-6 tracking-wide uppercase">
              Discover Nepal
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-7 leading-tight">
              Explore the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Roof of the World
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              From the world's highest peaks to lush subtropical jungles, explore
              Nepal’s diverse landscapes and rich cultural tapestry through our
              curated regional guides.
            </p>

            {/* Filter Bar (UI only) */}
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-300/30">
                <span className="material-icons text-sm">filter_list</span>
                All Regions
              </button>

              <button className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-emerald-400/60 transition-colors flex items-center gap-2">
                <span className="material-icons text-sm">terrain</span>
                Mountains
              </button>

              <button className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-emerald-400/60 transition-colors flex items-center gap-2">
                <span className="material-icons text-sm">temple_hindu</span>
                Heritage
              </button>

              <button className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-emerald-400/60 transition-colors flex items-center gap-2">
                <span className="material-icons text-sm">nature</span>
                Wildlife
              </button>
            </div>
          </div>
        </div>

        {/* background blob */}
        <div className="absolute top-0 right-0 -z-10 w-[420px] md:w-[520px] h-[420px] md:h-[520px] opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.3,-44.7C85.4,-31.3,90.5,-15.7,89.3,-0.7C88.1,14.3,80.7,28.6,71.2,40.1C61.8,51.6,50.3,60.3,37.8,68.2C25.3,76,12.7,83,0,83C-12.7,83,-25.3,76,-37.1,67.7C-48.8,59.3,-59.7,49.6,-68.1,37.8C-76.4,26.1,-82.3,12.3,-82.6,-1.7C-82.9,-15.7,-77.7,-29.9,-69.3,-42C-60.8,-54.2,-49.1,-64.3,-36.2,-71.9C-23.3,-79.6,-9.1,-84.8,3.2,-85.4C15.6,-86,31.2,-83.6,44.7,-76.4Z"
              fill="currentColor"
              className="text-emerald-500"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </section>

      {/* DESTINATIONS GRID */}
      <main id="destinations" className="max-w-7xl mx-auto px-6 pb-20 md:pb-24">
        <div className="grid gap-6 [grid-auto-rows:250px] md:[grid-auto-rows:260px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <DestinationCard key={c.id} card={c} />
          ))}
        </div>
      </main>

      {/* MAP PREVIEW */}
      <section id="map" className="bg-white dark:bg-slate-900/50 py-20 md:py-24 border-t border-emerald-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Explore by Geography
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Can't decide where to go? Use our interactive map to visualize the
              regions—from arid rain-shadow areas of the north to tropical
              plains of the south.
            </p>

            <div className="space-y-6">
              <InfoRow icon="location_on" title="7 Strategic Regions" desc="Organized by terrain type and travel feasibility." />
              <InfoRow icon="explore" title="Tailored Routes" desc="Over 150+ expert-vetted trekking and tour routes." />
            </div>

            <button className="mt-10 group flex items-center gap-4 text-emerald-500 font-extrabold text-lg hover:gap-6 transition-all">
              Launch Interactive Map
              <span className="material-icons">arrow_right_alt</span>
            </button>
          </div>

          <div className="w-full md:w-1/2 h-80 md:h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden relative border-8 border-white dark:border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <img
                alt="Map of Nepal"
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHMxaprwCzDAT-KUqXc3J-kf-tu4Rtt7KPWf3S4miLR1noObEmLWucUc_Jhn-NZGTS2nHPyndWHtKoIBMibOVOtOzo_fYhFDPvtJDdrwzRdtPlid84VLmtSK3UIfeYTlF2AFpYYDxFF0T_5XeO5M7L7d3ovFY6i6GfSeCvWNlWhTqErkKVNCX8uJ1_gvm_TdYtxAcOuY61WdeaEAME6CwtnEed-szmtqHsL04FzoIQsGPje7gMBzqPZC0kUA8U8eUb5yzF82MmPjg"
              />
              <div className="absolute inset-0 bg-emerald-500/5" />

              {/* markers */}
              <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
              <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-pulse [animation-delay:1s]" />
              <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.5s]" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-slate-950 text-white pt-16 md:pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-14 border-b border-white/10 pb-14">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center">
                  <span className="material-icons text-slate-900 text-sm">
                    terrain
                  </span>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  TRAVOLIN
                </span>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Empowering travelers to discover the magic of the Himalayas
                through sustainable and authentic experiences.
              </p>

              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-400/20 transition-colors" href="#">
                  <span className="material-icons text-sm">facebook</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-400/20 transition-colors" href="#">
                  <span className="material-icons text-sm">camera_alt</span>
                </a>
              </div>
            </div>

            <FooterCol
              title="Top Regions"
              items={["Everest Region", "Annapurna Range", "Langtang Valley", "Upper Mustang"]}
            />
            <FooterCol
              title="Activities"
              items={["Peak Climbing", "Cultural Tours", "Yoga Retreats", "Helicopter Tours"]}
            />

            <div>
              <h4 className="font-extrabold mb-6">Newsletter</h4>
              <p className="text-slate-400 text-sm mb-4">
                Get travel tips and exclusive region guides.
              </p>

              <div className="flex gap-2">
                <input
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-emerald-400"
                  placeholder="Email address"
                  type="email"
                />
                <button className="bg-emerald-400 text-slate-900 p-2 rounded-lg hover:bg-emerald-500 transition">
                  <span className="material-icons">send</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-slate-500 text-xs">
            <p>© 2024 TRAVOLIN Nepal. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="hover:text-white transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-white transition-colors" href="#">
                Terms of Service
              </a>
              <a className="hover:text-white transition-colors" href="#">
                Cookbook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Components ---------------- */

function DestinationCard({ card }) {
  const large = card.size === "large";
  const wide = card.size === "wide";

  return (
    <article
      className={[
        "relative group overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800",
        large ? "md:row-span-2" : "",
        wide ? "md:col-span-2" : "",
      ].join(" ")}
    >
      <img
        src={card.img}
        alt={card.title}
        className={[
          "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
          wide ? "group-hover:scale-105" : "group-hover:scale-110",
        ].join(" ")}
      />

      {/* overlay */}
      <div
        className={[
          "absolute inset-0",
          wide
            ? "bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"
            : "bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent",
        ].join(" ")}
      />

      {/* top chips */}
      <div className="absolute top-5 left-5 flex flex-wrap gap-2">
        {card.chips?.map((t) => (
          <span
            key={t}
            className="bg-emerald-400/90 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase"
          >
            {t}
          </span>
        ))}
        {card.chipSingle && (
          <span className="bg-emerald-400/90 text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
            {card.chipSingle}
          </span>
        )}
        {card.badge && wide === false && large === true && (
          <span className="bg-white/15 backdrop-blur text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
            {card.badge}
          </span>
        )}
      </div>

      {/* wide top chip */}
      {wide && card.chipSingle && (
        <div className="absolute top-6 left-6">
          <span className="bg-emerald-400/90 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            {card.chipSingle}
          </span>
        </div>
      )}

      {/* content */}
      <div className={wide ? "absolute inset-y-0 left-0 w-2/3 p-8 flex flex-col justify-end" : "absolute bottom-5 left-5 right-5"}>
        {card.badge && !large && !wide && (
          <span className="inline-flex items-center gap-2 mb-2 text-emerald-400 text-xs font-semibold">
            {card.badge}
          </span>
        )}

        {large && card.badge && (
          <div className="mb-2">
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
              {card.badge}
            </span>
          </div>
        )}

        <h3 className={wide || large ? "text-3xl font-extrabold text-white mb-2" : "text-xl font-extrabold text-white mb-1"}>
          {card.title}
        </h3>

        <p className={wide ? "text-slate-300 text-sm mb-6 max-w-md" : "text-slate-300 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all"}>
          {card.desc}
        </p>

        {card.cta && (
          <button className="bg-emerald-400 text-slate-900 px-5 py-2 rounded-lg font-extrabold text-xs uppercase tracking-wider w-fit">
            {card.cta}
          </button>
        )}

        {large && !wide && (
          <button className="bg-emerald-400 text-slate-900 px-6 py-2 rounded-lg font-extrabold text-sm transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-fit">
            View Region
          </button>
        )}

        {card.priceBox && (
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 mt-2">
            <div>
              <span className="block text-white font-extrabold">{card.priceBox.title}</span>
              <span className="text-slate-300 text-xs uppercase">{card.priceBox.sub}</span>
            </div>
            <span className="material-icons text-emerald-300">arrow_forward_ios</span>
          </div>
        )}
      </div>
    </article>
  );
}

function InfoRow({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center shrink-0">
        <span className="material-icons text-emerald-400">{icon}</span>
      </div>
      <div>
        <h4 className="font-extrabold text-lg">{title}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{desc}</p>
      </div>
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="font-extrabold mb-6">{title}</h4>
      <ul className="space-y-4 text-slate-400 text-sm">
        {items.map((i) => (
          <li key={i}>
            <a className="hover:text-emerald-400 transition-colors" href="#">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
