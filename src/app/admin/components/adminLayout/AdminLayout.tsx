"use client";

import { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../../sidebar/Sidebar";
import UsersTab from "../../usersTab/page";
import ChatsTab from "../../chatsTab/page";
import FeedbackTab from "../../feedbackTab/page";
import DashboardContent from "../../dashboardContent/DashboardContent";
import PricingRuleManager from "../../pricingRuleManager/PricingRuleManager";


export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 ml-64 lg:ml-64">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "usersTab" && <UsersTab />}
          {activeTab === "chatsTab" && <ChatsTab />}
          {activeTab === "feedbackTab" && <FeedbackTab />}
          {activeTab === "pricingRuleManager" && <PricingRuleManager />}
          
        </main>
      </div>
    </div>
  );
}
