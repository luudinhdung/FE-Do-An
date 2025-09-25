import { useTranslation } from "react-i18next";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

interface UserHeaderProps {
  user: User;
  copied: boolean;
  onCopy: () => void;
}

export const UserHeader = ({ user, copied, onCopy }: UserHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="py-3 px-4 sm:px-6 lg:px-8 border-b border-[#00D084] dark:border-[#1AFF1A]">
      <div className="flex items-center">
        <h1 className="font-bold text-base sm:text-lg">
          {t("userHeader.chatAs", { name: user.name })}
        </h1>
      </div>
      <span className="flex items-center w-full mt-4 text-[16px] leading-[1.5]">
        <span className="font-semibold mr-2 shrink-0 w-[15px]">
          {t("userHeader.idLabel")}
        </span>
        <span
          className={`inline-block max-w-full truncate cursor-pointer px-1 rounded transition-all duration-300 ${
            copied ? "text-gray-400 dark:text-gray-800" : ""
          }`}
          title={t("userHeader.copyHint")}
          onClick={onCopy}
        >
          {user.id}
        </span>
      </span>
    </div>
  );
};
