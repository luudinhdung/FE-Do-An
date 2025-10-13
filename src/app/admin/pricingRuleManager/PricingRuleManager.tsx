"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type PricingRule = {
  type: "TEXT" | "IMAGE" | "FILE";
  cost: number;
  isActive: boolean;
};

export default function PricingRuleManager() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://35.188.81.254";


  // Lấy danh sách rules
  const fetchRules = async () => {
    try {
      const res = await axios.get(`${API_URL}/pricing-rules`);
      setRules(res.data);
    } catch (err) {
      console.error("Lỗi load rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Cập nhật rule
  const handleUpdate = async (rule: PricingRule) => {
    try {
      await axios.put(`${API_URL}/pricing-rules/${rule.type}`, {
        cost: rule.cost,
        isActive: rule.isActive,
      });
      await fetchRules();
      alert(`${rule.type} cập nhật thành công!`);
    } catch (err: any) {
      console.error("Lỗi update:", err);
      alert(err.response?.data?.message || "Lỗi update pricing rule");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quản lý giá tin nhắn</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Loại tin nhắn</th>
            <th className="border px-4 py-2">Giá (credits)</th>
            <th className="border px-4 py-2">Trạng thái</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{rule.type}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={rule.cost}
                  className="w-20 p-1 border rounded"
                  onChange={(e) => {
                    const newCost = parseInt(e.target.value) || 0;
                    setRules((prev) =>
                      prev.map((r) =>
                        r.type === rule.type ? { ...r, cost: newCost } : r
                      )
                    );
                  }}
                />
              </td>
              <td className="border px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={rule.isActive}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRules((prev) =>
                      prev.map((r) =>
                        r.type === rule.type ? { ...r, isActive: checked } : r
                      )
                    );
                  }}
                />
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleUpdate(rule)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Lưu
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
