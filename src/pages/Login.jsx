import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        "/accounts/login/",
        formData
      );

      const { access, refresh, user } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(
        `Welcome back, ${user.first_name || user.username}!`
      );

    } catch (error) {
      console.error(error);

      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid username or password.");
        } else {
          setError(
            error.response.data?.error ||
            "Login failed. Please try again."
          );
        }
      } else {
        setError("Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f5ee] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-[#bfe8d0] p-10 md:p-14 flex flex-col justify-center min-h-[500px]">

          <div className="mb-10">
            <p className="text-black text-sm font-semibold tracking-widest uppercase">
              CareFlow
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Welcome back.
          </h1>

          <div className="mt-10">
            <div className="w-16 h-1 bg-black rounded-full"></div>
          </div>

          <p className="mt-6 text-black/60 text-sm">
            Simple healthcare. Better care. One place.
          </p>

        </div>

        <div className="bg-white p-10 md:p-14 flex flex-col justify-center">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black">
              Sign in
            </h2>

            <p className="mt-2 text-gray-500">
              Enter your details to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-black mb-2"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-2"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black transition"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.8} />
                  ) : (
                    <Eye size={20} strokeWidth={1.8} />
                  )}
                </button>

              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-[#e8f5ee] border border-[#bfe8d0] text-black px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-semibold transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black hover:text-[#4f9f70] transition"
            >
              Create one
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;