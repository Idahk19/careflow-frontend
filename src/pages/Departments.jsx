import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Building2,
  X,
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
        // EDIT
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
        // ADD
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

  return (
    <div className="min-h-screen bg-[#f5faf7]">

      <AdminSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">

        <div className="p-6 lg:p-10">

          {/* PAGE HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold text-black">
                Departments
              </h1>

              <p className="mt-2 text-black/50">
                Manage hospital departments.
              </p>

            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-[#bfe8d0] text-black px-5 py-3 rounded-xl font-semibold hover:bg-[#a9ddc0] transition"
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

          {/* ERROR */}

          {error && (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="mt-8">

              <p className="text-black/50">
                Loading departments...
              </p>

            </div>
          )}

          {/* DEPARTMENTS */}

          {!loading && !error && (
            <div className="mt-8 bg-white rounded-2xl border border-black/5 overflow-hidden">

              {/* TABLE HEADER */}

              <div className="px-6 py-5 border-b border-black/5">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#bfe8d0] flex items-center justify-center">

                    <Building2
                      size={20}
                      className="text-black"
                    />

                  </div>

                  <div>

                    <h2 className="font-semibold text-black">
                      Hospital Departments
                    </h2>

                    <p className="text-sm text-black/50">
                      {departments.length} departments
                    </p>

                  </div>

                </div>

              </div>

              {/* EMPTY */}

              {departments.length === 0 ? (
                <div className="p-10 text-center">

                  <Building2
                    size={40}
                    className="mx-auto text-black/20"
                  />

                  <p className="mt-4 text-black/50">
                    No departments found.
                  </p>

                </div>
              ) : (

                <div className="divide-y divide-black/5">

                  {departments.map(
                    (department) => (

                      <div
                        key={department.id}
                        className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#f8fcfa] transition"
                      >

                        {/* DEPARTMENT INFO */}

                        <div className="flex items-center gap-4 min-w-0">

                          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#e8f5ee] flex items-center justify-center">

                            <Building2
                              size={21}
                              className="text-black"
                              strokeWidth={1.8}
                            />

                          </div>

                          <div className="min-w-0">

                            <h3 className="font-semibold text-black capitalize">
                              {department.name}
                            </h3>

                            <p className="mt-1 text-sm text-black/50">
                              {department.description}
                            </p>

                            <span
                              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                department.is_active
                                  ? "bg-[#bfe8d0] text-black"
                                  : "bg-black/5 text-black/50"
                              }`}
                            >

                              {department.is_active
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center gap-2 shrink-0">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                department
                              )
                            }
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-black hover:bg-[#e8f5ee] transition"
                            title="Edit department"
                          >

                            <Pencil
                              size={18}
                              strokeWidth={1.8}
                            />

                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                department.id
                              )
                            }
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-50 transition"
                            title="Delete department"
                          >

                            <Trash2
                              size={18}
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

              {/* NAME */}

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

              {/* DESCRIPTION */}

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

              {/* ACTIVE */}

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

              {/* FORM ERROR */}

              {formError && (

                <div className="mt-5 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {formError}
                </div>

              )}

              {/* BUTTONS */}

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