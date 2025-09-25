"use client";

import AuthGuard from "@/app/(auth)/AuthGuard";
import Loading from "@/components/icons/Loading/Loading";
import Chat from "@/components/widgets/Chat/Chat";
import FeedbackButton from "@/components/widgets/Feedback/FeedbackButton";
import Message from "@/components/widgets/Message/Message";
import RenderData from "@/components/widgets/renderData/renderData";
import Sidebar from "@/components/widgets/Sidebar/Sidebar";
import { AppContext } from "@/contexts/app.context";
import "@/i18n";
import { ChatGroup } from "@/types/chat";
import { Lock, MessageSquareText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import logoAstra from "../../public/imgs/logo-astra.png";

function Home() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, handleLogout } = useContext(AppContext);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [selectChatId, setSelectChatId] = useState<string | null>(null);
  const [selectChatKey, setSelectChatKey] = useState<string | null>(null);
  const [selectChatDisplayName, setSelectChatDisplayName] = useState<
    string | null
  >(null);
  const [selectChatAvatar, setSelectChatAvatar] = useState<string | null>(null);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);

  const navigate = useRouter();

  const selectedGroup = chatGroups.find((g) => g.id === selectChatId);
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate.replace("/login");
    }
  }, [isAuthenticated, isLoading]);

  const handleCloseMessage = () => setShowMessage(false);
  const handleOpenMessageList = () => {
    setSelectChatId(null);
    setShowMessage(true);
    localStorage.removeItem("selectedChatId");
  };
  const handleSelectChat = (
    chatId: string,
    chatKey: string | null,
    displayName?: string,
    avatar?: string
  ) => {
    setSelectChatId(chatId);
    setSelectChatKey(chatKey);
    setSelectChatDisplayName(displayName ?? null);
    setSelectChatAvatar(avatar ?? null);
  };

  return (
    <AuthGuard allowedRoles={["USER"]}>
      <main>
        {isLoading && (
          <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <Loading />
          </div>
        )}
        {!isLoading && (
          <div className="grid grid-cols-12 h-screen">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3 grid grid-cols-12 ">
              <div className="block col-span-2 md:col-span-1 lg:col-span-2 bg-[#1E1F26] text-white">
                <Sidebar
                  onOpenMessage={handleOpenMessageList}
                  onClickHandleLogout={handleLogout}
                />
              </div>
              <div className="block col-span-10 md:col-span-11 lg:col-span-10 h-full overflow-y-auto dark:bg-[#22262B] dark:text-white">
                {selectChatId === null ? (
                  <Message
                    chatGroups={chatGroups}
                    setChatGroups={setChatGroups}
                    selectedChatId={selectChatId}
                    onSelectChat={handleSelectChat}
                  />
                ) : (
                  <div className="h-full w-full relative">
                    <div className="hidden lg:block">
                      <Message
                        selectedChatId={selectChatId}
                        onSelectChat={handleSelectChat}
                        chatGroups={chatGroups}
                        setChatGroups={setChatGroups}
                      />
                    </div>
                    <div className="w-full h-full block lg:hidden">
                      <Chat
                        chatId={selectChatId}
                        chatKey={selectChatKey ?? ""}
                        setChatGroups={setChatGroups}
                        displayName={selectChatDisplayName ?? undefined}
                        avatarPage={selectChatAvatar ?? undefined}
                        participants={selectedGroup?.participants ?? []}
                      />
                    </div>
                  </div>
                )}
              </div>
              {showMessage && (
                <div
                  className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
                  onClick={handleCloseMessage}
                >
                  <div
                    className="absolute left-0 top-0 h-full w-full bg-white dark:bg-[#22262B]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Message
                      onSelectChat={handleSelectChat}
                      selectedChatId={selectChatId}
                      chatGroups={chatGroups}
                      setChatGroups={setChatGroups}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Chat desktop */}
            <div className="hidden lg:col-span-9 lg:grid grid-cols-12 w-full h-full">
              {selectChatId === null ? (
                <div className="col-span-12 h-full w-full flex items-center justify-center bg-white dark:bg-[#0D1117] text-center px-4">
                  <div className="max-w-lg mx-auto">
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      <ShieldCheck className="w-8 h-8 text-green-500" />
                      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {t("secure_chat_title")}
                      </h1>
                    </div>
                    <div className="h-20 w-20 mb-4 mx-auto">
                      <Image
                        src={logoAstra}
                        alt="Logo Astra"
                        className="rounded-3xl bg-black dark:bg-transparent"
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t("secure_chat_desc")}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Lock className="text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {t("full_security")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquareText className="text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {t("no_server_storage")}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {t("choose_chat_prompt")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lg:col-span-9 h-full overflow-y-auto hidden lg:block">
                    <Chat
                      chatId={selectChatId}
                      chatKey={selectChatKey ?? ""}
                      displayName={selectChatDisplayName ?? undefined}
                      setChatGroups={setChatGroups}
                      avatarPage={selectChatAvatar ?? undefined}
                      participants={selectedGroup?.participants ?? []}
                    />
                  </div>
                  <div className="hidden lg:block lg:col-span-3 h-full border-l border-solid border-[#E2E8F0] dark:border-[#2D333B] bg-black dark:bg-[#0D1117] overflow-y-auto">
                    <RenderData chatId={selectChatId} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={2000} />

      </main>
    </AuthGuard>
  );
}

export default Home;
