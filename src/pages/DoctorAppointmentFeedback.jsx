import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Stethoscope,
  ClipboardList,
  HeartPulse,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorAppointmentFeedback() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);

  const [formData, setFormData] = useState({
    notes: "",
    diagnosis: "",
    recommendations: "",
    follow_up: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

useEffect(() => {
  const loadAppointment = async () => {
    try {
      setLoading(true);
      setError("");

      const appointmentResponse = await api.get(
        `/appointments/${appointmentId}/`
      );

      setAppointment(appointmentResponse.data);

      const feedbackResponse = await api.get(
        `/appointments/doctor/feedback/`
      );

      const feedbackList = Array.isArray(feedbackResponse.data)
        ? feedbackResponse.data
        : feedbackResponse.data.results || [];

      const existingFeedback = feedbackList.find(
        (feedback) =>
          Number(feedback.appointment) ===
          Number(appointmentId)
      );

      if (existingFeedback) {
        setFeedbackId(existingFeedback.id);

        setFormData({
          notes: existingFeedback.notes || "",
          diagnosis: existingFeedback.diagnosis || "",
          recommendations:
            existingFeedback.recommendations || "",
          follow_up: existingFeedback.follow_up || "",
        });
      }
    } catch (error) {
      console.error("Appointment feedback error:", error);

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

  loadAppointment();
}, [appointmentId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (feedbackId) {
        await api.patch(
          `/appointments/doctor/feedback/${feedbackId}/`,
          formData
        );

        setSuccess(
          "Appointment feedback has been updated successfully."
        );
      } else {
        const response = await api.post(
          "/appointments/doctor/feedback/",
          {
            appointment: Number(appointmentId),
            ...formData,
          }
        );

        setFeedbackId(response.data.id);

        setSuccess(
          "Appointment feedback has been saved successfully."
        );
      }

      setTimeout(() => {
        navigate("/doctor/appointments");
      }, 1200);
    } catch (error) {
      console.error("Feedback save error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.detail ||
          error.response?.data?.appointment ||
          "Could not save appointment feedback."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <DoctorSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-10 max-w-5xl">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-black/50 hover:text-black transition"
          >
            <ArrowLeft size={17} />
            Back to Appointments
          </button>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              {feedbackId && (
                <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center text-green-700">
                  <CheckCircle2 size={20} />
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-black">
                  {feedbackId
                    ? "Update Appointment Feedback"
                    : "Appointment Feedback"}
                </h1>

                <p className="mt-2 text-black/50">
                  {feedbackId
                    ? "Review and update the feedback for this completed appointment."
                    : "Add feedback and care information for this completed appointment."}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 bg-white rounded-2xl border border-black/5 p-8">
              <p className="text-black/50">
                Loading appointment...
              </p>
            </div>
          ) : error && !appointment ? (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          ) : (
            <>
              {appointment && (
                <div className="mt-8 bg-white rounded-2xl border border-black/5 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                        Patient
                      </p>
<h2 className="mt-2 text-xl font-bold text-black">
  {appointment.patient_name || "Patient"}
</h2>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                        Service
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-black/70">
                        <Stethoscope size={17} />

                        <span>
                          {appointment.service_name ||
                            appointment.service?.name ||
                            "—"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">
                        Status
                      </p>

                      <span className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f5ee] text-green-700 border border-[#cdebd9] text-xs font-semibold">
                        <CheckCircle2 size={14} />
                        Completed
                      </span>
                    </div>

                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 bg-white rounded-2xl border border-black/5 p-6 lg:p-8"
              >

                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <FileText size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-black">
                        Consultation Notes
                      </h2>

                      <p className="text-sm text-black/40">
                        Record the main observations from the appointment.
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Enter consultation notes..."
                    className="mt-5 w-full px-4 py-3 rounded-xl border border-black/10 outline-none focus:border-[#8bc9a5] focus:ring-2 focus:ring-[#bfe8d0]/40 resize-none"
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <HeartPulse size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-black">
                        Diagnosis / Findings
                      </h2>

                      <p className="text-sm text-black/40">
                        Record the diagnosis or important findings.
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter diagnosis or findings..."
                    className="mt-5 w-full px-4 py-3 rounded-xl border border-black/10 outline-none focus:border-[#8bc9a5] focus:ring-2 focus:ring-[#bfe8d0]/40 resize-none"
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <ClipboardList size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-black">
                        Recommendations
                      </h2>

                      <p className="text-sm text-black/40">
                        Add treatment advice or recommendations for the patient.
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter recommendations..."
                    className="mt-5 w-full px-4 py-3 rounded-xl border border-black/10 outline-none focus:border-[#8bc9a5] focus:ring-2 focus:ring-[#bfe8d0]/40 resize-none"
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <Stethoscope size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-black">
                        Follow-up Instructions
                      </h2>

                      <p className="text-sm text-black/40">
                        Tell the patient what they should do next.
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="follow_up"
                    value={formData.follow_up}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter follow-up instructions..."
                    className="mt-5 w-full px-4 py-3 rounded-xl border border-black/10 outline-none focus:border-[#8bc9a5] focus:ring-2 focus:ring-[#bfe8d0]/40 resize-none"
                  />
                </div>

                {error && (
                  <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mt-6 bg-[#e8f5ee] text-green-700 px-4 py-3 rounded-xl text-sm">
                    {success}
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-5 py-3 rounded-xl bg-white border border-black/10 text-black font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#bfe8d0] text-black font-semibold hover:bg-[#aee0c2] transition disabled:opacity-50"
                  >
                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : feedbackId
                        ? "Update Feedback"
                        : "Save Feedback"}
                  </button>
                </div>

              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default DoctorAppointmentFeedback;