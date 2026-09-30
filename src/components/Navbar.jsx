import { Link, NavLink } from "react-router-dom";
import {
  UserRound,
  Menu,
  X,
  ChevronDown,
  HeartPulse,
  ArrowRight,
  House,
  Info,
  Mail,
  Sun,
  Moon,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [isSignedIn, setIsSignedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const userRole = user?.role?.toUpperCase();
  const isPatient = userRole === "PATIENT";

  const dashboardPath =
    userRole === "PATIENT"
      ? "/patient/dashboard"
      : userRole === "STAFF"
      ? "/doctor/dashboard"
      : "/admin/dashboard";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const nextTheme = darkMode ? "light" : "dark";

    setDarkMode(!darkMode);
    localStorage.setItem("theme", nextTheme);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm transition ${
      isActive
        ? "text-black dark:text-white font-semibold"
        : "text-black/45 dark:text-white/55 hover:text-black dark:hover:text-white"
    }`;

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      if (refreshToken) {
        await api.post("/accounts/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      setIsSignedIn(false);
      setUser(null);
      setProfileOpen(false);
      setMenuOpen(false);

      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-[#e9f7ee]/95 dark:bg-[#101915]/95 backdrop-blur-xl transition-colors duration-300">
        <div className="w-full px-3 sm:px-5 lg:px-6">
          <div className="h-20 flex items-center justify-between">

            <Link
              to="/"
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-3 group"
            >
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-6 rounded-full bg-[#9ee6bd] group-hover:h-7 transition-all"></div>

                <div className="w-2.5 h-4 rounded-full bg-[#c8f3d9] group-hover:h-5 transition-all"></div>
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-black dark:text-white transition-colors">
                  CareFlow
                </h1>

                <p className="text-[9px] text-black/40 dark:text-white/40 tracking-[0.2em] uppercase transition-colors">
                  Healthcare
                </p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-9">

              <NavLink
                to="/"
                className={navLinkClass}
              >
                <House
                  size={16}
                  strokeWidth={1.8}
                />
                Home
              </NavLink>

              {isSignedIn && (
                <NavLink
                  to={dashboardPath}
                  className={navLinkClass}
                >
                  <LayoutDashboard
                    size={16}
                    strokeWidth={1.8}
                  />
                  My Dashboard
                </NavLink>
              )}

              <NavLink
                to="/about"
                className={navLinkClass}
              >
                <Info
                  size={16}
                  strokeWidth={1.8}
                />
                About
              </NavLink>

              {(!isSignedIn || isPatient) && (
                <NavLink
                  to="/contact"
                  className={navLinkClass}
                >
                  <Mail
                    size={16}
                    strokeWidth={1.8}
                  />
                  Contact
                </NavLink>
              )}

            </div>

            <div className="hidden md:flex items-center gap-5">

              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition"
                aria-label={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun
                    size={18}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Moon
                    size={18}
                    strokeWidth={1.8}
                  />
                )}
              </button>

              {!isSignedIn ? (
                <div className="flex items-center gap-7">

                  <Link
                    to="/login"
                    className="text-sm font-medium text-black/60 dark:text-white/65 hover:text-black dark:hover:text-white transition"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="group flex items-center gap-3 text-sm font-semibold text-black dark:text-white"
                  >
                    Get started

                    <span className="w-9 h-9 rounded-full bg-black dark:bg-[#9ee6bd] text-white dark:text-black flex items-center justify-center group-hover:translate-x-1 transition">
                      <ArrowRight size={16} />
                    </span>
                  </Link>

                </div>
              ) : (
                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen((previous) => !previous)
                    }
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#9ee6bd] flex items-center justify-center group-hover:bg-[#83dca9] transition">
                      <UserRound
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {user?.first_name || user?.username}
                      </p>

                      <p className="text-[11px] text-black/40 dark:text-white/40">
                        {userRole === "PATIENT"
                          ? "Patient"
                          : userRole === "STAFF"
                          ? "Staff"
                          : "Admin"}
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      strokeWidth={1.8}
                      className={`text-black/40 dark:text-white/40 transition-transform ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#18221d] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-black/5 dark:border-white/10 p-2">

                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-black dark:text-white hover:bg-[#e8f5ee] dark:hover:bg-[#223129] transition"
                      >
                        <UserRound
                          size={17}
                          strokeWidth={1.8}
                        />

                        <span className="text-sm font-medium">
                          My Profile
                        </span>
                      </Link>

                      {isPatient && (
                        <Link
                          to="/my-care"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-black dark:text-white hover:bg-[#e8f5ee] dark:hover:bg-[#223129] transition"
                        >
                          <HeartPulse
                            size={17}
                            strokeWidth={1.8}
                          />

                          <span className="text-sm font-medium">
                            My Care
                          </span>
                        </Link>
                      )}

                      <div className="h-px bg-black/5 dark:bg-white/10 my-2"></div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-sm font-medium"
                      >
                        Sign Out
                      </button>

                    </div>
                  )}

                </div>
              )}

            </div>

            <button
              type="button"
              onClick={() =>
                setMenuOpen((previous) => !previous)
              }
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {menuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>

          </div>

          {menuOpen && (
            <div className="md:hidden border-t border-black/5 dark:border-white/10 py-5">

              <div className="flex flex-col">

                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <div className="py-3 flex items-center gap-3">
                    <House
                      size={17}
                      strokeWidth={1.8}
                    />
                    Home
                  </div>
                </NavLink>

                {isSignedIn && (
                  <NavLink
                    to={dashboardPath}
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    <div className="py-3 flex items-center gap-3">
                      <LayoutDashboard
                        size={17}
                        strokeWidth={1.8}
                      />
                      My Dashboard
                    </div>
                  </NavLink>
                )}

                <NavLink
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <div className="py-3 flex items-center gap-3">
                    <Info
                      size={17}
                      strokeWidth={1.8}
                    />
                    About
                  </div>
                </NavLink>

                {(!isSignedIn || isPatient) && (
                  <NavLink
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    <div className="py-3 flex items-center gap-3">
                      <Mail
                        size={17}
                        strokeWidth={1.8}
                      />
                      Contact
                    </div>
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-3 py-3 text-sm text-black/60 dark:text-white/60"
                >
                  {darkMode ? (
                    <Sun
                      size={17}
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Moon
                      size={17}
                      strokeWidth={1.8}
                    />
                  )}

                  {darkMode
                    ? "Light mode"
                    : "Dark mode"}
                </button>

                {isSignedIn ? (
                  <>

                    <NavLink
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className={navLinkClass}
                    >
                      <div className="py-3 flex items-center gap-3">
                        <UserRound
                          size={17}
                          strokeWidth={1.8}
                        />
                        My Profile
                      </div>
                    </NavLink>

                    {isPatient && (
                      <NavLink
                        to="/my-care"
                        onClick={() => setMenuOpen(false)}
                        className={navLinkClass}
                      >
                        <div className="py-3 flex items-center gap-3">
                          <HeartPulse
                            size={17}
                            strokeWidth={1.8}
                          />
                          My Care
                        </div>
                      </NavLink>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-left py-3 text-sm font-medium text-red-600 dark:text-red-400"
                    >
                      Sign Out
                    </button>

                  </>
                ) : (
                  <div className="border-t border-black/5 dark:border-white/10 mt-3 pt-5 flex flex-col gap-4">

                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-semibold text-black dark:text-white"
                    >
                      Sign in
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full py-3.5 bg-black dark:bg-[#9ee6bd] text-white dark:text-black rounded-full text-sm font-semibold"
                    >
                      Get started
                      <ArrowRight size={17} />
                    </Link>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </nav>
    </header>
  );
}

export default Navbar;