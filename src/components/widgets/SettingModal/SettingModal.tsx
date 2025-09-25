import Button from "@/components/ui/Button/Button";
import ContentPanel from "@/components/widgets/SettingModal/ContentPanel";
import Sidebar from "@/components/widgets/SettingModal/Sidebar";
import { IconModalBack, IconModalClose } from "@/data/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // ⬅️ thêm

interface PropTypes {
  onClickCloseModal: () => void;
}

function SettingModal({ onClickCloseModal }: PropTypes) {
  const [selected, setSelected] = useState("general");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { t } = useTranslation(); // ⬅️ thêm

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setShowSidebar(selected === "" || !selected);
      } else {
        setIsMobile(false);
        setShowSidebar(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selected]);

  const handleSelect = (id: string) => {
    setSelected(id);
    if (isMobile) setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
    setSelected("");
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.60)] z-[35] cursor-pointer">
      <div className="flex justify-center items-center h-full">
        <div className="relative grid grid-cols-12 w-[406px] lg:w-[800px] lg:max-h-[800px] md:w-[650px] text-black bg-[#EBECF0] dark:bg-[#16191D] rounded-lg z-[30] cursor-default">
          {/* Sidebar */}
          {isMobile ? (
            showSidebar ? (
              <div className="col-span-12 bg-white dark:bg-[#22262B] rounded-lg w-full animate-slideInLeft">
                <Sidebar selected={selected} setSelected={handleSelect} />
              </div>
            ) : null
          ) : (
            <div className="md:col-span-3 bg-white dark:bg-[#22262B] rounded-lg">
              <Sidebar selected={selected} setSelected={setSelected} />
            </div>
          )}

          {/* Content */}
          {isMobile ? (
            !showSidebar && (
              <div className="col-span-12 lg:min-h-[500px] lg:max-h-[750px] w-full animate-slideInRight">
                <Button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-4 text-sm font-medium text-primary mb-2"
                >
                  <IconModalBack />
                  {t("settings.back")} {/* ⬅️ dịch từ file JSON */}
                </Button>
                <ContentPanel selected={selected} />
              </div>
            )
          ) : (
            <div className="md:col-span-9 lg:min-h-[500px] lg:max-h-[750px]">
              <ContentPanel selected={selected} />
            </div>
          )}

          {/* Close */}
          <Button
            onClick={onClickCloseModal}
            className="flex justify-center items-center rounded-[999px] bg-white dark:bg-[#1E1F26] p-[12px] absolute -top-5 -right-5 shadow-[3px_2px_12px_0px_rgba(0,0,0,0.10)]"
          >
            <IconModalClose />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingModal;
