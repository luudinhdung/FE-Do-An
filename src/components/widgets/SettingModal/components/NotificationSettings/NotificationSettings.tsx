import Input from "@/components/common/Input/Input";
import Button from "@/components/ui/Button/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function NotificationSettings() {
  const [status, setStatus] = useState<string>("off");
  const [enabled, setEnabled] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <div className="pl-4 dark:text-white">
      <h3 className="font-medium pl-4">{t('notification_settings_title')}</h3>
      <p className="text-[14px] text-[#5a6981] mt-4 pl-4">{t('notification_settings_desc')}</p>
      <div className="mr-4 py-5 px-5 mt-4 rounded-lg bg-white dark:bg-[#22262B]">
        <div className="flex items-center gap-6 justify-around bg-white dark:bg-[#22262B]">
          {/* Item 1 */}
          <div className="flex flex-col justify-center items-center gap-4 cursor-pointer">
            <label htmlFor="on" className={`cursor-pointer overflow-hidden`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                />
              </svg>
            </label>
            <div className="flex items-center gap-x-2">
              <Input id="on" type="radio" checked={status === "on"} onChange={() => setStatus("on")} />
              <span className="text-[14px]">{t('turn_on')}</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex flex-col justify-center items-center gap-4 cursor-pointer">
            <label htmlFor="off" className={`cursor-pointer overflow-hidden`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                />
              </svg>
            </label>
            <div className="flex items-center gap-x-2">
              <Input id="off" type="radio" checked={status === "off"} onChange={() => setStatus("off")} />
              <span className="text-[14px]">{t('turn_off')}</span>
            </div>
          </div>
        </div>
      </div>
      <h3 className="font-medium mt-7 pl-4">{t('sound_and_notifications')}</h3>
      <div className="mr-4 mt-6">
        <div className="ml-auto flex items-center gap-6 justify-between px-4 py-4 rounded-lg text-[14px] mt-4 bg-white w-full dark:bg-[#22262B]">
          <span className="">{t('play_sound_on_new_message')}</span>
          <Button
            type="button"
            onClick={() => setEnabled((prevState) => !prevState)}
            className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${
              enabled ? "bg-[#0084FF]" : "bg-gray-300 dark:bg-[#333333]"
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                enabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettings;
