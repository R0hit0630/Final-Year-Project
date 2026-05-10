import { Outlet } from "react-router-dom";
import AgencySidebar from "./AgencySidebar";

export default function AgencyLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fcfbf8]">
      <AgencySidebar />
      <main className="flex flex-1 flex-col overflow-y-auto bg-[#f6f7f8]">
        <Outlet />
      </main>
    </div>
  );
}
