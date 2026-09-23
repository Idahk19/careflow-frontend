import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  SkipForward,
} from "lucide-react";
import DoctorSidebar from "../components/DoctorSidebar";
import api from "../services/api";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(
          "/appointments/doctor/dashboard/"
        );

        console.log("Doctor dashboard API response:", response.data);

        setDashboardData(response.data);
      } catch (error) {
        console.error("Doctor dashboard API error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        if (error.response?.status === 403) {
          setError(
            "You do not have permission to access the doctor dashboard."
          );
          return;
        }

        setError(
          error.response?.data?.detail ||
            error.response?.data?.error ||
            "Could not load the doctor dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const stats = [
    {
      title: "Today's Appointments",
      value: dashboardData?.today ?? 0,
      icon: CalendarDays,
    },
    {
      title: "In Progress",
      value: dashboardData?.in_progress ?? 0,
      icon: Clock3,
    },
    {
      title: "Completed",
      value: dashboardData?.completed ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Skipped",
      value: dashboardData?.skipped ?? 0,
      icon: SkipForward,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <DoctorSidebar />

      <main className="ml-0 lg:ml-64 min-h-screen">
        <div className="p-10">

          <h1 className="text-3xl font-bold text-black">
            Dashboard
          </h1>

          <p className="mt-2 text-black/50">
            Overview of your appointments and patient queue.
          </p>

          {loading && (
            <div className="mt-8">
              <p className="text-black/50">
                Loading dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {!loading && !error && dashboardData && (
            <>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="bg-[#bfe8d0] rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">

                        <div>
                          <p className="text-sm font-medium text-black/60">
                            {stat.title}
                          </p>

                          <p className="mt-3 text-4xl font-bold text-black">
                            {stat.value}
                          </p>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center">
                          <Icon
                            size={22}
                            strokeWidth={1.8}
                            className="text-black"
                          />
                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default DoctorDashboard;