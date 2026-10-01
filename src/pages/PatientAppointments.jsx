import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Filter,
  Search,
  Stethoscope,
  UserRound,
  X,
  Trash2,
  Ban,
  RotateCcw,
  MessageSquareText,
  Check,
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

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [rescheduleSaving, setRescheduleSaving] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

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

  const handleCancel = async (appointmentId) => {
    try {
      setError("");

      await api.patch(
        `/appointments/${appointmentId}/cancel/`,
        {
          status: "CANCELLED",
        }
      );

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Failed to cancel appointment:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.status?.[0] ||
          error.response?.data?.slot?.[0] ||
          "Failed to cancel appointment."
      );
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      setError("");

      await api.delete(
        `/appointments/${appointmentId}/delete/`
      );

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Failed to delete appointment:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to delete appointment."
      );
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return tomorrow
      .toISOString()
      .split("T")[0];
  };

  const getTodayDate = () => {
    return new Date()
      .toISOString()
      .split("T")[0];
  };

  const openRescheduleModal = (appointment) => {
    const today = getTodayDate();

    const appointmentDate =
      appointment.appointment_date;

    const initialDate =
      appointment.status === "MISSED" ||
      !appointmentDate ||
      appointmentDate < today
        ? getTomorrowDate()
        : appointmentDate;

    setRescheduleAppointment(appointment);
    setRescheduleDate(initialDate);
    setSelectedSlot("");
    setAvailableSlots([]);
    setRescheduleError("");
    setShowRescheduleModal(true);

    loadAvailableSlots(
      appointment,
      initialDate
    );
  };

  const closeRescheduleModal = () => {
    if (rescheduleSaving) {
      return;
    }

    setShowRescheduleModal(false);
    setRescheduleAppointment(null);
    setRescheduleDate("");
    setSelectedSlot("");
    setAvailableSlots([]);
    setRescheduleError("");
  };

  const loadAvailableSlots = async (
    appointment,
    date
  ) => {
    if (
      !appointment?.doctor ||
      !appointment?.service ||
      !date
    ) {
      setAvailableSlots([]);

      setRescheduleError(
        "Unable to load time slots because the doctor or service information is missing."
      );

      return;
    }

    try {
      setSlotsLoading(true);
      setRescheduleError("");
      setSelectedSlot("");

      const response = await api.get(
        "/appointments/slots/",
        {
          params: {
            doctor: appointment.doctor,
            service: appointment.service,
            date,
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setAvailableSlots(data);

      if (data.length === 0) {
        setRescheduleError(
          "There are no available time slots for this date."
        );
      }
    } catch (error) {
      console.error(
        "Failed to load available time slots:",
        error.response?.data || error
      );

      setAvailableSlots([]);

      setRescheduleError(
        error.response?.data?.date?.[0] ||
          error.response?.data?.doctor?.[0] ||
          error.response?.data?.service?.[0] ||
          error.response?.data?.error ||
          "Failed to load available time slots."
      );
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleRescheduleDateChange = (event) => {
    const date = event.target.value;

    setRescheduleDate(date);

    if (rescheduleAppointment) {
      loadAvailableSlots(
        rescheduleAppointment,
        date
      );
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedSlot) {
      setRescheduleError(
        "Please select a time slot."
      );

      return;
    }

    try {
      setRescheduleSaving(true);
      setRescheduleError("");

      const payload = {
        slot: Number(selectedSlot),
      };

      if (
        rescheduleAppointment.status ===
        "MISSED"
      ) {
        payload.status = "BOOKED";
      }

      await api.patch(
        `/appointments/${rescheduleAppointment.id}/update/`,
        payload
      );

      setShowRescheduleModal(false);
      setRescheduleAppointment(null);
      setRescheduleDate("");
      setSelectedSlot("");
      setAvailableSlots([]);

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Failed to reschedule appointment:",
        error.response?.data || error
      );

      setRescheduleError(
        error.response?.data?.detail ||
          error.response?.data?.slot?.[0] ||
          error.response?.data?.status?.[0] ||
          "Failed to reschedule appointment."
      );
    } finally {
      setRescheduleSaving(false);
    }
  };

  const handleViewFeedback = () => {
    navigate("/patient/my-feedback");
  };

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0
    );

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeRange = (appointment) => {
    if (
      !appointment.start_time ||
      !appointment.end_time
    ) {
      return "—";
    }

    return `${formatTime(
      appointment.start_time
    )} - ${formatTime(
      appointment.end_time
    )}`;
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
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

      case "MISSED":
        return "bg-[#fff4e5] text-[#9a641f]";

      default:
        return "bg-[#f1f5f3] text-black/60";
    }
  };

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const upcomingAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => {
        if (
          appointment.status === "CANCELLED" ||
          appointment.status === "COMPLETED" ||
          appointment.status === "MISSED"
        ) {
          return false;
        }

        if (!appointment.appointment_date) {
          return false;
        }

        const appointmentDate =
          new Date(
            `${appointment.appointment_date}T00:00:00`
          );

        return appointmentDate >= today;
      }
    );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => {
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

        const appointmentDate =
          new Date(
            `${appointment.appointment_date}T00:00:00`
          );

        return (
          appointmentDate < today ||
          appointment.status === "MISSED"
        );
      }
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

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
          appointment.appointment_date ===
            dateFilter;

        const matchesStatus =
          !statusFilter ||
          appointment.status ===
            statusFilter;

        let matchesView = true;

        if (viewFilter === "upcoming") {
          matchesView =
            upcomingAppointments.some(
              (item) =>
                item.id === appointment.id
            );
        }

        if (viewFilter === "past") {
          matchesView =
            pastAppointments.some(
              (item) =>
                item.id === appointment.id
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
          `${a.appointment_date}T${
            a.start_time || "00:00"
          }`
        );

        const dateB = new Date(
          `${b.appointment_date}T${
            b.start_time || "00:00"
          }`
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

  const totalAppointments =
    appointments.length;

  const checkedInCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "CHECKED_IN"
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "CANCELLED"
    ).length;

  const missedCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "MISSED"
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

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-4">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-black/40">
                Total
              </p>

              <p className="text-2xl font-bold mt-2">
                {totalAppointments}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-black/40">
                Upcoming
              </p>

              <p className="text-2xl font-bold mt-2">
                {upcomingAppointments.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-black/40">
                Checked In
              </p>

              <p className="text-2xl font-bold mt-2">
                {checkedInCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-black/40">
                Completed
              </p>

              <p className="text-2xl font-bold mt-2">
                {completedCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-black/40">
                Missed
              </p>

              <p className="text-2xl font-bold mt-2">
                {missedCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-black/40">
                Cancelled
              </p>

              <p className="text-2xl font-bold mt-2">
                {cancelledCount}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-3">

              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search doctor or service..."
                  className="w-full h-11 rounded-xl border border-black/10 bg-[#f8faf9] pl-11 pr-4 text-sm outline-none focus:border-[#9ee6bd]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter
                  size={17}
                  className="text-black/40"
                />

                <select
                  value={viewFilter}
                  onChange={(event) =>
                    setViewFilter(event.target.value)
                  }
                  className="h-11 rounded-xl border border-black/10 bg-[#f8faf9] px-3 text-sm outline-none focus:border-[#9ee6bd]"
                >
                  <option value="all">
                    All Appointments
                  </option>

                  <option value="upcoming">
                    Upcoming
                  </option>

                  <option value="past">
                    Past
                  </option>
                </select>
              </div>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(event.target.value)
                }
                className="h-11 rounded-xl border border-black/10 bg-[#f8faf9] px-3 text-sm outline-none focus:border-[#9ee6bd]"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 rounded-xl border border-black/10 bg-[#f8faf9] px-3 text-sm outline-none focus:border-[#9ee6bd]"
              >
                <option value="">
                  All Statuses
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

                <option value="MISSED">
                  Missed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-11 px-4 rounded-xl bg-[#101915] text-white text-sm font-medium hover:bg-black transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-sm text-black/45">
                Loading your appointments...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarDays
                  size={36}
                  className="mx-auto text-black/20"
                  strokeWidth={1.5}
                />

                <h3 className="mt-4 font-semibold text-black">
                  No appointments found
                </h3>

                <p className="text-sm text-black/45 mt-1">
                  Try changing your filters or book a new appointment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-black/5 text-left">
                      <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] text-black/40 font-medium">
                        Doctor
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] text-black/40 font-medium">
                        Service
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] text-black/40 font-medium">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] text-black/40 font-medium">
                        Time
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] text-black/40 font-medium">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs uppercase tracking-[0.12em] text-black/40 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-black/5 last:border-b-0"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                                <UserRound
                                  size={18}
                                  className="text-[#27764d]"
                                />
                              </div>

                              <span className="font-medium text-black">
                                {appointment.doctor_name ||
                                  "Doctor"}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-black/65">
                              <Stethoscope
                                size={16}
                                className="text-black/35"
                              />

                              {appointment.service_name ||
                                "Service"}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-black/65">
                              <CalendarDays
                                size={16}
                                className="text-black/35"
                              />

                              {formatDate(
                                appointment.appointment_date
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm text-black/65">
                              <Clock3
                                size={16}
                                className="text-black/35"
                              />

                              {getTimeRange(
                                appointment
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                appointment.status
                              )}`}
                            >
                              {formatStatus(
                                appointment.status
                              )}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 flex-wrap">

                              {appointment.status ===
                                "COMPLETED" && (
                                <button
                                  type="button"
                                  onClick={
                                    handleViewFeedback
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl bg-[#e8f5ee] px-3 py-2 text-xs font-medium text-[#27764d] hover:bg-[#bfe8d0] transition"
                                >
                                  <MessageSquareText
                                    size={15}
                                  />

                                  View Feedback
                                </button>
                              )}

                              {(
                                appointment.status ===
                                  "BOOKED" ||
                                appointment.status ===
                                  "MISSED"
                              ) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openRescheduleModal(
                                      appointment
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl bg-[#101915] px-3 py-2 text-xs font-medium text-white hover:bg-black transition"
                                >
                                  <RotateCcw
                                    size={15}
                                  />

                                  Reschedule
                                </button>
                              )}

                              {appointment.status ===
                                "BOOKED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCancel(
                                      appointment.id
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-medium text-black/65 hover:bg-[#f8eeee] hover:text-[#9a4b4b] transition"
                                >
                                  <Ban
                                    size={15}
                                  />

                                  Cancel
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    appointment.id
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-medium text-black/65 hover:bg-[#f8eeee] hover:text-[#9a4b4b] transition"
                              >
                                <Trash2
                                  size={15}
                                />

                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {showRescheduleModal &&
        rescheduleAppointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">

              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Reschedule Appointment
                  </h2>

                  <p className="text-sm text-black/45 mt-1">
                    Choose a new date and available time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeRescheduleModal
                  }
                  disabled={rescheduleSaving}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-black/45 hover:bg-black/5 hover:text-black transition disabled:opacity-40"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">

                <div className="rounded-2xl bg-[#f5faf7] border border-[#e8f5ee] p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#bfe8d0] flex items-center justify-center shrink-0">
                      <Stethoscope
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-black">
                        {rescheduleAppointment.doctor_name}
                      </p>

                      <p className="text-sm text-black/50 mt-1">
                        {rescheduleAppointment.service_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    New Date
                  </label>

                  <input
                    type="date"
                    value={rescheduleDate}
                    min={getTodayDate()}
                    onChange={
                      handleRescheduleDateChange
                    }
                    disabled={rescheduleSaving}
                    className="w-full h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#9ee6bd]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Available Time
                  </label>

                  {slotsLoading ? (
                    <div className="h-12 rounded-xl bg-[#f8faf9] border border-black/5 flex items-center px-4 text-sm text-black/45">
                      Loading available time slots...
                    </div>
                  ) : (
                    <select
                      value={selectedSlot}
                      onChange={(event) =>
                        setSelectedSlot(
                          event.target.value
                        )
                      }
                      disabled={
                        rescheduleSaving ||
                        availableSlots.length === 0
                      }
                      className="w-full h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#9ee6bd] disabled:bg-[#f8faf9] disabled:text-black/40"
                    >
                      <option value="">
                        Select an available time
                      </option>

                      {availableSlots.map(
                        (slot) => (
                          <option
                            key={slot.id}
                            value={slot.id}
                          >
                            {slot.label ||
                              `${formatTime(
                                slot.start_time
                              )} - ${formatTime(
                                slot.end_time
                              )}`}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>

                {rescheduleError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {rescheduleError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={
                      closeRescheduleModal
                    }
                    disabled={rescheduleSaving}
                    className="h-11 px-5 rounded-xl border border-black/10 text-sm font-medium text-black/65 hover:bg-black/5 transition disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleRescheduleSubmit
                    }
                    disabled={
                      rescheduleSaving ||
                      slotsLoading ||
                      !selectedSlot
                    }
                    className="h-11 px-5 rounded-xl bg-[#101915] text-white text-sm font-medium hover:bg-black transition disabled:opacity-40 inline-flex items-center gap-2"
                  >
                    <Check size={16} />

                    {rescheduleSaving
                      ? "Rescheduling..."
                      : "Confirm Reschedule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default PatientAppointments;        