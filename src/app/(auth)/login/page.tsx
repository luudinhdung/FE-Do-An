"use client";

import authApi from "@/apis/auth.api";
import InputAuth from "@/components/features/InputAuth/InputAuth";
import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import { SchemaLogin, schemaLogin } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import animateLogin from "../../../../public/animation/animate-login.json";
import dynamic from "next/dynamic";

// Chỉ render Animate ở client
const Animate = dynamic(() => import("@/components/icons/Animate/Animate"), {
  ssr: false,
});

type FormData = SchemaLogin;

function page() {
  const { isAuthenticated, handleLogin } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schemaLogin),
  });

  const loginMutation = useMutation({
    mutationFn: (body: FormData) => {
      return authApi.login(body);
    },
  });
  const handleSubmitForm = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        handleLogin(response.data.accessToken);
        toast.success("Đăng nhập thành công");

        if (response.data.user.role === "ADMIN") {
          console.log("Đi tới trang admin");
          sessionStorage.setItem("user_role", "ADMIN");
          router.push(path.admin);
        } else {
          console.log("Đi tới trang home");
          sessionStorage.setItem("user_role", "USER");
          router.push(path.home);
        }
      },
    });
  });

  return (
    <div className="">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:pr-10 items-center h-[100vh]">
          <div className="hidden lg:block lg:grid-start-1 lg:col-span-3">
            <Animate animateData={animateLogin} className="max-w-[500px]" />
          </div>
          <div className="bg-white p-7 text-center overflow-hidden rounded-lg [box-shadow:0px_0px_4px_0px_rgba(0,_0,_0,_0.08)] lg:col-span-2 lg:col-start-4">
            <h2 className="font-semibold text-[18px] md:text-2xl">
              <span className="text-[#6358DC]">Chào mừng </span>bạn quay trở lại
            </h2>
            <form className="mt-5" onSubmit={handleSubmitForm}>
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
              <div className="flex mt-1 text-[15px] gap-4 text-left flex-col sm:flex-row justify-start items-start sm:items-center sm:justify-between">
                <div className="flex items-center gap-x-2">
                  <input type="checkbox" id="check" />
                  <label htmlFor="check" className="select-none">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  href={path.forgotPassword}
                  className="text-[#4F46E5] cursor-pointer"
                >
                  Quên mật khẩu
                </Link>
              </div>
              <div className="mt-5">
                <button className="w-full text-center py-3 px-5 uppercase border border-solid rounded-[8px] bg-[#4F46E5] text-white text-sm flex items-center justify-center gap-x-2">
                  Đăng nhập
                </button>
              </div>
            </form>
            <div className="my-4 flex items-center gap-x-2">
              <hr className="w-full h-[1px] bg-[#4D4D4D]" />
              <span className="text-[#ccc]">or</span>
              <hr className="w-full h-[1px] bg-[#4D4D4D]" />
            </div>
            <div className="flex items-center justify-between">
              <button className="flex items-center justify-center p-3 w-full rounded-[4px] border border-solid border-[#B3B3B3] [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
                <img src="../../../icons/google.svg" alt="google" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 sm:justify-between flex-col sm:flex-row lg:justify-center text-[15px]">
              <span className="text-gray-600">
                Bạn đã có tài khoản hay chưa?
              </span>
              <Link href={path.register} className="text-[#4F46E5]">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
