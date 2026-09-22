import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UsersRound,
  UserRound,
  LogOut,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-[#bfe8d0] text-black font-semibold"
        : "text-black/60 hover:bg-[#e8f5ee] hover:text-black"
    }`;

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-black/5">

      <div className="h-full flex flex-col">

        <div className="px-6 py-6 border-b border-black/5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
              <span className="text-black font-bold text-lg">
                C
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-black">
                CareFlow
              </h1>

              <p className="text-[10px] text-black/50 tracking-widest uppercase">
                Administration
              </p>
            </div>

          </div>

        </div>

        <div className="px-4 py-6 flex-1">

          <p className="px-4 mb-3 text-xs font-semibold text-black/40 uppercase tracking-wider">
            Management
          </p>

          <nav className="space-y-1">

            <NavLink
              to="/admin/dashboard"
              className={navLinkClass}
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
              to="/admin/staff"
              className={navLinkClass}
            >
              <Stethoscope
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Staff
              </span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={navLinkClass}
            >
              <UsersRound
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Users
              </span>
            </NavLink>

            <NavLink
              to="/admin/patients"
              className={navLinkClass}
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

        <div className="p-4 border-t border-black/5">

          <div className="bg-[#e8f5ee] rounded-2xl p-4 mb-3">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-[#bfe8d0] flex items-center justify-center">
                <UserRound
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-black truncate">
                  {user?.first_name || user?.username}
                </p>

                <p className="text-xs text-black/50">
                  Administrator
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut
              size={19}
              strokeWidth={1.8}
            />

            <span className="font-medium">
              Sign Out
            </span>
          </button>

        </div>

      </div>

    </aside>
  );
}

export default AdminSidebar;