import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  MessageSquareText,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar";
import api from "../services/api";

function PatientFeedback() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/appointments/my-feedback/"
        );

        const feedbackList = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        setFeedback(feedbackList);
      } catch (error) {
        console.error("Patient feedback error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          window.location.href = "/login";
          return;
        }

        setError(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Could not load appointment feedback."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <PatientSidebar />

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
              View feedback and follow-up information from your
              doctors.
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
                <MessageSquareText size={24} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-black">
                No Appointment Feedback
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Feedback from your completed appointments will
                appear here once your doctor adds it.
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
                          Doctor
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                            <Stethoscope size={18} />
                          </div>

                          <h2 className="text-xl font-bold text-black">
                            {item.doctor_name || "Doctor"}
                          </h2>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                          Service
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-black/70">
                          <ClipboardList size={17} />

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
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-7">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <FileText size={18} />
                        </div>

                        <h3 className="font-bold text-black">
                          Consultation Notes
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-7 whitespace-pre-line">
                        {item.notes ||
                          "No consultation notes provided."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <HeartPulse size={18} />
                        </div>

                        <h3 className="font-bold text-black">
                          Diagnosis / Findings
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-7 whitespace-pre-line">
                        {item.diagnosis ||
                          "No diagnosis or findings provided."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <ClipboardList size={18} />
                        </div>

                        <h3 className="font-bold text-black">
                          Recommendations
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-7 whitespace-pre-line">
                        {item.recommendations ||
                          "No recommendations provided."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                          <Stethoscope size={18} />
                        </div>

                        <h3 className="font-bold text-black">
                          Follow-up Instructions
                        </h3>
                      </div>

                      <p className="mt-3 text-sm text-black/60 leading-7 whitespace-pre-line">
                        {item.follow_up ||
                          "No follow-up instructions provided."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PatientFeedback;