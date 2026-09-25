import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  ListOrdered,
  HeartPulse,
  Bell,
  Menu,
  X,
} from "lucide-react";
import api from "../services/api";

function PatientSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/");

        const notifications = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        const unreadCount = notifications.filter(
          (notification) => !notification.is_read
        ).length;

        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

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
                <div className="w-10 h-10 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                  <HeartPulse
                    size={22}
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-black">
                    CareFlow
                  </h1>

                  <p className="text-[10px] text-black/50 tracking-widest uppercase">
                    Patient Portal
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
              Patient activities
            </p>

            <nav className="space-y-1">
              <NavLink
                to="/patient/dashboard"
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
                to="/patient/appointments"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <CalendarDays
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  My Appointments
                </span>
              </NavLink>

              <NavLink
                to="/patient/notifications"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <Bell
                  size={19}
                  strokeWidth={1.8}
                />

                <span className="flex-1">
                  Notifications
                </span>

                {notificationCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#bfe8d0] text-[#27764d] text-[11px] font-bold flex items-center justify-center">
                    {notificationCount > 9
                      ? "9+"
                      : notificationCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/appointments/book"
                className={navLinkClass}
                onClick={closeSidebar}
              >
                <CalendarPlus
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Book Appointment
                </span>
              </NavLink>

              <NavLink
                to="/my-queue"
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
        </div>
      </aside>
    </>
  );
}

export default PatientSidebar;