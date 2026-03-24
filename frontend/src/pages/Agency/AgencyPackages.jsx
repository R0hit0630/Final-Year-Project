import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AgencyPackages() {
  const navigate = useNavigate();

  const COLORS = {
    primary: "#1978e5",
    primaryDark: "#3fa10e",
    secondary: "#2d3b2a",
    accent: "#f3f6f1",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };

  const sidebar = useMemo(
    () => [
      { label: "Overview", icon: "dashboard", to: "/agency", active: false },
      { label: "My Packages", icon: "hiking", to: "/agency/packages", active: true },
      { label: "Bookings", icon: "book_online", to: "/agency/bookings", active: false },
      { label: "Guides", icon: "groups", to: "/agency/guides", active: false },
      { label: "Earnings", icon: "payments", to: "/agency/earnings", active: false },
      { label: "Profile", icon: "settings_account_box", to: "/agency/profile", active: false },
    ],
    []
  );

  const packages = useMemo(
    () => [
      {
        id: 1,
        title: "Everest Base Camp Trek",
        days: "14 Days",
        location: "Everest Region",
        price: "$2,499",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxCx4lvlP0Kh_rRW8w6KC_xBqq44gkDYPeJW7IO7qKmEd-jAvpG7SCpkyWgkktoeaKVUEcP1l51Qtf9q4jNUh-m_L7KaVuNwmXH9XHUkCBocupQ_-Z086lJjyCfllbGWCkY9K-_KP8bhp_iINwSrGKQu97TFQXQqEb5GZox5lVnAN61ousBbMVrw6pMiobdJywo6maGNNpBZOZNKMhKLRgQut5EsBSXqdwRrM7w4j8Han3fqGv1XmJGQtHwjnxPuVSgFInbgKvMNPB",
        status: "High Demand",
        pct: 85,
        next: "Oct 12",
        bookings: 148,
        rating: 4.9,
      },
      {
        id: 2,
        title: "Annapurna Circuit",
        days: "18 Days",
        location: "Annapurna Region",
        price: "$1,950",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWxTB4cgJvHHA2IV1YoQ_Z67y3iGbI3wxkglhG3eC3YxI1ybS73mm55bmsJs0CcMNFRpcW_vSc2VefCR-2XGpxstaetQS6nnq41ZZoGAmVggeToEtyj3qcIBvexSSxhPyNsfiZODWx-RchpgzbDvnTH3CR5tsNfcArNC1GYcaAvoYg84iE6oYP4BOlnCXJLZ7SLCubMp2RsjMkVdZj1DALtNtK2Md-oCiaMhEOVreSOKu1XYOdcpM0W2_uHFWzzWT63WLZmbLyTPM7",
        status: "Steady",
        pct: 62,
        next: "Oct 15",
        bookings: 96,
        rating: 4.7,
      },
      {
        id: 3,
        title: "Langtang Valley Trek",
        days: "10 Days",
        location: "Langtang Region",
        price: "$1,250",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLhk_Z58zuE39eSVkG25SOFsTt_0jCU4sxYwbJaylC_cLN4qWv2LHJ-UAq1Y8bmvzkE_sIB8w4mWUtWO3Ge_eNydGZ-E35qriWWk5HMiyQY9HKbyl5QW-mJCN-3y-hV3zR3yw4kaZ39acLrhOmmVdmWfzJ7GuU4VVeOXyFlwBj_BrKflsckmabvdts1CRHyue-0FZngB__W1DdI6IPb43dvvqXvC0S0oqWYTdMC3ndZadrfo9g6d0YblFEAG0ybtPwft1oi3y2DHMy",
        status: "Filling Fast",
        pct: 45,
        next: "Nov 01",
        bookings: 54,
        rating: 4.6,
      },
      {
        id: 4,
        title: "Manaslu Circuit Trek",
        days: "16 Days",
        location: "Manaslu Region",
        price: "$2,150",
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        status: "High Demand",
        pct: 78,
        next: "Oct 20",
        bookings: 122,
        rating: 4.8,
      },
      {
        id: 5,
        title: "Mardi Himal Trek",
        days: "7 Days",
        location: "Pokhara",
        price: "$899",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        status: "Steady",
        pct: 58,
        next: "Oct 10",
        bookings: 71,
        rating: 4.5,
      },
      {
        id: 6,
        title: "Upper Mustang Jeep Tour",
        days: "9 Days",
        location: "Mustang",
        price: "$1,799",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        status: "Filling Fast",
        pct: 49,
        next: "Nov 05",
        bookings: 43,
        rating: 4.7,
      },
    ],
    []
  );

  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const pkgStatusBadge = (status) => {
    if (status === "High Demand")
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (status === "Steady")
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-800 border-yellow-500/20";
  };

  const summaryStats = useMemo(
    () => [
      {
        label: "Total Packages",
        value: "24",
        sub: "18 Active",
        icon: "hiking",
      },
      {
        label: "Total Bookings",
        value: "1,248",
        sub: "+12% this month",
        icon: "book_online",
      },
      {
        label: "Avg. Rating",
        value: "4.8",
        sub: "/ 5.0",
        icon: "star",
      },
      {
        label: "Revenue Potential",
        value: "$42.5k",
        sub: "Monthly",
        icon: "payments",
      },
    ],
    []
  );

  const StatCard = ({ item }) => (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <span
          className="material-symbols-outlined text-6xl"
          style={{ color: COLORS.primary }}
        >
          {item.icon}
        </span>
      </div>
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#6b7280]">
        {item.label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#2d3b2a]">{item.value}</h3>
        <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>
      </div>
    </div>
  );

  const PackageCard = ({ p }) => (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative h-52 overflow-hidden">
        <img
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          src={p.img}
        />

        <div className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {p.days}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {p.location}
          </p>
          <h3 className="text-lg font-bold text-white">{p.title}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#6b7280]">
            Booking Status
          </span>
          <span
            className={[
              "rounded-full border px-2 py-1 text-xs font-bold",
              pkgStatusBadge(p.status),
            ].join(" ")}
          >
            {p.status}
          </span>
        </div>

        <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full"
            style={{ width: `${p.pct}%`, backgroundColor: COLORS.primary }}
          />
        </div>

        <div className="mb-4 flex justify-between text-xs">
          <span className="text-[#2d3b2a]">{p.pct}% Full</span>
          <span className="text-[#6b7280]">Next Dep: {p.next}</span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3 rounded-xl bg-[#f8fafc] p-3">
          <div>
            <p className="text-[11px] uppercase text-[#94a3b8]">Price</p>
            <p className="text-sm font-bold text-[#2d3b2a]">{p.price}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#94a3b8]">Bookings</p>
            <p className="text-sm font-bold text-[#2d3b2a]">{p.bookings}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-[#94a3b8]">Rating</p>
            <p className="text-sm font-bold text-[#2d3b2a]">{p.rating} ★</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-bold text-[#2d3b2a] transition-colors hover:bg-gray-50"
            type="button"
          >
            Edit Details
          </button>

          <button
            className="flex-1 rounded-lg border py-2 text-xs font-bold transition-colors"
            style={{
              color: COLORS.primary,
              backgroundColor: "rgba(25,120,229,0.08)",
              borderColor: "rgba(25,120,229,0.25)",
            }}
            type="button"
          >
            Manage Dates
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]" style={paperTextureStyle}>
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#e0e8dc] bg-white shadow-sm">
                <img
                  alt="Agency Logo"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight text-[#2d3b2a]">
                  Summit Treks
                </h1>
                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: COLORS.primary }}
                >
                  Partner Agency
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {sidebar.map((i) => (
                <Link
                  key={i.label}
                  to={i.to}
                  className={[
                    "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                    i.active
                      ? "bg-[#1978e5]/10 hover:bg-[#1978e5]/20"
                      : "hover:bg-[#f0f4ee]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "material-symbols-outlined transition-colors",
                      i.active
                        ? "text-[#1978e5]"
                        : "text-[#6b7280] group-hover:text-[#1978e5]",
                    ].join(" ")}
                  >
                    {i.icon}
                  </span>
                  <span
                    className={[
                      "text-sm",
                      i.active
                        ? "font-semibold text-[#2d3b2a]"
                        : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]",
                    ].join(" ")}
                  >
                    {i.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <Link
                to="/logout"
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm"
              >
                <span className="material-symbols-outlined text-[#6b7280] transition-colors group-hover:text-red-500">
                  logout
                </span>
                <span className="text-sm font-medium text-[#4b5563] group-hover:text-red-500">
                  Log Out
                </span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile Top Bar */}
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 shadow-sm backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ color: COLORS.primary }}
              >
                terrain
              </span>
              <span className="text-lg font-bold text-[#2d3b2a]">Travolin</span>
            </div>
            <button className="text-[#2d3b2a]" type="button" aria-label="Menu">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-10">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="tracking-tight text-3xl font-bold text-[#2d3b2a]">
                  My Packages
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Manage all your travel packages with the same agency dashboard style.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/agency/add-package")}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 12px 30px rgba(25,120,229,0.18)",
                  }}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Package
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {summaryStats.map((s) => (
                <StatCard key={s.label} item={s} />
              ))}
            </div>

            {/* Packages grid */}
            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#2d3b2a]">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: COLORS.primary }}
                  >
                    landscape
                  </span>
                  Package Collection
                </h2>

                <button
                  className="text-sm font-bold hover:underline"
                  style={{ color: COLORS.primary }}
                  type="button"
                >
                  View Analytics
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {packages.map((p) => (
                  <PackageCard key={p.id} p={p} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 border-t border-[#e0e8dc] pb-8 pt-10 text-center">
              <p className="text-sm font-medium italic text-gray-400">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="mt-2 text-xs text-gray-300">
                © 2026 Travolin. Partner Agency Portal.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}