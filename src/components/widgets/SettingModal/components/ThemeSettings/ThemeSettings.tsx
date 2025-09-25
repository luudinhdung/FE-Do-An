import Input from "@/components/common/Input/Input";
import Button from "@/components/ui/Button/Button";
import { AppContext } from "@/contexts/app.context";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

function ThemeSettings() {
  const [theme, setTheme] = useState("light");
  const [enabled, setEnabled] = useState(false);

  const { theme: themeContext, handleThemeChange } = useContext(AppContext);
  const { t } = useTranslation();
  console.log(themeContext);

  return (
    <div className="dark:text-white dark:bg-[#16191D]">
      <h3 className="font-medium pl-8">{t('theme_settings_title')}</h3>
      <div className="mx-4 py-5 px-5 mt-4 rounded-lg bg-white dark:bg-[#22262B]">
        <div className="flex items-center gap-6 justify-between bg-white dark:bg-[#22262B]">
          {/* Item 1 */}
          <div
            className="flex flex-col justify-center items-center gap-4 cursor-pointer"
            onClick={() => handleThemeChange("light")}
          >
            <label
              htmlFor="light"
              className={`cursor-pointer overflow-hidden ${
                themeContext === "light" ? "border-2 border-solid rounded-[13px] border-[#0084FF]" : ""
              }`}
            >
              <img className="" src="../../../../../imgs/theme-light.png" alt="" />
            </label>
            <div className="flex items-center gap-x-2">
              <Input
                id="light"
                type="radio"
                name="theme"
                checked={themeContext === "light"}
                onChange={() => setTheme("light")}
              />
              <span className="text-[14px]">{t('light_mode')}</span>
            </div>
          </div>
          {/* Item 2 */}
          <div
            className="flex flex-col justify-center items-center gap-4 cursor-pointer"
            onClick={() => handleThemeChange("dark")}
          >
            <label
              htmlFor="dark"
              className={`cursor-pointer overflow-hidden ${
                themeContext === "dark" ? "border-2 border-solid rounded-[13px] border-[#0084FF]" : ""
              }`}
            >
              <img className="w-full" src="../../../../../imgs/theme-dark.png" alt="" />
            </label>
            <div className="flex items-center gap-x-2">
              <Input
                id="dark"
                type="radio"
                name="theme"
                checked={themeContext === "dark"}
                onChange={() => setTheme("dark")}
              />
              <span className="text-[14px]">{t('dark_mode')}</span>
            </div>
          </div>
          {/* Item 3 */}
          <div
            className="flex flex-col justify-center items-center gap-4 cursor-pointer"
            onClick={() => handleThemeChange("system")}
          >
            <label
              htmlFor="system"
              className={`cursor-pointer overflow-hidden ${
                themeContext === "system" ? "border-2 border-solid rounded-[13px] border-[#0084FF]" : ""
              }`}
            >
              <img className="" src="../../../../../imgs/theme-system.png" alt="" />
            </label>
            <div className="flex items-center gap-x-2">
              <Input
                id="system"
                type="radio"
                name="theme"
                checked={themeContext === "system"}
                onChange={() => setTheme("system")}
              />
              <span className="text-[14px]">{t('system_mode')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 mt-6">
        <h3 className="mx-4 font-medium">{t('chat_background_title')}</h3>
        <div className="ml-auto flex items-center gap-6 justify-between px-4 py-4 rounded-lg text-[14px] mt-4 bg-white w-full dark:bg-[#22262B]">
          <span>{t('use_avatar_background')}</span>
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
      </div>
    </div>
  );
}

export default ThemeSettings;
