import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Replace with your own assets
import hero1 from "../assets/bg.jpg";
import hero2 from "../assets/bg.jpg";
import hero3 from "../assets/bg.jpg";

const Home = () => {
  const slides = useMemo(
    () => [
      {
        title: "Lifetime Experiences",
        subtitle: "Explore mountains, culture, nature and heritage",
        image: hero1,
        primary: { label: "Places to go", to: "/places" },
        secondary: { label: "Things to do", to: "/things-to-do" },
      },
      {
        title: "Explore the Himalayas",
        subtitle: "Trekking routes, viewpoints and adventure",
        image: hero2,
        primary: { label: "Trekking", to: "/things-to-do/trekking" },
        secondary: { label: "Plan your trip", to: "/plan" },
      },
      {
        title: "Culture & Festivals",
        subtitle: "Heritage sites, traditions and celebrations",
        image: hero3,
        primary: { label: "Festivals & Events", to: "/festivals" },
        secondary: { label: "Heritage", to: "/places/heritage" },
      },
    ],
    []
  );

  // NTB-style mega menu structure (you can edit routes later)
  const menu = useMemo(
    () => ({
      places: {
        title: "Places to go",
        cols: [
          {
            heading: "Highlights",
            items: [
              { label: "Kathmandu", to: "/places/kathmandu" },
              { label: "Pokhara", to: "/places/pokhara" },
              { label: "Everest", to: "/places/everest" },
              { label: "Janakpur", to: "/places/janakpur" },
              { label: "Chitwan", to: "/places/chitwan" },
              { label: "Lumbini", to: "/places/lumbini" },
            ],
          },
          {
            heading: "Attractions",
            items: [
              { label: "Provinces", to: "/places/provinces" },
              { label: "UNESCO Sites", to: "/places/unesco" },
              { label: "Protected Areas", to: "/places/protected-areas" },
              { label: "Pilgrimage Sites", to: "/places/pilgrimage" },
              { label: "Mid Hills", to: "/places/mid-hills" },
            ],
          },
        ],
      },
      things: {
        title: "Things to do",
        cols: [
          {
            heading: "Adventure",
            items: [
              { label: "Trekking", to: "/things-to-do/trekking" },
              { label: "Bungee Jumping", to: "/things-to-do/bungee" },
              { label: "Rafting & Kayaking", to: "/things-to-do/rafting" },
              { label: "Paragliding", to: "/things-to-do/paragliding" },
              { label: "Mountain Biking", to: "/things-to-do/biking" },
            ],
          },
          {
            heading: "Culture & Wellness",
            items: [
              { label: "Cultural Tours", to: "/things-to-do/cultural-tours" },
              { label: "Heritage Walk", to: "/things-to-do/heritage-walk" },
              { label: "Homestay", to: "/things-to-do/homestay" },
              { label: "Meditation", to: "/things-to-do/meditation" },
              { label: "Ayurveda", to: "/things-to-do/ayurveda" },
            ],
          },
        ],
      },
      festivals: {
        title: "Festivals & Events",
        cols: [
          {
            heading: "Festivals",
            items: [
              { label: "Tihar", to: "/festivals/tihar" },
              { label: "Indra Jatra", to: "/festivals/indra-jatra" },
              { label: "Dashain", to: "/festivals/dashain" },
              { label: "Chhath", to: "/festivals/chhath" },
            ],
          },
          {
            heading: "Calendar",
            items: [
              { label: "Event Calendar", to: "/festivals/calendar" },
              { label: "Festival Highlights", to: "/festivals/highlights" },
            ],
          },
        ],
      },
      plan: {
        title: "Plan Your Trip",
        cols: [
          {
            heading: "Trip Ideas",
            items: [
              { label: "Travel with children", to: "/plan/travel-with-children" },
              { label: "Ganesh Himal Trek", to: "/plan/ganesh-himal" },
              { label: "Chandragiri - Chitlang", to: "/plan/chandragiri-chitlang" },
            ],
          },
          {
            heading: "Travel Details",
            items: [
              { label: "Tourist Visa", to: "/plan/visa" },
              { label: "Local Transportation", to: "/plan/transport" },
              { label: "Trekking Permit", to: "/plan/trekking-permit" },
              { label: "Park Entry Fees", to: "/plan/park-fees" },
              { label: "Tourist Police", to: "/plan/tourist-police" },
            ],
          },
        ],
      },
    }),
    []
  );

  const [active, setActive] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const timerRef = useRef(null);

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % slides.length);
    }, 5500);
  };

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = slides[active];

  const officialNotices = [
    { title: "Revised Provision for Trekking", to: "/notices/revised-provision-trekking" },
    { title: "Participation Notice - Tourism Expo", to: "/notices/tourism-expo" },
    { title: "Sales Mission Announcement", to: "/notices/sales-mission" },
    { title: "Special Festival Notice", to: "/notices/festival-notice" },
  ];

  const latestStories = [
    { title: "Maghe Sankranti", to: "/stories/maghe-sankranti" },
    { title: "Butterflies: Indicators of Healthy Ecosystem", to: "/stories/butterflies" },
    { title: "Tamu Lhosar", to: "/stories/tamu-lhosar" },
    { title: "Glaciers in the Khumbu Region", to: "/stories/khumbu-glaciers" },
    { title: "Janakpur and Vivah Panchami", to: "/stories/janakpur-vivah-panchami" },
    { title: "Heritage Walk in the Valley", to: "/stories/heritage-walk" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* TOP LANGUAGE BAR */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <span className="font-medium text-gray-800">Travolin</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">National Tourism Portal (UI)</span>
          </div>
          <div className="flex items-center gap-3">
            <select className="border rounded-full px-3 py-1 bg-white text-gray-700">
              <option>English</option>
              <option>Spanish</option>
              <option>Japanese</option>
              <option>Chinese</option>
            </select>
            <Link to="/login" className="text-gray-700 hover:text-[#274c77] font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER + MEGA MENU */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/home" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#274c77] text-white flex items-center justify-center font-bold">
              T
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">Travolin</div>
              <div className="text-xs text-gray-500 -mt-0.5">Explore Nepal</div>
            </div>
          </Link>

          <nav
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-700 relative"
            onMouseLeave={() => setOpenMenu(null)}
          >
            {[
              { key: "places", label: "Places to go" },
              { key: "things", label: "Things to do" },
              { key: "festivals", label: "Festivals & Events" },
              { key: "plan", label: "Plan Your Trip" },
            ].map((m) => (
              <div key={m.key} className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setOpenMenu(m.key)}
                  className="hover:text-[#274c77] py-2"
                >
                  {m.label}
                </button>

                {/* Mega menu */}
                {openMenu === m.key && (
                  <div className="absolute left-0 top-full mt-3 w-[760px] rounded-2xl border bg-white shadow-lg p-6">
                    <div className="text-sm font-bold text-gray-900 mb-4">
                      {menu[m.key].title}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {menu[m.key].cols.map((col) => (
                        <div key={col.heading}>
                          <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {col.heading}
                          </div>
                          <ul className="mt-3 space-y-2">
                            {col.items.map((it) => (
                              <li key={it.label}>
                                <Link
                                  to={it.to}
                                  className="text-sm text-gray-700 hover:text-[#274c77]"
                                >
                                  {it.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center border rounded-full px-4 py-2 w-72">
              <input
                className="w-full outline-none text-sm"
                placeholder="Search…"
              />
            </div>
            <Link
              to="/places"
              className="px-4 py-2 rounded-full bg-[#274c77] text-white text-sm font-semibold hover:opacity-90"
            >
              Explore
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SLIDER */}
      <section
        className="relative"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div
          className="h-[520px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${s.image})` }}
        >
          <div className="h-full w-full bg-black/35">
            <div className="mx-auto max-w-7xl px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <div className="text-xs uppercase tracking-widest bg-white/10 inline-block px-4 py-2 rounded-full">
                  Lifetime Experiences
                </div>
                <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
                  {s.title}
                </h1>
                <p className="mt-3 text-white/90 text-base md:text-lg">
                  {s.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to={s.primary.to}
                    className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-white/90"
                  >
                    {s.primary.label}
                  </Link>
                  <Link
                    to={s.secondary.to}
                    className="px-6 py-3 rounded-full border border-white/70 text-white font-semibold text-sm hover:bg-white/10"
                  >
                    {s.secondary.label}
                  </Link>
                </div>

                {/* Dots + arrows */}
                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActive((p) => (p - 1 + slides.length) % slides.length)}
                    className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/30"
                    aria-label="Previous"
                  >
                    ‹
                  </button>

                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActive(i)}
                        className={`h-2.5 rounded-full transition-all ${
                          i === active ? "w-10 bg-white" : "w-2.5 bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActive((p) => (p + 1) % slides.length)}
                    className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/30"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links (NTB-style cards under slider) */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="-mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Highlights", desc: "Top destinations & icons", to: "/places" },
              { title: "Adventure", desc: "Trek, raft, fly, ride", to: "/things-to-do" },
              { title: "Festivals", desc: "Seasonal celebrations", to: "/festivals" },
              { title: "Plan Your Trip", desc: "Visa, permits & tips", to: "/plan" },
            ].map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="text-sm font-bold text-gray-900">{c.title}</div>
                <div className="mt-1 text-sm text-gray-600">{c.desc}</div>
                <div className="mt-3 text-xs font-bold text-[#274c77]">Explore →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICIAL UPDATES / NOTICES (no Travel Updates section page content, just this block) */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Official Updates */}
          <div className="lg:col-span-1">
            <div className="text-xs uppercase tracking-wider font-bold text-gray-500">
              Official Updates
            </div>
            <div className="mt-2 rounded-2xl border p-5">
              <div className="font-bold text-gray-900">Tourist Police</div>
              <p className="mt-2 text-sm text-gray-600">
                For information about tourist police, visit the dedicated page.
              </p>
              <Link
                to="/plan/tourist-police"
                className="inline-block mt-4 text-sm font-bold text-[#274c77] hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>

          {/* Official Notices */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-gray-500">
                  Official Notices
                </div>
                <div className="mt-1 text-lg font-extrabold text-gray-900">
                  Notices & Announcements
                </div>
              </div>
              <Link to="/notices" className="text-sm font-bold text-[#274c77] hover:underline">
                View all →
              </Link>
            </div>

            <div className="mt-4 rounded-2xl border overflow-hidden">
              <ul className="divide-y">
                {officialNotices.map((n) => (
                  <li key={n.title} className="p-4 hover:bg-gray-50 transition">
                    <Link to={n.to} className="font-semibold text-gray-900 hover:text-[#274c77]">
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST STORIES */}
      <section className="bg-gray-50 border-y">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-gray-500">
                Latest Stories
              </div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">
                News & Articles
              </div>
            </div>
            <Link to="/stories" className="text-sm font-bold text-[#274c77] hover:underline">
              View more →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestStories.map((st) => (
              <Link
                key={st.title}
                to={st.to}
                className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition"
              >
                <div
                  className="h-44 bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero1})` }}
                >
                  <div className="h-full w-full bg-black/10" />
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900">{st.title}</div>
                  <div className="mt-3 text-sm font-bold text-[#274c77]">Read →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="font-extrabold text-gray-900">Travolin</div>
            <p className="mt-2 text-sm text-gray-600">
              Tourism-style portal UI inspired by NTB layout (custom content/assets).
            </p>
          </div>

          <div>
            <div className="font-bold text-gray-900">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link className="hover:text-[#274c77]" to="/places">Places to go</Link></li>
              <li><Link className="hover:text-[#274c77]" to="/things-to-do">Things to do</Link></li>
              <li><Link className="hover:text-[#274c77]" to="/festivals">Festivals</Link></li>
              <li><Link className="hover:text-[#274c77]" to="/plan">Plan your trip</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-gray-900">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link className="hover:text-[#274c77]" to="/about">About</Link></li>
              <li><Link className="hover:text-[#274c77]" to="/contact">Contact</Link></li>
              <li><Link className="hover:text-[#274c77]" to="/privacy">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-gray-900">Newsletter</div>
            <p className="mt-2 text-sm text-gray-600">
              Get travel inspiration and updates.
            </p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                required
                placeholder="Email"
                className="flex-1 px-4 py-2 rounded-full border outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#274c77] text-white font-bold hover:opacity-90"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>© {new Date().getFullYear()} Travolin</div>
            <div className="text-xs text-gray-500">Custom UI • Not the official site</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
