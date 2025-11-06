"use client";
import { userApi } from "@/apis/user.api";
import Button from "@/components/ui/Button/Button";
import SettingModal from "@/components/widgets/SettingModal/SettingModal";
import { IconSidebarDiary, IconSidebarLogout, IconSidebarMessage, IconSidebarSetting } from "@/data/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL ;
interface PropTypes {
  onClickHandleLogout?: () => void;
  onOpenMessage?: () => void;
}

function Sidebar({ onClickHandleLogout,onOpenMessage }: PropTypes) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const getUserQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return userApi.getUser();
    },
  });

  const { data } = getUserQuery;

  const handleClickOpenModal = () => {
    return setOpen((prev) => !prev);
  };

  const handleClickCloseModal = () => {
    return setOpen(false);
  };

    const onClickHandleLogout1 = async () => {
    try {
      await axios.post(
        `${API_URL}/users/logout`,
        {},
        { withCredentials: true } // ⚠️ gửi cookie kèm theo
      );

      // Xoá token ở localStorage nếu bạn vẫn còn lưu tạm ở client
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Chuyển hướng sang trang login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <section className="sidebar py-4 shadow-[0px_0px_24px_0px_rgba(0,0,0,0.08)] h-[100vh] dark:bg-[#121416]">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-[40px] h-[40px] text-[21px] font-bold rounded-[14px] flex items-center justify-center">
          {data && <img src={data.data.user.avatar} alt="user" className="w-full h-full rounded-[50%]" />}
        </div>
        <div className="mt-[48px] flex flex-col gap-4 justify-center items-center">
          <Button onClick={onOpenMessage} className="group hover:bg-[#00000026] dark:hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out px-3 py-3 rounded-lg flex items-center justify-center">
            <IconSidebarMessage />
          </Button>
          <Button className="group  hover:bg-[#00000026] dark:hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out px-3 py-3 rounded-lg flex items-center justify-center">
            <IconSidebarDiary />
          </Button>
        </div>
        <div className="mt-auto flex flex-col gap-5 justify-center items-center">
          <Button
            className="group hover:bg-[#00000026] dark:hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out px-3 py-3 rounded-lg flex items-center justify-center"
            onClick={handleClickOpenModal}
          >
            <IconSidebarSetting />
          </Button>
          <Button
            className="group hover:bg-[#00000026] dark:hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out px-3 py-3 rounded-lg flex items-center justify-center"
            onClick={onClickHandleLogout1}
          >
            <IconSidebarLogout />
          </Button>
        </div>
      </div>
      {open && <SettingModal onClickCloseModal={handleClickCloseModal} />}
    </section>
  );
}

export default Sidebar;
