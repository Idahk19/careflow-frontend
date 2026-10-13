import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Stethoscope,
  X,
  Search,
  Mail,
  Phone,
  Copy,
  Check,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    department: "",
    first_name: "",
    last_name: "",
    specialization: "",
    phone_number: "",
    email: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/login";
      return true;
    }

    return false;
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [doctorsResponse, departmentsResponse] =
        await Promise.all([
          api.get("/hospital/doctors/"),
          api.get("/hospital/departments/"),
        ]);

      setDoctors(
        Array.isArray(doctorsResponse.data)
          ? doctorsResponse.data
          : doctorsResponse.data.results || []
      );

      setDepartments(
        Array.isArray(departmentsResponse.data)
          ? departmentsResponse.data
          : departmentsResponse.data.results || []
      );
    } catch (error) {
      console.error("Fetch doctors error:", error);

      if (handleAuthError(error)) return;

      if (error.response?.status === 403) {
        setError("You do not have permission to access doctors.");
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load doctors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      department: "",
      first_name: "",
      last_name: "",
      specialization: "",
      phone_number: "",
      email: "",
      is_active: true,
    });

    setEditingDoctor(null);
    setFormError("");
    setGeneratedCredentials(null);
    setCopied(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);

    setFormData({
      department:
        doctor.department_id ??
        doctor.department ??
        "",
      first_name: doctor.first_name || "",
      last_name: doctor.last_name || "",
      specialization: doctor.specialization || "",
      phone_number: doctor.phone_number || "",
      email: doctor.email || "",
      is_active: doctor.is_active ?? true,
    });

    setFormError("");
    setGeneratedCredentials(null);
    setCopied(false);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        ...formData,
        department: formData.department
          ? Number(formData.department)
          : "",
      };

      if (editingDoctor) {
        const response = await api.put(
          `/hospital/doctors/${editingDoctor.id}/`,
          payload
        );

        setDoctors((currentDoctors) =>
          currentDoctors.map((doctor) =>
            doctor.id === editingDoctor.id
              ? response.data
              : doctor
          )
        );

        setShowModal(false);
        resetForm();
      } else {
        const response = await api.post(
          "/hospital/doctors/",
          payload
        );

        const newDoctor = response.data;

        setDoctors((currentDoctors) => [
          ...currentDoctors,
          newDoctor,
        ]);

        if (
          newDoctor.username ||
          newDoctor.temporary_password
        ) {
          setGeneratedCredentials({
            username: newDoctor.username || "",
            temporary_password:
              newDoctor.temporary_password || "",
          });
        } else {
          setShowModal(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Save doctor error:", error);

      if (handleAuthError(error)) return;

      const data = error.response?.data;

      if (data && typeof data === "object") {
        const firstError = Object.entries(data).find(
          ([, value]) => value
        );

        if (firstError) {
          const [, value] = firstError;

          setFormError(
            Array.isArray(value)
              ? value.join(" ")
              : typeof value === "string"
                ? value
                : "Please check the information entered."
          );
        } else {
          setFormError("Could not save doctor.");
        }
      } else {
        setFormError("Could not save doctor.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/hospital/doctors/${id}/`);

      setDoctors((currentDoctors) =>
        currentDoctors.filter(
          (doctor) => doctor.id !== id
        )
      );

      setError("");
    } catch (error) {
      console.error("Delete doctor error:", error);

      if (handleAuthError(error)) return;

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not delete doctor. The doctor may have existing appointments."
      );
    }
  };

  const copyCredentials = async () => {
    if (!generatedCredentials) return;

    const credentials = [
      `Username: ${generatedCredentials.username}`,
      `Temporary Password: ${generatedCredentials.temporary_password}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(credentials);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy credentials error:", error);
      setFormError(
        "Could not copy credentials. Please copy them manually."
      );
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.toLowerCase();

    const fullName =
      `${doctor.first_name || ""} ${doctor.last_name || ""}`
        .toLowerCase();

    const departmentName =
      doctor.department_name ||
      departments.find(
        (department) =>
          String(department.id) ===
          String(
            doctor.department_id ?? doctor.department
          )
      )?.name ||
      "";

    return (
      fullName.includes(search) ||
      (doctor.specialization || "")
        .toLowerCase()
        .includes(search) ||
      departmentName.toLowerCase().includes(search) ||
      (doctor.email || "").toLowerCase().includes(search) ||
      (doctor.phone_number || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <AdminSidebar />

      <main className="ml-0 min-h-screen lg:ml-64">
        <div className="max-w-7xl p-6 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-black/40">
                <Stethoscope size={16} />
                <span>Hospital Management</span>
                <span>/</span>
                <span className="text-black/70">Doctors</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-black">
                Doctors
              </h1>

              <p className="mt-2 max-w-xl text-black/50">
                Organize and manage your hospital's medical staff.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-2 self-start rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/80 lg:self-auto"
            >
              <Plus size={18} strokeWidth={2} />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="relative mt-8 h-px bg-black/10">
            <div className="absolute left-0 top-0 h-px w-24 bg-[#8bcfa9]" />
          </div>

          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider text-black/40">
                Medical Staff
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-black">
                  {doctors.length}
                </span>

                <span className="text-sm text-black/50">
                  registered doctors
                </span>
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search doctors..."
                className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none placeholder:text-black/30 focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-red-600">
              <p className="text-sm">{error}</p>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 transition hover:text-red-600"
                aria-label="Dismiss error"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {loading && (
            <div className="mt-10 py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />

              <p className="mt-4 text-sm text-black/40">
                Loading doctors...
              </p>
            </div>
          )}

          {!loading && (
            <div className="mt-8">
              {filteredDoctors.length > 0 && (
                <div className="hidden grid-cols-[60px_1.5fr_1.3fr_1.3fr_120px_100px] gap-5 px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-black/35 lg:grid">
                  <span>#</span>
                  <span>Doctor</span>
                  <span>Specialization</span>
                  <span>Department</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>
              )}

              {filteredDoctors.length === 0 ? (
                <div className="border-t border-black/10 py-20 text-center">
                  <Stethoscope
                    size={38}
                    className="mx-auto text-black/20"
                    strokeWidth={1.5}
                  />

                  <h3 className="mt-4 font-semibold text-black">
                    {searchTerm
                      ? "No doctors found"
                      : "No doctors yet"}
                  </h3>

                  <p className="mt-1 text-sm text-black/40">
                    {searchTerm
                      ? "Try a different search."
                      : "Add your first doctor to get started."}
                  </p>

                  {!searchTerm && (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/80"
                    >
                      <Plus size={18} />
                      Add Doctor
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-t border-black/10">
                  {filteredDoctors.map((doctor, index) => {
                    const departmentName =
                      doctor.department_name ||
                      departments.find(
                        (department) =>
                          String(department.id) ===
                          String(
                            doctor.department_id ??
                              doctor.department
                          )
                      )?.name ||
                      "No department assigned";

                    return (
                      <div
                        key={doctor.id}
                        className="group grid grid-cols-1 gap-4 border-b border-black/10 px-5 py-6 transition hover:bg-white/60 lg:grid-cols-[60px_1.5fr_1.3fr_1.3fr_120px_100px] lg:items-center lg:gap-5"
                      >
                        <div className="hidden items-start pt-1 lg:flex">
                          <span className="text-sm font-medium text-black/25">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5ee]">
                            <Stethoscope
                              size={18}
                              className="text-black"
                              strokeWidth={1.7}
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-black">
                              Dr. {doctor.first_name} {doctor.last_name}
                            </h3>

                            <p className="mt-1 break-all text-sm text-black/45">
                              {doctor.email || "No email provided"}
                            </p>

                            <p className="mt-1 text-sm text-black/45 lg:hidden">
                              {doctor.specialization ||
                                "No specialization"}
                              {" · "}
                              {departmentName}
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm text-black/45 lg:hidden">
                              <Phone size={14} />
                              {doctor.phone_number || "No phone number"}
                            </p>
                          </div>
                        </div>

                        <div className="hidden lg:block">
                          <p className="text-sm text-black/60">
                            {doctor.specialization || "Not specified"}
                          </p>
                        </div>

                        <div className="hidden lg:block">
                          <p className="text-sm text-black/60">
                            {departmentName}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <span
                            className={`text-xs font-semibold ${
                              doctor.is_active
                                ? "text-[#38845a]"
                                : "text-black/35"
                            }`}
                          >
                            <span
                              className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${
                                doctor.is_active
                                  ? "bg-[#5eaf7d]"
                                  : "bg-black/25"
                              }`}
                            />
                            {doctor.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(doctor)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-black/50 transition hover:bg-[#e8f5ee] hover:text-black"
                            title="Edit doctor"
                          >
                            <Pencil size={17} strokeWidth={1.8} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(doctor.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-black/30 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete doctor"
                          >
                            <Trash2 size={17} strokeWidth={1.8} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#bfe8d0]/45 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="my-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#bfe8d0]">
                  <Stethoscope
                    size={21}
                    className="text-black"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-black">
                    {generatedCredentials
                      ? "Doctor Created Successfully"
                      : editingDoctor
                        ? "Edit Doctor"
                        : "Add Doctor"}
                  </h2>

                  <p className="text-sm text-black/50">
                    {generatedCredentials
                      ? "Save the doctor's login credentials."
                      : editingDoctor
                        ? "Update doctor details."
                        : "Create a new hospital doctor account."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-black/50 transition hover:bg-black/5 hover:text-black disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {generatedCredentials ? (
              <div className="p-6">
                <div className="rounded-2xl border border-[#bfe8d0] bg-[#f5faf7] p-5">
                  <h3 className="font-semibold text-black">
                    Doctor login credentials
                  </h3>

                  <p className="mt-2 text-sm text-black/55">
                    Copy these credentials and share them securely with the
                    doctor. Save the temporary password before closing.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        Username
                      </label>

                      <div className="break-all rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black">
                        {generatedCredentials.username || "Not provided"}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-black">
                        Temporary Password
                      </label>

                      <div className="break-all rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-sm text-black">
                        {generatedCredentials.temporary_password ||
                          "Not provided"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyCredentials}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/80"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied Successfully" : "Copy Credentials"}
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-black/80"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="doctor-first-name"
                      className="mb-2 block text-sm font-semibold text-black"
                    >
                      First Name
                    </label>

                    <input
                      id="doctor-first-name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleFormChange}
                      placeholder="Enter first name"
                      required
                      className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] px-4 py-3 text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doctor-last-name"
                      className="mb-2 block text-sm font-semibold text-black"
                    >
                      Last Name
                    </label>

                    <input
                      id="doctor-last-name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleFormChange}
                      placeholder="Enter last name"
                      required
                      className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] px-4 py-3 text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doctor-specialization"
                      className="mb-2 block text-sm font-semibold text-black"
                    >
                      Specialization
                    </label>

                    <input
                      id="doctor-specialization"
                      name="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={handleFormChange}
                      placeholder="e.g. Cardiology"
                      required
                      className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] px-4 py-3 text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doctor-department"
                      className="mb-2 block text-sm font-semibold text-black"
                    >
                      Department
                    </label>

                    <select
                      id="doctor-department"
                      name="department"
                      value={formData.department}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] px-4 py-3 text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                    >
                      <option value="">Select department</option>

                      {departments.map((department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="doctor-phone"
                      className="mb-2 block text-sm font-semibold text-black"
                    >
                      Phone Number
                    </label>

                    <input
                      id="doctor-phone"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleFormChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] px-4 py-3 text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="doctor-email"
                      className="mb-2 block text-sm font-semibold text-black"
                    >
                      Email Address
                    </label>

                    <input
                      id="doctor-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="doctor@example.com"
                      required
                      className="w-full rounded-xl border border-black/10 bg-[#f8fcfa] px-4 py-3 text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <input
                    id="doctor-active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleFormChange}
                    className="h-4 w-4 accent-black"
                  />

                  <label
                    htmlFor="doctor-active"
                    className="text-sm font-medium text-black"
                  >
                    Doctor is active
                  </label>
                </div>

                {formError && (
                  <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <div className="mt-7 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/80 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/80 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingDoctor
                        ? "Save Changes"
                        : "Add Doctor"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;