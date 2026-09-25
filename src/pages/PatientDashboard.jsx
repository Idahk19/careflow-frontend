import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  ListOrdered,
  ArrowRight,
  Clock3,
  UserRound,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";
import PatientSidebar from "../components/PatientSidebar";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientName = "Patient";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments/");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments
    .filter((appointment) => {
      if (
        appointment.status === "CANCELLED" ||
        appointment.status === "COMPLETED"
      ) {
        return false;
      }

      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`
      );

      return appointmentDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(
        `${a.appointment_date}T${a.start_time || "00:00"}`
      );

      const dateB = new Date(
        `${b.appointment_date}T${b.start_time || "00:00"}`
      );

      return dateA - dateB;
    });

  const pastAppointments = appointments
    .filter((appointment) => {
      if (
        appointment.status === "COMPLETED" ||
        appointment.status === "CHECKED_IN" ||
        appointment.status === "CANCELLED"
      ) {
        return false;
      }

      const appointmentDate = new Date(
        `${appointment.appointment_date}T00:00:00`
      );

      return appointmentDate < today;
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

  const upcomingAppointment =
    upcomingAppointments.length > 0
      ? upcomingAppointments[0]
      : null;

  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = new Date(
        `${a.appointment_date}T${a.start_time || "00:00"}`
      );

      const dateB = new Date(
        `${b.appointment_date}T${b.start_time || "00:00"}`
      );

      return dateB - dateA;
    })
    .slice(0, 4);

  const appointmentCount = appointments.length;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-blue-50 text-blue-700";

      case "CHECKED_IN":
        return "bg-[#e1f5e8] text-green-700";

      case "COMPLETED":
        return "bg-gray-100 text-gray-600";

      case "CANCELLED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <PatientSidebar />

      <main className="lg:ml-64 min-h-screen">
    
        <div className="px-6 sm:px-8 lg:px-10 py-8 max-w-[1600px] mx-auto">
          <section className="mb-8">
            <p className="text-sm text-gray-500 mb-1">
              Welcome back,
            </p>

            <h2 className="text-3xl font-bold text-gray-900">
              {patientName}
            </h2>

            <p className="text-gray-500 mt-2">
              Here's an overview of your appointments and care.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <button
              onClick={() => navigate("/appointments/book")}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                  <CalendarPlus
                    size={21}
                    className="text-gray-800"
                  />
                </div>

                <ArrowRight
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-semibold text-gray-900 mt-5">
                Book Appointment
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Schedule your next visit
              </p>
            </button>

            <button
              onClick={() => navigate("/appointments")}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#eef7f1] flex items-center justify-center">
                  <CalendarDays
                    size={21}
                    className="text-gray-700"
                  />
                </div>

                <ArrowRight
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-semibold text-gray-900 mt-5">
                My Appointments
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                View your appointments
              </p>
            </button>

            <button
              onClick={() => navigate("/my-queue")}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#eef7f1] flex items-center justify-center">
                  <ListOrdered
                    size={21}
                    className="text-gray-700"
                  />
                </div>

                <ArrowRight
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-semibold text-gray-900 mt-5">
                My Queue
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Check your queue position
              </p>
            </button>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                  <Clock3
                    size={19}
                    className="text-gray-800"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Upcoming
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {upcomingAppointments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef7f1] flex items-center justify-center">
                  <CalendarDays
                    size={19}
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Appointments
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {appointmentCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eef7f1] flex items-center justify-center">
                  <ListOrdered
                    size={19}
                    className="text-gray-700"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Queue Status
                  </p>

                  <p className="text-lg font-semibold text-gray-900">
                    Not in queue
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Appointment
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your next scheduled visit
                  </p>
                </div>

                <CalendarDays
                  size={21}
                  className="text-gray-400"
                />
              </div>

              {loading ? (
                <div className="py-10 text-center text-gray-500">
                  Loading appointment...
                </div>
              ) : upcomingAppointment ? (
                <div className="bg-[#f5faf7] rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                        <Stethoscope
                          size={20}
                          className="text-gray-700"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {upcomingAppointment.doctor_name ||
                            "Doctor"}
                        </p>

                        <p className="text-sm text-gray-500 truncate">
                          {upcomingAppointment.service_name ||
                            "Medical Consultation"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusClass(
                        upcomingAppointment.status
                      )}`}
                    >
                      {upcomingAppointment.status || "BOOKED"}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CalendarDays size={17} />

                      <span>
                        {formatDate(
                          upcomingAppointment.appointment_date
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock3 size={17} />

                      <span>
                        {formatTime(
                          upcomingAppointment.start_time
                        )}{" "}
                        –{" "}
                        {formatTime(
                          upcomingAppointment.end_time
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/appointments/${upcomingAppointment.id}`
                      )
                    }
                    className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                  >
                    View Appointment
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#eef7f1] flex items-center justify-center mx-auto">
                    <CalendarDays
                      size={23}
                      className="text-gray-500"
                    />
                  </div>

                  <h4 className="font-semibold text-gray-900 mt-4">
                    No upcoming appointments
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    You don't have any upcoming appointments.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/appointments/book")
                    }
                    className="mt-5 px-5 py-2.5 bg-[#bfe8d0] rounded-xl text-sm font-medium text-gray-900 hover:bg-[#aee0c2] transition"
                  >
                    Book Appointment
                  </button>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Today's Queue
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your current queue status
                  </p>
                </div>

                <ListOrdered
                  size={21}
                  className="text-gray-400"
                />
              </div>

              <div className="bg-[#f5faf7] rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto">
                  <ListOrdered
                    size={23}
                    className="text-gray-500"
                  />
                </div>

                <h4 className="font-semibold text-gray-900 mt-4">
                  You're not currently in a queue
                </h4>

                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Once you've checked in for an appointment,
                  your queue position will appear here.
                </p>

                <button
                  onClick={() => navigate("/my-queue")}
                  className="mt-5 px-5 py-2.5 bg-[#bfe8d0] rounded-xl text-sm font-medium text-gray-900 hover:bg-[#aee0c2] transition"
                >
                  View My Queue
                </button>
              </div>
            </section>
          </div>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Appointments
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Your latest appointments
                </p>
              </div>

              <button
                onClick={() => navigate("/appointments")}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                View all
                <ArrowRight size={16} />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-500">
                Loading appointments...
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#eef7f1] flex items-center justify-center mx-auto">
                  <CalendarDays
                    size={22}
                    className="text-gray-500"
                  />
                </div>

                <h4 className="font-semibold text-gray-900 mt-4">
                  No appointments yet
                </h4>

                <p className="text-sm text-gray-500 mt-1">
                  Your appointment history will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#f8fbf9] hover:bg-[#f2f8f4] transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                        <Stethoscope
                          size={18}
                          className="text-gray-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {appointment.service_name ||
                            "Medical Consultation"}
                        </h4>

                        <p className="text-sm text-gray-500 truncate">
                          {appointment.doctor_name ||
                            "Doctor"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-sm text-gray-500">
                        <p>
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </p>

                        <p className="mt-1">
                          {formatTime(
                            appointment.start_time
                          )}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {pastAppointments.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Past Appointments
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Appointments that passed without being
                    checked in or completed
                  </p>
                </div>

                <Clock3
                  size={21}
                  className="text-gray-400"
                />
              </div>

              <div className="space-y-3">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#fff8f8] border border-red-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                        <CalendarDays
                          size={18}
                          className="text-gray-600"
                        />
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">
                          {appointment.service_name ||
                            "Medical Consultation"}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {appointment.doctor_name || "Doctor"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-sm text-gray-500">
                        <p>
                          {formatDate(
                            appointment.appointment_date
                          )}
                        </p>

                        <p className="mt-1">
                          {formatTime(
                            appointment.start_time
                          )}
                        </p>
                      </div>

                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                        Missed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-6 bg-[#dff3e6] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2
                  size={21}
                  className="text-gray-700"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Stay on top of your care
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Keep track of your appointments and queue
                  status through your CareFlow dashboard.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/my-care")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
            >
              My Care
              <ArrowRight size={16} />
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;