import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ListOrdered,
  UserRound,
  Menu,
  X,
} from "lucide-react";

function DoctorSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-[#9ee6bd] text-[#101915] font-semibold"
        : "text-white/65 hover:bg-white/10 hover:text-[#9ee6bd]"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 w-11 h-11 rounded-xl bg-[#101915] border border-white/10 shadow-sm flex items-center justify-center text-[#9ee6bd]"
      >
        <Menu size={22} />
      </button>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#101915] border-r border-white/10 transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">

          <div className="h-20 px-6 border-b border-white/10 flex items-center">

            <div className="flex items-center justify-between w-full">

              <div className="flex items-center gap-3">

                <div className="flex items-center gap-1">

                  <div className="w-2.5 h-6 rounded-full bg-[#9ee6bd]"></div>

                  <div className="w-2.5 h-4 rounded-full bg-[#c8f3d9]"></div>

                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    CareFlow
                  </h1>

                  <p className="text-[10px] text-white/40 tracking-widest uppercase">
                    Doctor Portal
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeSidebar}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-[#9ee6bd] transition"
              >
                <X size={20} />
              </button>

            </div>

          </div>

          <div className="px-4 py-6 flex-1 overflow-y-auto">

            <p className="px-4 mb-3 text-xs font-semibold text-white/35 uppercase tracking-[0.18em]">
              Doctor activities
            </p>

            <nav className="space-y-1">

              <NavLink
                to="/doctor/dashboard"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <LayoutDashboard
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Dashboard
                </span>
              </NavLink>

              <NavLink
                to="/doctor/allappointments"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <CalendarDays
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  All Appointments
                </span>
              </NavLink>

              <NavLink
                to="/doctor/appointments"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <CalendarDays
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Today's Appointments
                </span>
              </NavLink>

              <NavLink
                to="/doctor/feedback"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <CalendarDays
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Feedback
                </span>
              </NavLink>

              <NavLink
                to="/doctor/queue"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <ListOrdered
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  My Queue
                </span>
              </NavLink>

            </nav>

          </div>

          <div className="p-4 border-t border-white/10">

            <NavLink
              to="/profile"
              onClick={closeSidebar}
              className="block"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3 hover:bg-white/10 transition">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#9ee6bd] flex items-center justify-center text-[#101915]">
                    <UserRound
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-white truncate">
                      {user?.first_name
                        ? `Dr. ${user.first_name}`
                        : user?.username}
                    </p>

                    <p className="text-xs text-white/40">
                      My Profile
                    </p>

                  </div>

                </div>

              </div>
            </NavLink>

          </div>

        </div>
      </aside>
    </>
  );
}

export default DoctorSidebar;