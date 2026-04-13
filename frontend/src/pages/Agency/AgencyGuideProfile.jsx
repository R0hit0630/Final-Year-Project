// src/Pages/AgencyGuideProfile.jsx
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function AgencyGuideProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const COLORS = {
    primary: "#1978e5",
    secondary: "#2d3b2a",
    paper: "#fcfbf8",
    bgLight: "#f6f7f8",
  };

  const sidebar = useMemo(
    () => [
      { label: "Overview", icon: "dashboard", to: "/agency", active: false },
      { label: "My Packages", icon: "hiking", to: "/agency/packages", active: false },
      { label: "Bookings", icon: "book_online", to: "/agency/bookings", active: false },
      { label: "Earnings", icon: "payments", to: "/agency/earnings", active: false },
      { label: "Guides", icon: "person", to: "/agency/guides", active: true },
      { label: "Profile", icon: "settings_account_box", to: "/agency/profile", active: false },
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

  // Static demo data for now
  const guides = useMemo(
    () => [
      {
        id: "1",
        fullName: "Pasang Lhamu",
        region: "Khumbu / Everest Region",
        experience: "12+ Yrs",
        email: "pasang@example.com",
        phone: "+977 9812345678",
        certification: "UIAA / NMA Certified",
        specialization: "High Altitude Trekking",
        languages: "English, Nepali, Hindi",
        bio: "Experienced mountain guide with strong knowledge of high-altitude trekking routes, client safety, and expedition support across the Everest region.",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCfw-nBaxTB8SZl_-LyrWpnU4zVGE6mOQ9DjW0qSZ1hfL0dylmUKzEcHYrT2wjrsew5QaEAhYuJ3Rdn2jKWe5xlHhMnRyFLHVhFA4tSTihYL4zAQAueXUYnxybU42sCzr6IxFc9B9iLduSB79xo4abmCRRQ9cKUtNZmbfUSFoEsXm0_lrfciKSlTLTdUYb5a8RkdiyFFGJaI7eo9RCf9NTOhH8reJ1SXgu5uofNphcgIJJCTro9xR1JipvtmHfmiWMBx8K2JqcfBnRC",
        skills: ["UIAA Certified", "NMA Member", "Technical Photography", "First Aid"],
      },
      {
        id: "2",
        fullName: "Dorje Shrestha",
        region: "Annapurna Massif",
        experience: "15+ Yrs",
        email: "dorje@example.com",
        phone: "+977 9800000000",
        certification: "IFMGA Certified",
        specialization: "Technical Trekking",
        languages: "English, Nepali",
        bio: "Senior trekking guide with deep route experience in the Annapurna region and strong group leadership skills.",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDAwuM4DVehJLxjn6v0vzu9ndTl15A0ZUIRhifKW_NVVzBnhRxy_h8O0y1JTvQVwcXy-415ruFGgwkodswONn_J0LYuT6WoCnp1-U1u_Ww6oSDg7RdO4U0H5K39w5cKZYZRuLnh1W1kS-rqYiVrhGFzNQ8t26pBgcuwgDufmsoHkiygYywlSwagTzl5cvbLY3xQ3ry_CNRgoV2x_blBS7rhOMSFfyybv-XLwfc7GOQAe0zVqXqKC_84WZAUv0f3Wss37tdHfDbayQ__",
        skills: ["IFMGA Certified", "WFR Medical", "Expedition Planning"],
      },
      {
        id: "3",
        fullName: "Anjali Rai",
        region: "Langtang / Helambu",
        experience: "8+ Yrs",
        email: "anjali@example.com",
        phone: "+977 9822222222",
        certification: "NMA Certified",
        specialization: "Nature & Wellness Trekking",
        languages: "English, Nepali, Hindi",
        bio: "Guide focused on nature-led trekking experiences, cultural trails, and client wellbeing during longer trips.",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBKb9hwAjZzPBcM8zS1XudLkf0FRmx8krXzw8R2eFIB5kXMV6LG56VVVTcjaQH6uFja_TXCfl2fqEHzMncJefbiZbFksCYdwO5VrhM-TO5f0AtAxyhd5AjhLXhWt0om27XmJUmqDWQNY49dC3eE91QMnyEE4d9XHwecunw8fdHn3vAWTslKs0MqhKJMe61cCJaRhIy2NYGtvVG08mdGW5FeqXw71ParwT2BCmA_xGhfvjvslcOsOJSzedVqV_G2Yipq0oSRJrPCL9Ec",
        skills: ["NMA Certified", "Botanical Expert", "Yoga/Wellness"],
      },
      {
        id: "4",
        fullName: "Mingma Gyalje",
        region: "Manaslu / Ganesh Himal",
        experience: "10+ Yrs",
        email: "mingma@example.com",
        phone: "+977 9833333333",
        certification: "High Altitude Medical Training",
        specialization: "Remote Region Trekking",
        languages: "English, Nepali, Tibetan",
        bio: "Specialist guide for remote trekking regions with strong logistics awareness and altitude safety knowledge.",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDhbRkjesoYnGCL_7vcMR59Imv_1j2Qo_FQHCzqFDfDIDKb9mlh23jAqBwZJzEG3SVdPJAK011iD100um8SLu5nlt5gFsePn7WbEwPRdcYT2aZ5estPHRwX2t8EySGP7ifFSE6lZJOM2z9uXwrSzXT5bytz9GRFlqRMTQPyY0jsGVE2hrpGFm4bG952QXvVTFFvzvWrQACUiFCUqnjwvyh210Y0B9GOq3Mxr9cRn4QyNOAysnM2mv_pdTA2bwHAXK4ds0mIJQKYuT-b",
        skills: ["High Altitude Med", "Lhotse Summit", "Remote Route Planning"],
      },
    ],
    []
  );

  const guide = guides.find((g) => g.id === id) || guides[0];

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f6f7f8] text-[#2d3b2a] antialiased">
      <div className="flex h-full w-full bg-[#fcfbf8]" style={paperTextureStyle}>
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

        <main className="flex flex-1 flex-col overflow-y-auto">
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
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/agency/guides")}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#4b5563] transition hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-base">
                      arrow_back
                    </span>
                    Back
                  </button>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#2d3b2a]">
                  Guide Profile
                </h1>
                <p className="mt-1 text-[#6b7280]">
                  View guide information, expertise, and contact details.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                >
                  Edit Guide
                </button>

                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm font-bold text-white shadow-lg transition-all"
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: "0 12px 30px rgba(25,120,229,0.18)",
                  }}
                >
                  Assign to Trip
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-2">
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="h-32 w-32 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                      <img
                        src={guide.image}
                        alt={guide.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-[#2d3b2a]">
                        {guide.fullName}
                      </h2>
                      <p className="mt-1 text-sm text-[#6b7280]">{guide.region}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#1978e5]/20 bg-[#1978e5]/10 px-3 py-1.5 text-xs font-semibold text-[#1978e5]">
                          {guide.experience} Experience
                        </span>
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#4b5563]">
                          {guide.specialization}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                          <span className="material-symbols-outlined text-sm leading-none">
                            star
                          </span>
                          4.8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: COLORS.primary }}
                    >
                      badge
                    </span>
                    <h2 className="text-lg font-bold text-[#2d3b2a]">
                      Professional Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-semibold text-[#374151]">
                        Certification
                      </p>
                      <p className="text-sm text-[#6b7280]">{guide.certification}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-semibold text-[#374151]">
                        Languages
                      </p>
                      <p className="text-sm text-[#6b7280]">{guide.languages}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-semibold text-[#374151]">
                        Specialization
                      </p>
                      <p className="text-sm text-[#6b7280]">{guide.specialization}</p>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-semibold text-[#374151]">
                        Experience
                      </p>
                      <p className="text-sm text-[#6b7280]">{guide.experience}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: COLORS.primary }}
                    >
                      psychology
                    </span>
                    <h2 className="text-lg font-bold text-[#2d3b2a]">
                      Skills & Expertise
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {guide.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#1978e5]/20 bg-[#1978e5]/10 px-3 py-1.5 text-xs font-semibold text-[#1978e5]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: COLORS.primary }}
                    >
                      description
                    </span>
                    <h2 className="text-lg font-bold text-[#2d3b2a]">
                      Guide Bio
                    </h2>
                  </div>

                  <p className="text-sm leading-7 text-[#4b5563]">{guide.bio}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: COLORS.primary }}
                    >
                      contact_mail
                    </span>
                    <h2 className="text-lg font-bold text-[#2d3b2a]">
                      Contact Details
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="mb-1 font-semibold text-[#374151]">Email</p>
                      <p className="text-[#6b7280]">{guide.email}</p>
                    </div>

                    <div>
                      <p className="mb-1 font-semibold text-[#374151]">Phone</p>
                      <p className="text-[#6b7280]">{guide.phone}</p>
                    </div>

                    <div>
                      <p className="mb-1 font-semibold text-[#374151]">Region</p>
                      <p className="text-[#6b7280]">{guide.region}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1978e5]/10 bg-[#1978e5]/5 p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-[#2d3b2a]">
                    Guide Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">Name</span>
                      <span className="font-semibold text-[#2d3b2a]">
                        {guide.fullName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">Experience</span>
                      <span className="font-semibold text-[#2d3b2a]">
                        {guide.experience}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">Skills</span>
                      <span className="font-semibold text-[#2d3b2a]">
                        {guide.skills.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2">
                    <span
                      className="material-symbols-outlined"
                      style={{ color: COLORS.primary }}
                    >
                      task_alt
                    </span>
                    <h2 className="text-lg font-bold text-[#2d3b2a]">
                      Quick Actions
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                    >
                      Edit Guide Details
                    </button>

                    <button
                      type="button"
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#2d3b2a] transition hover:bg-gray-50"
                    >
                      View Assignments
                    </button>

                    <button
                      type="button"
                      className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      Remove Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 border-t border-[#e5e7eb] pt-6 text-sm text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
              <p>Agency guide profile overview</p>
              <p>Updated for the current dashboard style</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}