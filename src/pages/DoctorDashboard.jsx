import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  SkipForward,
  Activity,
  ArrowUpRight,
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  RefreshCw,
  HeartPulse,
  TrendingUp,
  CircleAlert,
  UserRound,
  Stethoscope,
  ListOrdered,
} from "lucide-react";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const formattedDate = today.toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        const response = await api.get(
          "/appointments/doctor/dashboard/"
        );

        if (active) {
          setDashboardData(response.data);
          setError("");
        }
      } catch (error) {
        if (!active) return;

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            (error.response?.status === 403
              ? "You do not have permission to access the doctor dashboard."
              : "Could not load the doctor dashboard.")
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments/doctor/");

        if (!active) return;

        const data = response.data;

        const records = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.appointments)
              ? data.appointments
              : [];

        setAppointments(records);
        setActivityError("");
      } catch (error) {
        if (!active) return;

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setActivityError(
          error.response?.status === 403
            ? "You do not have permission to view these appointments."
            : "Appointment activity is currently unavailable."
        );
      } finally {
        if (active) setAppointmentsLoading(false);
      }
    };

    fetchDashboard();
    fetchAppointments();

    return () => {
      active = false;
    };
  }, [navigate, refreshKey]);

  const getStatus = (status) => {
    const normalized = String(status || "").toUpperCase();

    const statuses = {
      BOOKED: {
        label: "Booked",
        className: "bg-blue-50 text-blue-700",
        color: "bg-blue-500",
        textColor: "text-blue-700",
        icon: CalendarCheck,
      },
      CHECKED_IN: {
        label: "Checked in",
        className: "bg-amber-50 text-amber-700",
        color: "bg-amber-400",
        textColor: "text-amber-700",
        icon: Clock3,
      },
      IN_PROGRESS: {
        label: "In progress",
        className: "bg-amber-50 text-amber-700",
        color: "bg-amber-400",
        textColor: "text-amber-700",
        icon: Activity,
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-700",
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        icon: CheckCircle2,
      },
      SKIPPED: {
        label: "Skipped",
        className: "bg-orange-50 text-orange-700",
        color: "bg-orange-400",
        textColor: "text-orange-700",
        icon: SkipForward,
      },
      MISSED: {
        label: "Missed",
        className: "bg-orange-50 text-orange-700",
        color: "bg-orange-400",
        textColor: "text-orange-700",
        icon: SkipForward,
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-red-50 text-red-600",
        color: "bg-red-400",
        textColor: "text-red-600",
        icon: CircleAlert,
      },
    };

    return (
      statuses[normalized] || {
        label: normalized || "Unknown",
        className: "bg-gray-100 text-gray-600",
        color: "bg-gray-400",
        textColor: "text-gray-600",
        icon: Activity,
      }
    );
  };

  const getAppointmentDate = (appointment) =>
    appointment.appointment_date ||
    appointment.date ||
    appointment.slot_date ||
    appointment.slot?.date ||
    appointment.appointment_slot?.date ||
    "";

  const getAppointmentTime = (appointment) => {
    const time =
      appointment.start_time ||
      appointment.slot_start_time ||
      appointment.time ||
      appointment.slot?.start_time ||
      appointment.appointment_slot?.start_time ||
      "";

    if (!time) return "Time unavailable";

    const match = String(time).match(/^(\d{1,2}):(\d{2})/);

    if (!match) return String(time);

    const hours = Number(match[1]);
    const minutes = match[2];
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes} ${suffix}`;
  };

  const formatAppointmentDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getPatientName = (appointment) => {
    const patient = appointment.patient;

    const fullName =
      appointment.patient_name ||
      appointment.patient_full_name ||
      patient?.full_name ||
      patient?.name;

    if (fullName) return fullName;

    const firstName =
      patient?.first_name ||
      appointment.first_name ||
      "";

    const lastName =
      patient?.last_name ||
      appointment.last_name ||
      "";

    return (
      `${firstName} ${lastName}`.trim() ||
      patient?.username ||
      appointment.username ||
      "Patient"
    );
  };

  const getServiceName = (appointment) =>
    appointment.service_name ||
    appointment.service?.name ||
    appointment.service?.service_name ||
    "General consultation";

  const todayAppointments = appointments.filter(
    (appointment) =>
      getAppointmentDate(appointment) === todayString
  );

  const statusCounts = appointments.reduce(
    (counts, appointment) => {
      const status = String(
        appointment.status || ""
      ).toUpperCase();

      if (status === "BOOKED") {
        counts.BOOKED += 1;
      } else if (
        status === "CHECKED_IN" ||
        status === "IN_PROGRESS"
      ) {
        counts.CHECKED_IN += 1;
      } else if (status === "COMPLETED") {
        counts.COMPLETED += 1;
      } else if (
        status === "SKIPPED" ||
        status === "MISSED"
      ) {
        counts.SKIPPED += 1;
      }

      return counts;
    },
    {
      BOOKED: 0,
      CHECKED_IN: 0,
      COMPLETED: 0,
      SKIPPED: 0,
    }
  );

  const stats = [
    {
      title: "Today's Appointments",
      value: dashboardData?.today ?? todayAppointments.length,
      description: "Appointments scheduled for today",
      icon: CalendarDays,
    },
    {
      title: "In Progress",
      value:
        dashboardData?.in_progress ??
        statusCounts.CHECKED_IN,
      description: "Patients awaiting or receiving consultation",
      icon: Clock3,
    },
    {
      title: "Completed",
      value:
        dashboardData?.completed ??
        statusCounts.COMPLETED,
      description: "Completed consultations",
      icon: CheckCircle2,
    },
    {
      title: "Skipped",
      value:
        dashboardData?.skipped ??
        statusCounts.SKIPPED,
      description: "Patients skipped in the queue",
      icon: SkipForward,
    },
  ];

  const statusItems = [
    {
      label: "Booked",
      value: statusCounts.BOOKED,
      color: "bg-blue-500",
      textColor: "text-blue-700",
    },
    {
      label: "Checked in / In progress",
      value: statusCounts.CHECKED_IN,
      color: "bg-amber-400",
      textColor: "text-amber-700",
    },
    {
      label: "Completed",
      value: statusCounts.COMPLETED,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
    },
    {
      label: "Skipped",
      value: statusCounts.SKIPPED,
      color: "bg-orange-400",
      textColor: "text-orange-700",
    },
  ];

  const recentAppointments = [...todayAppointments]
    .sort((a, b) =>
      getAppointmentTime(a).localeCompare(
        getAppointmentTime(b)
      )
    )
    .slice(0, 5);

  const quickActions = [
    {
      title: "My appointments",
      description: "Review scheduled appointments and their statuses",
      icon: CalendarDays,
      path: "/doctor/appointments",
    },
    {
      title: "Patient queue",
      description: "Review patients waiting for consultation",
      icon: ListOrdered,
      path: "/doctor/queue",
    },
    {
      title: "Consultations",
      description: "Access your consultation workflow",
      icon: Stethoscope,
      path: "/doctor/consultations",
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setAppointmentsLoading(true);
    setError("");
    setActivityError("");
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <DoctorSidebar />

      <main className="ml-0 min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1600px] p-5 sm:p-8 lg:p-10">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4f9f70]">
                CareFlow doctor portal
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#101915] sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Your appointments, consultations, and patient queue at a glance.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Today
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {formattedDate}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#9ee6bd] hover:text-[#286b45]"
                aria-label="Refresh dashboard"
                title="Refresh dashboard"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </header>

          {error && (
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <CircleAlert
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Dashboard unavailable
                </p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          <section className="mt-9">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#101915]">
                Your overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A summary of your appointments and consultation activity.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="animate-pulse rounded-2xl border border-[#b0dfc1] bg-[#bfe8d0] p-6"
                  >
                    <div className="h-4 w-32 rounded bg-black/10" />
                    <div className="mt-5 h-9 w-20 rounded bg-black/10" />
                    <div className="mt-4 h-3 w-40 rounded bg-black/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="group rounded-2xl border border-[#b0dfc1] bg-[#bfe8d0] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#83c99d] hover:bg-[#b3e3c6] hover:shadow-lg hover:shadow-[#101915]/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-black/65">
                            {stat.title}
                          </p>

                          <p className="mt-3 text-4xl font-bold tracking-tight text-[#101915]">
                            {Number(stat.value).toLocaleString()}
                          </p>

                          <p className="mt-2 text-xs leading-relaxed text-black/55">
                            {stat.description}
                          </p>
                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/65 transition group-hover:bg-white/85">
                          <Icon
                            size={23}
                            strokeWidth={1.8}
                            className="text-[#101915]"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-9 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 xl:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity
                      size={19}
                      className="text-[#4f9f70]"
                    />

                    <h2 className="text-lg font-bold text-[#101915]">
                      Today's patient schedule
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Your next scheduled patients and their appointment statuses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/doctor/appointments")}
                  className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#3e8b5c] transition hover:text-black sm:self-center"
                >
                  All appointments
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="mt-6">
                {appointmentsLoading ? (
                  <div className="space-y-5">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex animate-pulse items-center gap-4"
                      >
                        <div className="h-11 w-11 rounded-xl bg-gray-100" />

                        <div className="flex-1">
                          <div className="h-4 w-40 rounded bg-gray-100" />
                          <div className="mt-2 h-3 w-28 rounded bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activityError ? (
                  <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
                    <p>{activityError}</p>

                    <button
                      type="button"
                      onClick={() => navigate("/doctor/appointments")}
                      className="mt-3 font-semibold text-[#3e8b5c] hover:text-black"
                    >
                      Open appointments
                    </button>
                  </div>
                ) : recentAppointments.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f5ee]">
                      <ClipboardList
                        size={25}
                        className="text-[#4f9f70]"
                      />
                    </div>

                    <p className="mt-4 font-semibold text-gray-700">
                      No appointments scheduled for today
                    </p>

                    <p className="mt-1 max-w-sm text-sm text-gray-400">
                      Your patient schedule will appear here when appointments are available.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentAppointments.map((appointment, index) => {
                      const status = getStatus(appointment.status);
                      const StatusIcon = status.icon;

                      return (
                        <div
                          key={
                            appointment.id ??
                            appointment.pk ??
                            `appointment-${index}`
                          }
                          className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5ee]">
                            <UserRound
                              size={20}
                              className="text-[#3e8b5c]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#101915]">
                              {getPatientName(appointment)}
                            </p>

                            <p className="mt-1 truncate text-sm text-gray-500">
                              {getServiceName(appointment)}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                              <span className="inline-flex items-center gap-1">
                                <Clock3 size={13} />
                                {getAppointmentTime(appointment)}
                              </span>

                              <span>
                                {formatAppointmentDate(
                                  getAppointmentDate(appointment)
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${status.className}`}
                            >
                              <StatusIcon size={13} />
                              {status.label}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                navigate("/doctor/appointments")
                              }
                              className="text-xs font-semibold text-gray-400 transition hover:text-[#3e8b5c]"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-center gap-2">
                <TrendingUp
                  size={19}
                  className="text-[#4f9f70]"
                />

                <h2 className="text-lg font-bold text-[#101915]">
                  Appointment overview
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Breakdown of your appointment statuses.
              </p>

              {appointmentsLoading ? (
                <div className="mt-8 space-y-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="animate-pulse">
                      <div className="h-3 w-24 rounded bg-gray-100" />
                      <div className="mt-2 h-2 rounded-full bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : activityError ? (
                <p className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  The appointment breakdown is unavailable because appointment data could not be loaded.
                </p>
              ) : (
                <>
                  <div className="mt-7">
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-sm text-gray-500">
                        Loaded appointments
                      </p>

                      <p className="text-3xl font-bold text-[#101915]">
                        {appointments.length}
                      </p>
                    </div>

                    <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-gray-100">
                      {statusItems.map((item) => {
                        const percentage =
                          appointments.length > 0
                            ? (item.value / appointments.length) * 100
                            : 0;

                        return (
                          <div
                            key={item.label}
                            className={`${item.color} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                            title={`${item.label}: ${item.value}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-7 space-y-5">
                    {statusItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                          />

                          <span className="text-sm text-gray-600">
                            {item.label}
                          </span>
                        </div>

                        <span
                          className={`text-sm font-bold ${item.textColor}`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/doctor/appointments")}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-[#101915] transition hover:border-[#9ee6bd] hover:bg-[#f5faf7]"
                  >
                    View all appointments
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="mt-9">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#101915]">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Quickly access your daily clinical tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    type="button"
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left transition hover:border-[#bfe8d0] hover:shadow-md hover:shadow-[#101915]/5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e8f5ee] transition group-hover:bg-[#bfe8d0]">
                      <Icon
                        size={22}
                        strokeWidth={1.8}
                        className="text-[#286b45]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#101915]">
                        {action.title}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {action.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-gray-300 transition group-hover:text-[#3e8b5c]"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="mt-10 flex flex-col gap-2 border-t border-gray-200 py-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse
                size={16}
                className="text-[#4f9f70]"
              />
              <span>CareFlow Hospital Management</span>
            </div>

            <p>Doctor overview</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;