import Button from "@/components/ui/Button/Button";
import { useMenuItems } from "@/data/menuItems";
import { useTranslation } from "react-i18next";

interface PropTypes {
  selected: string;
  setSelected: (selected: string) => void;
}

function Sidebar({ selected, setSelected }: PropTypes) {
  const { t } = useTranslation();
  const menuItems = useMenuItems();

  return (
    <div className="py-4 bg-white dark:bg-[#22262B] dark:text-white rounded-lg">
      <h3 className="text-[20px] font-medium px-4">{t("settings.title")}</h3>
      <ul className="mt-5 flex flex-col justify-start">
        {menuItems.map((item) => {
          const isActive = selected === item.id;
          return (
            <li key={item.id} className="text-[14px]">
              <Button
                type="button"
                onClick={() => setSelected(item.id)}
                className={`flex items-center gap-x-2 w-full py-3 px-4 text-left font-medium hover:text-primary transition-all duration-200 ease-in-out ${
                  isActive ? "bg-[#DBEBFF] dark:bg-[#1F344D]" : ""
                }`}
              >
                {item.icon}
                {t(item.label)}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
