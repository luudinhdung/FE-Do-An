"use client";

import authApi from "@/apis/auth.api";
import InputAuth from "@/components/features/InputAuth/InputAuth";
import Animate from "@/components/icons/Animate/Animate";
import { path } from "@/constants/path";
import { schemaRegister, SchemaRegister } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import animaRegister from "../../../../public/animation/animate-register.json";

type FormData = SchemaRegister;

function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schemaRegister),
  });

  const registerMutation = useMutation({
    mutationFn: (body: FormData) => {
      return authApi.register(body as any);
    },
  });

  const handleSubmitForm = handleSubmit((data) => {
    return registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Đăng ký tài khoản thành công");
        navigate.push(path.login);
      },
      onError: (error: any) => {
        console.log("❌ error full:", error);
        console.log("❌ error.response.data:", error?.response?.data);
        const resMessage = error.response?.data?.message;
  
        if (Array.isArray(resMessage)) {
          // Nếu là mảng (validate nhiều lỗi)
          resMessage.forEach((msg: string) => toast.error(msg));
        } else if (typeof resMessage === "string") {
          console.log(resMessage);
        } else {
          alert("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
      },
    });
  });

  return (
    <div id="register">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:pr-10 items-center h-[100vh]">
          <div className="hidden lg:block lg:grid-start-1 lg:col-span-3">
            <Animate animateData={animaRegister} className="max-w-[500px]" />
          </div>
          <div className="bg-white p-7 text-center overflow-hidden rounded-lg [box-shadow:0px_0px_4px_0px_rgba(0,_0,_0,_0.08)] lg:col-span-2 lg:col-start-4">
            <h2 className="text-[#6358DC] font-semibold text-[18px] md:text-2xl">
              Đăng ký tài khoản
            </h2>
            <form className="mt-5" onSubmit={handleSubmitForm}>
              <InputAuth
                className="mt-2"
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.name
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameShow="ml-auto px-3 h-full hidden"
                type="text"
                name="name"
                placeholder="Nhập tên"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.name?.message}
                errors={errors.name}
              />
              <InputAuth
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.email
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameShow="ml-auto px-3 h-full hidden"
                type="text"
                name="email"
                placeholder="Email khách hàng"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.email?.message}
                errors={errors.email}
              />
              <InputAuth
                className="mt-2"
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.phone
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameShow="ml-auto px-3 h-full hidden"
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.phone?.message}
                errors={errors.phone}
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
              <div className="flex mt-3 text-[15px] gap-4 text-left flex-col sm:flex-row justify-start items-start sm:items-center sm:justify-between">
                <div className="flex items-center gap-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="check"
                    checked={agree}
                    onChange={() => {
                      setAgree((prev) => !prev);
                    }}
                  />
                  <label htmlFor="check" className="select-none cursor-pointer">
                    Tôi đồng ý với các điều khoản
                  </label>
                </div>
                <Link href="#!" className="text-[#4F46E5] cursor-pointer">
                  Xem điều khoản
                </Link>
              </div>
              <div className="mt-5">
                <button
                  className="w-full text-center py-3 px-5 uppercase border border-solid rounded-[8px] bg-[#4F46E5] text-white text-sm flex items-center justify-center gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!agree}
                >
                  Đăng ký
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
              <Link href={path.login} className="text-[#4F46E5]">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
