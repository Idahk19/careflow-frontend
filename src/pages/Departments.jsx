import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Building2,
  X,
  Search,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await api.get(
        "/hospital/departments/"
      );

      setDepartments(response.data);
    } catch (error) {
      console.error("Departments API error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to access departments."
        );
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load departments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  /* =========================
     OPEN ADD MODAL
  ========================= */

  const openAddModal = () => {
    setEditingDepartment(null);

    setFormData({
      name: "",
      description: "",
      is_active: true,
    });

    setFormError("");
    setShowModal(true);
  };

  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEditModal = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department.name || "",
      description: department.description || "",
      is_active: department.is_active,
    });

    setFormError("");
    setShowModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingDepartment(null);
    setFormError("");
  };

  /* =========================
     FORM CHANGE
  ========================= */

  const handleFormChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================
     ADD / EDIT DEPARTMENT
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setFormError("");

    try {
      let response;

      if (editingDepartment) {
        response = await api.put(
          `/hospital/departments/${editingDepartment.id}/`,
          formData
        );

        setDepartments((currentDepartments) =>
          currentDepartments.map((department) =>
            department.id === editingDepartment.id
              ? response.data
              : department
          )
        );
      } else {
        response = await api.post(
          "/hospital/departments/",
          formData
        );

        setDepartments((currentDepartments) => [
          ...currentDepartments,
          response.data,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error(
        editingDepartment
          ? "Edit department error:"
          : "Create department error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      setFormError(
        error.response?.data?.detail ||
          error.response?.data?.name?.[0] ||
          error.response?.data?.description?.[0] ||
          error.response?.data?.error ||
          "Could not save department."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE DEPARTMENT
  ========================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/hospital/departments/${id}/`
      );

      setDepartments((currentDepartments) =>
        currentDepartments.filter(
          (department) => department.id !== id
        )
      );

      setError("");
    } catch (error) {
      console.error(
        "Delete department error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not delete department. You have doctors and services attached to this department."
      );
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const filteredDepartments =
    departments.filter((department) => {
      const search =
        searchTerm.toLowerCase();

      return (
        department.name
          ?.toLowerCase()
          .includes(search) ||
        department.description
          ?.toLowerCase()
          .includes(search)
      );
    });

  return (
    <div className="min-h-screen bg-[#f5faf7]">

      <AdminSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">

        <div className="p-6 lg:p-10 max-w-7xl">

          {/* =========================
              HEADER
          ========================= */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-2 text-sm text-black/40 mb-3">

                <Building2 size={16} />

                <span>
                  Hospital Management
                </span>

                <span>
                  /
                </span>

                <span className="text-black/70">
                  Departments
                </span>

              </div>

              <h1 className="text-4xl font-bold tracking-tight text-black">
                Departments
              </h1>

              <p className="mt-2 text-black/50 max-w-xl">
                Organize and manage the departments
                that make up your hospital.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="self-start lg:self-auto flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition"
            >

              <Plus
                size={18}
                strokeWidth={2}
              />

              <span>
                Add Department
              </span>

            </button>

          </div>

          {/* =========================
              GREEN ACCENT
          ========================= */}

          <div className="mt-8 h-px bg-black/10 relative">

            <div className="absolute left-0 top-0 h-px w-24 bg-[#8bcfa9]" />

          </div>

          {/* =========================
              SUMMARY / SEARCH
          ========================= */}

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-black/40 uppercase tracking-wider">
                Departments
              </p>

              <div className="mt-1 flex items-baseline gap-2">

                <span className="text-2xl font-bold text-black">
                  {departments.length}
                </span>

                <span className="text-sm text-black/50">
                  registered departments
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
                placeholder="Search departments..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-black/10 rounded-xl outline-none text-sm text-black placeholder:text-black/30 focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]"
              />

            </div>

          </div>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="mt-6 flex items-start justify-between gap-4 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl">

              <p className="text-sm">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600"
              >
                <X size={18} />
              </button>

            </div>
          )}

          {/* =========================
              LOADING
          ========================= */}

          {loading && (
            <div className="mt-10 py-16 text-center">

              <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-sm text-black/40">
                Loading departments...
              </p>

            </div>
          )}

          {/* =========================
              DEPARTMENT LIST
          ========================= */}

          {!loading && (
            <div className="mt-8">

              {/* COLUMN HEADERS */}

              {filteredDepartments.length > 0 && (
                <div className="hidden md:grid grid-cols-[60px_1.5fr_2fr_120px_100px] gap-6 px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-black/35">

                  <span>
                    #
                  </span>

                  <span>
                    Department
                  </span>

                  <span>
                    Description
                  </span>

                  <span>
                    Status
                  </span>

                  <span className="text-right">
                    Actions
                  </span>

                </div>
              )}

              {/* LIST */}

              {filteredDepartments.length === 0 ? (

                <div className="py-20 text-center border-t border-black/10">

                  <Building2
                    size={38}
                    className="mx-auto text-black/20"
                    strokeWidth={1.5}
                  />

                  <h3 className="mt-4 font-semibold text-black">
                    {searchTerm
                      ? "No departments found"
                      : "No departments yet"}
                  </h3>

                  <p className="mt-1 text-sm text-black/40">
                    {searchTerm
                      ? "Try a different search."
                      : "Add your first hospital department to get started."}
                  </p>

                </div>

              ) : (

                <div className="border-t border-black/10">

                  {filteredDepartments.map(
                    (department, index) => (

                      <div
                        key={department.id}
                        className="group grid grid-cols-1 md:grid-cols-[60px_1.5fr_2fr_120px_100px] gap-4 md:gap-6 px-5 py-6 border-b border-black/10 hover:bg-white/60 transition"
                      >

                        {/* NUMBER */}

                        <div className="hidden md:flex items-start pt-1">

                          <span className="text-sm font-medium text-black/25">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                        </div>

                        {/* DEPARTMENT */}

                        <div className="flex items-start gap-3">

                          <div className="mt-0.5 w-9 h-9 rounded-lg bg-[#e8f5ee] flex items-center justify-center shrink-0">

                            <Building2
                              size={17}
                              className="text-black"
                              strokeWidth={1.7}
                            />

                          </div>

                          <div className="min-w-0">

                            <h3 className="font-semibold text-black capitalize">
                              {department.name}
                            </h3>

                            <p className="md:hidden mt-1 text-sm text-black/45">
                              {department.description ||
                                "No description"}
                            </p>

                          </div>

                        </div>

                        {/* DESCRIPTION */}

                        <div className="hidden md:block">

                          <p className="text-sm leading-6 text-black/50 line-clamp-2">
                            {department.description ||
                              "No description provided."}
                          </p>

                        </div>

                        {/* STATUS */}

                        <div className="flex items-center">

                          <span
                            className={`text-xs font-semibold ${
                              department.is_active
                                ? "text-[#38845a]"
                                : "text-black/35"
                            }`}
                          >

                            <span
                              className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                                department.is_active
                                  ? "bg-[#5eaf7d]"
                                  : "bg-black/25"
                              }`}
                            />

                            {department.is_active
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center justify-end gap-1">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                department
                              )
                            }
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black hover:bg-[#e8f5ee] transition"
                            title="Edit department"
                          >

                            <Pencil
                              size={17}
                              strokeWidth={1.8}
                            />

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                department.id
                              )
                            }
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-black/30 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete department"
                          >

                            <Trash2
                              size={17}
                              strokeWidth={1.8}
                            />

                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>
          )}

        </div>

      </main>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#bfe8d0]/45 backdrop-blur-md"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }

          }}
        >

          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/70 overflow-hidden"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">

                  <Building2
                    size={21}
                    className="text-black"
                    strokeWidth={1.8}
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-black">

                    {editingDepartment
                      ? "Edit Department"
                      : "Add Department"}

                  </h2>

                  <p className="text-sm text-black/50">

                    {editingDepartment
                      ? "Update department details."
                      : "Create a new hospital department."}

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

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div>

                <label
                  htmlFor="department-name"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Department Name
                </label>

                <input
                  id="department-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Cardiology"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                />

              </div>

              <div className="mt-5">

                <label
                  htmlFor="department-description"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Description
                </label>

                <textarea
                  id="department-description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe this department..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8fcfa] text-black outline-none resize-none focus:border-black focus:ring-2 focus:ring-[#bfe8d0]"
                />

              </div>

              <div className="mt-5 flex items-center gap-3">

                <input
                  id="department-active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleFormChange}
                  className="w-4 h-4 accent-black"
                />

                <label
                  htmlFor="department-active"
                  className="text-sm font-medium text-black"
                >
                  Department is active
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
                  className="flex-1 bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-black/80 transition disabled:opacity-50"
                >

                  {saving
                    ? "Saving..."
                    : editingDepartment
                    ? "Save Changes"
                    : "Add Department"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Departments;