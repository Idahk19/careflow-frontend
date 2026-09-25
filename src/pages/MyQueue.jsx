import { useCallback, useEffect, useState } from "react";
import {
  Clock3,
  UserRound,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar";
import api from "../services/api";

const MyQueue = () => {
  const navigate = useNavigate();

  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchQueue = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setRefreshing(true);
      }

      const response = await api.get("/queue/my-queue/");

      setQueue(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setQueue(null);
        setError("");
      } else {
        console.error("Failed to load queue:", err);
        setError("Failed to load your queue.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleRefresh = () => {
    fetchQueue(true);
  };

  const getStatusLabel = () => {
    if (!queue) return "";

    switch (queue.status) {
      case "WAITING":
        return "Waiting";
      case "CALLED":
        return "It's your turn";
      case "IN_PROGRESS":
        return "Consultation in progress";
      default:
        return queue.status;
    }
  };

  const getStatusClass = () => {
    if (!queue) return "";

    switch (queue.status) {
      case "CALLED":
        return "bg-[#bfe8d0] text-[#27764d]";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-[#f1f7f3] text-[#27764d]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf9]">
        <PatientSidebar />

        <main className="lg:ml-64">
          <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-80"></div>

              <div className="bg-white rounded-2xl border border-black/5 p-8">
                <div className="h-40 bg-gray-100 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <PatientSidebar />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                My Queue
              </h1>

              <p className="text-gray-500 mt-2">
                Track your position and estimated waiting time.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-black/5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {!queue && !error && (
            <div className="bg-white rounded-2xl border border-black/5 p-8 sm:p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f1f7f3] flex items-center justify-center">
                <UsersRound
                  size={30}
                  className="text-[#27764d]"
                />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mt-5">
                You are not currently in a queue
              </h2>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Once you check in for today's appointment, your queue position
                will appear here.
              </p>

              <button
                onClick={() => navigate("/patient/appointments")}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#bfe8d0] text-[#27764d] font-semibold hover:bg-[#aee0c2] transition"
              >
                View My Appointments
                <ArrowRight size={17} />
              </button>
            </div>
          )}

          {queue && (
            <>
              {queue.status === "CALLED" && (
                <div className="mb-6 bg-[#bfe8d0] rounded-2xl p-6 border border-[#9ed5b6]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                      <CheckCircle2
                        size={27}
                        className="text-[#27764d]"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#27764d]">
                        It's your turn!
                      </h2>

                      <p className="text-[#27764d] mt-1">
                        Please proceed to the doctor's room.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {queue.status === "IN_PROGRESS" && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Stethoscope
                        size={25}
                        className="text-blue-700"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-blue-800">
                        Consultation in progress
                      </h2>

                      <p className="text-blue-700 mt-1">
                        Your consultation with {queue.doctor_name} is currently
                        in progress.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Your queue position
                      </p>

                      <div className="flex items-end gap-3 mt-2">
                        <span className="text-6xl font-bold text-[#27764d]">
                          {queue.people_ahead + 1}
                        </span>

                        <span className="text-gray-500 mb-2">
                          in line
                        </span>
                      </div>
                    </div>

                    <div
                      className={`self-start px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass()}`}
                    >
                      {getStatusLabel()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-[#f8faf9] rounded-xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                          <UsersRound
                            size={20}
                            className="text-[#27764d]"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            People ahead
                          </p>

                          <p className="text-xl font-semibold text-gray-900">
                            {queue.people_ahead}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f8faf9] rounded-xl p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                          <Clock3
                            size={20}
                            className="text-[#27764d]"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Estimated wait
                          </p>

                          <p className="text-xl font-semibold text-gray-900">
                            {queue.estimated_wait_minutes === 0
                              ? "Now"
                              : `${queue.estimated_wait_minutes} min`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-5 rounded-xl bg-[#f1f7f3]">
                    <p className="text-[#27764d] font-medium">
                      {queue.message}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-black/5 p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Appointment details
                  </h2>

                  <div className="space-y-5 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f1f7f3] flex items-center justify-center shrink-0">
                        <UserRound
                          size={19}
                          className="text-[#27764d]"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Doctor
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {queue.doctor_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f1f7f3] flex items-center justify-center shrink-0">
                        <Stethoscope
                          size={19}
                          className="text-[#27764d]"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Service
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {queue.service_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f1f7f3] flex items-center justify-center shrink-0">
                        <Clock3
                          size={19}
                          className="text-[#27764d]"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Queue number
                        </p>

                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          #{queue.queue_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyQueue;