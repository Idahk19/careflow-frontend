import { Link, NavLink } from "react-router-dom";
import {
  CalendarDays,
  HeartPulse,
  UserRound,
  LogIn,
  Menu,
  X,
  ChevronDown,
  Info,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const isSignedIn = !!localStorage.getItem("access_token");

  const userRole = user?.role?.toUpperCase();

  const isAdminOrDoctor =
    userRole === "ADMIN" ||
    userRole === "DOCTOR";

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-black font-semibold"
        : "text-black/60 hover:text-black"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white/75 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(false);
              }}
            >
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
                  Healthcare
                </p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">

              <NavLink
                to="/"
                className={navLinkClass}
              >
                Home
              </NavLink>

              {isAdminOrDoctor ? (
                <NavLink
                  to="/about"
                  className={navLinkClass}
                >
                  <span className="flex items-center gap-2">
                    <Info
                      size={17}
                      strokeWidth={1.8}
                    />
                    About
                  </span>
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/appointments"
                    className={navLinkClass}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays
                        size={17}
                        strokeWidth={1.8}
                      />
                      My Appointments
                    </span>
                  </NavLink>

                  <NavLink
                    to="/appointments/book"
                    className={navLinkClass}
                  >
                    Book Appointment
                  </NavLink>

                  {isSignedIn && (
                    <NavLink
                      to="/my-care"
                      className={navLinkClass}
                    >
                      <span className="flex items-center gap-2">
                        <HeartPulse
                          size={17}
                          strokeWidth={1.8}
                        />
                        My Care
                      </span>
                    </NavLink>
                  )}
                </>
              )}

            </div>

            <div className="hidden md:flex items-center gap-3">

              {!isSignedIn ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#e8f5ee] rounded-xl transition"
                  >
                    <LogIn
                      size={18}
                      strokeWidth={1.8}
                    />
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                  >
                    <UserRound
                      size={18}
                      strokeWidth={1.8}
                    />
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(
                        (previous) => !previous
                      )
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#e8f5ee] transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#bfe8d0] flex items-center justify-center">
                      <UserRound
                        size={19}
                        strokeWidth={1.8}
                        className="text-black"
                      />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-black">
                        {user?.first_name ||
                          user?.username}
                      </p>

                      <p className="text-xs text-black/50">
                        {user?.role === "PATIENT"
                          ? "Patient"
                          : user?.role === "DOCTOR"
                          ? "Doctor"
                          : user?.role === "STAFF"
                          ? "Staff"
                          : "Admin"}
                      </p>
                    </div>

                    <ChevronDown
                      size={16}
                      strokeWidth={1.8}
                      className={`transition-transform ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-black/5 p-2">

                      <Link
                        to="/profile"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5ee] transition"
                      >
                        <UserRound
                          size={18}
                          strokeWidth={1.8}
                        />

                        <span className="text-sm font-medium">
                          My Profile
                        </span>
                      </Link>

                      {!isAdminOrDoctor && (
                        <Link
                          to="/my-care"
                          onClick={() =>
                            setProfileOpen(false)
                          }
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5ee] transition"
                        >
                          <HeartPulse
                            size={18}
                            strokeWidth={1.8}
                          />

                          <span className="text-sm font-medium">
                            My Care
                          </span>
                        </Link>
                      )}

                      <div className="border-t border-black/5 my-2"></div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition text-sm font-medium"
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
                setMenuOpen(
                  (previous) => !previous
                )
              }
              className="md:hidden p-2 text-black hover:bg-[#e8f5ee] rounded-xl transition"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {menuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>

          {menuOpen && (
            <div className="md:hidden border-t border-black/5 py-5">

              <div className="flex flex-col gap-2">

                <NavLink
                  to="/"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={navLinkClass}
                >
                  <div className="px-4 py-3 rounded-xl hover:bg-[#e8f5ee]">
                    Home
                  </div>
                </NavLink>

                {isAdminOrDoctor ? (
                  <NavLink
                    to="/about"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className={navLinkClass}
                  >
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5ee]">
                      <Info
                        size={18}
                        strokeWidth={1.8}
                      />
                      About
                    </div>
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/appointments"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className={navLinkClass}
                    >
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5ee]">
                        <CalendarDays
                          size={18}
                          strokeWidth={1.8}
                        />
                        My Appointments
                      </div>
                    </NavLink>

                    <NavLink
                      to="/appointments/book"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className={navLinkClass}
                    >
                      <div className="px-4 py-3 rounded-xl hover:bg-[#e8f5ee]">
                        Book Appointment
                      </div>
                    </NavLink>

                    {isSignedIn && (
                      <NavLink
                        to="/my-care"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className={navLinkClass}
                      >
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5ee]">
                          <HeartPulse
                            size={18}
                            strokeWidth={1.8}
                          />
                          My Care
                        </div>
                      </NavLink>
                    )}
                  </>
                )}

                {isSignedIn && (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className={navLinkClass}
                    >
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5ee]">
                        <UserRound
                          size={18}
                          strokeWidth={1.8}
                        />
                        My Profile
                      </div>
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                )}

                {!isSignedIn && (
                  <div className="border-t border-black/5 mt-3 pt-4 flex flex-col gap-2">

                    <Link
                      to="/login"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="px-4 py-3 text-center font-semibold text-black rounded-xl hover:bg-[#e8f5ee] transition"
                    >
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="px-4 py-3 text-center bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                      Get Started
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