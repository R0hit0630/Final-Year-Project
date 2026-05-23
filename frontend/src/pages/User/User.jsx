import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const [twoFA, setTwoFA] = useState(true);

  const achievements = useMemo(
    () => [
      { title: "High Altitude\nWalker", icon: "hiking", color: "amber", locked: false },
      { title: "Winter\nSurvivor", icon: "severe_cold", color: "cyan", locked: false },
      { title: "Visual\nStoryteller", icon: "photo_camera", color: "purple", locked: false },
      { title: "Eco\nWarrior", icon: "forest", color: "emerald", locked: false },
      { title: "Summit\nMaster", icon: "lock", locked: true },
      { title: "Expedition\nLeader", icon: "lock", locked: true },
    ],
    []
  );

  const prefs = useMemo(
    () => [
      { label: "Dietary Requirements", value: "Vegetarian options preferred", type: "text" },
      { label: "Difficulty Level", value: "3/5", type: "dots" },
      { label: "Accommodation Preference", value: "Tea Houses & Lodges", type: "text" },
      { label: "Group Size", value: "Small groups (4-6 people)", type: "text" },
      { label: "Primary Language", value: "English, Nepali", type: "text" },
    ],
    []
  );

  // [FLOW FEATURE: USER PROFILE LOGOUT]
  // Handles logging out the user by navigating to the logout route
  const handleLogout = () => {
    navigate("/logout", { replace: true });
  };

  const avatar =
    user?.avatar ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBmHPJdPFZVoG51RQlmTFoiyahKr6TsKTxy7GciEAVN2U-FhWNJQyjsWTqck-nX3YHc_N_jXIXEwPFpz95TiJJnEKAvn2dGU0q90VDXZ_2KMP6wHMiTOPZRcGdpWsqcfRXqLU3lQb1O9oKyHgssgoQlI5LMhEUrdc_HNpNKn3CrsNZdOCSHQG76hVhQgX4HUvmWrcKA2AO7Zs4tD7Lwl09aAzXv8E4wf1EXd78v_wMcxg4FZkeRyj5g0TSyAktcD_ICuZvojBQPdKBl";

  return (
    <div className="px-6 md:px-8 py-6 space-y-8 pb-12">
      {/* Top grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <div className="lg:col-span-2 glass p-8 rounded-xl border border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-9xl">landscape</span>
          </div>

          <div className="relative group">
            <div
              className="size-32 rounded-full bg-cover bg-center border-4 border-white/10 shadow-2xl"
              style={{ backgroundImage: `url('${avatar}')` }}
            />
            <button className="absolute bottom-1 right-1 size-8 rounded-full bg-[--color-primary] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 z-0">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h3 className="text-3xl font-bold text-white">
                  {user?.name || "Arjun Sharma"}
                </h3>
                <span className="material-symbols-outlined text-blue-400" title="Verified Explorer">
                  verified
                </span>
              </div>
              <p className="text-slate-400">
                {user?.city ? `${user.city}, Nepal` : "Kathmandu, Nepal"} • Member since{" "}
                {user?.memberSince || "2021"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-4 py-1.5 bg-[--color-primary]/20 border border-[--color-primary]/30 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-[--color-primary] text-sm">
                  diamond
                </span>
                <span className="text-[--color-primary] text-xs font-bold uppercase tracking-wider">
                  Elite Explorer
                </span>
              </div>

              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-300 text-sm">flag</span>
                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                  12 Summits
                </span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                Passionate mountaineer and photographer. Always seeking the next high-altitude adventure in
                the Himalayas. Currently training for Ama Dablam.
              </p>
            </div>

            {/* Logout button inside card */}
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-all"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass p-6 rounded-xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-bold text-white">Achievements</h4>
            <button className="text-xs text-[--color-primary] font-bold uppercase tracking-wider hover:opacity-80">
              View All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {achievements.map((a, idx) => {
              const locked = a.locked;
              const color = a.color;

              const ring =
                color === "amber"
                  ? "from-amber-400/20 to-amber-600/20 border-amber-500/30"
                  : color === "cyan"
                  ? "from-blue-400/20 to-cyan-600/20 border-cyan-500/30"
                  : color === "purple"
                  ? "from-purple-400/20 to-purple-600/20 border-purple-500/30"
                  : "from-emerald-400/20 to-emerald-600/20 border-emerald-500/30";

              const glow =
                color === "amber"
                  ? "bg-amber-500/10"
                  : color === "cyan"
                  ? "bg-cyan-500/10"
                  : color === "purple"
                  ? "bg-purple-500/10"
                  : "bg-emerald-500/10";

              const iconColor =
                color === "amber"
                  ? "text-amber-400"
                  : color === "cyan"
                  ? "text-cyan-400"
                  : color === "purple"
                  ? "text-purple-400"
                  : "text-emerald-400";

              return (
                <div
                  key={`${a.title}-${idx}`}
                  className={`flex flex-col items-center gap-2 group cursor-pointer ${locked ? "opacity-40" : ""}`}
                >
                  {locked ? (
                    <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                      <span className="material-symbols-outlined text-slate-500 text-3xl">
                        {a.icon}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`size-16 rounded-full bg-gradient-to-br ${ring} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                    >
                      <div className={`absolute inset-0 ${glow} blur-xl`} />
                      <span className={`material-symbols-outlined ${iconColor} text-3xl drop-shadow-lg relative`}>
                        {a.icon}
                      </span>
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-slate-400 text-center leading-tight whitespace-pre-line">
                    {a.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preferences */}
        <section className="glass p-8 rounded-xl border border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-2">
            <div className="size-10 rounded-lg bg-[--color-primary]/20 flex items-center justify-center text-[--color-primary]">
              <span className="material-symbols-outlined">tune</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Expedition Preferences</h4>
              <p className="text-xs text-slate-400">Customize your travel experience</p>
            </div>
          </div>

          <div className="space-y-8">
            {prefs.map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white mb-1">{p.label}</p>

                  {p.type === "dots" ? (
                    <div className="flex gap-1 mt-1">
                      <span className="size-2 rounded-full bg-[--color-primary]" />
                      <span className="size-2 rounded-full bg-[--color-primary]" />
                      <span className="size-2 rounded-full bg-[--color-primary]" />
                      <span className="size-2 rounded-full bg-[--color-primary]/30" />
                      <span className="size-2 rounded-full bg-[--color-primary]/30" />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">{p.value}</p>
                  )}
                </div>

                <button className="text-slate-500 hover:text-[--color-primary] transition-colors p-2 hover:bg-white/5 rounded-lg">
                  <span className="material-symbols-outlined">edit_square</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-6 border-t border-white/10">
            <button className="w-full py-3 bg-white/5 text-slate-300 hover:text-white rounded-lg font-bold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">history</span>
              Reset to Default
            </button>
          </div>
        </section>

        {/* Security */}
        <section className="glass p-8 rounded-xl border border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-2">
            <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Account Security</h4>
              <p className="text-xs text-slate-400">Manage your login and privacy</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Email Address</p>
                  <p className="text-xs text-slate-400">{user?.email || "arjun.sharma@example.com"}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">key</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Password</p>
                  <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                </div>
              </div>
              <button className="text-xs text-[--color-primary] font-bold uppercase tracking-wider hover:underline">
                Update
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">smartphone</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Two-Factor Auth</p>
                  <p className="text-xs text-slate-400">Enabled via SMS</p>
                </div>
              </div>

              <button
                onClick={() => setTwoFA((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${twoFA ? "bg-[--color-primary]" : "bg-white/10"}`}
                aria-label="Toggle two-factor auth"
              >
                <span
                  className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-transform ${
                    twoFA ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">devices</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Active Sessions</p>
                  <p className="text-xs text-slate-400">2 devices currently logged in</p>
                </div>
              </div>
              <button className="text-xs text-red-400 font-bold uppercase tracking-wider hover:underline">
                Manage
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
