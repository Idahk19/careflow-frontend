import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAuthError = (error) => {
    if (error.response?.status !== 401) return false;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    window.location.href = "/login";
    return true;
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/hospital/patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Patients error:", error);

      if (handleAuthError(error)) return;

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load patients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/hospital/patients/${id}/`);

      setPatients((current) =>
        current.filter((patient) => patient.id !== id)
      );
    } catch (error) {
      console.error("Delete patient error:", error);

      if (handleAuthError(error)) return;

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not delete patient."
      );
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();

    const fullName = `${patient.first_name || ""} ${
      patient.last_name || ""
    }`.toLowerCase();

    return (
      fullName.includes(search) ||
      patient.username?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.phone_number?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <AdminSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-7xl">

          <div className="mb-10">
            <p className="text-sm text-black/40 mb-2">
              Hospital Management / Patients
            </p>

            <h1 className="text-3xl font-bold text-black">
              Patients
            </h1>

            <p className="mt-2 text-black/50">
              View and manage registered patients.
            </p>
          </div>

          <div className="h-1 w-16 bg-[#8fd3ad] rounded-full mb-8" />

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-sm font-semibold text-black">
              {filteredPatients.length}{" "}
              {filteredPatients.length === 1 ? "Patient" : "Patients"}
            </p>

            <div className="relative w-full sm:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
              />

              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 rounded-xl outline-none focus:border-[#8fd3ad] transition text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-black/40">
              Loading patients...
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-16 text-center">
              <UserRound
                size={32}
                strokeWidth={1.5}
                className="mx-auto text-black/30 mb-3"
              />

              <p className="text-sm font-medium text-black">
                {searchTerm
                  ? "No patients found."
                  : "No patients registered yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-black/40 uppercase tracking-wider">
                      #
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Patient
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Username
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Contact
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Phone
                    </th>

                    <th className="px-4 py-4 text-right text-xs font-semibold text-black/40 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className="border-b border-black/5 last:border-b-0 hover:bg-[#f8fcfa] transition"
                    >
                      <td className="px-4 py-5 text-sm text-black/40">
                        {index + 1}
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                            <UserRound
                              size={17}
                              strokeWidth={1.7}
                              className="text-black"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-black">
                              {patient.first_name}{" "}
                              {patient.last_name}
                            </p>

                            <p className="text-xs text-black/40">
                              Patient #{patient.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 text-sm text-black/60">
                        {patient.username}
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2 text-sm text-black/60">
                          <Mail
                            size={15}
                            strokeWidth={1.7}
                          />
                          <span>{patient.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2 text-sm text-black/60">
                          <Phone
                            size={15}
                            strokeWidth={1.7}
                          />
                          <span>
                            {patient.phone_number || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(patient.id)
                            }
                            className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 transition rounded-lg"
                            title="Delete patient"
                          >
                            <Trash2
                              size={17}
                              strokeWidth={1.8}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Patients;