"use client";

import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import { SchemaLogin, schemaLogin } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import InputAuth from "@/components/features/InputAuth/InputAuth";
import animateLogin from "../../../../public/animation/animate-login.json";
import axios from "axios";

const Animate = dynamic(() => import("@/components/icons/Animate/Animate"), {
  ssr: false,
});
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://35.188.81.254";
type FormData = SchemaLogin;

function Page() {
  const { handleLogin } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schemaLogin),
  });

  // ✅ Hàm xử lý login
  const handleLoginClick = async (data: FormData, e?: React.BaseSyntheticEvent) => {
    if (e) e.preventDefault(); // ⛔ Chặn reload khi submit hoặc nhấn Enter

    try {
      console.log("🚀 Gửi request login:", data);

      const response = await axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true,
      });

      console.log("✅ Login success:", response.data);

      const { accessToken, user } = response.data;
      if (!accessToken) {
        toast.error("Phản hồi không hợp lệ từ server");
        return;
      }

      handleLogin(accessToken);
      toast.success("Đăng nhập thành công");

      sessionStorage.setItem("user_role", user.role);
      router.push(user.role === "ADMIN" ? path.admin : path.home);
    } catch (error: any) {
      console.error("❌ Login error:", error);

      const msg = error.response?.data?.message;

      if (msg === "Invalid password" || msg === "Sai mật khẩu") {
        toast.error("Sai mật khẩu");
      } else if (msg === "User not found" || msg === "Không tìm thấy người dùng") {
        toast.error("Tài khoản không tồn tại");
      } else {
        toast.error(msg || "Đăng nhập thất bại, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:pr-10 items-center h-[100vh]">
          <div className="hidden lg:block lg:col-span-3">
            <Animate animateData={animateLogin} className="max-w-[500px]" />
          </div>

          <div className="bg-white p-7 text-center rounded-lg shadow-sm lg:col-span-2 lg:col-start-4">
            <h2 className="font-semibold text-[18px] md:text-2xl">
              <span className="text-[#6358DC]">Chào mừng </span>bạn quay trở lại123321
            </h2>

            <form
              className="mt-5"
              onSubmit={handleSubmit(handleLoginClick)}
            >
                <InputAuth
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.identifier
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameShow="ml-auto px-3 h-full"
                type="text"
                name="identifier"
                placeholder="Email hoặc SĐT"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.identifier?.message}
              />

            <InputAuth
                className="mt-2"
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.password
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameShow="ml-auto px-3 h-full"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.password?.message}
                errors={errors.password}
                handleShowPassword={() => setShowPassword((prev) => !prev)}
              />

              <div className="flex mt-3 text-sm justify-between">
                <div className="flex items-center gap-x-2">
                  <input type="checkbox" id="check" />
                  <label htmlFor="check">Ghi nhớ đăng nhập</label>
                </div>
                <Link href={path.forgotPassword} className="text-[#4F46E5]">
                  Quên mật khẩu
                </Link>
              </div>

              <button
                type="submit"
                className="mt-5 w-full py-3 px-5 uppercase rounded-[8px] bg-[#4F46E5] text-white text-sm"
              >
                Đăng nhập
              </button>
            </form>

            <div className="my-4 flex items-center gap-x-2">
              <hr className="w-full h-[1px] bg-[#4D4D4D]" />
              <span className="text-[#ccc]">or</span>
              <hr className="w-full h-[1px] bg-[#4D4D4D]" />
            </div>

            <button className="flex items-center justify-center p-3 w-full border rounded-[4px] border-[#B3B3B3]">
              <img src="../../../icons/google.svg" alt="google" />
            </button>

            <div className="mt-4 flex flex-col sm:flex-row justify-center text-[15px]">
              <span className="text-gray-600">Bạn đã có tài khoản hay chưa?</span>
              <Link href={path.register} className="text-[#4F46E5] ml-1">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
