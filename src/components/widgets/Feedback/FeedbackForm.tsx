"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface FeedbackFormProps {
  onClose: () => void;
}

export default function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [user, setUser] = useState<any>(null); // lưu user từ API
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    content: "",
    screenshots: [] as File[],
  });
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user khi mở form
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3002/users/current", {
          withCredentials: true,
        });
        setUser(res.data.user);

        console.log(res.data.user, "user");

        // fill sẵn vào form
        setForm((prev) => ({
          ...prev,
          name: res.data.user.name || "",
          email: res.data.user.email || "",
        }));
      } catch (err) {
        console.error("Lỗi lấy user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, screenshots: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async () => {
    if (!form.content.trim()) return alert("Vui lòng nhập nội dung");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", user?.id || "");
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", form.phone);
      formData.append("content", form.content);

      // ✅ thêm tất cả ảnh
      form.screenshots.forEach((file, index) => {
        formData.append("screenshots", file);
        // nếu backend cần index thì: formData.append(`screenshots[${index}]`, file);
      });

      const res = await fetch("http://localhost:3002/feedback", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Lỗi khi gửi feedback");
      alert("Cảm ơn bạn đã gửi ý kiến!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6 border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gửi phản hồi</h2>

      <input
        type="text"
        name="name"
        placeholder="Tên"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="text"
        name="phone"
        placeholder="Số điện thoại (tùy chọn)"
        value={form.phone}
        onChange={handleChange}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <textarea
        name="content"
        placeholder="Nội dung góp ý..."
        value={form.content}
        onChange={handleChange}
        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-28 resize-none"
      />

      <label className="block mb-4">
        <span className="text-gray-700">Ảnh minh họa (tùy chọn)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 
                   file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                   file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
        />
      </label>

      {form.screenshots.length > 0 && (
        <div className="flex gap-3 mb-4 flex-wrap">
          {form.screenshots.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt={`preview-${i}`}
              className="h-20 w-auto rounded-lg border shadow-sm hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg transition-colors shadow"
      >
        {loading ? "Đang gửi..." : "Gửi phản hồi"}
      </button>
    </div>
  );
}
