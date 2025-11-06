"use client";
import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL ;
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  balance: number; // 👈 thêm trường số tiền
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi khi tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  console.log(users,"users");
  

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Danh sách User</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Số dư (credits)</th>
                <th className="p-2 border">Avatar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border text-blue-600 font-semibold">
                    {user?.balance} ₫
                  </td>
                  <td className="p-2 border">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
