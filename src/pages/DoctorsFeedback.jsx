import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Pencil,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorsFeedback() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [patientNames, setPatientNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/appointments/doctor/feedback/"
      );

      const feedbackList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setFeedback(feedbackList);

      const appointmentRequests = feedbackList.map(
        (item) =>
          api.get(`/appointments/${item.appointment}/`)
      );

      const appointmentResponses = await Promise.all(
        appointmentRequests
      );

      const names = {};

      appointmentResponses.forEach((response, index) => {
        const appointmentId =
          feedbackList[index].appointment;

        names[appointmentId] =
          response.data.patient_name || "Patient";
      });

      setPatientNames(names);
    } catch (error) {
      console.error("Feedback error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.detail ||
          "Could not load appointment feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleUpdate = (appointmentId) => {
    navigate(
      `/doctor/appointments/${appointmentId}/feedback`
    );
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) {
      return;
    }

    try {
      setDeletingId(feedbackToDelete.id);
      setError("");

      await api.delete(
        `/appointments/doctor/feedback/${feedbackToDelete.id}/delete/`
      );

      setFeedback((previous) =>
        previous.filter(
          (item) => item.id !== feedbackToDelete.id
        )
      );

      setFeedbackToDelete(null);
    } catch (error) {
      console.error("Delete feedback error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.detail ||
          "Could not delete appointment feedback."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <DoctorSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-6xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black transition"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-black">
              Appointment Feedback
            </h1>

            <p className="mt-2 text-black/50">
              View and manage feedback added to your completed
              appointments.
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-8 bg-white rounded-2xl border border-black/5 p-8">
              <p className="text-black/50">
                Loading feedback...
              </p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="mt-8 bg-white rounded-2xl border border-black/5 p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center">
                <FileText size={24} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-black">
                No feedback yet
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Feedback you add to completed appointments will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-black/5 overflow-hidden"
                >
                  <div className="p-6 border-b border-black/5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div>
                        <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                          Patient
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                            <UserRound size={17} />
                          </div>

                          <h2 className="text-xl font-bold text-black">
                            {patientNames[item.appointment] ||
                              "Patient"}
                          </h2>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                          Service
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-black/70">
                          <Stethoscope size={17} />

                          <span>
                            {item.service_name || "—"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                          Appointment Date
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-black/70">
                          <CalendarDays size={17} />

                          <span>
                            {item.appointment_date || "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdate(item.appointment)
                          }
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#bfe8d0] text-black text-sm font-semibold hover:bg-[#aee0c2] transition"
                        >
                          <Pencil size={16} />
                          Update
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setFeedbackToDelete(item)
                          }
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-semibold hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <FileText size={17} />
                        </div>

                        <h3 className="font-bold text-black">
                          Consultation Notes
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-6 whitespace-pre-line">
                        {item.notes ||
                          "No consultation notes added."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <HeartPulse size={17} />
                        </div>

                        <h3 className="font-bold text-black">
                          Diagnosis / Findings
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-6 whitespace-pre-line">
                        {item.diagnosis ||
                          "No diagnosis or findings added."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <ClipboardList size={17} />
                        </div>

                        <h3 className="font-bold text-black">
                          Recommendations
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-6 whitespace-pre-line">
                        {item.recommendations ||
                          "No recommendations added."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <Stethoscope size={17} />
                        </div>

                        <h3 className="font-bold text-black">
                          Follow-up Instructions
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-6 whitespace-pre-line">
                        {item.follow_up ||
                          "No follow-up instructions added."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {feedbackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setFeedbackToDelete(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <button
              type="button"
              onClick={() => setFeedbackToDelete(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-black/40 hover:bg-gray-100 hover:text-black transition"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-black">
              Delete Feedback?
            </h2>

            <p className="mt-2 text-sm text-black/50 leading-6">
              Are you sure you want to delete this appointment
              feedback? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFeedbackToDelete(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl border border-black/10 text-black font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId !== null}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsFeedback;