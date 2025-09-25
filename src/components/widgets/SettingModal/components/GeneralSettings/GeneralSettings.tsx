import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function GeneralSettings() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("vi");

  // Khi load trang → lấy ngôn ngữ từ localStorage hoặc mặc định
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "vi";
    setLang(savedLang);
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  // Xử lý khi đổi ngôn ngữ
  const handleChangeLanguage = (e: { target: { value: any; }; }) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("lang", selectedLang);
  };
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="font-medium pl-8 dark:text-white">{t('language_settings')}</h3>
      <div className="mx-4">
        <div className="flex items-center justify-between py-3 px-4 bg-white mt-4 mb-6 rounded-lg dark:bg-[#22262b] dark:text-white">
          <span className="text-[14px] cursor-none select-none">{t('change_language')}</span>
          <div className="relative transition-all duration-300 ease-in-out hover:text-white rounded-md border border-solid border-gray-400">
            <select
              value={lang}
              onChange={handleChangeLanguage}
              className="outline-none appearance-none h-8 pl-4 pr-14 hover:bg-slate-100 rounded-md capitalize bg-white text-black text-sm text-left dark:bg-[#1D2025] dark:text-white"
            >
              <option value="vi">{t('lang_vi')}</option>
              <option value="en">{t('lang_en')}</option>
            </select>
            <div className="absolute right-0 top-[50%] -translate-x-[50%] -translate-y-[50%] text-gray-600 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;
