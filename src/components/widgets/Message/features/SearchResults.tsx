import { useTranslation } from "react-i18next";

// components/Message/SearchResults.tsx
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

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
  unreadCount?: number;
}

interface SearchResultsProps {
  searchTerm: string;
  allUsers: User[];
  filteredGroups: ChatGroup[];
  highlightedIndex: number;
  onUserClick: (user: User) => void;
  onSelectGroup: (
    groupId: string,
    hashedKey: string,
    displayName?: string
  ) => void;
  resultBoxRef: React.RefObject<HTMLDivElement>;
  highlightedItemRef: React.RefObject<HTMLDivElement>;
}

export const SearchResults = ({
  searchTerm,
  allUsers,
  filteredGroups,
  highlightedIndex,
  onUserClick,
  onSelectGroup,
  resultBoxRef,
  highlightedItemRef,
} : SearchResultsProps) => {
  const { t } = useTranslation();

  if (!searchTerm || (allUsers.length === 0 && filteredGroups.length === 0)) {
    return null;
  }
  return (
    <div
      ref={resultBoxRef}
      className="absolute custom-scroll z-50 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 
      bg-[#F6FFF6] dark:bg-[#0A0F0D] mt-2 rounded-lg shadow-lg 
      max-h-[300px] overflow-y-auto border border-[#00D084] dark:border-[#1AFF1A]"
    >
      {allUsers.map((user, index) => {
        const isHighlighted = highlightedIndex === index;
        return (
          <div
            key={user.id}
            onClick={() => onUserClick(user)}
            ref={isHighlighted ? highlightedItemRef : null}
            className={`
            flex items-center justify-between gap-2 px-4 py-2 
            cursor-pointer transition-all duration-200 ease-in-out 
            ${
              isHighlighted
                ? "bg-[#99b39b] "
                : "hover:bg-[#e0f0e7] dark:hover:bg-[#1B5E20]"
            }
          `}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                className="w-10 h-10 rounded-full object-cover border border-[#00FF99]/40"
              />
              <div>
                <div className="font-semibold text-base text-[#1B5E20] dark:text-[#B9FBC0]">
                  {user.name}
                </div>
                <div className="text-sm text-[#4B5563] dark:text-[#81FFD9]">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {filteredGroups.map((group, index) => {
        if (!group.isGroup) return null;
        const realIndex = allUsers.length + index;
        const isHighlighted = highlightedIndex === realIndex;
        let avatar;

        if (group.name) {
          avatar = group.participants[0]?.user.avatar;
        } else {
          avatar = group.participants[1]?.user.avatar;
        }

        return (
          <div
            key={group.id}
            onClick={() =>
              onSelectGroup(group.id, group.hashedUserKey, group.displayName)
            }
            ref={isHighlighted ? highlightedItemRef : null}
            className={`
            flex items-center justify-between gap-2 px-4 py-2 
            cursor-pointer transition-all duration-200 ease-in-out 
            ${
              isHighlighted
                ? "bg-[#99b39b]"
                : "hover:bg-[#e0f0e7] dark:hover:bg-[#1B5E20]"
            }
          `}
          >
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={group.displayName}
                className="w-10 h-10 rounded-full object-cover border border-[#00FF99]/40"
              />
              <div>
                <div className="font-semibold text-base text-[#1B5E20] dark:text-[#B9FBC0]">
                  {group.displayName}
                </div>
                <div className="text-sm text-[#4B5563] dark:text-[#81FFD9]">
                  {t("searchResults.groupLabel")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
