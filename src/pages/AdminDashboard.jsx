import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UsersRound,
  Stethoscope,
  BriefcaseMedical,
  CalendarDays,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(
          "/hospital/admin/dashboard/"
        );

        console.log("Dashboard API response:", response.data);

        setDashboardData(response.data);
      } catch (error) {
        console.error("Dashboard API error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        if (error.response?.status === 403) {
          setError(
            "You do not have permission to access the admin dashboard."
          );
          return;
        }

        setError(
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Could not load the admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const stats = [
    {
      title: "Total Patients",
      value: dashboardData?.total_patients ?? 0,
      icon: UsersRound,
    },
    {
      title: "Total Doctors",
      value: dashboardData?.total_doctors ?? 0,
      icon: Stethoscope,
    },
    {
      title: "Total Services",
      value: dashboardData?.total_services ?? 0,
      icon: BriefcaseMedical,
    },
    {
      title: "Total Appointments",
      value: dashboardData?.total_appointments ?? 0,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5faf7]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen">
        <div className="p-10">

          <h1 className="text-3xl font-bold text-black">
            Dashboard
          </h1>

          <p className="mt-2 text-black/50">
            Overview of your hospital system.
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

export default AdminDashboard;