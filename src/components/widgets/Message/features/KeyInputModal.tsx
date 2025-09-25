import { useTranslation } from "react-i18next";

interface KeyInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  manualKey: string;
  onKeyChange: (value: string) => void;
}

export const KeyInputModal = ({
  isOpen,
  onClose,
  onConfirm,
  manualKey,
  onKeyChange,
}: KeyInputModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-[#EFFFF0] text-black dark:text-white dark:bg-[#0F1F1B] p-4 sm:p-6 rounded-md shadow-md w-full max-w-sm border border-[#00D084] dark:border-[#1AFF1A]">
        <h3 className="text-lg font-semibold mb-4">
          {t("keyModal.title")}
        </h3>
        <input
          type="text"
          maxLength={6}
          value={manualKey}
          onChange={(e) => onKeyChange(e.target.value)}
          className="w-full px-3 py-2 border border-[#00D084] dark:border-[#1AFF1A] rounded-md bg-[#DFFFEF] dark:bg-[#162D26] text-[#005A3C] dark:text-[#1AFF1A] mb-4"
          placeholder={t("keyModal.placeholder")}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            {t("keyModal.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#00B37E] text-white rounded-md hover:bg-[#007A5E]"
          >
            {t("keyModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};
