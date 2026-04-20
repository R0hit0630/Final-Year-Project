import { useNavigate } from "react-router-dom";

export default function AgencyPending() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/logout");
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-extrabold">Agency approval pending</h1>
        <p className="mt-3 text-gray-600">
          Hi <b>{user?.username}</b>, your agency account is waiting for admin verification.
          Once approved, you can access the agency dashboard.
        </p>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-full bg-[#274c77] py-3 text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}