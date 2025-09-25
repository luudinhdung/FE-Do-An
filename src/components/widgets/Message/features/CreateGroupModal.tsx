import Button from "@/components/ui/Button/Button";
import { IconModalClose } from "@/data/icons";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

interface GroupChatDto {
  userIds: string;
  name: string;
  encryptedKey: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupChatDto) => void;
  groupSearchTerm: string;
  onGroupSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  groupSearchResults: User[];
  selectedGroupUsers: User[];
  onAddUserToGroup: (user: User) => void;
  onRemoveUserFromGroup: (userId: string) => void;
  register: ReturnType<typeof useForm<GroupChatDto>>['register'];
  handleSubmit: ReturnType<typeof useForm<GroupChatDto>>['handleSubmit'];
}

export const CreateGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
  groupSearchTerm,
  onGroupSearchChange,
  groupSearchResults,
  selectedGroupUsers,
  onAddUserToGroup,
  onRemoveUserFromGroup,
  register,
  handleSubmit,
}: CreateGroupModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[30] flex justify-center items-center px-4">
      <div
        className="relative w-full max-w-[500px] bg-[#2E3138] dark:bg-[#0F1F1B] rounded-lg p-4 sm:p-6 shadow-lg border border-[#00D084] dark:border-[#1AFF1A]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-center">
          {t("group.title")}
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative">
            <input
              type="text"
              value={groupSearchTerm}
              onChange={onGroupSearchChange}
              placeholder={t("group.search_placeholder")}
              className="w-full px-3 py-2 rounded bg-[#3A3F47] dark:bg-[#162D26] border-none outline-none text-white"
            />

            {groupSearchTerm && groupSearchResults.length > 0 && (
              <div className="absolute z-50 bg-[#2E3138] border border-[#00D084] mt-2 rounded w-full max-h-[200px] overflow-y-auto">
                {groupSearchResults.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 py-2 hover:bg-[#3A3F47] cursor-pointer"
                    onClick={() => onAddUserToGroup(user)}
                  >
                    {user.name} - {user.email}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danh sách người dùng đã chọn */}
          {selectedGroupUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 transition-all">
              {selectedGroupUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 px-3 py-1 bg-[#1AFF1A] text-black rounded-full text-sm"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => onRemoveUserFromGroup(user.id)}
                    className="text-black hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            {...register("name", { required: true })}
            type="text"
            spellCheck={false}
            placeholder={t("group.name_placeholder")}
            className="flex-1 px-3 py-2 rounded bg-[#3A3F47] dark:bg-[#162D26] border-none outline-none text-[#ffffff] dark:text-[#1AFF1A]"
          />
          <input
            {...register("encryptedKey", { required: true })}
            type="text"
            maxLength={6}
            spellCheck={false}
            placeholder={t("group.key_placeholder")}
            className="flex-1 px-3 py-2 rounded bg-[#3A3F47] dark:bg-[#162D26] border-none outline-none text-[#ffffff] dark:text-[#1AFF1A]"
          />
          <Button
            type="submit"
            className="bg-[#00B37E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#007A5E] transition"
            message={t("group.create_button")}
          />
          <Button
            onClick={onClose}
            className="flex justify-center items-center rounded-full bg-[#3A3F47]  p-[12px] absolute -top-5 -right-5 shadow"
          >
            <IconModalClose />
          </Button>
        </form>
      </div>
    </div>
  );
};
