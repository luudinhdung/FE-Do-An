import Button from "@/components/ui/Button/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function SecuritySettings() {
  const [countdown, setCountdown] = useState<number>(30);
  const { t } = useTranslation();

  useEffect(() => {
    // Lấy defaultCountdown từ API current user
    axios
      .get("http://localhost:3002/users/current", { withCredentials: true })
      .then((res) => setCountdown(res.data.user.defaultCountdown))
      .catch(() => setCountdown(30));
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.get("http://localhost:3002/users/current", {
        withCredentials: true,
      });
      const userId = res.data.user.id;

      await axios.patch(
        `http://localhost:3002/users/${userId}`,
        { defaultCountdown: countdown },
        { withCredentials: true }
      );

      // 🔥 Cập nhật UI ngay
      setCountdown(countdown);

      // 🔥 Nếu muốn chắc chắn DB đã update, fetch lại user
      const updated = await axios.get("http://localhost:3002/users/current", {
        withCredentials: true,
      });
      setCountdown(updated.data.user.defaultCountdown);

      alert("Lưu thành công");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu cài đặt");
    }
  };

  return (
    <div className="dark:text-white w-full max-w-4xl mx-auto">
      <h3 className="font-medium pl-8">{t("security_settings_title")}</h3>
      <form
        className="mx-4 px-4 mt-6 flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="defaultCountdown" className="text-sm">
              {t("default_decrypt_time")}
            </label>
            <input
              id="defaultCountdown"
              type="number"
              min={1}
              max={3000}
              value={countdown}
              onChange={(e) => setCountdown(Number(e.target.value))}
              className="border border-[#666666] rounded-md px-3 py-2 bg-gray-100 
                     text-sm text-gray-800 w-full focus:outline-none 
                     focus:border-[#4F46E5] dark:bg-gray-700 dark:text-gray-200"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("decrypt_time_hint")} (1 - 3000s)
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-end mt-2">
          <Button
            className="border border-solid border-[#4F46E5] bg-white rounded-lg px-8 py-2 text-[#4F46E5]"
            type="button"
            message={t("cancel")}
          />
          <Button
            className="border border-[#4F46E5] rounded-md px-8 py-2 text-white bg-[#4F46E5] hover:opacity-90 transition"
            type="submit"
            message={t("save")}
          />
        </div>
      </form>
    </div>
  );
}

export default SecuritySettings;
