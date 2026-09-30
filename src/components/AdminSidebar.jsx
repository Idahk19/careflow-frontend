import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
  Building2,
  BriefcaseMedical,
  Menu,
  X,
} from "lucide-react";

function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                    Administration
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
              Management
            </p>

            <nav className="space-y-1">

              <NavLink
                to="/admin/dashboard"
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
                to="/admin/appointments"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <CalendarDays
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Appointments
                </span>
              </NavLink>

              <NavLink
                to="/admin/doctors"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <Stethoscope
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Doctors
                </span>
              </NavLink>

              <NavLink
                to="/admin/departments"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <Building2
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Departments
                </span>
              </NavLink>

              <NavLink
                to="/admin/services"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <BriefcaseMedical
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Services
                </span>
              </NavLink>

              <NavLink
                to="/admin/patients"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <UserRound
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Patients
                </span>
              </NavLink>

            </nav>

          </div>

        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;