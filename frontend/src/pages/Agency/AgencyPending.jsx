import { useNavigate } from "react-router-dom";
import travelinLogo from "../../assets/travolin-logo.png";

export default function AgencyPending() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("comparePackages");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex flex-col items-center justify-center p-6">

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#197fe6] via-[#4ba3ff] to-[#197fe6]" />

        <div className="p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={travelinLogo} alt="Travolin" className="h-8 w-auto" />
          </div>

          {/* Icon & Status */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-amber-500">pending</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-amber-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-amber-500">schedule</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[#2d3b2a] mb-2">Pending Approval</h1>
            <p className="text-[#6b7280] leading-relaxed">
              Hi <span className="font-semibold text-[#2d3b2a]">{user?.username || "there"}</span>,
              your agency account is under review by our admin team.
            </p>
          </div>

          {/* Info boxes */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
              <span className="material-symbols-outlined text-[#197fe6] text-[20px] mt-0.5 shrink-0">info</span>
              <div>
                <p className="text-sm font-semibold text-[#2d3b2a]">Review Timeline</p>
                <p className="text-sm text-[#6b7280] mt-0.5">Approvals typically take <strong>24–48 hours</strong> on business days.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
              <span className="material-symbols-outlined text-emerald-600 text-[20px] mt-0.5 shrink-0">verified_user</span>
              <div>
                <p className="text-sm font-semibold text-[#2d3b2a]">What Happens Next?</p>
                <p className="text-sm text-[#6b7280] mt-0.5">Once approved, you'll get full access to the Agency Dashboard to manage packages, guides, and bookings.</p>
              </div>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#197fe6] flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-white text-[16px]">check</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#197fe6]">Registered</p>
            </div>
            <div className="flex-1 h-0.5 bg-amber-200" />
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[16px]">schedule</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Under Review</p>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200" />
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-gray-300 text-[16px]">rocket_launch</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Active</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl border border-[#e0e8dc] text-sm font-semibold text-[#6b7280] hover:bg-[#f6f7f8] transition"
            >
              Sign Out & Come Back Later
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-[#94a3b8]">
        Need help? Email us at <a href="mailto:support@travolin.com" className="underline hover:text-[#197fe6]">support@travolin.com</a>
      </p>
    </div>
  );
}