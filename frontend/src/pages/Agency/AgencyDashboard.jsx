// src/Pages/AgencyDashboard.jsx
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AgencyDashboard() {
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
      { label: "Earnings", icon: "payments", to: "/agency/earnings", active: false },
      { label: "Guides", icon: "person", to: "/agency/guides", active: false },
      { label: "Profile", icon: "settings_account_box", to: "/agency/profile", active: false },
    ],
    []
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Bookings",
        value: "1,248",
        delta: "12%",
        deltaUp: true,
        icon: "book_online",
      },
      {
        label: "Monthly Revenue",
        value: "$42.5k",
        delta: "8.4%",
        deltaUp: true,
        icon: "payments",
      },
      {
        label: "Average Rating",
        value: "4.8",
        sub: "/ 5.0",
        stars: 4.5,
        icon: "star",
      },
      {
        label: "Active Guides",
        value: "18",
        sub: "on trip",
        icon: "groups",
        avatars: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuABkbMrmrxC9_vyNWuBwCehtfwkH9EIKsC9XgSC0WdYQgl6xJ116josDTa0_ik8SK31KKINcsqry6km43RpdgJLFstJ6c2An6GOD7ZS-TmN9QiRAQKCZ20EymehuzKpuAkerf8hnKvVQOPY5-mMeUFUOEGOIKqt2eiDZcwXm8H-8hPiO29aLdIupXIdGYtaT_RnOjGwa3UjsFMxC2p_3-0hbznE057wfJ5m2K68clkAmT-jUKG2XXva10Cqf4950IxQl7fnGlJeaEH8",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDwCjglLvrPd_3JtGOm8Ctkc6JrNMHcBFO_9wuq-ST1z9hGHbRdw-ow5JrCoOezvGjc-yLT4jevlkIt8Howd4JJJArvP6kLyMDuz4pWqbMfSVFkJF1OMkAPF5y93-2My06oiXSVWXfNZcHbTEtjaySkGLY4C2wEbmwLnBG5ugQOvNUA8aa1_L2cW0ri3v6UV2NJ9xgLSm9QwR-DR59d01zM2mrqptnhS9GlFN3TDsm7tdDTWiSxhIJLYhJkEbBk7VaUs6Hd6-0ei8Mq",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCoBypd0T9mH4WH0xPXvF2cNRnaOApiIUYfgy1lZavO-G6sHHcO4aK--fG_kWppl9-PqbSQMBje_YjtTm8N5H1TqKASTULhPk04lYtnrMlOoui6-3Oh9Mqi2puTGh8-Tn5f3FTsp20SHv4mqtv-Zy-VaydOcdMB0zVXeMLtqydq5dAZxAkOhhONqBaxwk3cR2IBq1CrVxlk2GFksjD1bdJg6e5bk937eafFMN-GpKpSnVytlTjB5wdi-R2ttwONTid_NdL4cBaIRokI",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBgYwyMbhW4SFs_9R3GePNzpM-6q-r9R_x9yKZwtLMIMZ9UV3nCijHZmtJwZ4Re91nxSVFqLddoEBDZs5M03ssfA1owyjFneOtehnz-dQvAfNW6CFbchVSG9fa_3fizHbIHzmHRLTj_zJ0YDFEvFJWCGdV5xh4AX_BlY2SHIgyzW0WrM8TLmTDAVZ260zug12qqDP0xcAi_u8YOek2uoETheFvHz0PRzhNcavAwcukgEPwsUsAOESy4zFN1YK4_Vl7Z1YEaaT9sSdeH",
        ],
        extra: "+14",
      },
    ],
    []
  );

  const packages = useMemo(
    () => [
      {
        title: "Everest Base Camp Trek",
        days: "14 Days",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxCx4lvlP0Kh_rRW8w6KC_xBqq44gkDYPeJW7IO7qKmEd-jAvpG7SCpkyWgkktoeaKVUEcP1l51Qtf9q4jNUh-m_L7KaVuNwmXH9XHUkCBocupQ_-Z086lJjyCfllbGWCkY9K-_KP8bhp_iINwSrGKQu97TFQXQqEb5GZox5lVnAN61ousBbMVrw6pMiobdJywo6maGNNpBZOZNKMhKLRgQut5EsBSXqdwRrM7w4j8Han3fqGv1XmJGQtHwjnxPuVSgFInbgKvMNPB",
        status: "High Demand",
        pct: 85,
        next: "Oct 12",
      },
      {
        title: "Annapurna Circuit",
        days: "18 Days",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWxTB4cgJvHHA2IV1YoQ_Z67y3iGbI3wxkglhG3eC3YxI1ybS73mm55bmsJs0CcMNFRpcW_vSc2VefCR-2XGpxstaetQS6nnq41ZZoGAmVggeToEtyj3qcIBvexSSxhPyNsfiZODWx-RchpgzbDvnTH3CR5tsNfcArNC1GYcaAvoYg84iE6oYP4BOlnCXJLZ7SLCubMp2RsjMkVdZj1DALtNtK2Md-oCiaMhEOVreSOKu1XYOdcpM0W2_uHFWzzWT63WLZmbLyTPM7",
        status: "Steady",
        pct: 62,
        next: "Oct 15",
      },
      {
        title: "Langtang Valley Trek",
        days: "10 Days",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLhk_Z58zuE39eSVkG25SOFsTt_0jCU4sxYwbJaylC_cLN4qWv2LHJ-UAq1Y8bmvzkE_sIB8w4mWUtWO3Ge_eNydGZ-E35qriWWk5HMiyQY9HKbyl5QW-mJCN-3y-hV3zR3yw4kaZ39acLrhOmmVdmWfzJ7GuU4VVeOXyFlwBj_BrKflsckmabvdts1CRHyue-0FZngB__W1DdI6IPb43dvvqXvC0S0oqWYTdMC3ndZadrfo9g6d0YblFEAG0ybtPwft1oi3y2DHMy",
        status: "Filling Fast",
        pct: 45,
        next: "Nov 01",
      },
    ],
    []
  );

  const departures = useMemo(
    () => [
      {
        pkg: "Everest Base Camp",
        group: "Group A-24",
        date: "Oct 12, 2023",
        guide: { name: "Pasang Sherpa", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkq9GNaKqpDGcO3Q-iAHqaeaD-csCI09AA3Bi4WJwN8C59IqduOnyy6oGmD7fdoPbPowH7nR4oixmPYoBdqY5ufKzo-dJMWHY-s7hpmgOeSc26MxvMaiiTlNxLLTzHtW-PZkwqiW7Q9UxVPgh-05xx1LKg6hNJ7guUXp48VAfDTLKQwOHDPIlrQhAQ_zKXMXnR9Z1IT-iFv0nlzfs0O-Lvmv6rdrzXmZ9_ZV3gqPxLQwy2sOAt4x-JxNhKbdbO6E0hwyV-KKwc17AV" },
        clients: {
          avatars: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAdqUQ2TUCG1POCFmn-unDQpIgAXZAcurXPmU1jF8Gzpy-V6RGYz3lGN2jRYH9nDAhWNpeTI1qNf0IGXXmS7e1HJh9z4-_djCglR-pOeOiAihagZXn8o_YApQbW_kWVy9R42TKhdR962dSPVHpUD7zqpk3tZ3OJ5n5I2bB4iM7zN4cp3aPszfYxDQmXYBNSV81y5f5UejfNhK37eQ0-6LqLepRL3FF9bQS6xjyWuXKJh6XhWoDytGT4b98cLCgxRY1E9RccXQRPjdXP",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDszDD3qSPt-F1brUrf5oSN242MlNNK6uu_8OXLXKniMAC9xxGA5Toqiu2qbbSFon4FUL_-_cCi5sSyodGYfSBQRqv-WC2NHMLfQWQCyfrQT6Xe-6jIW7HN8s2-tjTXgR0-bDuo6XP4OKENIW4FRUl3ahZeSKbbKHubg1C9Xujqh82_OrtLBV1LlVQmEid8ox5OV8uEwn8sNtbmTq9VxxkAHEFuJ5JwiC1K3394q09MQ0dcKfTMXEAU4wcbBri9nHP2su0m6c7kuLeV",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCB_UlHalaP7fL5UXGbutGFtBeu5NvW3W6KPyYMRmryRTCKbgrVGXVKzzUWy9XwOYL97WwOfmY29HS-xu9hCnaQsF0vQNJlWJ2CKE_IHptPCRFAjRNw4GZOYRqkS13p6umen7DnL-K_sGjHNSfgSHS5MadwVkouRoTWy9jDLfIrPH8osdc4IY5HXEP7_xEQJO2NuNTokZjIYkS9mVoTLjl9XTtVoLHE4IUAKawvUkDNLS31KyGHdkKHLKvip4XdNp-MGRZMZKFTCZ8l",
          ],
          extra: "+8",
        },
        status: "Confirmed",
      },
      {
        pkg: "Annapurna Circuit",
        group: "Group B-19",
        date: "Oct 15, 2023",
        guide: { name: "Lakpa Dorje", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF4lpmnU0L8RO6wxoVwHDstMYGlm13mtYnFtnz-YlEKe7jAiC2PEUUIdJlIiLl3IQyAqv4PeFeiAWh7voi8N1umHEzA9zLBIo0-Q_E14Thmz4Q-wPNX5oXl33U6ACotgzNlWqfjBBiDzqTQLxtb6LGgq2I97xZnvOFeX6waFoCHYL34KT5iGnVLQe1xejvim5igT-ORIMYqinzn1lwbTTTkAnOghcmAM4IrQ2kjQ0SDhj71e_pC40ob7k86mDBM7ODnSANwQ6Gni5C" },
        clients: {
          avatars: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAqwAXcyAMLW2droaB88b6WIqyjPq3G7maNP6AWxd6U1Qcr5k17aoV28S15X3lL7C9-X1HwOiDEANVObpnKWpd9aIBhjSDx9ic6IBh1HN0tafmDk8hw2Mh5ge6-jwvjcZzigbedfJTOTENFBoDHAF_-0rnWi2t2uP1ot3CVFlqz0yn1xr795eQgO8F8_VjLVRxf5lROLSbq06_uvSXBcNZFHKCBiQqdEEIMmC9IufIz1R6tbNkU1AOIJQ9PWV4Pqp4F9K0F9x8oEmO5",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuClK1BP4h1BQXpc15-nQiyphE9yO7RKluy9MYHJk6JacMvDdaUHhYr0wccCh9OxSRD1KLlKyQIv61ajm4U8H2Q340E_DjcjZWmmZRkFKcav2Hh78MlyvIajbSk37zQkfWlLVkTNVvZ-pnPZexF5Pv9TNrj6Fb1GqabEW3S8y9zllY_j-mXe5XS1VdZ7mFit_L8H9vx0K4cQr4WxV_Qp4_j3lSDLXh27TSu8N-lYtITw5jdkMrXod9cltFG6dQvb249Vw_PpiYCuBgZE",
          ],
          extra: "+4",
        },
        status: "Pending",
      },
      {
        pkg: "Langtang Valley",
        group: "Group C-05",
        date: "Nov 01, 2023",
        guide: null,
        clients: {
          avatars: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAO2qV_t9hvHq23pGAw6zoXsGfO_cM3xvjnZ74igOzWGoAsQDTCvlIQ60RJZAiQ6EHlJ_cn757tjzUaO0qhhSQhSaYpqWV3WA2WDKAuGqlhonhpH1uynpEFB6UDVPj3SpUfdjAHMZQav3aCQsTosWREJFI79eFA8CoyaB4L9OoFEpFt9fr5qFygYpPAEpV6VbsTiED5lMY033BFM8GvYU4ppD0r-LfUbpJb2ABiKBPaee0zO-1PQtqb3_kLC_lf5irpAYQWfPGQ1xge",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCWm9e1Xw3QZV3CxeSsBFb6CKf1gzutvwYUoN95kO4Iq6LG_Cfo48BGkTdl_w4adYY74g1Bq5cxx7d4Ox4QDf6XaziWUeQgWe4gBNFjKxiQ3hFuK8xlkdApcoEvAf4rzTTehHw49Pe5ARtTzQlc5bD9d0lrE2iooRSdIm1RA-DUQSm9C1-m8nysv1S5jJTPDc1lbO9s05fCPpWekgsjEMYNpfXpFrlejjzCRYj8Q7-6P6xk26KZZN4qRNauAqwkiNowKLBkVP7u_fkz",
          ],
          extra: null,
        },
        status: "Action Req",
      },
    ],
    []
  );

  const paperTextureStyle = useMemo(
    () => ({
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-.895 2-2 2 .895 2 2 2z' fill='%2394a3b8' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    }),
    []
  );

  const badgeForStatus = (status) => {
    if (status === "Confirmed")
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (status === "Pending")
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
  };

  const pkgStatusBadge = (status) => {
    if (status === "High Demand")
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    if (status === "Steady")
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-800 border-yellow-500/20";
  };

  const StatCard = ({ item }) => (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-6xl" style={{ color: COLORS.primary }}>
          {item.icon}
        </span>
      </div>
      <p className="text-sm font-bold uppercase tracking-wider text-[#6b7280] mb-2">
        {item.label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-[#2d3b2a]">{item.value}</h3>

        {item.delta && (
          <span
            className={[
              "text-xs font-bold flex items-center gap-1",
              item.deltaUp ? "text-emerald-600" : "text-red-600",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-sm">
              {item.deltaUp ? "arrow_upward" : "arrow_downward"}
            </span>
            {item.delta}
          </span>
        )}

        {item.sub && <span className="text-xs font-medium text-[#94a3b8]">{item.sub}</span>}
      </div>

      {item.stars && (
        <div className="mt-2 flex">
          {[1, 2, 3, 4, 5].map((i) => {
            const icon = item.stars >= i ? "star" : item.stars >= i - 0.5 ? "star_half" : "star";
            const muted = item.stars < i - 0.5;
            return (
              <span
                key={i}
                className={[
                  "material-symbols-outlined text-sm",
                  muted ? "text-gray-300" : "text-yellow-500",
                ].join(" ")}
              >
                {icon}
              </span>
            );
          })}
        </div>
      )}

      {item.avatars && (
        <div className="mt-3 flex -space-x-2 overflow-hidden">
          {item.avatars.slice(0, 4).map((src, idx) => (
            <img
              key={idx}
              alt=""
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
              src={src}
            />
          ))}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2d3b2a] ring-2 ring-white text-[10px] font-bold text-white">
            {item.extra}
          </div>
        </div>
      )}
    </div>
  );

  const PackageCard = ({ p }) => (
    <div className="rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="h-48 overflow-hidden relative">
        <img
          alt={p.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          src={p.img}
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
          {p.days}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <h3 className="text-lg font-bold text-white">{p.title}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase font-bold text-[#6b7280]">
            Booking Status
          </span>
          <span
            className={[
              "text-xs font-bold px-2 py-1 rounded-full border",
              pkgStatusBadge(p.status),
            ].join(" ")}
          >
            {p.status}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full"
            style={{ width: `${p.pct}%`, backgroundColor: COLORS.primary }}
          />
        </div>

        <div className="flex justify-between text-xs mb-4">
          <span className="text-[#2d3b2a]">{p.pct}% Full</span>
          <span className="text-[#6b7280]">Next Dep: {p.next}</span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg bg-white hover:bg-gray-50 text-xs font-bold text-[#2d3b2a] border border-gray-200 transition-colors"
            type="button"
          >
            Edit Details
          </button>
          <button
            className="flex-1 py-2 rounded-lg text-xs font-bold border transition-colors"
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

  const navigate = useNavigate();

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]" style={paperTextureStyle}>
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col justify-between border-r border-[#e0e8dc] bg-[#fdfdfc]/80 backdrop-blur-sm lg:flex">
          <div className="flex h-full flex-col p-6">
            <div className="mb-10 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#e0e8dc] shadow-sm bg-white">
                <img
                  alt="Agency Logo"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv5cRvMY3Y1duu7_mqX4yGdtkq8hLjd7F2MWWbrxUiEYLR7ACb9_WpRAQDRA1i-nfBrrt7AWJrIKWgoFL6vXK9nmNa7Xx6U-ouFwn1JaB6JtbwbjAOvrB3UCMvcSodjNYzIRFzg40W6onxqocvKUA9Jjr7U8YMFcbQQhwtTQxZirmliaSD4lbz4FrGB6Fqi68Q9lmPo_OPnKLhoj9a3nOxtLm-k3whu_Eiasizlk-9SwO5NES13rYYXjbUqCMDDE6JCeme3iAMfowo"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-[#2d3b2a] text-base font-bold leading-tight">
                  Summit Treks
                </h1>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.primary }}>
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
                    i.active ? "bg-[#1978e5]/10 hover:bg-[#1978e5]/20" : "hover:bg-[#f0f4ee]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "material-symbols-outlined transition-colors",
                      i.active ? "text-[#1978e5]" : "text-[#6b7280] group-hover:text-[#1978e5]",
                    ].join(" ")}
                  >
                    {i.icon}
                  </span>
                  <span
                    className={[
                      "text-sm",
                      i.active ? "font-semibold text-[#2d3b2a]" : "font-medium text-[#4b5563] group-hover:text-[#2d3b2a]",
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
                className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 hover:border-[#e0e8dc] hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[#6b7280] group-hover:text-red-500 transition-colors">
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
          {/* Mobile top bar */}
          <div className="sticky top-0 z-50 flex items-center justify-between bg-white/80 p-4 backdrop-blur-md shadow-sm lg:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" style={{ color: COLORS.primary }}>
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
                <h1 className="text-3xl font-bold text-[#2d3b2a] tracking-tight">
                  Agency Dashboard
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  Welcome back, Summit Treks. Here's what's happening today.
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

            {/* Stats */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <StatCard key={s.label} item={s} />
              ))}
            </div>

            {/* Packages */}
            <div className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#2d3b2a]">
                  <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                    landscape
                  </span>
                  My Booking Packages
                </h2>

                <a
                  className="text-sm font-bold hover:underline"
                  style={{ color: COLORS.primary }}
                  href="#"
                >
                  View All Packages
                </a>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((p) => (
                  <PackageCard key={p.title} p={p} />
                ))}
              </div>
            </div>

            {/* Upcoming Group Departures */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#2d3b2a]">
                  <span className="material-symbols-outlined" style={{ color: COLORS.primary }}>
                    calendar_month
                  </span>
                  Upcoming Group Bookings
                </h3>

                <div className="flex gap-2">
                  <button
                    className="rounded p-1 text-[#6b7280] hover:bg-gray-100 hover:text-[#2d3b2a] transition-colors"
                    type="button"
                    aria-label="Filter"
                  >
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button
                    className="rounded p-1 text-[#6b7280] hover:bg-gray-100 hover:text-[#2d3b2a] transition-colors"
                    type="button"
                    aria-label="More"
                  >
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Package
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Booking Date
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Lead Guide
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Clients
                      </th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Status
                      </th>
                      <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm">
                    {departures.map((r) => (
                      <tr
                        key={r.group}
                        className="group border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="py-4 font-medium text-[#2d3b2a]">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                              <img
                                alt={r.pkg}
                                className="h-full w-full object-cover"
                                src={
                                  packages.find((p) => r.pkg.includes(p.title.split(" ")[0]))?.img ||
                                  packages[0].img
                                }
                              />
                            </div>
                            <div>
                              <p className="font-bold">{r.pkg}</p>
                              <p className="text-xs text-[#94a3b8]">{r.group}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-[#4b5563]">{r.date}</td>

                        <td className="py-4">
                          {r.guide ? (
                            <div className="flex items-center gap-2">
                              <img
                                alt="Guide"
                                className="h-6 w-6 rounded-full ring-1 ring-gray-200 object-cover"
                                src={r.guide.avatar}
                              />
                              <span className="text-[#4b5563]">{r.guide.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs italic text-[#94a3b8]">Unassigned</span>
                          )}
                        </td>

                        <td className="py-4">
                          <div className="flex -space-x-2">
                            {r.clients.avatars.slice(0, 3).map((src, idx) => (
                              <img
                                key={idx}
                                alt=""
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 object-cover"
                                src={src}
                              />
                            ))}
                            {r.clients.extra && (
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d3b2a] ring-2 ring-white text-xs font-medium text-white cursor-help"
                                title="More clients"
                              >
                                {r.clients.extra}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-4">
                          <span
                            className={[
                              "rounded border px-2 py-1 text-xs font-bold",
                              badgeForStatus(r.status),
                            ].join(" ")}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="py-4 text-right">
                          <button
                            className="text-[#94a3b8] hover:text-[#1978e5] transition-colors"
                            type="button"
                            aria-label="Edit booking"
                          >
                            <span className="material-symbols-outlined">edit_square</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 border-t border-[#e0e8dc] pb-8 pt-10 text-center">
              <p className="text-sm font-medium italic text-gray-400">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="mt-2 text-xs text-gray-300">© 2023 Travolin. Partner Agency Portal.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}