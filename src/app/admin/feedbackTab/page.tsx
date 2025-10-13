"use client";
import { useEffect, useState, useCallback } from "react";

interface Feedback {
  userId: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  content: string;
  screenshots?: string[];
  createdAt: string;
}

export default function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedbackIndex, setSelectedFeedbackIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://35.188.81.254";

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback`);
        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Xử lý phím mũi tên next/prev
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedFeedbackIndex === null || selectedImageIndex === null) return;

      const images = feedbacks[selectedFeedbackIndex].screenshots || [];
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev! + 1 < images.length ? prev! + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev! - 1 >= 0 ? prev! - 1 : images.length - 1));
      } else if (e.key === "Escape") {
        setSelectedFeedbackIndex(null);
        setSelectedImageIndex(null);
      }
    },
    [selectedFeedbackIndex, selectedImageIndex, feedbacks]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const goNext = () => {
    if (selectedFeedbackIndex === null || selectedImageIndex === null) return;
    const images = feedbacks[selectedFeedbackIndex].screenshots || [];
    setSelectedImageIndex((prev) => (prev! + 1 < images.length ? prev! + 1 : 0));
  };

  const goPrev = () => {
    if (selectedFeedbackIndex === null || selectedImageIndex === null) return;
    const images = feedbacks[selectedFeedbackIndex].screenshots || [];
    setSelectedImageIndex((prev) => (prev! - 1 >= 0 ? prev! - 1 : images.length - 1));
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Ý kiến người dùng</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : feedbacks.length === 0 ? (
        <p>Chưa có phản hồi nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Người dùng</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Nội dung</th>
                <th className="p-2 border">Ảnh</th>
                <th className="p-2 border">Ngày gửi</th>
              </tr>
            </thead>
              <tbody>
                {feedbacks.map((fb, fbIndex) => (
                  <tr key={fb.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center align-middle">{fb.userId}</td>
                    <td className="p-2 border text-center align-middle">{fb.name}</td>
                    <td className="p-2 border text-center align-middle">{fb.email}</td>
                    <td className="p-2 border text-center align-middle">{fb.content}</td>
                    <td className="p-2 border text-center align-middle">
                      {fb.screenshots && fb.screenshots.length > 0 ? (
                        <div className="flex gap-2 flex-wrap items-center">
                          <img
                            src={`${API_URL}/uploads/feedback/${fb.screenshots[0]}`}
                            alt="screenshot"
                            className="h-16 w-auto rounded cursor-pointer hover:opacity-80"
                            onClick={() => {
                              setSelectedFeedbackIndex(fbIndex);
                              setSelectedImageIndex(0);
                            }}
                          />
                          {fb.screenshots.length > 1 && (
                            <span className="text-gray-500 text-sm">
                              +{fb.screenshots.length - 1} ảnh
                            </span>
                          )}
                        </div>
                      ) : (
                        "Không có ảnh"
                      )}
                    </td>
                    <td className="p-2 border text-center align-middle">{new Date(fb.createdAt).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      )}

      {/* Modal hiển thị ảnh */}
      {selectedFeedbackIndex !== null && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => {
            setSelectedFeedbackIndex(null);
            setSelectedImageIndex(null);
          }}
        >
          <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={goPrev}
              className="absolute left-[-50px] text-white text-3xl font-bold p-2 hover:opacity-70"
            >
              ‹
            </button>

            <img
              src={`${API_URL}/uploads/feedback/${
                feedbacks[selectedFeedbackIndex].screenshots![selectedImageIndex]
              }`}
              alt="Xem ảnh"
              className=" h-[650px] w-[500px] rounded shadow-lg"
            />

            <button
              onClick={goNext}
              className="absolute right-[-50px] text-white text-3xl font-bold p-2 hover:opacity-70"
            >
              ›
            </button>

            <div className="absolute bottom-2 right-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {selectedImageIndex + 1}/{feedbacks[selectedFeedbackIndex].screenshots!.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
