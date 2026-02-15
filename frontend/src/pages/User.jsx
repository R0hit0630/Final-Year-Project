import { useMemo, useState } from "react";

export default function ExplorePackages() {
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("popularity");
  const [budget, setBudget] = useState(2500);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [regions, setRegions] = useState({
    everest: true,
    annapurna: false,
    langtang: false,
    mustang: false,
    chitwan: false,
  });

  const [activities, setActivities] = useState({
    trekking: true,
    safari: false,
    heritage: false,
    climbing: false,
  });

  const packages = useMemo(
    () => [
      {
        id: 1,
        title: "Everest Base Camp Trek",
        desc: "Experience the ultimate Himalayan journey to the foot of the world's highest peak with expert local guides.",
        price: 1299,
        duration: "14 Days",
        difficulty: "Moderate",
        rating: 4.9,
        reviews: "1.2k",
        tags: ["Best Seller", "Eco-Friendly"],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxDmJovWlFpTgvJk9A2yr9DoEaQjKLnUPPMEPEXOBehPimXp6sAxrHFpijPCQNsHKvRQh0FiwlLirtGGRgR8Vr_TKRaF3BekdfLM3u5r018ZnB0mjRF5OSbWP02JDr9cakoArOv83Y_CAN1ZEZM4hjBk4KdLfzVG6JQZYOunNJamaJEgcQYqdW9fFe9-klFVxGFMAGdkGxasM6iWx91jOLczC8_spGYTm76_-ofLH-28XT0MdmNQuya6ayHQoIhTa74K4vNHR1R6k",
        alt: "Everest Base Camp snow peaks and prayer flags",
      },
      {
        id: 2,
        title: "Chitwan Wildlife Safari",
        desc: "Explore the subtropical jungles of Terai, home to one-horned rhinos, Bengal tigers, and exotic birds.",
        price: 450,
        duration: "4 Days",
        difficulty: "Easy",
        rating: 4.7,
        reviews: "850",
        tags: ["Eco-Friendly"],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWLYXFigVtKSyMX_Jpaz2bZB_W_oqL2eSajOZhOLBAfsaEsRJ7Dw6t1UROCvXTioHXY0KsdA4RrvARE2CPaATaD7_AprzzdN7iCjI_Xt46DKo5yDgrUIGQMsEcHNN0DaNSixMPOzR7MdQraXns5ISexAPxICxPuibdLz1oBIwQavkn2KeyGeW3OZL5X_6Uklq2QtQIMECNjH5g0dzBK3TRDKga9lfyjNALF01a8lEEEd7cuFF1cRp4gWXK_XNMPmGz57pP7SgNRbg",
        alt: "Chitwan National Park jungle safari with rhinos",
      },
      {
        id: 3,
        title: "Annapurna Base Camp",
        desc: "A diverse trek through local villages and varied landscapes to the natural amphitheater of the mountains.",
        price: 890,
        duration: "10 Days",
        difficulty: "Moderate",
        rating: 4.8,
        reviews: "2.1k",
        tags: ["Popular"],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsXvpHpsLHT3vd7hTcQQ5IEzEpEClSozFAr73-mbxuhrxtwCcI2HShzZnXDh2r1vjlKTtlQAPkELsb-DGft7NyWqMsytE-CKp5gQvpDw3UPymPTaqNU2UBdcUnq8i573hikpisd8VxOY8io5xyHHAReyQVnUH8FhHw9e9UgadKRtHfEgyisnWgtY73WkU5mEdp9NVBp7VHzE74Ull6ayFOCYrgJb1ZlqacW1_Vr61-8c8qOsA8E_Q8czE5wzq8J-RVSZEsPWYWJrQ",
        alt: "Annapurna Base Camp trail through rhododendrons",
      },
      {
        id: 4,
        title: "Forbidden Kingdom Mustang",
        desc: "Discover the hidden Tibetan-style desert and ancient monasteries of Upper Mustang, the Last Forbidden Kingdom.",
        price: 2100,
        duration: "17 Days",
        difficulty: "Strenuous",
        rating: 5.0,
        reviews: "310",
        tags: [],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB09cnkKPURAD8xwQolD2-tjtXj5jWtaZKlBJ3yP32BSP9nni3PkVh31nf93_3olqhz27hogueioZ0No7l9trJVkxwAUGI_3r7Cv2LhkJVaVKbqnzCW7aipV1526Zl5l2hwFK8AToXH8YAnt6219ibppGub4ibUDlsCExwrXoeQRilttT-GffuU4zI1898m7OtMukSNAmZf5heFjF2h6-WOsCYxnk1K5dYB8Z-D6og9M1d3ky2hpWICfsAY1i6fsv826m3NdzQbfCs",
        alt: "Upper Mustang desert landscape and gompa",
      },
      {
        id: 5,
        title: "Kathmandu Heritage Tour",
        desc: "A deep dive into the spiritual heart of Nepal through ancient temples, shrines, and colorful marketplaces.",
        price: 650,
        duration: "7 Days",
        difficulty: "Easy",
        rating: 4.6,
        reviews: "1.5k",
        tags: [],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOFhep3NRRqdG-BTEDLSaC_Jdu-DF-eKcee123HtQIbliLAOLP_HCE5bfbGPTqckJA5qo4juj2_AE8qRB9JW04OZdIhqvG91ryKwehtpAlcoOdG0kz8X83d1POl0r2Bl7zbKBmPw6k_yo5hgyxbrPk1f31p9f4NM22YWe-efb0gRPnO2ICg8IsThoq23SbCgGjpi00xbB1sAvHnkdxcNgQy_LB2Td-2trorEvsschtLf21uvOPnQ2NGOWWzF4nK6rr9YlEbRyAt6c",
        alt: "Kathmandu valley heritage temple sites",
      },
      {
        id: 6,
        title: "Everest Base Camp Heli-Tour",
        desc: "The luxury of time: See the world's highest peak from your private helicopter window in just one morning.",
        price: 950,
        duration: "1 Day",
        difficulty: "Luxury",
        rating: 4.9,
        reviews: "120",
        tags: [],
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGWUyqF2pNGGObRGvs6kLsNGhycTK_jpehQ1Z1n2OV5odcm4M1Nl-gH93tFAiduP7jhbTAhJtlEZVZh87T-tsSjibcvWtaowBfXKcAMIrtpAVjlo_Oakl0loU-qssLSW8_-HbOczkEwF_bpM9pUUp9AeJBJ9hqhxlzih49u3EgMq2Kc0JDZ9fpAjka5kQENBYdIX7CcEwRwGIY-SH3KpXHmwWS_wkFGCQ5a2U7et9FzKYXfCARM-yX7hkQfoich_5-XAxuMOoaQpU",
        alt: "Helicopter flying over Himalayan peaks",
      },
    ],
    []
  );

  const toggleRegion = (key) =>
    setRegions((p) => ({ ...p, [key]: !p[key] }));

  const toggleActivity = (key) =>
    setActivities((p) => ({ ...p, [key]: !p[key] }));

  const clearAll = () => {
    setRegions({
      everest: false,
      annapurna: false,
      langtang: false,
      mustang: false,
      chitwan: false,
    });
    setActivities({
      trekking: false,
      safari: false,
      heritage: false,
      climbing: false,
    });
    setBudget(2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* NAVBAR (matches screenshot + responsive) */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Mobile: burger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center"
            aria-label="Open filters"
          >
            <IconMenu className="w-5 h-5 text-slate-700" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 min-w-[140px]">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <IconMountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight uppercase">
              Nepal<span className="text-emerald-500">Vibe</span>
            </span>
          </div>

          {/* Search (center like screenshot) */}
          <div className="flex-1 hidden md:block">
            <div className="relative">
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-100 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 outline-none text-sm"
                placeholder="Search treks, regions, or activities..."
                type="text"
              />
            </div>
          </div>

          {/* Right nav (desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Destinations
            </button>
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Special Offers
            </button>
          </div>

          {/* CTA */}
          <button className="ml-auto lg:ml-0 bg-emerald-500 text-slate-900 px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-sm hover:bg-emerald-600 transition">
            My Bookings
          </button>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-100 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 outline-none text-sm"
              placeholder="Search treks, regions, or activities..."
              type="text"
            />
          </div>
        </div>
      </nav>

      {/* CONTENT WRAP */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 lg:py-8 flex gap-6 lg:gap-8">
        {/* Desktop sidebar (visible like screenshot) */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0">
          <Filters
            regions={regions}
            activities={activities}
            budget={budget}
            setBudget={setBudget}
            toggleRegion={toggleRegion}
            toggleActivity={toggleActivity}
            clearAll={clearAll}
          />
        </aside>

        {/* MAIN */}
        <section className="flex-1 min-w-0">
          {/* Toolbar row like screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Adventure Packages
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Found 42 experiences matching your criteria
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                <button
                  onClick={() => setView("grid")}
                  className={[
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition",
                    view === "grid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-400 hover:text-slate-700",
                  ].join(" ")}
                >
                  <IconGrid className="w-4 h-4" /> Grid
                </button>
                <button
                  onClick={() => setView("map")}
                  className={[
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition",
                    view === "map"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-400 hover:text-slate-700",
                  ].join(" ")}
                >
                  <IconMap className="w-4 h-4" /> Map View
                </button>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-4 focus:ring-emerald-100 focus:border-emerald-300 outline-none"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="duration">Duration: Shortest</option>
              </select>
            </div>
          </div>

          {/* GRID (fix: 1 col mobile, 2 cols desktop like screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <PageBtn muted>
              <IconChevronLeft className="w-5 h-5" />
            </PageBtn>
            <PageBtn active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <span className="px-2 text-slate-400">...</span>
            <PageBtn>12</PageBtn>
            <PageBtn muted>
              <IconChevronRight className="w-5 h-5" />
            </PageBtn>
          </div>
        </section>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="font-extrabold text-slate-900">Filters</div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center"
                aria-label="Close"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
              <Filters
                regions={regions}
                activities={activities}
                budget={budget}
                setBudget={setBudget}
                toggleRegion={toggleRegion}
                toggleActivity={toggleActivity}
                clearAll={clearAll}
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Overlay (optional) */}
      {view === "map" && (
        <div className="fixed inset-0 z-[70] bg-white">
          <div className="flex h-full">
            <div className="hidden md:block w-[420px] border-r border-slate-200 p-6 overflow-y-auto">
              <h2 className="text-lg font-extrabold mb-4">Map Results</h2>
              <div className="space-y-3">
                {packages.map((p) => (
                  <button
                    key={p.id}
                    className="w-full text-left rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition"
                  >
                    <div className="font-bold">{p.title}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      From ${p.price.toLocaleString()} · {p.duration}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-slate-100 relative flex items-center justify-center">
              <div className="text-center">
                <IconMap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  Interactive Map View is loading...
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setView("grid")}
            className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-xl border border-slate-200 flex items-center justify-center"
            aria-label="Close map overlay"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Filters UI ---------------- */

function Filters({
  regions,
  activities,
  budget,
  setBudget,
  toggleRegion,
  toggleActivity,
  clearAll,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Filters</h2>
        </div>
        <button
          onClick={clearAll}
          className="text-xs font-extrabold text-emerald-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      <Section title="Region">
        <div className="space-y-2">
          <CheckboxRow
            checked={regions.everest}
            onChange={() => toggleRegion("everest")}
            label="Everest Region"
          />
          <CheckboxRow
            checked={regions.annapurna}
            onChange={() => toggleRegion("annapurna")}
            label="Annapurna Circuit"
          />
          <CheckboxRow
            checked={regions.langtang}
            onChange={() => toggleRegion("langtang")}
            label="Langtang Valley"
          />
          <CheckboxRow
            checked={regions.mustang}
            onChange={() => toggleRegion("mustang")}
            label="Mustang (Forbidden Kingdom)"
          />
          <CheckboxRow
            checked={regions.chitwan}
            onChange={() => toggleRegion("chitwan")}
            label="Chitwan National Park"
          />
        </div>
      </Section>

      <Divider />

      <Section title="Budget Range (USD)">
        <input
          className="w-full accent-emerald-500"
          max="5000"
          min="200"
          step="100"
          type="range"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <div className="flex justify-between mt-3 text-xs font-semibold text-slate-500">
          <span>$200</span>
          <span className="text-emerald-600 font-extrabold">
            ${budget.toLocaleString()}+
          </span>
          <span>$5,000</span>
        </div>
      </Section>

      <Divider />

      <Section title="Duration">
        <div className="grid grid-cols-2 gap-2">
          <Chip label="1–5 Days" active={false} />
          <Chip label="6–10 Days" active />
          <Chip label="11–15 Days" active={false} />
          <Chip label="15+ Days" active={false} />
        </div>
      </Section>

      <Divider />

      <Section title="Activities">
        <div className="space-y-2">
          <CheckboxRow
            checked={activities.trekking}
            onChange={() => toggleActivity("trekking")}
            label="Trekking & Hiking"
          />
          <CheckboxRow
            checked={activities.safari}
            onChange={() => toggleActivity("safari")}
            label="Jungle Safari"
          />
          <CheckboxRow
            checked={activities.heritage}
            onChange={() => toggleActivity("heritage")}
            label="Cultural Heritage"
          />
          <CheckboxRow
            checked={activities.climbing}
            onChange={() => toggleActivity("climbing")}
            label="Peak Climbing"
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-slate-200" />;
}

function CheckboxRow({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-200"
        type="checkbox"
      />
      <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors">
        {label}
      </span>
    </label>
  );
}

function Chip({ label, active }) {
  return (
    <button
      className={[
        "px-3 py-2 text-xs font-extrabold rounded-lg border transition",
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700",
      ].join(" ")}
      type="button"
    >
      {label}
    </button>
  );
}

function PageBtn({ children, active, muted }) {
  return (
    <button
      className={[
        "w-10 h-10 rounded-xl border flex items-center justify-center font-extrabold transition",
        active
          ? "bg-emerald-500 text-slate-900 border-emerald-500"
          : muted
          ? "border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-700"
          : "border-slate-200 text-slate-700 hover:border-emerald-200 hover:text-emerald-700",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

/* ---------------- Package Card (matches screenshot proportions) ---------------- */

function PackageCard({ pkg }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={pkg.img}
          alt={pkg.alt}
          className="w-full h-full object-cover"
        />

        {/* tags top-left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {pkg.tags.map((t) => (
            <span
              key={t}
              className={[
                "text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider",
                t === "Eco-Friendly"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-emerald-500 text-slate-900",
              ].join(" ")}
            >
              {t}
            </span>
          ))}
        </div>

        {/* heart top-right */}
        <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 backdrop-blur flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition">
          <IconHeart className="w-5 h-5" />
        </button>

        {/* bottom overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-4 text-white text-xs font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> {pkg.duration}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> {pkg.difficulty}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <IconStar className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-500">
              {pkg.rating} ({pkg.reviews})
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500 line-clamp-2">
          {pkg.desc}
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold">Starting from</div>
            <div className="text-xl font-black text-slate-900">
              ${pkg.price.toLocaleString()}
            </div>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-sm hover:bg-emerald-500 hover:text-slate-900 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function IconSearch({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconMountain({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 19l7-12 4 7 2-3 5 8H3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconMenu({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconGrid({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconMap({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 20 3 18V4l6 2 6-2 6 2v14l-6-2-6 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 6v14M15 4v14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconHeart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4.5-9.5-8.5C.8 9.3 2.5 6 6 6c2 0 3.3 1 4 2 0 0 1.5-2 4-2 3.5 0 5.2 3.3 3.5 6.5C19 16.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconStar({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.3 6.8 20l1-5.8L3.6 10l5.8-.8L12 4l2.6 5.2 5.8.8-4.2 4.2 1 5.8L12 17.3Z" />
    </svg>
  );
}
function IconChevronLeft({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconChevronRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
