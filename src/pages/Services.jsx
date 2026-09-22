import { useEffect, useState } from "react";
import {
  BriefcaseMedical,
  Check,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

const initialForm = {
  department: "",
  name: "",
  description: "",
  is_active: true,
};

function Services() {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleAuthError = (error) => {
    if (error.response?.status !== 401) {
      return false;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    return true;
  };

  const fetchData = async () => {
    try {
      const [servicesResponse, departmentsResponse] =
        await Promise.all([
          api.get("/hospital/services/"),
          api.get("/hospital/departments/"),
        ]);

      setServices(servicesResponse.data);
      setDepartments(departmentsResponse.data);
    } catch (error) {
      console.error("Services data error:", error);

      if (handleAuthError(error)) {
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access services."
        );
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setFormError("");
  };

  const openAddModal = () => {
    setEditingService(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);

    setFormData({
      department: service.department || "",
      name: service.name || "",
      description: service.description || "",
      is_active: service.is_active,
    });

    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingService(null);
    resetForm();
  };

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

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
      const response = editingService
        ? await api.put(
            `/hospital/services/${editingService.id}/`,
            formData
          )
        : await api.post("/hospital/services/", formData);

      setServices((current) =>
        editingService
          ? current.map((service) =>
              service.id === editingService.id
                ? response.data
                : service
            )
          : [...current, response.data]
      );

      closeModal();
    } catch (error) {
      console.error("Save service error:", error);

      if (handleAuthError(error)) {
        return;
      }

      setFormError(
        error.response?.data?.detail ||
          error.response?.data?.department?.[0] ||
          error.response?.data?.name?.[0] ||
          error.response?.data?.description?.[0] ||
          "Could not save service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await api.delete(`/hospital/services/${id}/`);

      setServices((current) =>
        current.filter((service) => service.id !== id)
      );

      setError("");
    } catch (error) {
      console.error("Delete service error:", error);

      if (handleAuthError(error)) {
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not delete service."
      );
    }
  };

  const filteredServices = services.filter((service) => {
    const search = searchTerm.toLowerCase();

    return (
      service.name?.toLowerCase().includes(search) ||
      service.department_name?.toLowerCase().includes(search) ||
      service.description?.toLowerCase().includes(search)
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
                <BriefcaseMedical size={16} />
                <span>Hospital Management</span>
                <span>/</span>
                <span className="text-black/70">Services</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-black">
                Services
              </h1>

              <p className="mt-2 text-black/50 max-w-xl">
                Manage the medical services offered by your hospital
                and organize them by department.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="self-start lg:self-auto flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition"
            >
              <Plus size={18} />
              Add Service
            </button>
          </div>

          <div className="mt-8 h-px bg-black/10 relative">
            <div className="absolute left-0 top-0 h-px w-24 bg-[#8bcfa9]" />
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm text-black/40 uppercase tracking-wider">
                Medical Services
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-black">
                  {services.length}
                </span>

                <span className="text-sm text-black/50">
                  registered services
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
                placeholder="Search services..."
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

          {loading ? (
            <div className="mt-10 py-16 text-center">
              <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-sm text-black/40">
                Loading services...
              </p>
            </div>
          ) : (
            <div className="mt-8">
              {filteredServices.length > 0 && (
                <div className="hidden md:grid grid-cols-[60px_1.5fr_1.2fr_2fr_120px_100px] gap-5 px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-black/35">
                  <span>#</span>
                  <span>Service</span>
                  <span>Department</span>
                  <span>Description</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>
              )}

              {filteredServices.length === 0 ? (
                <div className="py-20 text-center border-t border-black/10">
                  <BriefcaseMedical
                    size={38}
                    className="mx-auto text-black/20"
                    strokeWidth={1.5}
                  />

                  <h3 className="mt-4 font-semibold text-black">
                    {searchTerm
                      ? "No services found"
                      : "No services yet"}
                  </h3>

                  <p className="mt-1 text-sm text-black/40">
                    {searchTerm
                      ? "Try a different search."
                      : "Add your first medical service to get started."}
                  </p>
                </div>
              ) : (
                <div className="border-t border-black/10">
                  {filteredServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="grid grid-cols-1 md:grid-cols-[60px_1.5fr_1.2fr_2fr_120px_100px] gap-4 md:gap-5 px-5 py-5 border-b border-black/10 hover:bg-white/60 transition"
                    >
                      <div className="hidden md:flex items-center text-sm text-black/35">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#bfe8d0] flex items-center justify-center shrink-0">
                          <BriefcaseMedical
                            size={18}
                            className="text-black"
                            strokeWidth={1.7}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-black">
                            {service.name}
                          </h3>

                          <p className="mt-1 text-xs text-black/40 md:hidden">
                            {service.department_name ||
                              "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="inline-flex px-3 py-1.5 rounded-lg bg-[#e8f5ee] text-xs font-semibold text-[#38845a]">
                          {service.department_name ||
                            "Unassigned"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <p className="text-sm text-black/50 line-clamp-2">
                          {service.description ||
                            "No description provided"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-semibold ${
                            service.is_active
                              ? "text-[#38845a]"
                              : "text-black/40"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              service.is_active
                                ? "bg-[#6fbe8e]"
                                : "bg-black/20"
                            }`}
                          />

                          {service.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <div className="flex items-center justify-start md:justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(service)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black hover:bg-[#e8f5ee] transition"
                          title="Edit service"
                        >
                          <Pencil
                            size={17}
                            strokeWidth={1.8}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(service.id)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-black/30 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete service"
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
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-white/70 overflow-hidden"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                  <BriefcaseMedical
                    size={21}
                    className="text-black"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-black">
                    {editingService
                      ? "Edit Service"
                      : "Add Service"}
                  </h2>

                  <p className="text-sm text-black/50">
                    {editingService
                      ? "Update service information."
                      : "Create a new medical service."}
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

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="service-name"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Service Name
                  </label>

                  <input
                    id="service-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. General Consultation"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service-department"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Department
                  </label>

                  <select
                    id="service-department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
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
                    htmlFor="service-description"
                    className="block text-sm font-semibold text-black mb-2"
                  >
                    Description
                  </label>

                  <textarea
                    id="service-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the service..."
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none resize-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 accent-black"
                  />

                  <span className="text-sm font-medium text-black">
                    Service is active
                  </span>
                </label>
              </div>

              {formError && (
                <div className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={17} />
                      {editingService
                        ? "Save Changes"
                        : "Add Service"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;