"use client";
import Loading from "@/components/icons/Loading/Loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // danh sách role được phép vào trang
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const userRole = sessionStorage.getItem("user_role"); // giả sử lưu role khi login

    if (!token) {
      toast.error("Bạn chưa đăng nhập");
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(userRole!)) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.replace("/"); // hoặc trang mặc định cho role  
    } else {
      setChecking(false); // OK, cho phép hiển thị nội dung
    }
  }, []);

  if (checking)
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Loading />
      </div>
    );

  return <>{children}</>;
}
