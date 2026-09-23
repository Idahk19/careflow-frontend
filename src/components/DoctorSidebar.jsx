import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  UserCheck,
  ListOrdered,
  CircleCheck,
  UserRound,
  LogOut,
  Menu,
  X,
  History,
} from "lucide-react";
import api from "../services/api";

function DoctorSidebar() {
  const navigate = useNavigate();

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
        ? "bg-[#bfe8d0] text-black font-semibold"
        : "text-black/60 hover:bg-[#e8f5ee] hover:text-black"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 w-11 h-11 rounded-xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-black"
      >
        <Menu size={22} />
      </button>

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-black/5 transform transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">

          <div className="h-20 px-6 border-b border-black/5 flex items-center">

            <div className="flex items-center justify-between w-full">

              <div className="flex items-center gap-3">

                <div>
                  <h1 className="text-xl font-bold text-black">
                    CareFlow
                  </h1>

                  <p className="text-[10px] text-black/50 tracking-widest uppercase">
                    Doctor Portal
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={closeSidebar}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-black/60 hover:bg-black/5 hover:text-black transition"
              >
                <X size={20} />
              </button>

            </div>

          </div>

          <div className="px-4 py-6 flex-1 overflow-y-auto">

            <p className="px-4 mb-3 text-xs font-semibold text-black/40 uppercase tracking-wider">
              Doctors activities
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

          <NavLink
  to="/doctor/history"
  className={navLinkClass}
  onClick={closeSidebar}
>
  <History
    size={19}
    strokeWidth={1.8}
  />

  <span>History</span>
</NavLink>

            </nav>

          </div>

          <div className="p-4 border-t border-black/5">

            <NavLink
              to="/profile"
              onClick={closeSidebar}
              className="block"
            >
              <div className="bg-[#e8f5ee] rounded-2xl p-4 mb-3 hover:bg-[#dff1e7] transition">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#bfe8d0] flex items-center justify-center">
                    <UserRound
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-black truncate">
                      {user?.first_name
                        ? `Dr. ${user.first_name}`
                        : user?.username}
                    </p>

                    <p className="text-xs text-black/50">
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