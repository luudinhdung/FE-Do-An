import Input from "@/components/common/Input/Input";
import Button from "@/components/ui/Button/Button";
import { IconSearch } from "@/data/icons";
import { useTranslation } from "react-i18next";

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  searchBoxRef: React.RefObject<HTMLDivElement>;
}

export const SearchBox = ({
  searchTerm,
  onSearchChange,
  onSearchKeyDown,
  onSearchFocus,
  searchBoxRef,
}: SearchBoxProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center bg-[#434952] dark:bg-[#102218] rounded-xl border border-[#00D084] dark:border-[#1AFF1A]">
      <Button className="pl-5 py-2 pr-2">
        <IconSearch />
      </Button>
      <div ref={searchBoxRef} className="w-full">
        <Input
          value={searchTerm}
          className="w-full bg-transparent outline-none border-none placeholder:text-[#ffffff] dark:text-[#1AFF1A] dark:placeholder:text-[#1AFF1A] py-[10px]"
          type="text"
          placeholder={t("searchBox.placeholder")}
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          onFocus={onSearchFocus}
        />
      </div>
    </div>
  );
};
