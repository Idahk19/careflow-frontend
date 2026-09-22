import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Plus,
  Building2,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

function Departments() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        navigate("/login");
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
    } catch (error) {
      console.error("Delete department error:", error);

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
        "Could not delete department."
      );
    }
  };

  const handleEdit = (department) => {
    navigate(
      `/admin/departments/${department.id}/edit`
    );
  };

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <AdminSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-10">

          <div className="flex items-center justify-between">

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
              onClick={() =>
                navigate("/admin/departments/create")
              }
              className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-medium hover:bg-black/80 transition"
            >
              <Plus size={18} />

              <span>
                Add Department
              </span>
            </button>

          </div>

          {loading && (
            <div className="mt-8">
              <p className="text-black/50">
                Loading departments...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-8 bg-white rounded-2xl border border-black/5 overflow-hidden">

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

                  {departments.map((department) => (
                    <div
                      key={department.id}
                      className="px-6 py-5 flex items-center justify-between hover:bg-[#f8fcfa] transition"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <Building2
                            size={21}
                            className="text-black"
                            strokeWidth={1.8}
                          />
                        </div>

                        <div>
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

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(department)
                          }
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-black hover:bg-[#e8f5ee] transition"
                          title="Edit department"
                        >
                          <Pencil
                            size={18}
                            strokeWidth={1.8}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(department.id)
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
                  ))}

                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Departments;