"use client";
import { LayoutDashboard, Users, MessageSquare, MessageCircle } from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "usersTab", label: "Users", icon: Users },
    { id: "chatsTab", label: "Chats", icon: MessageCircle },
    { id: "feedbackTab", label: "Feedback", icon: MessageSquare },
    { id: "pricingRuleManager", label: "PricingRule", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white fixed h-full">
      <div className="p-4 font-bold text-xl">Admin</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-700 ${
              activeTab === item.id ? "bg-gray-700" : ""
            }`}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
