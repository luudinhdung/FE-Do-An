"use client";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  MessageCircle,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL ;
function DashboardContent() {
  type StatColor = "blue" | "green" | "purple" | "orange";
  type StatsCard = {
    title: string;
    value: string;
    change: string;
    changeType: string;
    color: StatColor;
    icon: React.ElementType;
    description: string;
  };

  // 👉 Chuyển từ mảng tĩnh sang state để update real-time
  const [statsCards, setStatsCards] = useState<StatsCard[]>([
    {
      title: "Tổng số Users",
      value: "0",
      change: "+12.5%",
      changeType: "increase",
      color: "blue",
      icon: Users,
      description: "Người dùng đăng ký",
    },
    {
      title: "Chat đang hoạt động",
      value: "1,254",
      change: "+8.2%",
      changeType: "increase",
      color: "green",
      icon: MessageCircle,
      description: "Cuộc trò chuyện active",
    },
    {
      title: "Feedback nhận được",
      value: "486",
      change: "+15.3%",
      changeType: "increase",
      color: "purple",
      icon: Star,
      description: "Phản hồi trong tuần",
    },
    {
      title: "Tình trạng hệ thống",
      value: "98.5%",
      change: "+0.5%",
      changeType: "increase",
      color: "orange",
      icon: Activity,
      description: "Uptime server",
    },
  ]);

  // 👉 Gọi API lấy danh sách user
useEffect(() => {
  const fetchStats = async () => {
    try {
      const [usersRes, roomsRes,feedbackRes] = await Promise.all([
        axios.get(`${API_URL}/users/non-admin`),
        axios.get(`${API_URL}/chats/rooms`),
        axios.get(`${API_URL}/feedback`)
      ]);

      const userCount = usersRes.data.length;
      const roomCount = roomsRes.data.length;
      const feedbackCount = feedbackRes.data.data.length;
        
      // cập nhật statsCards
      setStatsCards((prev) => {
        const updated = [...prev];
        updated[0].value = userCount.toString();  // Tổng số user
        updated[1].value = roomCount.toString(); 
        updated[2].value = feedbackCount.toString(); // Tổng feedback
        return updated;
      });
    } catch (error) {
      console.error("Lỗi khi load stats:", error);
    }
  };

  fetchStats();
}, []);
  const recentActivities = [
    {
      user: "Nguyễn Văn A",
      action: "đã tạo tài khoản mới",
      time: "5 phút trước",
      avatar: "A",
      color: "bg-blue-500",
    },
    {
      user: "Trần Thị B",
      action: "đã gửi feedback tích cực",
      time: "12 phút trước",
      avatar: "B",
      color: "bg-purple-500",
    },
    {
      user: "Lê Minh C",
      action: "đã bắt đầu chat mới",
      time: "18 phút trước",
      avatar: "C",
      color: "bg-green-500",
    },
    {
      user: "Phạm Thu D",
      action: "đã cập nhật profile",
      time: "25 phút trước",
      avatar: "D",
      color: "bg-orange-500",
    },
    {
      user: "Hoàng Văn E",
      action: "đã hoàn thành khảo sát",
      time: "32 phút trước",
      avatar: "E",
      color: "bg-indigo-500",
    },
  ];

  const quickStats = [
    { label: "Hôm nay", value: 85, color: "bg-blue-500" },
    { label: "Tuần này", value: 91, color: "bg-green-500" },
    { label: "Tháng này", value: 78, color: "bg-purple-500" },
    { label: "Năm nay", value: 94, color: "bg-orange-500" },
  ];

  const systemAlerts = [
    {
      message: "Backup dữ liệu hoàn tất",
      time: "2 giờ trước",
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      message: "CPU sử dụng cao (85%)",
      time: "30 phút trước",
      icon: AlertTriangle,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      message: "Cập nhật hệ thống lúc 2:00 AM",
      time: "1 ngày trước",
      icon: Clock,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  const getColorClasses = (color: "blue" | "green" | "purple" | "orange") => {
    const colors = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-500" },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        icon: "bg-green-500",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        icon: "bg-purple-500",
      },
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        icon: "bg-orange-500",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">
                  Chào mừng đến với Admin!
                </h1>
              </div>
              <p className="text-blue-100 text-lg">
                Quản lý hệ thống và theo dõi hoạt động trong thời gian thực
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Hệ thống hoạt động tốt</span>
                </div>
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Hiệu suất tăng 15%</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Hiệu suất hệ thống
              </h3>
              <p className="text-gray-500 text-sm">
                Theo dõi hoạt động theo thời gian
              </p>
            </div>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-6">
            {quickStats.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-20 text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                  <div
                    className={`h-3 rounded-full ${item.color} relative overflow-hidden`}
                    style={{ width: `${item.value}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Thông báo hệ thống
          </h3>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${alert.color} border`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Hoạt động gần đây
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}
                >
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default DashboardContent;
