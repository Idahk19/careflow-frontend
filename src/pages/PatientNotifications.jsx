import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Clock3,
  Filter,
  X,
} from "lucide-react";
import PatientSidebar from "../components/PatientSidebar";
import api from "../services/api";

function PatientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [typeFilter, setTypeFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to view your notifications."
        );
      } else {
        setError("Failed to load your notifications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read/`
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "—";

    return new Date(dateTime).toLocaleString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "CHECKED_IN":
        return "Checked In";

      case "ALMOST_TURN":
        return "Almost Your Turn";

      case "YOUR_TURN":
        return "Your Turn";

      default:
        return "Notification";
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case "CHECKED_IN":
        return "bg-[#e8f5ee] text-[#27764d]";

      case "ALMOST_TURN":
        return "bg-[#f0f7f3] text-[#3d7357]";

      case "YOUR_TURN":
        return "bg-[#bfe8d0] text-[#1f6040]";

      default:
        return "bg-[#f1f5f3] text-[#4b5f54]";
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case "YOUR_TURN":
        return "bg-[#bfe8d0] text-[#1f6040]";

      case "ALMOST_TURN":
        return "bg-[#e8f5ee] text-[#27764d]";

      case "CHECKED_IN":
        return "bg-[#e8f5ee] text-[#27764d]";

      default:
        return "bg-[#f1f5f3] text-[#4b5f54]";
    }
  };

  const notificationTypes = useMemo(() => {
    return [
      ...new Set(
        notifications
          .map(
            (notification) =>
              notification.notification_type
          )
          .filter(Boolean)
      ),
    ];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesType =
        !typeFilter ||
        notification.notification_type === typeFilter;

      const matchesRead =
        !readFilter ||
        (readFilter === "unread" &&
          !notification.is_read) ||
        (readFilter === "read" &&
          notification.is_read);

      return matchesType && matchesRead;
    });
  }, [notifications, typeFilter, readFilter]);

  const clearFilters = () => {
    setTypeFilter("");
    setReadFilter("");
  };

  const hasFilters = typeFilter || readFilter;

  const totalNotifications = notifications.length;

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.is_read
  ).length;

  const checkedInCount = notifications.filter(
    (notification) =>
      notification.notification_type === "CHECKED_IN"
  ).length;

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <PatientSidebar />

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-5 sm:p-8 lg:p-10">

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#bfe8d0] flex items-center justify-center">
                <Bell
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Notifications
                </h1>

                <p className="text-sm text-black/50 mt-1">
                  Stay updated on your appointments and queue status
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Total
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {totalNotifications}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Unread
              </p>

              <p className="text-2xl font-bold text-[#27764d] mt-2">
                {unreadCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Read
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {readCount}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="text-sm text-black/50">
                Queue Updates
              </p>

              <p className="text-2xl font-bold text-black mt-2">
                {checkedInCount}
              </p>
            </div>

          </div>

          <div className="bg-white rounded-2xl border border-black/5 p-5 mb-6">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2">
                <Filter
                  size={18}
                  className="text-black/50"
                />

                <h2 className="font-semibold text-black">
                  Filter Notifications
                </h2>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Notification Type
                </label>

                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                  className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                >
                  <option value="">
                    All notifications
                  </option>

                  {notificationTypes.map((type) => {
                    const notification = notifications.find(
                      (item) =>
                        item.notification_type === type
                    );

                    return (
                      <option
                        key={type}
                        value={type}
                      >
                        {notification?.notification_type_display ||
                          getNotificationTitle(type)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/50 mb-2">
                  Status
                </label>

                <select
                  value={readFilter}
                  onChange={(e) =>
                    setReadFilter(e.target.value)
                  }
                  className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white text-sm outline-none focus:border-[#8bcfa9] focus:ring-2 focus:ring-[#bfe8d0]/40"
                >
                  <option value="">
                    All notifications
                  </option>

                  <option value="unread">
                    Unread
                  </option>

                  <option value="read">
                    Read
                  </option>
                </select>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">

            <div className="px-5 sm:px-6 py-5 border-b border-black/5">
              <h2 className="font-semibold text-black">
                Your Notifications
              </h2>

              <p className="text-sm text-black/50 mt-1">
                Showing {filteredNotifications.length} of{" "}
                {notifications.length} notifications
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-[#bfe8d0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

                <p className="text-sm text-black/50">
                  Loading notifications...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-sm text-red-600 mb-4">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="px-5 py-2.5 rounded-xl bg-[#bfe8d0] text-black text-sm font-medium hover:bg-[#aee0c2] transition"
                >
                  Try Again
                </button>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">

                <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center mx-auto mb-4">
                  <Bell
                    size={25}
                    className="text-[#27764d]"
                    strokeWidth={1.7}
                  />
                </div>

                <h3 className="font-semibold text-black">
                  No notifications found
                </h3>

                <p className="text-sm text-black/50 mt-1">
                  {hasFilters
                    ? "Try changing or clearing your filters."
                    : "You don't have any notifications yet."}
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-sm font-medium text-[#27764d] hover:underline"
                  >
                    Clear filters
                  </button>
                )}

              </div>
            ) : (
              <div className="divide-y divide-black/5">

                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-5 sm:px-6 py-5 transition ${
                      notification.is_read
                        ? "bg-white hover:bg-[#f8faf9]"
                        : "bg-[#f5faf7] hover:bg-[#eef7f1]"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconClass(
                          notification.notification_type
                        )}`}
                      >
                        <Bell
                          size={20}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">

                              <h3 className="font-semibold text-black">
                                {notification.notification_type_display ||
                                  getNotificationTitle(
                                    notification.notification_type
                                  )}
                              </h3>

                              {!notification.is_read && (
                                <span className="w-2 h-2 rounded-full bg-[#27764d]" />
                              )}

                            </div>

                            <p className="text-sm text-black/65 mt-2 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>

                          <span
                            className={`inline-flex self-start px-3 py-1.5 rounded-full text-xs font-medium ${getNotificationClass(
                              notification.notification_type
                            )}`}
                          >
                            {notification.is_read
                              ? "Read"
                              : "Unread"}
                          </span>

                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">

                          <div className="flex items-center gap-2 text-xs text-black/40">
                            <Clock3 size={14} />

                            <span>
                              {formatDateTime(
                                notification.created_at
                              )}
                            </span>
                          </div>

                          {!notification.is_read && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(notification.id)
                              }
                              className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-lg bg-[#e8f5ee] text-[#27764d] text-xs font-medium hover:bg-[#bfe8d0] transition"
                            >
                              <CheckCheck size={15} />
                              Mark as read
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientNotifications;