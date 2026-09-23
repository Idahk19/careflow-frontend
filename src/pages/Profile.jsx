import { useEffect, useState } from "react";
import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/accounts/profile/");

      setProfile({
        username: response.data.username || "",
        email: response.data.email || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        phone_number: response.data.phone_number || "",
        role: response.data.role || "",
      });

      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to load profile:", error);
      setProfileError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");
    setSavingProfile(true);

    try {
      const response = await api.put("/accounts/profile/", {
        username: profile.username,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
      });

      const updatedUser = response.data.user;

      setProfile({
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        first_name: updatedUser.first_name || "",
        last_name: updatedUser.last_name || "",
        phone_number: updatedUser.phone_number || "",
        role: updatedUser.role || "",
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfileMessage("Your profile has been updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);

      const errors = error.response?.data;

      if (typeof errors === "object" && errors !== null) {
        const firstError = Object.values(errors)[0];

        setProfileError(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );
      } else {
        setProfileError("Unable to update your profile.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwords.current_password ||
      !passwords.new_password ||
      !passwords.confirm_password
    ) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwords.new_password.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const response = await api.post(
        "/accounts/change-password/",
        {
          current_password: passwords.current_password,
          new_password: passwords.new_password,
        }
      );

      setPasswordMessage(
        response.data.message || "Password changed successfully."
      );

      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);

      const data = error.response?.data;

      if (data?.error) {
        setPasswordError(data.error);
      } else {
        setPasswordError("Unable to change your password.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-sm text-black outline-none transition focus:border-[#7fc69c] focus:ring-2 focus:ring-[#bfe8d0]";

  const labelClass =
    "block text-sm font-medium text-black mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5faf7] flex items-center justify-center">
        <div className="flex items-center gap-3 text-black/60">
          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5faf7] px-5 py-8 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
              <UserRound
                size={21}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Profile
              </h1>

              <p className="text-sm text-black/50">
                Manage your personal information and account security.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile side information */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black/5 rounded-2xl p-6">
              <div className="w-16 h-16 rounded-full bg-[#bfe8d0] flex items-center justify-center mb-5">
                <UserRound
                  size={28}
                  strokeWidth={1.7}
                />
              </div>

              <h2 className="text-lg font-semibold text-black">
                {profile.first_name || profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`.trim()
                  : profile.username}
              </h2>

              <p className="text-sm text-black/50 mt-1">
                {profile.email}
              </p>

              <div className="mt-5 pt-5 border-t border-black/5">
                <div className="flex items-center gap-2 text-black/50 text-sm">
                  <ShieldCheck size={17} />
                  <span>Account type</span>
                </div>

                <p className="mt-2 text-sm font-semibold text-black capitalize">
                  {profile.role?.toLowerCase() || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-8">

            {/* Personal Information */}
            <section className="bg-white border border-black/5 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                  <UserRound
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Personal Information
                  </h2>

                  <p className="text-xs text-black/45 mt-1">
                    Update your account information.
                  </p>
                </div>
              </div>

              {profileMessage && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-[#e8f5ee] text-sm text-green-700 border border-green-100">
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-sm text-red-600 border border-red-100">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>
                    <label className={labelClass}>
                      First Name
                    </label>

                    <input
                      type="text"
                      name="first_name"
                      value={profile.first_name}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="last_name"
                      value={profile.last_name}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Last name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Username"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Email address"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone_number"
                      value={profile.phone_number}
                      onChange={handleProfileChange}
                      className={inputClass}
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="mt-7 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/85 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={17} />

                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>

            {/* Security */}
            <section className="bg-white border border-black/5 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                  <LockKeyhole
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Security
                  </h2>

                  <p className="text-xs text-black/45 mt-1">
                    Keep your account secure by updating your password.
                  </p>
                </div>
              </div>

              {passwordMessage && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-[#e8f5ee] text-sm text-green-700 border border-green-100">
                  {passwordMessage}
                </div>
              )}

              {passwordError && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-sm text-red-600 border border-red-100">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-5">

                  {/* Current Password */}
                  <div>
                    <label className={labelClass}>
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPasswords.current
                            ? "text"
                            : "password"
                        }
                        name="current_password"
                        value={passwords.current_password}
                        onChange={handlePasswordChange}
                        className={`${inputClass} pr-12`}
                        placeholder="Enter current password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          togglePassword("current")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className={labelClass}>
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPasswords.new
                            ? "text"
                            : "password"
                        }
                        name="new_password"
                        value={passwords.new_password}
                        onChange={handlePasswordChange}
                        className={`${inputClass} pr-12`}
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          togglePassword("new")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={labelClass}>
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPasswords.confirm
                            ? "text"
                            : "password"
                        }
                        name="confirm_password"
                        value={passwords.confirm_password}
                        onChange={handlePasswordChange}
                        className={`${inputClass} pr-12`}
                        placeholder="Confirm new password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          togglePassword("confirm")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-end">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-black/85 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <KeyRound size={17} />

                    {changingPassword
                      ? "Changing..."
                      : "Change Password"}
                  </button>
                </div>
              </form>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;