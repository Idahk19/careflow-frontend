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
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    first_name: "",
    last_name: "",
    specialization: "",
    phone_number: "",
    email: "",
    is_active: true,
  });

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
    try {
      const [doctorsResponse, departmentsResponse] =
        await Promise.all([
          api.get("/hospital/doctors/"),
          api.get("/hospital/departments/"),
        ]);

      setDoctors(doctorsResponse.data);
      setDepartments(departmentsResponse.data);
    } catch (error) {
      console.error("Staff data error:", error);

      if (handleAuthError(error)) {
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access doctors."
        );
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load staff data."
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

    setFormError("");
    setGeneratedCredentials(null);
    setCopied(false);
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);

    setFormData({
      department: doctor.department || "",
      first_name: doctor.first_name || "",
      last_name: doctor.last_name || "",
      specialization: doctor.specialization || "",
      phone_number: doctor.phone_number || "",
      email: doctor.email || "",
      is_active: doctor.is_active,
    });

    setFormError("");
    setGeneratedCredentials(null);
    setCopied(false);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingDoctor(null);
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
      if (editingDoctor) {
        const response = await api.put(
          `/hospital/doctors/${editingDoctor.id}/`,
          formData
        );

        setDoctors((current) =>
          current.map((doctor) =>
            doctor.id === editingDoctor.id
              ? response.data
              : doctor
          )
        );

        closeModal();
      } else {
        const response = await api.post(
          "/hospital/doctors/",
          formData
        );

        setDoctors((current) => [
          ...current,
          response.data,
        ]);

        setGeneratedCredentials({
          username: response.data.username,
          password: response.data.temporary_password,
        });
      }
    } catch (error) {
      console.error("Save doctor error:", error);

      if (handleAuthError(error)) {
        return;
      }

      setFormError(
        error.response?.data?.detail ||
          error.response?.data?.department?.[0] ||
          error.response?.data?.first_name?.[0] ||
          error.response?.data?.last_name?.[0] ||
          error.response?.data?.specialization?.[0] ||
          error.response?.data?.phone_number?.[0] ||
          error.response?.data?.email?.[0] ||
          "Could not save doctor."
      );
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

      setDoctors((current) =>
        current.filter((doctor) => doctor.id !== id)
      );

      setError("");
    } catch (error) {
      console.error("Delete doctor error:", error);

      if (handleAuthError(error)) {
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not delete doctor."
      );
    }
  };

  const copyCredentials = async () => {
    if (!generatedCredentials) {
      return;
    }

    const credentials = `Username: ${generatedCredentials.username}
Temporary Password: ${generatedCredentials.password}`;

    try {
      await navigator.clipboard.writeText(credentials);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy credentials:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.toLowerCase();

    const fullName = `${doctor.first_name || ""} ${
      doctor.last_name || ""
    }`.toLowerCase();

    return (
      fullName.includes(search) ||
      doctor.specialization?.toLowerCase().includes(search) ||
      doctor.department_name?.toLowerCase().includes(search) ||
      doctor.email?.toLowerCase().includes(search) ||
      doctor.phone_number?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <AdminSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-black/40 mb-3">
                <Stethoscope size={16} />
                <span>Hospital Management</span>
                <span>/</span>
                <span className="text-black/70">Doctors</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-black">
                Doctors
              </h1>

              <p className="mt-2 text-black/50 max-w-xl">
                Manage your hospital doctors, departments and
                professional information.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="self-start lg:self-auto flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition"
            >
              <Plus size={18} strokeWidth={2} />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="mt-8 h-px bg-black/10 relative">
            <div className="absolute left-0 top-0 h-px w-24 bg-[#8bcfa9]" />
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm text-black/40 uppercase tracking-wider">
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
                className="w-full pl-11 pr-4 py-3 bg-white border border-black/10 rounded-xl outline-none text-sm text-black placeholder:text-black/30 focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start justify-between gap-4 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl">
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

          {loading && (
            <div className="mt-10 py-16 text-center">
              <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-sm text-black/40">
                Loading doctors...
              </p>
            </div>
          )}

          {!loading && (
            <div className="mt-8">
              {filteredDoctors.length > 0 && (
                <div className="hidden md:grid grid-cols-[1.7fr_1.3fr_1.2fr_1.5fr_100px] gap-6 px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-black/35">
                  <span>Doctor</span>
                  <span>Specialization</span>
                  <span>Department</span>
                  <span>Contact</span>
                  <span className="text-right">Actions</span>
                </div>
              )}

              {filteredDoctors.length === 0 ? (
                <div className="py-20 text-center border-t border-black/10">
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
                </div>
              ) : (
                <div className="border-t border-black/10">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="group grid grid-cols-1 md:grid-cols-[1.7fr_1.3fr_1.2fr_1.5fr_100px] gap-4 md:gap-6 px-5 py-6 border-b border-black/10 hover:bg-white/60 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-10 h-10 rounded-full bg-[#bfe8d0] flex items-center justify-center shrink-0">
                          <Stethoscope
                            size={18}
                            className="text-black"
                            strokeWidth={1.7}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-black">
                            Dr. {doctor.first_name}{" "}
                            {doctor.last_name}
                          </h3>

                          <p className="mt-1 text-sm text-black/40">
                            {doctor.email || "No email provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <p className="text-sm text-black/60">
                          {doctor.specialization ||
                            "Not specified"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#e8f5ee] text-xs font-semibold text-[#38845a]">
                          {doctor.department_name ||
                            "Unassigned"}
                        </span>
                      </div>

                      <div className="hidden md:flex flex-col justify-center gap-1">
                        <div className="flex items-center gap-2 text-xs text-black/50">
                          <Mail size={13} />
                          <span className="truncate">
                            {doctor.email || "No email"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-black/50">
                          <Phone size={13} />
                          <span>
                            {doctor.phone_number || "No phone"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(doctor)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black hover:bg-[#e8f5ee] transition"
                          title="Edit doctor"
                        >
                          <Pencil
                            size={17}
                            strokeWidth={1.8}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(doctor.id)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-black/30 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete doctor"
                        >
                          <Trash2
                            size={17}
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#bfe8d0]/45 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/70 overflow-hidden max-h-[90vh] overflow-y-auto"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                  <Stethoscope
                    size={21}
                    className="text-black"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-black">
                    {editingDoctor
                      ? "Edit Doctor"
                      : "Add Doctor"}
                  </h2>

                  <p className="text-sm text-black/50">
                    {editingDoctor
                      ? "Update doctor information."
                      : "Create a new doctor and staff account."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-black/50 hover:bg-black/5 hover:text-black transition"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    First Name
                  </label>

                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleFormChange}
                    placeholder="e.g. Jane"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Last Name
                  </label>

                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleFormChange}
                    placeholder="e.g. Wanjiku"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Specialization
                  </label>

                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleFormChange}
                    placeholder="e.g. Cardiology"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Department
                  </label>

                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  >
                    <option value="">
                      Select department
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
                </div>

                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleFormChange}
                    placeholder="e.g. 0712345678"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="doctor@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
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
                  className="w-4 h-4 accent-black"
                />

                <label
                  htmlFor="doctor-active"
                  className="text-sm font-medium text-black"
                >
                  Doctor is active
                </label>
              </div>

              {formError && (
                <div className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              {generatedCredentials && (
                <div className="mt-6 bg-[#e8f5ee] border border-[#bfe8d0] rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-black">
                        Doctor account created
                      </h3>

                      <p className="mt-1 text-sm text-black/50">
                        Save these credentials and give them
                        to the doctor.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={copyCredentials}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-black/80 transition"
                    >
                      {copied ? (
                        <Check size={15} />
                      ) : (
                        <Copy size={15} />
                      )}

                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-black/40">
                        Username
                      </p>

                      <p className="mt-1 font-semibold text-black">
                        {generatedCredentials.username}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-black/40">
                        Temporary Password
                      </p>

                      <p className="mt-1 font-semibold text-black break-all">
                        {generatedCredentials.password}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition disabled:opacity-50"
                >
                  {generatedCredentials ? "Close" : "Cancel"}
                </button>

                {!generatedCredentials && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingDoctor
                      ? "Save Changes"
                      : "Add Doctor"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;