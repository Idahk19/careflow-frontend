import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/accounts/register/", {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      setSuccess(
        response.data?.message || "Account created successfully."
      );

      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error(error);

      if (error.response) {
        const data = error.response.data;

        if (typeof data === "object" && data !== null) {
          const messages = Object.entries(data)
            .map(([field, errors]) => {
              const message = Array.isArray(errors)
                ? errors.join(" ")
                : String(errors);

              return `${field}: ${message}`;
            })
            .join(" ");

          setError(
            messages ||
              "Registration failed. Please check your details."
          );
        } else {
          setError("Registration failed. Please try again.");
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
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-[#bfe8d0] p-10 md:p-14 flex flex-col justify-center min-h-[650px]">
          <div className="mb-10">
            <p className="text-black text-sm font-semibold tracking-widest uppercase">
              CareFlow
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Your care,
            <br />
            starts here.
          </h1>

          <div className="mt-10">
            <div className="w-16 h-1 bg-black rounded-full"></div>
          </div>

          <p className="mt-6 text-black/60 text-sm">
            Simple healthcare. Better care. One place.
          </p>
        </div>

        <div className="bg-white p-10 md:p-14">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black">
              Create an account
            </h2>

            <p className="mt-2 text-gray-500">
              Enter your details to get started with CareFlow.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  First Name
                </label>

                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Last Name
                </label>

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
                />
              </div>
            </div>

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
                placeholder="Choose a username"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
              />
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-semibold text-black mb-2"
              >
                Phone Number
              </label>

              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
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

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-black outline-none transition focus:border-[#70c795] focus:ring-2 focus:ring-[#bfe8d0]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black transition"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} strokeWidth={1.8} />
                    ) : (
                      <Eye size={20} strokeWidth={1.8} />
                    )}
                  </button>
                </div>
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
              className="w-full bg-black text-white py-3.5 rounded-xl font-semibold transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:text-[#4f9f70] transition"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;