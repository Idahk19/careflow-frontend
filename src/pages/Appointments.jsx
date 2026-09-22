import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  CalendarDays,
  ChevronDown,
  Filter,
  Search,
  UserRound,
  Stethoscope,
  Building2,
  BriefcaseMedical,
  Clock,
  X,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          appointmentsResponse,
          doctorsResponse,
          servicesResponse,
          departmentsResponse,
        ] = await Promise.all([
          api.get("/appointments/admin/"),
          api.get("/hospital/doctors/"),
          api.get("/hospital/services/"),
          api.get("/hospital/departments/"),
        ]);

        setAppointments(
          appointmentsResponse.data.results ||
            appointmentsResponse.data ||
            []
        );

        setDoctors(
          doctorsResponse.data.results ||
            doctorsResponse.data ||
            []
        );

        setServices(
          servicesResponse.data.results ||
            servicesResponse.data ||
            []
        );

        setDepartments(
          departmentsResponse.data.results ||
            departmentsResponse.data ||
            []
        );
      } catch (err) {
        console.error("Error loading appointments:", err);

        setError(
          err.response?.data?.detail ||
            "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearFilters = () => {
    setSelectedDoctor("");
    setSelectedService("");
    setSelectedDepartment("");
    setSelectedDate("");
    setSearchTerm("");
  };

  const getDoctorDepartmentId = (doctor) => {
    if (!doctor) return "";

    if (doctor.department_id) {
      return String(doctor.department_id);
    }

    if (typeof doctor.department === "number") {
      return String(doctor.department);
    }

    if (doctor.department?.id) {
      return String(doctor.department.id);
    }

    return "";
  };

  const filteredDoctors = useMemo(() => {
    if (!selectedDepartment) {
      return doctors;
    }

    return doctors.filter(
      (doctor) =>
        getDoctorDepartmentId(doctor) ===
        String(selectedDepartment)
    );
  }, [doctors, selectedDepartment]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      let matchesDoctor = true;

      if (selectedDoctor) {
        const selectedDoctorObject = doctors.find(
          (doctor) =>
            String(doctor.id) === String(selectedDoctor)
        );

        if (selectedDoctorObject) {
          const doctorName =
            `Dr. ${selectedDoctorObject.first_name || ""} ${
              selectedDoctorObject.last_name || ""
            }`.trim();

          matchesDoctor =
            appointment.doctor_name?.toLowerCase() ===
            doctorName.toLowerCase();
        }
      }

      let matchesService = true;

      if (selectedService) {
        const selectedServiceObject = services.find(
          (service) =>
            String(service.id) === String(selectedService)
        );

        if (selectedServiceObject) {
          matchesService =
            appointment.service_name?.toLowerCase() ===
            selectedServiceObject.name?.toLowerCase();
        }
      }

      const matchesDate =
        !selectedDate ||
        appointment.appointment_date === selectedDate ||
        appointment.date === selectedDate;

      let matchesDepartment = true;

      if (selectedDepartment) {
        const doctor = doctors.find((doc) => {
          const fullName =
            `Dr. ${doc.first_name || ""} ${
              doc.last_name || ""
            }`.trim();

          return (
            appointment.doctor_name?.toLowerCase() ===
            fullName.toLowerCase()
          );
        });

        matchesDepartment =
          doctor &&
          getDoctorDepartmentId(doctor) ===
            String(selectedDepartment);
      }

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        appointment.patient_name
          ?.toLowerCase()
          .includes(search) ||
        appointment.username
          ?.toLowerCase()
          .includes(search) ||
        appointment.email
          ?.toLowerCase()
          .includes(search) ||
        appointment.doctor_name
          ?.toLowerCase()
          .includes(search) ||
        appointment.service_name
          ?.toLowerCase()
          .includes(search);

      return (
        matchesDoctor &&
        matchesService &&
        matchesDepartment &&
        matchesDate &&
        matchesSearch
      );
    });
  }, [
    appointments,
    doctors,
    services,
    selectedDoctor,
    selectedService,
    selectedDepartment,
    selectedDate,
    searchTerm,
  ]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour), Number(minute), 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "BOOKED":
        return "bg-blue-100 text-blue-700";

      case "CHECKED_IN":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5faf7]">
        <AdminSidebar />

        <main className="ml-0 lg:ml-64 min-h-screen p-6 lg:p-10">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">
              Loading appointments...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <AdminSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-black/40 mb-3">
              <CalendarDays size={16} />

              <span>Hospital Management</span>

              <span>/</span>

              <span className="text-black/70">
                Appointments
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-black">
                  Appointments
                </h1>

                <p className="mt-2 text-black/50">
                  View and manage patient appointments.
                </p>
              </div>

              <div className="text-sm text-black/50">
                <span className="font-semibold text-black">
                  {filteredAppointments.length}
                </span>{" "}
                {filteredAppointments.length === 1
                  ? "appointment"
                  : "appointments"}
              </div>
            </div>
          </div>

          <div className="h-px bg-black/10 relative">
            <div className="absolute left-0 top-0 h-px w-24 bg-[#8bcfa9]" />
          </div>

          {error && (
            <div className="mt-6 flex items-center justify-between gap-4 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl">
              <p className="text-sm">{error}</p>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="mt-8 bg-white border border-black/10 rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e8f5ee] flex items-center justify-center">
                  <Filter
                    size={18}
                    className="text-black"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-black">
                    Filters
                  </h2>

                  <p className="text-xs text-black/40">
                    Narrow down appointment records
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="self-start lg:self-auto flex items-center gap-2 text-sm text-black/45 hover:text-black transition"
              >
                <X size={15} />
                Clear filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Building2
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                />

                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedDoctor("");
                  }}
                  className="w-full appearance-none rounded-xl border border-black/10 bg-[#f8fcfa] pl-10 pr-9 py-3 text-sm text-black outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
                >
                  <option value="">
                    All Departments
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
                />
              </div>

              <div className="relative">
                <Stethoscope
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                />

                <select
                  value={selectedDoctor}
                  onChange={(e) =>
                    setSelectedDoctor(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-black/10 bg-[#f8fcfa] pl-10 pr-9 py-3 text-sm text-black outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
                >
                  <option value="">
                    All Doctors
                  </option>

                  {filteredDoctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      Dr. {doctor.first_name}{" "}
                      {doctor.last_name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
                />
              </div>

              <div className="relative">
                <BriefcaseMedical
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                />

                <select
                  value={selectedService}
                  onChange={(e) =>
                    setSelectedService(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-black/10 bg-[#f8fcfa] pl-10 pr-9 py-3 text-sm text-black outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
                >
                  <option value="">
                    All Services
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

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none"
                />
              </div>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] pl-10 pr-3 py-3 text-sm text-black outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
                />
              </div>

              <div className="relative md:col-span-2 lg:col-span-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search..."
                  className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] pl-10 pr-4 py-3 text-sm text-black placeholder:text-black/30 outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-black">
                Appointment Records
              </h2>

              <p className="text-sm text-black/40 mt-1">
                {filteredAppointments.length}{" "}
                {filteredAppointments.length === 1
                  ? "appointment"
                  : "appointments"}{" "}
                found
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <div className="py-16 text-center">
                  <CalendarDays
                    size={45}
                    className="mx-auto text-black/15 mb-3"
                  />

                  <h3 className="text-lg font-semibold text-black/60">
                    No appointments found
                  </h3>

                  <p className="text-sm text-black/35 mt-1">
                    Try changing or clearing your filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f8fcfa] border-b border-black/5">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase">
                          Patient
                        </th>

                        <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase">
                          Doctor
                        </th>

                        <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase">
                          Service
                        </th>

                        <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase">
                          Date
                        </th>

                        <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase">
                          Time
                        </th>

                        <th className="text-left px-6 py-4 text-xs font-semibold text-black/40 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-black/5">
                      {filteredAppointments.map(
                        (appointment) => (
                          <tr
                            key={appointment.id}
                            className="hover:bg-[#f8fcfa] transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                                  <UserRound
                                    size={18}
                                    className="text-[#38845a]"
                                  />
                                </div>

                                <div>
                                  <p className="font-medium text-black">
                                    {appointment.patient_name ||
                                      appointment.username ||
                                      "Unknown patient"}
                                  </p>

                                  <p className="text-xs text-black/40">
                                    {appointment.email || "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Stethoscope
                                  size={17}
                                  className="text-black/30"
                                />

                                <span className="text-sm text-black/60">
                                  {appointment.doctor_name ||
                                    "—"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-sm text-black/60">
                                {appointment.service_name ||
                                  "—"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <CalendarDays
                                  size={16}
                                  className="text-black/30"
                                />

                                <span className="text-sm text-black/60">
                                  {formatDate(
                                    appointment.appointment_date ||
                                      appointment.date
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Clock
                                  size={16}
                                  className="text-black/30"
                                />

                                <span className="text-sm text-black/60">
                                  {formatTime(
                                    appointment.start_time
                                  )}{" "}
                                  -{" "}
                                  {formatTime(
                                    appointment.end_time
                                  )}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status
                                  ?.replace("_", " ")
                                  .toLowerCase()
                                  .replace(
                                    /\b\w/g,
                                    (char) =>
                                      char.toUpperCase()
                                  ) || "Unknown"}
                              </span>
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
        </div>
      </main>
    </div>
  );
}

export default Appointments;