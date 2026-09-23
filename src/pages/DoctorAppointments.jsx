import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
  CircleDot,
  UserCheck,
} from "lucide-react";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(null);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments/doctor/today/");
      setAppointments(
        Array.isArray(response.data) ? response.data : []
      );
      setError("");
    } catch (error) {
      console.error("Doctor appointments API error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access your appointments."
        );
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load today's appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCheckIn = async (appointmentId) => {
    setCheckingIn(appointmentId);
    setError("");

    try {
      await api.post("/queue/check-in/", {
        appointment: appointmentId,
      });

      await fetchAppointments();
    } catch (error) {
      console.error("Check-in error:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          error.response?.data?.appointment ||
          "Could not check in the patient."
      );
    } finally {
      setCheckingIn(null);
    }
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "Today";

    return new Date(`${date}T00:00:00`).toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-blue-50 text-blue-700 border border-blue-100";

      case "CHECKED_IN":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100";

      case "COMPLETED":
        return "bg-[#e8f5ee] text-green-700 border border-[#cdebd9]";

      case "CANCELLED":
        return "bg-red-50 text-red-600 border border-red-100";

      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <DoctorSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">
                My Appointments
              </h1>

              <p className="mt-2 text-black/50">
                View and manage your appointments for today.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAppointments}
              disabled={loading}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-black/5 text-black font-medium hover:bg-[#e8f5ee] transition disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-8 bg-white rounded-2xl border border-black/5 p-8">
              <p className="text-black/50">
                Loading today's appointments...
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#bfe8d0] rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black/60">
                        Today's Appointments
                      </p>

                      <p className="mt-3 text-4xl font-bold text-black">
                        {appointments.length}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center">
                      <CalendarDays size={22} strokeWidth={1.8} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black/50">
                        Date
                      </p>

                      <p className="mt-3 text-xl font-bold text-black">
                        {formatDate(appointments[0]?.date)}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <Clock3 size={22} strokeWidth={1.8} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-black">
                      Today's Schedule
                    </h2>

                    <p className="text-sm text-black/50 mt-1">
                      Your scheduled patients
                    </p>
                  </div>

                  <span className="text-sm text-black/50">
                    {appointments.length} appointment
                    {appointments.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {appointments.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e8f5ee] flex items-center justify-center">
                      <CalendarDays size={26} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-black">
                      No appointments today
                    </h3>

                    <p className="mt-2 text-sm text-black/50">
                      You don't have any appointments scheduled for today.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                    <div className="hidden lg:grid grid-cols-[1.4fr_1.3fr_1fr_1fr_130px] gap-4 px-6 py-4 bg-[#f8fcfa] border-b border-black/5 text-xs font-semibold text-black/40 uppercase tracking-wider">
                      <span>Patient</span>
                      <span>Service</span>
                      <span>Time</span>
                      <span>Status</span>
                      <span>Action</span>
                    </div>

                    <div className="divide-y divide-black/5">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="px-6 py-5 hover:bg-[#fafffc] transition"
                        >
                          <div className="lg:grid lg:grid-cols-[1.4fr_1.3fr_1fr_1fr_130px] lg:gap-4 lg:items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                                <UserRound
                                  size={19}
                                  strokeWidth={1.8}
                                />
                              </div>

                              <div>
                                <p className="font-semibold text-black">
                                  {appointment.patient_name ||
                                    "Unknown Patient"}
                                </p>

                                {appointment.phone && (
                                  <p className="text-xs text-black/40 mt-1">
                                    {appointment.phone}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 lg:mt-0">
                              <p className="lg:hidden text-xs text-black/40 mb-1">
                                Service
                              </p>

                              <div className="flex items-center gap-2 text-sm text-black/70">
                                <Stethoscope
                                  size={16}
                                  strokeWidth={1.8}
                                />
                                <span>
                                  {appointment.service_name || "—"}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 lg:mt-0">
                              <p className="lg:hidden text-xs text-black/40 mb-1">
                                Time
                              </p>

                              <div className="flex items-center gap-2">
                                <Clock3
                                  size={16}
                                  strokeWidth={1.8}
                                  className="text-black/40"
                                />

                                <div>
                                  <p className="text-sm font-semibold text-black">
                                    {formatTime(
                                      appointment.start_time
                                    )}
                                  </p>

                                  <p className="text-xs text-black/40">
                                    to{" "}
                                    {formatTime(
                                      appointment.end_time
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 lg:mt-0">
                              <p className="lg:hidden text-xs text-black/40 mb-1">
                                Status
                              </p>

                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status === "COMPLETED" ? (
                                  <CheckCircle2 size={13} />
                                ) : (
                                  <CircleDot size={13} />
                                )}

                                {formatStatus(appointment.status)}
                              </span>
                            </div>

                            <div className="mt-5 lg:mt-0">
                              {appointment.status === "BOOKED" ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCheckIn(appointment.id)
                                  }
                                  disabled={
                                    checkingIn === appointment.id
                                  }
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#bfe8d0] text-black text-sm font-semibold hover:bg-[#aee0c2] transition disabled:opacity-50"
                                >
                                  <UserCheck size={16} />

                                  {checkingIn === appointment.id
                                    ? "Checking In..."
                                    : "Check In"}
                                </button>
                              ) : appointment.status ===
                                "CHECKED_IN" ? (
                                <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#e8f5ee] text-green-700 text-sm font-semibold">
                                  <CheckCircle2 size={16} />
                                  Checked In
                                </div>
                              ) : (
                                <span className="text-sm text-black/40">
                                  —
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DoctorAppointments;