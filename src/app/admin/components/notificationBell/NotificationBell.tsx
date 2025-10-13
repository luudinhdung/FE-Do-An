"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://35.188.81.254";

const socket = io(API_URL);

interface Feedback {
  id: string;
  name?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Feedback[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load feedbacks ban đầu
    fetch(`${API_URL}/feedback`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setNotifications(data.data);
      });

    // Lắng nghe feedback mới qua socket
    socket.on("newFeedback", (feedback: Feedback) => {
      setNotifications((prev) => [feedback, ...prev]);
    });

    return () => {
      socket.off("newFeedback");
    };
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`${API_URL}/feedback/${id}/read`, {
      method: "PATCH",
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-400 hover:text-gray-600"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-5 h-5" />
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
          <div className="p-3 font-semibold border-b">Thông báo</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    n.read ? "opacity-50" : ""
                  }`}
                >
                  <p className="text-sm font-medium">{n.name || "Ẩn danh"}</p>
                  <p className="text-xs text-gray-600">{n.content}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-3 text-sm text-gray-500">Không có thông báo</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
