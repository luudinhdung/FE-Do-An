"use client";
import { useContext, useState } from "react";
import NotificationBell from "../notificationBell/NotificationBell";
import {
  default as Modal,
  default as SettingAccount,
} from "../settingAccount/SettingAccount";
import { AppContext } from "@/contexts/app.context";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/apis/user.api";
import Image from "next/image";
import logoAstra from "../../../../../public/imgs/chat.png";
import { Menu, Search } from "lucide-react";
import { IconSidebarLogoutAdmin } from "@/data/icons";

export default function Header() {
  const pathname = usePathname();

  const { handleLogout } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [open, setOpen] = useState(false);

  const getUserQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return userApi.getUser();
    },
  });

  const { data } = getUserQuery;

  function onClickHandleLogout(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    handleLogout();
  }
  return (
    <header className=" items-center border-b bg-white shadow relative z-40">
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="h-10 w-10 mx-auto">
                <Image
                  src={logoAstra}
                  alt="Logo Astra"
                  className=" bg-black dark:bg-transparent"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chat-Admin</h1>
                <p className="text-gray-500 hidden sm:block">
                  Quản lý hệ thống và theo dõi hoạt động
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative p-2 text-gray-400 hover:text-gray-600">
                <NotificationBell />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div
                className="w-[30px] h-[30px] text-[21px] font-bold rounded-[14px] flex items-center justify-center cursor-pointer"
                onClick={() => setOpen(true)}
              >
                {data && (
                  <img
                    src={data.data.user.avatar}
                    alt="user"
                    className="w-full h-full rounded-[50%]"
                  />
                )}
              </div>

              <Modal isOpen={open} onClose={() => setOpen(false)}>
                <SettingAccount
                  isOpen={false}
                  onClose={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  children={undefined}
                />
              </Modal>
              <button
                className="p-2 text-gray-400 hover:text-gray-600"
                onClick={onClickHandleLogout}
              >
                <IconSidebarLogoutAdmin />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
