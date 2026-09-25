import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Filter,
  History,
  Search,
  Stethoscope,
  UserRound,
  X,
  ArrowRight,
} from "lucide-react";
import PatientSidebar from "../components/PatientSidebar";
import api from "../services/api";

function PatientAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewFilter, setViewFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view these appointments.");
      } else {
        setError("Failed to load your appointments.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeRange = (appointment) => {
    if (!appointment.start_time || !appointment.end_time) {
      return "—";
    }

    return `${formatTime(appointment.start_time)} - ${formatTime(
      appointment.end_time
    )}`;
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-[#e8f5ee] text-[#27764d]";

      case "CHECKED_IN":
        return "bg-[#bfe8d0] text-[#1f6040]";

      case "COMPLETED":
        return "bg-[#f1f5f3] text-[#4b5f54]";

      case "CANCELLED":
        return "bg-[#f8eeee] text-[#9a4b4b]";

      default:
        return "bg-[#f1f5f3] text-black/60";
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (
        appointment.status === "CANCELLED" ||
        appointment.status === "COMPLETED"
      ) {
        return false;
      }

      if (!appointment.appointment_date) {
        return false;
      }

      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`
      );

      return appointmentDate >= today;
    });
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (
        appointment.status === "COMPLETED" ||
        appointment.status === "CHECKED_IN" ||
        appointment.status === "CANCELLED"
      ) {
        return false;
      }

      if (!appointment.appointment_date) {
        return false;
      }

      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`
      );

      return appointmentDate < today;
    });
  }, [appointments]);

  const services = useMemo(() => {
    return [
      ...new Set(
        appointments
          .map((appointment) => appointment.service_name)
          .filter(Boolean)
      ),
    ].sort();
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return appointments
      .filter((appointment) => {
        const matchesSearch =
          !searchValue ||
          appointment.doctor_name
            ?.toLowerCase()
            .includes(searchValue) ||
          appointment.service_name
            ?.toLowerCase()
            .includes(searchValue);

        const matchesDate =
          !dateFilter ||
          appointment.appointment_date === dateFilter;

        const matchesStatus =
          !statusFilter ||
          appointment.status === statusFilter;

        let matchesView = true;

        if (viewFilter === "upcoming") {
          matchesView = upcomingAppointments.some(
            (item) => item.id === appointment.id
          );
        }

        if (viewFilter === "past") {
          matchesView = pastAppointments.some(
            (item) => item.id === appointment.id
          );
        }

        return (
          matchesSearch &&
          matchesDate &&
          matchesStatus &&
          matchesView
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.appointment_date}T${a.start_time || "00:00"}`
        );

        const dateB = new Date(
          `${b.appointment_date}T${b.start_time || "00:00"}`
        );

        return dateB - dateA;
      });
  }, [
    appointments,
    search,
    dateFilter,
    statusFilter,
    viewFilter,
    upcomingAppointments,
    pastAppointments,
  ]);

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
    setStatusFilter("");
    setViewFilter("all");
  };

  const hasFilters =
    search ||
    dateFilter ||
    statusFilter ||
    viewFilter !== "all";

  const totalAppointments = appointments.length;

  const bookedCount = appointments.filter(
    (appointment) => appointment.status === "BOOKED"
  ).length;

  const checkedInCount = appointments.filter(
    (appointment) => appointment.status === "CHECKED_IN"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <PatientSidebar />

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                <CalendarDays
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  My Appointments
                </h1>

                <p className="text-sm text-black/50 mt-1">
                  View and manage your appointments
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Total
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {totalAppointments}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Upcoming
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {upcomingAppointments.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Checked In
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {checkedInCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Completed
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {completedCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Cancelled
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {cancelledCount}
              </p>
            </div>

          </div>

          <div className="bg-white rounded-2xl border border-black/5 p-5 mb-6">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2">
                <Filter
                  size={18}
                  className="text-black/50"
                />

                <h2 className="font-semibold text-black">
                  Filter Appointments
                </h2>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Doctor or Service
                </label>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search appointments"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                  />

                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                >
                  <option value="">
                    All statuses
                  </option>

                  <option value="BOOKED">
                    Booked
                  </option>

                  <option value="CHECKED_IN">
                    Checked In
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  View
                </label>

                <select
                  value={viewFilter}
                  onChange={(e) => setViewFilter(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                >
                  <option value="all">
                    All appointments
                  </option>

                  <option value="upcoming">
                    Upcoming
                  </option>

                  <option value="past">
                    Past
                  </option>
                </select>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-black/5">
              <h2 className="font-semibold text-black">
                Appointments
              </h2>

              <p className="text-sm text-black/50 mt-1">
                Showing {filteredAppointments.length} of{" "}
                {appointments.length} appointments
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-[#bfe8d0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

                <p className="text-sm text-black/50">
                  Loading your appointments...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-sm text-red-600 mb-4">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchAppointments}
                  className="px-5 py-2.5 rounded-xl bg-[#bfe8d0] text-black text-sm font-medium hover:bg-[#aee0c2] transition"
                >
                  Try Again
                </button>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-12 text-center">

                <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
                  {hasFilters ? (
                    <Search
                      size={25}
                      className="text-[#27764d]"
                      strokeWidth={1.7}
                    />
                  ) : (
                    <CalendarDays
                      size={25}
                      className="text-[#27764d]"
                      strokeWidth={1.7}
                    />
                  )}
                </div>

                <h3 className="font-semibold text-black">
                  No appointments found
                </h3>

                <p className="text-sm text-black/50 mt-1">
                  {hasFilters
                    ? "Try changing or clearing your filters."
                    : "You don't have any appointments yet."}
                </p>

                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-medium text-[#27764d] hover:underline"
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/appointments/book")}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-[#bfe8d0] text-black text-sm font-medium hover:bg-[#aee0c2] transition"
                  >
                    Book Appointment
                  </button>
                )}

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-black/5">

                      <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Doctor
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Service
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Date
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Time
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Status
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b border-black/5 last:border-b-0 hover:bg-[#f8faf9] transition"
                      >

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center flex-shrink-0">
                              <UserRound
                                size={18}
                                className="text-[#27764d]"
                              />
                            </div>

                            <div>
                              <p className="font-medium text-black">
                                {appointment.doctor_name ||
                                  "Doctor"}
                              </p>

                              <p className="text-sm text-black/45 mt-1">
                                CareFlow appointment
                              </p>
                            </div>

                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">

                            <Stethoscope
                              size={16}
                              className="text-black/40"
                            />

                            <span className="text-sm text-black/70">
                              {appointment.service_name || "—"}
                            </span>

                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-black/70">
                            <Clock3
                              size={16}
                              className="text-black/40"
                            />

                            {getTimeRange(appointment)}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {formatStatus(appointment.status)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/appointments/${appointment.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#eef7f1] text-[#27764d] text-sm font-medium hover:bg-[#dff3e6] transition"
                          >
                            View
                            <ArrowRight size={15} />
                          </button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientAppointments;