import { userApi } from "@/apis/user.api";
import Input from "@/components/common/Input/Input";
import Button from "@/components/ui/Button/Button";
import { CheckBold, FileCopyLine } from "@/data/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function AccountSettings() {
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => userApi.getUser(),
  });

  const { data } = userQuery;
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // Gán dữ liệu khi userData thay đổi
  useEffect(() => {
    if (data) {
      const user = data.data.user;
      console.log(user, "formdata");

      setFormData({
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [data]);

  const updateUserMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      console.log(123);

      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(t("update_success"));
    },
    onError: (error: any) => {
      // Nếu BE trả về message cụ thể
      const errorMessage =
        error?.response?.data?.message || // NestJS thường trả message
        error?.response?.data?.error ||   // hoặc error
        error?.message ||                 // hoặc lỗi mặc định của axios
        t("update_fail");                 // fallback
  
      toast.error(errorMessage);
    },
  });

  const handleCopy = () => {
    if (!data) return;

    navigator.clipboard
      .writeText(data.data.user.id)
      .then(() => {
        toast.success(t("copy_success"));
        setCopied(true);
        setTimeout(() => setCopied(false), 500);
      })
      .catch(() => toast.error(t("copy_fail")));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      const response = await userApi.uploadAvatar(formDataFile); // Gọi API upload
      const imageUrl = response.data.url; // Nhận URL từ server
      setFormData((prev) => ({ ...prev, avatar: imageUrl })); // Gán vào form
      toast.success(t("upload_success"));
    } catch (error) {
      toast.error(t("upload_fail"));
    }
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  const { t } = useTranslation();
  return (
    <div className="dark:text-white w-full max-w-4xl mx-auto">
      <h3 className="font-medium pl-8">{t("account_settings")}</h3>
      <form
        className="mx-4 px-4 mt-6 flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:items-start gap-4">
          {data && (
            <>
              <div className="relative w-20 h-20 md:w-[80px] md:h-[80px]">
                <img
                  src={formData.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full border border-[#6358DC]"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#6358DC] rounded-full p-1 cursor-pointer border-2 border-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M22 7.625V18.875C22 19.9102 21.1602 20.75 20.125 20.75H3.875C2.83984 20.75 2 19.9102 2 18.875V7.625C2 6.58984 2.83984 5.75 3.875 5.75H7.3125L7.79297 4.46484C8.06641 3.73437 8.76562 3.25 9.54688 3.25H14.4492C15.2305 3.25 15.9297 3.73437 16.2031 4.46484L16.6875 5.75H20.125C21.1602 5.75 22 6.58984 22 7.625ZM16.6875 13.25C16.6875 10.6641 14.5859 8.5625 12 8.5625C9.41406 8.5625 7.3125 10.6641 7.3125 13.25C7.3125 15.8359 9.41406 17.9375 12 17.9375C14.5859 17.9375 16.6875 15.8359 16.6875 13.25ZM15.4375 13.25C15.4375 15.1445 13.8945 16.6875 12 16.6875C10.1055 16.6875 8.5625 15.1445 8.5625 13.25C8.5625 11.3555 10.1055 9.8125 12 9.8125C13.8945 9.8125 15.4375 11.3555 15.4375 13.25Z"
                      fill="white"
                    />
                  </svg>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center ">
                      {"customer_id "}
                      <label className="text-sm">{t("")}</label>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-xs text-gray-700 flex items-center gap-1"
                      >
                        {copied ? (
                          <>
                            <CheckBold />
                            {t("copied")}
                          </>
                        ) : (
                          <>
                            <FileCopyLine />
                            {t("copy")}
                          </>
                        )}
                      </button>
                    </div>
                    <Input
                      value={data.data.user.id}
                      className=" border border-[#666666] rounded-md px-3 py-2 bg-gray-100 text-sm text-gray-800 w-full focus:outline-none focus:border-[#4F46E5] cursor-text select-all"
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm">
                      {t("customer_name")}
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-[#666666] rounded-md px-3 py-2 bg-gray-100 text-sm text-gray-800 w-full focus:outline-none focus:border-[#4F46E5] cursor-text select-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm">
                      {t("email")}
                    </label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border border-[#666666] rounded-md px-3 py-2 bg-gray-100 text-sm text-gray-800 w-full focus:outline-none focus:border-[#4F46E5] cursor-text select-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm">
                      {t("Phone")}
                    </label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border border-[#666666] rounded-md px-3 py-2 bg-gray-100 text-sm text-gray-800 w-full focus:outline-none focus:border-[#4F46E5] cursor-text select-all"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-end mt-2">
          <Button
            className="border border-[#4F46E5] rounded-md px-8 py-2 text-white bg-[#4F46E5] hover:opacity-90 transition"
            type="submit"
            message={t("update")}
          />
        </div>
      </form>
    </div>
  );
}

export default AccountSettings;
