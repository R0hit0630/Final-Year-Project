import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useNavigate } from "react-router-dom";

export default function AboutUS() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Rohit Shrestha",
      role: "Founder & CEO",
      icon: "engineering",
    },
    {
      name: "Anish Tamang",
      role: "Head of Operations",
      icon: "settings_accessibility",
    },
    {
      name: "Dhrrap Gurung",
      role: "Lead Developer",
      icon: "code",
    },
  ];

  const values = [
    {
      icon: "public",
      title: "Local Expertise",
      desc: "We partner exclusively with locally-owned agencies and guides who understand Nepal's terrain, culture, and traditions intimately.",
    },
    {
      icon: "shield",
      title: "Safety First",
      desc: "Every agency on Travolin is admin-verified, and every guide is vetted by the agency before they can lead a trip.",
    },
    {
      icon: "eco",
      title: "Sustainable Travel",
      desc: "We promote responsible tourism that benefits local communities and preserves the natural beauty of Nepal.",
    },
    {
      icon: "diversity_3",
      title: "Community Driven",
      desc: "Our platform is built on reviews and ratings from real travelers to help you make informed decisions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111921] text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-3e2b1e3f6f41?q=80&w=2400&auto=format&fit=crop"
            alt="Nepal mountains"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111921]/60 via-[#111921]/80 to-[#111921]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-4">
            About Travolin
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Connecting Travelers
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#197fe6] to-[#64b5f6]">
              with Nepal's Soul
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Travolin is a travel management platform that bridges the gap between
            adventurous travelers and verified Nepali travel agencies, making
            Himalayan expeditions accessible, safe, and unforgettable.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Simplifying travel in the Himalayas
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Nepal is home to 8 of the 14 highest peaks in the world, rich
                cultural heritage, and breathtaking landscapes. Yet, finding a
                trustworthy travel agency and booking a trip has always been
                fragmented and risky.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Travolin solves this by providing a unified platform where agencies
                are verified by our admin team, guides are rated by travelers, and
                payments are handled securely through eSewa — with full
                transparency and a 70% refund guarantee on cancellations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "50+", label: "Verified Agencies" },
                { value: "500+", label: "Trips Completed" },
                { value: "12K+", label: "Happy Travelers" },
                { value: "4.9★", label: "Average Rating" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-[#197fe6]/25 transition"
                >
                  <p className="text-2xl md:text-3xl font-extrabold text-white mb-1">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-[#197fe6]/30 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#197fe6]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#197fe6]/20 transition">
                    <span className="material-symbols-outlined text-[#197fe6] text-[24px]">
                      {v.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Three Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "search",
                title: "Explore Packages",
                desc: "Browse verified travel packages from trusted Nepali agencies. Filter by region, price, difficulty, and ratings.",
              },
              {
                step: "02",
                icon: "payments",
                title: "Book & Pay Securely",
                desc: "Reserve your trip and pay securely via eSewa. Cancel anytime before the trip starts for a 70% refund.",
              },
              {
                step: "03",
                icon: "hiking",
                title: "Travel & Review",
                desc: "Enjoy your adventure with an assigned expert guide. Share your experience by rating the trip and guide.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-[#197fe6]/30 transition-all group"
              >
                <span className="absolute top-6 right-6 text-4xl font-black text-white/[0.06] group-hover:text-[#197fe6]/10 transition">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#197fe6]/10 flex items-center justify-center mb-5 group-hover:bg-[#197fe6]/20 transition">
                  <span className="material-symbols-outlined text-[#197fe6] text-[24px]">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[#197fe6] text-xs font-bold uppercase tracking-widest mb-3">
              The Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Built by Travelers, for Travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center hover:border-[#197fe6]/30 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-[#197fe6]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#197fe6]/20 transition">
                  <span className="material-symbols-outlined text-[#197fe6] text-[36px]">
                    {member.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl bg-gradient-to-br from-[#197fe6]/20 via-[#197fe6]/5 to-transparent border border-[#197fe6]/15 p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore Nepal?
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Join thousands of travelers who trust Travolin for their Himalayan
              adventures.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="h-12 px-8 rounded-xl bg-[#197fe6] hover:bg-[#1570d4] text-white font-bold transition shadow-lg shadow-[#197fe6]/25"
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate("/destinations")}
                className="h-12 px-8 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold transition"
              >
                Browse Destinations
              </button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
