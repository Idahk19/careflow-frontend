import { useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar";
import api from "../services/api";

function BookAppointment() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        setError("");

        const response = await api.get(
          "/hospital/services/"
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setServices(
          data.filter((service) => service.is_active !== false)
        );
      } catch (error) {
        console.error(
          "Failed to fetch services:",
          error
        );

        setError("Failed to load services.");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedService) {
        setDoctors([]);
        setSelectedDoctor("");
        return;
      }

      try {
        setLoadingDoctors(true);
        setError("");

        const response = await api.get(
          "/hospital/doctors/"
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        const activeDoctors = data.filter(
          (doctor) => doctor.is_active !== false
        );

        setDoctors(activeDoctors);
      } catch (error) {
        console.error(
          "Failed to fetch doctors:",
          error
        );

        setError("Failed to load doctors.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();

    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedSlot("");
    setSlots([]);
  }, [selectedService]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (
        !selectedService ||
        !selectedDoctor ||
        !selectedDate
      ) {
        setSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);
        setError("");
        setSelectedSlot("");

        const response = await api.get(
          `/appointments/slots/?doctor=${selectedDoctor}&service=${selectedService}&date=${selectedDate}`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setSlots(
          data.filter(
            (slot) => slot.is_available !== false
          )
        );
      } catch (error) {
        console.error(
          "Failed to fetch available slots:",
          error
        );

        setSlots([]);

        if (error.response?.data?.date) {
          setError(error.response.data.date);
        } else {
          setError("Failed to load available time slots.");
        }
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [
    selectedService,
    selectedDoctor,
    selectedDate,
  ]);

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatSlot = (slot) => {
    return `${formatTime(
      slot.start_time
    )} - ${formatTime(slot.end_time)}`;
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSuccess("");
    setError("");
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedDate("");
    setSelectedSlot("");
    setSlots([]);
    setSuccess("");
    setError("");
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSlot("");
    setSuccess("");
    setError("");
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (
      !selectedService ||
      !selectedDoctor ||
      !selectedDate ||
      !selectedSlot
    ) {
      setError(
        "Please select a service, doctor, date and time slot."
      );
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      await api.post("/appointments/book/", {
        service: selectedService,
        doctor: selectedDoctor,
        date: selectedDate,
        slot: selectedSlot,
      });

      setSuccess(
        "Your appointment has been booked successfully."
      );

      setSelectedSlot("");

      const response = await api.get(
        `/appointments/slots/?doctor=${selectedDoctor}&service=${selectedService}&date=${selectedDate}`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setSlots(
        data.filter(
          (slot) => slot.is_available !== false
        )
      );

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);
    } catch (error) {
      console.error(
        "Failed to book appointment:",
        error
      );

      if (error.response?.data?.slot) {
        setError(error.response.data.slot);
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError(
          "Failed to book your appointment. Please try again."
        );
      }
    } finally {
      setBooking(false);
    }
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <PatientSidebar />

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto p-5 sm:p-8 lg:p-10">

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                <CalendarPlus
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Book Appointment
                </h1>

                <p className="text-sm text-black/50 mt-1">
                  Choose a service, doctor, date and available time
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#e8f5ee] border border-[#bfe8d0] text-sm text-[#27764d] flex items-center gap-2">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleBooking}>

            <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-7 mb-6">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-black">
                  Appointment Details
                </h2>

                <p className="text-sm text-black/50 mt-1">
                  Start by selecting the service you need.
                </p>
              </div>

              <div className="space-y-6">

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                    <Stethoscope
                      size={17}
                      className="text-[#27764d]"
                    />
                    Service
                  </label>

                  <select
                    value={selectedService}
                    onChange={handleServiceChange}
                    disabled={loadingServices}
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40 disabled:bg-black/[0.02] disabled:text-black/40"
                  >
                    <option value="">
                      {loadingServices
                        ? "Loading services..."
                        : "Select a service"}
                    </option>

                    {services.map((service) => (
                      <option
                        key={service.id}
                        value={service.id}
                      >
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                    <UserRound
                      size={17}
                      className="text-[#27764d]"
                    />
                    Doctor
                  </label>

                  <select
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                    disabled={
                      !selectedService ||
                      loadingDoctors
                    }
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40 disabled:bg-black/[0.02] disabled:text-black/40"
                  >
                    <option value="">
                      {!selectedService
                        ? "Select a service first"
                        : loadingDoctors
                        ? "Loading doctors..."
                        : doctors.length === 0
                        ? "No doctors available"
                        : "Select a doctor"}
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        Dr. {doctor.first_name}{" "}
                        {doctor.last_name}
                        {doctor.specialization
                          ? ` — ${doctor.specialization}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                    <CalendarDays
                      size={17}
                      className="text-[#27764d]"
                    />
                    Date
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    min={today}
                    onChange={handleDateChange}
                    disabled={!selectedDoctor}
                    className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40 disabled:bg-black/[0.02] disabled:text-black/40"
                  />
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-7 mb-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Available Time Slots
                  </h2>

                  <p className="text-sm text-black/50 mt-1">
                    {selectedDate
                      ? "Select an available time for your appointment."
                      : "Select a date to view available times."}
                  </p>
                </div>

                {selectedDate && (
                  <div className="hidden sm:flex items-center gap-2 text-sm text-[#27764d]">
                    <Clock3 size={16} />
                    {slots.length} available
                  </div>
                )}
              </div>

              {!selectedDate ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
                    <CalendarDays
                      size={25}
                      className="text-[#27764d]"
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3 className="font-semibold text-black">
                    Choose a date
                  </h3>

                  <p className="text-sm text-black/50 mt-1">
                    Available appointment times will appear here.
                  </p>
                </div>
              ) : loadingSlots ? (
                <div className="py-10 text-center">
                  <div className="w-8 h-8 border-2 border-[#bfe8d0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

                  <p className="text-sm text-black/50">
                    Checking available times...
                  </p>
                </div>
              ) : slots.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#f1f5f3] flex items-center justify-center mx-auto mb-4">
                    <Clock3
                      size={25}
                      className="text-black/40"
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3 className="font-semibold text-black">
                    No available slots
                  </h3>

                  <p className="text-sm text-black/50 mt-1">
                    There are no available appointments for this date.
                    Please choose another date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((slot) => {
                    const isSelected =
                      String(selectedSlot) ===
                      String(slot.id);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() =>
                          setSelectedSlot(slot.id)
                        }
                        className={`min-h-14 px-3 py-3 rounded-xl border text-sm font-medium transition ${
                          isSelected
                            ? "bg-[#bfe8d0] border-[#8bcfa9] text-[#1f6040]"
                            : "bg-white border-black/10 text-black/70 hover:border-[#8bcfa9] hover:bg-[#f5faf7]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Clock3 size={15} />

                          <span>
                            {formatSlot(slot)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <p className="text-sm text-black/50">
                    Selected appointment
                  </p>

                  <p className="font-semibold text-black mt-1">
                    {selectedService &&
                    selectedDoctor &&
                    selectedDate &&
                    selectedSlot
                      ? `${formatSlot(
                          slots.find(
                            (slot) =>
                              String(slot.id) ===
                              String(selectedSlot)
                          )
                        )}`
                      : "Select all appointment details"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    booking ||
                    !selectedService ||
                    !selectedDoctor ||
                    !selectedDate ||
                    !selectedSlot
                  }
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#bfe8d0] text-black font-semibold text-sm hover:bg-[#aee0c2] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking
                    ? "Booking..."
                    : "Book Appointment"}
                </button>

              </div>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default BookAppointment;