"use client";

import InputAuth from "@/components/features/InputAuth/InputAuth";
import { AppContext } from "@/contexts/app.context";
import { schemaResetPassword } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schemaResetPassword),
  });

  const navigate = useRouter();
  const { isAuthenticated } = useContext(AppContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate.replace("/");
    }
  }, [isAuthenticated]);

  const handleSubmitForm = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div id="reset-password" className="font-poppins bg-[#F4F4F4] min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="grid min-h-screen place-items-center">
          <div className="bg-white p-7 text-center overflow-hidden rounded-lg [box-shadow:0px_0px_4px_0px_rgba(0,_0,_0,_0.08)] w-full max-w-md">
            <h2 className="text-[#6358DC] font-semibold text-[20px] md:text-2xl">Đặt lại mật khẩu</h2>
            <p className="mt-4 leading-[1.5]">
              Thay đổi mật khẩu của bạn bằng cách nhập mật khẩu mới và xác nhận mật khẩu mới của bạn.
            </p>
            <form className="mt-5" onSubmit={handleSubmitForm}>
              <InputAuth
                className="mt-2"
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.password
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameShow="ml-auto px-3 h-full hidden"
                type="text"
                name="password"
                placeholder="Nhập mật khẩu mới"
                autoComplete="off"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.password?.message}
                errors={errors.password}
              />
              <InputAuth
                className="mt-2"
                classNameInput="pl-3 py-3 flex-1 border-none outline-none placeholder:text-[#666666]"
                classNameWrap={`overflow-hidden flex w-full text-[16px] outline-none border border-solid border-[#B3B3B3] rounded-[8px] focus:border-[#4F46E5] focus:shadow-sm h-[45px] ${
                  errors.confirm_password
                    ? `border-[#FF3B30] focus:border-[#FF3B30]`
                    : `border-[#B3B3B3] focus:border-[#4F46E5]`
                }`}
                classNameShow="ml-auto px-3 h-full hidden"
                type="text"
                name="confirm_password"
                placeholder="Nhập lại mật khẩu"
                autoComplete="off"
                register={register}
                classNameError="flex item-center gap-x-2 mt-1 text-red-600 min-h-[1.25rem] text-sm text-left"
                errorMessage={errors.confirm_password?.message}
                errors={errors.confirm_password}
              />
              <div className="mt-2">
                <button className="w-full text-center py-3 px-5 uppercase border border-solid rounded-[8px] bg-[#4F46E5] text-white text-sm flex items-center justify-center gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Đặt lại mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
