import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Filter,
  History,
  Search,
  Stethoscope,
  X,
} from "lucide-react";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/doctor/today/");

      setAppointments(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (error) {
      console.error("Failed to fetch appointments:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view these appointments.");
      } else {
        setError("Failed to load appointments.");
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

  const services = useMemo(() => {
    return [
      ...new Set(
        appointments
          .map((appointment) => appointment.service_name)
          .filter(Boolean)
      ),
    ].sort();
  }, [appointments]);

  const times = useMemo(() => {
    return [
      ...new Set(
        appointments
          .filter(
            (appointment) =>
              appointment.start_time && appointment.end_time
          )
          .map(
            (appointment) =>
              `${appointment.start_time}-${appointment.end_time}`
          )
      ),
    ].sort();
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        appointment.patient_name
          ?.toLowerCase()
          .includes(searchValue) ||
        appointment.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesDate =
        !dateFilter || appointment.date === dateFilter;

      const matchesService =
        !serviceFilter ||
        appointment.service_name === serviceFilter;

      const appointmentTime =
        appointment.start_time && appointment.end_time
          ? `${appointment.start_time}-${appointment.end_time}`
          : "";

      const matchesTime =
        !timeFilter || appointmentTime === timeFilter;

      const matchesStatus =
        !statusFilter ||
        appointment.status === statusFilter;

      return (
        matchesSearch &&
        matchesDate &&
        matchesService &&
        matchesTime &&
        matchesStatus
      );
    });
  }, [
    appointments,
    search,
    dateFilter,
    serviceFilter,
    timeFilter,
    statusFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
    setServiceFilter("");
    setTimeFilter("");
    setStatusFilter("");
  };

  const hasFilters =
    search ||
    dateFilter ||
    serviceFilter ||
    timeFilter ||
    statusFilter;

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
      <DoctorSidebar />

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                <History size={22} strokeWidth={1.8} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  All Appointments
                </h1>

                <p className="text-sm text-black/50 mt-1">
                  View and manage all appointments assigned to you
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
                Booked
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {bookedCount}
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
                <Filter size={18} className="text-black/50" />

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Patient
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
                    placeholder="Name or email"
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
                  Service
                </label>

                <div className="relative">
                  <Stethoscope
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                  />

                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-black/10 bg-white text-sm outline-none appearance-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                  >
                    <option value="">
                      All services
                    </option>

                    {services.map((service) => (
                      <option
                        key={service}
                        value={service}
                      >
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Time
                </label>

                <div className="relative">
                  <Clock3
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                  />

                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-black/10 bg-white text-sm outline-none appearance-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                  >
                    <option value="">
                      All times
                    </option>

                    {times.map((time) => {
                      const [start, end] = time.split("-");

                      return (
                        <option
                          key={time}
                          value={time}
                        >
                          {formatTime(start)} - {formatTime(end)}
                        </option>
                      );
                    })}
                  </select>
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
                  Loading appointments...
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
                  <History
                    size={25}
                    className="text-[#27764d]"
                    strokeWidth={1.7}
                  />
                </div>

                <h3 className="font-semibold text-black">
                  No appointments found
                </h3>

                <p className="text-sm text-black/50 mt-1">
                  {hasFilters
                    ? "Try changing or clearing your filters."
                    : "There are no appointments assigned to you."}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-medium text-[#27764d] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-black/5">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase tracking-wide">
                        Patient
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
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b border-black/5 last:border-b-0 hover:bg-[#f8faf9] transition"
                      >
                        <td className="px-6 py-5">
                          <p className="font-medium text-black">
                            {appointment.patient_name ||
                              "Unknown patient"}
                          </p>

                          <p className="text-sm text-black/45 mt-1">
                            {appointment.email || "No email"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          {appointment.service_name || "—"}
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          {formatDate(appointment.date)}
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          {getTimeRange(appointment)}
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

export default DoctorAllAppointments;