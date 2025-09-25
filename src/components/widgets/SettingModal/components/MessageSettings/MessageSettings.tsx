import Button from "@/components/ui/Button/Button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function MessageSettings() {
  const [enabled, setEnabled] = useState(false);
  const [enabledFriend, setEnabledFriend] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="pl-4 dark:text-white">
      <h3 className="font-medium pl-4">{t('message_settings_title')}</h3>
      <div className="mr-4 mt-6 bg-white rounded-lg dark:bg-[#22262b]">
        <div className="ml-auto flex items-center gap-6 justify-between px-4 py-3 rounded-lg text-[14px] mt-4 bg-white w-full dark:bg-[#22262B]">
          <span className="leading-[1.5]">{t('double_click_to_reply')}</span>
          <Button
            type="button"
            onClick={() => setEnabled((v) => !v)}
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
        <div className="ml-auto flex items-center gap-6 justify-between px-4 py-3 rounded-lg text-[14px] bg-white w-full dark:bg-[#22262B]">
          <span className="leading-[1.5]">{t('show_typing_status')}</span>
          <Button
            type="button"
            onClick={() => setEnabledFriend((v) => !v)}
            className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${
              enabledFriend ? "bg-[#0084FF]" : "bg-gray-300 dark:bg-[#333333]"
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                enabledFriend ? "translate-x-5" : "translate-x-1 "
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MessageSettings;
