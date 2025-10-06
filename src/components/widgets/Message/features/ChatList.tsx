import UserItem from "@/components/features/UserItem/UserItem";
import { IconDelete } from "@/data/icons";
import { useTranslation } from "react-i18next";

interface ChatGroup {
  id: string;
  name: string;
  hashedUserKey: string;
  durationTime: string;
  isGroup: boolean;
  participants: {
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
  displayName?: string;
  hasUnread?: boolean;
  unreadCounts?: number; // ✅ Đảm bảo có property này
}

interface ChatListProps {
  chatGroups: ChatGroup[];
  selectedChatId: string | null;
  onSelectGroup: (
    groupId: string,
    hashedKey: string,
    displayName?: string,
    avatar?: string
  ) => void;
  onDeleteGroup: (group: ChatGroup) => void;
  curentUserId?: string;
  unreadCounts: Record<string, number>; // ✅ Nhận từ parent
}

export const ChatList = ({
  chatGroups,
  selectedChatId,
  onSelectGroup,
  onDeleteGroup,
  curentUserId = "",
  unreadCounts, // ✅ Sử dụng từ props
}: ChatListProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col chat-scrollbar">
      <div className="flex-1 min-h-0 overflow-y-auto">
        {chatGroups.map((group) => {
          const isActive = group.id === selectedChatId;
          let avatar = "";

          if (group.name === "") {
            // Chat 1-1: tìm avatar của người còn lại
            const other = group.participants.find(
              (p) => p.user.id !== curentUserId
            );
            avatar = other?.user.avatar || "";
          } else {
            // Chat nhóm: đại diện là người đầu tiên
            avatar = group.participants[0]?.user.avatar || "";
          }

          // ✅ Lấy unread count từ props thay vì từ group
          const unreadCount = unreadCounts[group.id] || 0;
          
          return (
            <div
              key={group.id}
              onClick={() =>
                onSelectGroup(
                  group.id,
                  group.hashedUserKey,
                  group.displayName,
                  avatar
                )
              }
              className={`group relative transition-colors ${
                isActive
                  ? "bg-[#3A3F47] dark:bg-[#183A2D]"
                  : "hover:bg-[#3A3F47] dark:hover:bg-[#1C4032]"
              }`}
            >
              <UserItem
                key={group.id}
                image={avatar}
                name={group.displayName}
                isActive={isActive}
              />

              <div className="absolute top-1/2 -translate-y-1/2 right-8 ml-auto flex items-center gap-2">
                {/* ✅ Hiển thị unread badge */}
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}

                <button
                  className="text-red-600 font-bold hover:text-red-800 transition hidden group-hover:block"
                  title={t("chat.delete_title")}
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmed = confirm(
                      t("chat.delete_confirm", {
                        name: group.displayName || "",
                      })
                    );
                    if (!confirmed) return;
                    onDeleteGroup(group);
                  }}
                >
                  <IconDelete />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
