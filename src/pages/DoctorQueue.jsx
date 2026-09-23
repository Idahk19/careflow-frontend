import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListOrdered,
  Clock3,
  UsersRound,
  UserRound,
  Stethoscope,
  PhoneCall,
  Play,
  CheckCircle2,
  SkipForward,
  RefreshCw,
} from "lucide-react";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorQueue() {
  const navigate = useNavigate();

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const fetchQueue = async () => {
    try {
      const response = await api.get("/queue/doctor/");
      setQueueData(response.data);
      setError("");
    } catch (error) {
      console.error("Doctor queue API error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setError("You do not have permission to access the doctor queue.");
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load the queue."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (action, endpoint) => {
    setActionLoading(action);
    setError("");

    try {
      await api.post(endpoint);
      await fetchQueue();
    } catch (error) {
      console.error(`${action} error:`, error);

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
          `Could not ${action.toLowerCase()}.`
      );
    } finally {
      setActionLoading("");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100";

      case "CALLED":
        return "bg-blue-50 text-blue-700 border border-blue-100";

      case "IN_PROGRESS":
        return "bg-[#e8f5ee] text-green-700 border border-[#cdebd9]";

      case "SKIPPED":
        return "bg-red-50 text-red-600 border border-red-100";

      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatTime = (time) => {
    if (!time) return "—";

    return new Date(time).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const patients = queueData?.patients || [];

  const waitingPatients = patients.filter(
    (patient) => patient.status === "WAITING"
  );

  const calledPatient = patients.find(
    (patient) => patient.status === "CALLED"
  );

  const inProgressPatient = patients.find(
    (patient) => patient.status === "IN_PROGRESS"
  );

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <DoctorSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">
                My Queue
              </h1>

              <p className="mt-2 text-black/50">
                Manage patients currently waiting to see you.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchQueue}
              disabled={loading || actionLoading}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-black/5 text-black font-medium hover:bg-[#e8f5ee] transition disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Queue
            </button>
          </div>

          {error && (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-8 bg-white rounded-2xl p-8 border border-black/5">
              <p className="text-black/50">
                Loading queue...
              </p>
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#bfe8d0] rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black/60">
                        People in Queue
                      </p>

                      <p className="mt-3 text-4xl font-bold text-black">
                        {queueData?.total_people ?? 0}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center">
                      <UsersRound
                        size={22}
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black/50">
                        Queue Date
                      </p>

                      <p className="mt-3 text-xl font-bold text-black">
                        {queueData?.queue_date || "—"}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <ListOrdered
                        size={22}
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-black/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black/50">
                        Doctor
                      </p>

                      <p className="mt-3 text-xl font-bold text-black">
                        {queueData?.doctor || "Doctor"}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <Stethoscope
                        size={22}
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-white rounded-2xl border border-black/5 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <p className="text-sm font-medium text-black/50">
                      Queue Control
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-black">
                      Patient Flow
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!calledPatient && !inProgressPatient && (
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(
                            "Call Next Patient",
                            "/queue/doctor/call-next/"
                          )
                        }
                        disabled={
                          waitingPatients.length === 0 ||
                          actionLoading !== ""
                        }
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#bfe8d0] text-black font-semibold hover:bg-[#aee0c2] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PhoneCall size={18} />
                        {actionLoading === "Call Next Patient"
                          ? "Calling..."
                          : "Call Next Patient"}
                      </button>
                    )}

                    {calledPatient && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleAction(
                              "Start Consultation",
                              "/queue/doctor/start/"
                            )
                          }
                          disabled={actionLoading !== ""}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#bfe8d0] text-black font-semibold hover:bg-[#aee0c2] transition disabled:opacity-50"
                        >
                          <Play size={18} />
                          {actionLoading === "Start Consultation"
                            ? "Starting..."
                            : "Start Consultation"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleAction(
                              "Skip Patient",
                              "/queue/doctor/skip/"
                            )
                          }
                          disabled={actionLoading !== ""}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition disabled:opacity-50"
                        >
                          <SkipForward size={18} />
                          {actionLoading === "Skip Patient"
                            ? "Skipping..."
                            : "Skip Patient"}
                        </button>
                      </>
                    )}

                    {inProgressPatient && (
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(
                            "Complete Consultation",
                            "/queue/doctor/complete/"
                          )
                        }
                        disabled={actionLoading !== ""}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#bfe8d0] text-black font-semibold hover:bg-[#aee0c2] transition disabled:opacity-50"
                      >
                        <CheckCircle2 size={18} />
                        {actionLoading === "Complete Consultation"
                          ? "Completing..."
                          : "Complete Consultation"}
                      </button>
                    )}
                  </div>
                </div>

                {calledPatient && (
                  <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-sm text-blue-700">
                      Patient{" "}
                      <span className="font-semibold">
                        {calledPatient.patient_name}
                      </span>{" "}
                      is currently called and ready for consultation.
                    </p>
                  </div>
                )}

                {inProgressPatient && (
                  <div className="mt-5 p-4 rounded-xl bg-[#e8f5ee] border border-[#cdebd9]">
                    <p className="text-sm text-green-700">
                      Consultation in progress with{" "}
                      <span className="font-semibold">
                        {inProgressPatient.patient_name}
                      </span>
                      .
                    </p>
                  </div>
                )}

                {!calledPatient &&
                  !inProgressPatient &&
                  waitingPatients.length === 0 && (
                    <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm text-black/50">
                        There are no patients available to call.
                      </p>
                    </div>
                  )}
              </div>

              <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-black">
                      Today's Patients
                    </h2>

                    <p className="text-sm text-black/50 mt-1">
                      Patients currently in your queue
                    </p>
                  </div>

                  <span className="text-sm text-black/50">
                    {patients.length} patient
                    {patients.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {patients.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e8f5ee] flex items-center justify-center">
                      <ListOrdered
                        size={26}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-black">
                      No patients in the queue
                    </h3>

                    <p className="mt-2 text-sm text-black/50">
                      There are currently no patients waiting to see you.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                    <div className="hidden md:grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 bg-[#f8fcfa] border-b border-black/5 text-xs font-semibold text-black/40 uppercase tracking-wider">
                      <span>Queue</span>
                      <span>Patient</span>
                      <span>Status</span>
                      <span>Checked In</span>
                      <span>People Ahead</span>
                      <span>Estimated Wait</span>
                    </div>

                    <div className="divide-y divide-black/5">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          className="px-6 py-5 hover:bg-[#fafffc] transition"
                        >
                          <div className="md:grid md:grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr] md:gap-4 md:items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center font-bold text-black">
                                #{patient.queue_number}
                              </div>

                              <span className="md:hidden text-sm font-semibold text-black">
                                Queue #{patient.queue_number}
                              </span>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#e8f5ee] flex items-center justify-center">
                                <UserRound
                                  size={18}
                                  strokeWidth={1.8}
                                />
                              </div>

                              <div>
                                <p className="font-semibold text-black">
                                  {patient.patient_name ||
                                    "Unknown Patient"}
                                </p>

                                <p className="text-xs text-black/40 mt-1">
                                  Queue #{patient.queue_number}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                                  patient.status
                                )}`}
                              >
                                {formatStatus(patient.status)}
                              </span>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <p className="md:hidden text-xs text-black/40 mb-1">
                                Checked In
                              </p>

                              <div className="flex items-center gap-2 text-sm text-black/70">
                                <Clock3 size={15} />
                                {formatTime(patient.checked_in_at)}
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <p className="md:hidden text-xs text-black/40 mb-1">
                                People Ahead
                              </p>

                              <p className="text-sm font-semibold text-black">
                                {patient.people_ahead ?? 0}
                              </p>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <p className="md:hidden text-xs text-black/40 mb-1">
                                Estimated Wait
                              </p>

                              <div className="flex items-center gap-2 text-sm">
                                <Clock3
                                  size={15}
                                  className="text-black/40"
                                />

                                <span className="font-medium text-black">
                                  {patient.estimated_wait_minutes ?? 0} min
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DoctorQueue;