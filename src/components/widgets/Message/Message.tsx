"use client";

import { userApi } from "@/apis/user.api";
import Button from "@/components/ui/Button/Button";
import { IconCreateGroupChat } from "@/data/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { ChatList } from "./features/ChatList";
import { CreateGroupModal } from "./features/CreateGroupModal";
import { KeyInputModal } from "./features/KeyInputModal";
import { SearchBox } from "./features/SearchBox";
import { SearchResults } from "./features/SearchResults";
import { UserHeader } from "./features/UserHeader";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://35.188.81.254";

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
  unreadCounts?: number;
  avatar?: string | null;
}

interface MessageProps {
  onSelectChat: (
    chatId: string,
    chatKey: string | null,
    displayName: string,
    avatar?: string
  ) => void;
  selectedChatId: string | null;
  chatGroups: ChatGroup[];
  setChatGroups: React.Dispatch<React.SetStateAction<ChatGroup[]>>;
}

const socket = io(`${API_URL}/messages`);

interface CreateChatDto {
  userA: string;
  chatName: string;
  encryptedKey: string;
}

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

function Message({
  onSelectChat,
  selectedChatId,
  setChatGroups,
  chatGroups,
}: MessageProps) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [manualKey, setManualKey] = useState("");
  const [openCreactGroup, setOpenCreactGroup] = useState(false);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState<User[]>([]);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<User[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ChatGroup[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const resultBoxRef = useRef<HTMLDivElement>(null);
  const highlightedItemRef = useRef<HTMLDivElement | null>(null);

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    reset: resetGroup,
  } = useForm<GroupChatDto>();

  const { register, handleSubmit, reset } = useForm<CreateChatDto>();
  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "fallback-key";
  const { t } = useTranslation();

  // Xử lý khi người dùng chọn nhóm chat
  const handleSelectGroup = (
    groupId: string,
    hashedKey: string,
    displayName?: string,
    avatar?: string
  ) => {
    handleOpenGroup(groupId, hashedKey, displayName, avatar);
  };

  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return userApi.getUser();
    },
  });

  const { data } = userQuery;

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/current`, {
          withCredentials: true,
        });
        const user = res.data.user;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Lấy danh sách nhóm chat của người dùng
  const fetchMyGroups = async () => {
    try {
      const resUser = await axios.get(`${API_URL}/users/current`, {
        withCredentials: true,
      });
      const currentUserId = resUser.data.user.id;
      setCurrentUser(resUser.data.user);

      const res = await axios.get(`${API_URL}/chats/my-groups`, {
        withCredentials: true,
      });

      const groups: ChatGroup[] = res.data.map((group: ChatGroup) => {
        const otherUser = group.participants.find(
          (p) => p.user.id !== currentUserId
        );

        return {
          ...group,
          displayName: group.isGroup
            ? group.name
            : `${otherUser?.user.name ?? "Người dùng"}`,
          avatar: group.isGroup
            ? group.avatar || null
            : otherUser?.user.avatar || null,
        };
      });
      groups.sort(
        (a, b) =>
          new Date(b.durationTime).getTime() -
          new Date(a.durationTime).getTime()
      );

      setChatGroups(groups);

      const savedId = localStorage.getItem("selectedChatId");
      if (savedId) {
      }
    } catch (error) {
      console.error("Failed to fetch chat groups:", error);
    }
  };

  // Lắng nghe sự kiện cập nhật chat từ socket
  useEffect(() => {}, [chatGroups]);

  // Lắng nghe sự kiện kết nối từ socket
  useEffect(() => {
    if (currentUser?.id) {
      socket.emit("user:join", currentUser.id);
    }
  }, [currentUser]);

  // Lắng nghe sự kiện nhận key mới từ socket
  useEffect(() => {
    socket.on("chat:new-room-key", (data) => {
      fetchMyGroups();
    });
    return () => {
      socket.off("chat:new-room-key");
    };
  }, []);

  // Lắng nghe sự kiện xoá chat từ socket
  useEffect(() => {
    const handleChatDeleted = (data: { chatId: string }) => {
      setChatGroups((prev) => prev.filter((g) => g.id !== data.chatId));
      toast.success(t("notiDeleteUser"));
    };

    socket.on("chat:deleted", handleChatDeleted);

    return () => {
      socket.off("chat:deleted", handleChatDeleted);
    };
  }, []);

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);

    if (value.trim() === "") {
      setAllUsers([]);
      setFilteredGroups([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/users/search?query=${value}`,
        {
          withCredentials: true,
        }
      );
      setAllUsers(res.data);

      const filtered = chatGroups.filter(
        (group) =>
          group.isGroup &&
          group.displayName?.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredGroups(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  //tạo nhóm chat
  const createGroupChat = async (data: GroupChatDto) => {
    try {
      const encryptedKey = CryptoJS.AES.encrypt(
        data.encryptedKey,
        key
      ).toString();

      const userIdsArray = selectedGroupUsers.map((u) => u.id);

      const body = {
        name: data.name,
        userIds: userIdsArray,
        key: encryptedKey,
      };

      const res = await axios.post(
        `${API_URL}/chats/create/group`,
        body,
        {
          withCredentials: true,
        }
      );

      handleClickOpenModalGruop();
      toast.success(t("addGruopChat"));
      console.log(res.data);

      resetGroup();
      await fetchMyGroups();
    } catch (err) {
      console.error("Lỗi khi tạo nhóm chat group:", err);
    }
  };

  // Mở hoặc đóng modal tạo nhóm chat
  function handleClickOpenModalGruop() {
    return setOpenCreactGroup(!openCreactGroup);
  }

  // Xử lý khi người dùng xác nhận mã khoá
  const handleConfirmKey = () => {
    if (!selectedUser) return;

    const chatData: CreateChatDto = {
      userA: selectedUser.id,
      chatName: `Chat với ${selectedUser.name}`,
      encryptedKey: manualKey,
    };

    createChatWithUser(chatData);
    setShowKeyModal(false);
    setManualKey("");
    setSelectedUser(null);
  };

  // Xử lý tạo chat với người dùng
  const createChatWithUser = async (data: CreateChatDto) => {
    try {
      const encryptedKey = CryptoJS.AES.encrypt(
        data.encryptedKey,
        key
      ).toString();

      const dataToSend = {
        userA: data.userA,
        chatName: data.chatName,
        key: encryptedKey,
      };

      const res = await axios.post(
        `${API_URL}/chats/one-to-one`,
        dataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      reset();
      await fetchMyGroups();
    } catch (err) {
      console.error("Lỗi khi tạo nhóm:", err);
    }
  };

  // Xử lý xoá nhóm chat
  const deleteGroup = async (group: ChatGroup) => {
    try {
      await axios.delete(`${API_URL}/chats/delete/${group.id}`, {
        withCredentials: true,
      });

      setChatGroups((prev) => prev.filter((g) => g.id !== group.id));

      if (selectedChatId === group.id) {
        onSelectChat("", "", "", "");
        localStorage.removeItem("selectedChatId");
      }
    } catch (err) {
      console.error(`Failed to delete group ${group.name}`, err);
    }
  };

  // Xử lý copy mã người dùng
  const handleCopy = () => {
    if (!data) return;

    navigator.clipboard
      .writeText(data.data.user.id)
      .then(() => {
        toast.success(t("copyId"));
        setCopied(true);
        setTimeout(() => setCopied(false), 500);
      })
      .catch(() => toast.error(t("copyIdFail")));
  };

  // Lấy danh sách nhóm chat khi component được mount
  useEffect(() => {
    fetchMyGroups();
  }, []);

  // Lắng nghe sự kiện nhận tin nhắn mới từ socket
  useEffect(() => {
    // Load từ localStorage khi mount
    const savedGroups = localStorage.getItem("chatGroups");
    if (savedGroups) {
      setChatGroups(JSON.parse(savedGroups));
    }
  }, []);

  useEffect(() => {
    // Mỗi khi chatGroups thay đổi thì lưu vào localStorage
    if (chatGroups.length > 0) {
      localStorage.setItem("chatGroups", JSON.stringify(chatGroups));
    }
  }, [chatGroups]);

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const incomingChatId = data.chatId;
      if (!incomingChatId) return;

      setChatGroups((prevGroups) => {
        const updated = prevGroups.map((group) =>
          group.id === incomingChatId && incomingChatId !== selectedChatId
            ? {
                ...group,
                hasUnread: true,
                unreadCount: (group.unreadCounts || 0) + 1,
                durationTime: new Date().toISOString(),
              }
            : group
        );

        updated.sort(
          (a, b) =>
            new Date(b.durationTime).getTime() -
            new Date(a.durationTime).getTime()
        );

        return updated;
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedChatId]);

  // Cập nhật thời gian chat khi nhận sự kiện từ socket
  useEffect(() => {
    const handleUpdateChatTime = (data: {
      chatId: string;
      updatedAt: string;
    }) => {
      setChatGroups((prevGroups) => {
        const updated = prevGroups.map((group) =>
          group.id === data.chatId
            ? { ...group, durationTime: data.updatedAt }
            : group
        );

        return updated.sort(
          (a, b) =>
            new Date(b.durationTime).getTime() -
            new Date(a.durationTime).getTime()
        );
      });
    };

    socket.on("chat:update-time", handleUpdateChatTime);

    return () => {
      socket.off("chat:update-time", handleUpdateChatTime);
    };
  }, []);

  useEffect(() => {
    if (!resultBoxRef.current || !highlightedItemRef.current) return;

    const container = resultBoxRef.current;
    const item = highlightedItemRef.current;

    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // Nếu item nằm ngoài khung nhìn, scroll mượt đến vị trí của nó
    if (itemTop < containerTop) {
      container.scrollTo({
        top: itemTop - 10, // thêm padding một chút
        behavior: "smooth",
      });
    } else if (itemBottom > containerBottom) {
      container.scrollTo({
        top: itemBottom - container.clientHeight + 0,
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  // Xử lý tìm kiếm trong nhóm chat
  const handleGroupSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupSearchTerm(value);

    if (value.trim() === "") {
      setGroupSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/users/search?email=${value}`,
        {
          withCredentials: true,
        }
      );
      setGroupSearchResults(res.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm trong group:", error);
    }
  };

  const mergedResults = [...allUsers, ...filteredGroups];

  // Xử lý khi người dùng click vào một người dùng trong danh sách tìm kiếm
  const handleUserClick = async (user: User) => {
    try {
      const res = await axios.get(
        `${API_URL}/chats/check-one-to-one/${user.id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.exists) {
        const chat = res.data.chat;

        onSelectChat(chat.id, chat.hashedUserKey, user.name, user.avatar);
      } else {
        setSelectedUser(user);
        setShowKeyModal(true);
      }
      setSearchTerm("");
      setAllUsers([]);
    } catch (err) {
      console.error("Lỗi khi kiểm tra chat:", err);
    }
  };

  // Xử lý các phím trong ô tìm kiếm
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!mergedResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < mergedResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : mergedResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = mergedResults[highlightedIndex];
      if (!selected) return;

      if ("email" in selected) {
        handleUserClick(selected);
      } else {
        handleSelectGroup(
          selected.id,
          selected.hashedUserKey,
          selected.displayName
        );
      }
      setSearchTerm("");
      setAllUsers([]);
      setFilteredGroups([]);
      setHighlightedIndex(-1);
    }
  };

  // Xử lý click bên ngoài ô tìm kiếm và kết quả tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node) &&
        resultBoxRef.current &&
        !resultBoxRef.current.contains(event.target as Node)
      ) {
        setAllUsers([]);
        setFilteredGroups([]);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socket.on("chat:unread", ({ chatId, unreadCount }) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: unreadCount,
      }));
    });
    console.log(unreadCounts, "unreadCounts");

    return () => {
      socket.off("chat:unread");
    };
  }, []);

  // Thực hiện tìm kiếm khi ô tìm kiếm được focus
  const performSearch = async (term: string) => {
    if (term.trim() === "") {
      setAllUsers([]);
      setFilteredGroups([]);
      return;
    }

    try {
      const [resUsers] = await Promise.all([
        axios.get(`${API_URL}/users/search?email=${term}`, {
          withCredentials: true,
        }),
      ]);

      setAllUsers(resUsers.data);

      const filtered = chatGroups.filter((group) =>
        group.displayName?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredGroups(filtered);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  // Xử lý thêm người dùng vào nhóm chat
  const handleAddUserToGroup = (user: User) => {
    if (!selectedGroupUsers.find((u) => u.id === user.id)) {
      setSelectedGroupUsers((prev) => [...prev, user]);
    }
    setGroupSearchTerm("");
    setGroupSearchResults([]);
  };

  // Xử lý xoá người dùng khỏi nhóm chat
  const handleRemoveUserFromGroup = (userId: string) => {
    setSelectedGroupUsers((prev) => prev.filter((u) => u.id !== userId));
  };
  const fetchInitialUnreadCounts = async () => {
    if (!currentUser?.id) return;

    try {
      const res = await axios.get(
        `${API_URL}/messages/unread/${currentUser.id}`,
        { withCredentials: true }
      );

      setUnreadCounts(res.data); // { chatId: count }

      // ✅ Cập nhật chatGroups với unread counts
      setChatGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          unreadCounts: res.data[group.id] || 0,
          hasUnread: (res.data[group.id] || 0) > 0,
        }))
      );
    } catch (err) {
      console.error("Lỗi khi fetch unread counts:", err);
    }
  };

  // ✅ 2. Gọi fetchInitialUnreadCounts khi component mount
  useEffect(() => {
    fetchMyGroups();
    // Gọi sau khi đã có currentUser
    if (currentUser?.id) {
      fetchInitialUnreadCounts();
    }
  }, [currentUser?.id]);

  // ✅ 3. Cải thiện việc lắng nghe socket events
  useEffect(() => {
    if (!currentUser?.id) return;

    // Join user's personal room
    socket.emit("user:join", currentUser.id);

    // Join all chat rooms của user
    chatGroups.forEach((group) => {
      socket.emit("chat:join", {
        chatId: group.id,
        userId: currentUser.id,
      });
    });

    return () => {
      // Leave all rooms khi component unmount
      chatGroups.forEach((group) => {
        socket.emit("chat:leave", {
          chatId: group.id,
          userId: currentUser.id,
        });
      });
    };
  }, [currentUser?.id, chatGroups]);

  // ✅ 4. Cập nhật handleReceiveMessage
  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const incomingChatId = data.chatId;
      if (!incomingChatId) return;

      // ✅ Chỉ cập nhật nếu không phải chat đang mở
      if (incomingChatId !== selectedChatId) {
        setChatGroups((prevGroups) => {
          const updated = prevGroups.map((group) =>
            group.id === incomingChatId
              ? {
                  ...group,
                  hasUnread: true,
                  durationTime: new Date().toISOString(),
                  // ✅ Không tự tăng unreadCount ở đây nữa,
                  // để socket "chat:unread" handle
                }
              : group
          );

          updated.sort(
            (a, b) =>
              new Date(b.durationTime).getTime() -
              new Date(a.durationTime).getTime()
          );

          return updated;
        });
      } else {
        // ✅ Nếu đang ở chat này, đánh dấu đã đọc
        socket.emit("message:read:chat", {
          chatId: incomingChatId,
          userId: currentUser?.id,
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedChatId, currentUser?.id]);

  // ✅ 5. Cập nhật handleOpenGroup để đánh dấu đã đọc
  const handleOpenGroup = async (
    groupId: string,
    hashedUserKey: string,
    displayName?: string,
    avatar?: string
  ) => {
    const shownKeyIds = JSON.parse(
      localStorage.getItem("shownGroupKeys") || "[]"
    );

    if (hashedUserKey && !shownKeyIds.includes(groupId)) {
      const decryptedKey = hashedUserKey
        ? CryptoJS.AES.decrypt(hashedUserKey, key).toString(CryptoJS.enc.Utf8)
        : null;
      alert(`🔐 Mã khoá của phòng chat là: ${decryptedKey}`);
      shownKeyIds.push(groupId);
      localStorage.setItem("shownGroupKeys", JSON.stringify(shownKeyIds));
    }

    onSelectChat(groupId, hashedUserKey, displayName ?? "", avatar);
    localStorage.setItem("selectedChatId", groupId);

    // ✅ Đánh dấu chat này là đã đọc
    if (currentUser?.id) {
      socket.emit("message:read:chat", {
        chatId: groupId,
        userId: currentUser.id,
      });
    }

    // ✅ Reset unread count local
    setChatGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, hasUnread: false, unreadCounts: 0 }
          : group
      )
    );

    setUnreadCounts((prev) => ({
      ...prev,
      [groupId]: 0,
    }));
  };

  return (
    <section>
      <div className="dark:text-[#1AFF1A] text-[#ffffff] font-mono h-screen flex flex-col bg-[#2E3138] dark:bg-[#0A0F0D]">
        {/* Header Component */}
        {data && (
          <UserHeader
            user={{
              ...data.data.user,
              createdAt: data.data.user.createdAt ?? "",
            }}
            copied={copied}
            onCopy={handleCopy}
          />
        )}

        {/* Search Section */}
        <div className="relative mb-4 flex-shrink-0 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SearchBox
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearchKeyDown={handleSearchKeyDown}
              onSearchFocus={() => performSearch(searchTerm)}
              searchBoxRef={searchBoxRef}
            />
            <div>
              <Button onClick={handleClickOpenModalGruop}>
                <IconCreateGroupChat />
              </Button>
            </div>
          </div>

          <SearchResults
            highlightedItemRef={highlightedItemRef}
            searchTerm={searchTerm}
            allUsers={allUsers}
            filteredGroups={filteredGroups}
            highlightedIndex={highlightedIndex}
            onUserClick={handleUserClick}
            onSelectGroup={handleSelectGroup}
            resultBoxRef={resultBoxRef}
          />
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={openCreactGroup}
          onClose={handleClickOpenModalGruop}
          onSubmit={createGroupChat}
          groupSearchTerm={groupSearchTerm}
          onGroupSearchChange={handleGroupSearch}
          groupSearchResults={groupSearchResults}
          selectedGroupUsers={selectedGroupUsers}
          onAddUserToGroup={handleAddUserToGroup}
          onRemoveUserFromGroup={handleRemoveUserFromGroup}
          register={registerGroup}
          handleSubmit={handleSubmitGroup}
        />

        {/* Chat List */}
        <ChatList
          chatGroups={chatGroups}
          selectedChatId={selectedChatId}
          onSelectGroup={handleSelectGroup}
          onDeleteGroup={deleteGroup}
          curentUserId={currentUser?.id || ""}
          unreadCounts={unreadCounts}
        />

        {/* Key Input Modal */}
        <KeyInputModal
          isOpen={showKeyModal}
          onClose={() => setShowKeyModal(false)}
          onConfirm={handleConfirmKey}
          manualKey={manualKey}
          onKeyChange={setManualKey}
        />
      </div>
    </section>
  );
}

export default Message;
