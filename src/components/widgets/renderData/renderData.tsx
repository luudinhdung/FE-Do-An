import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import FeedbackButton from "../Feedback/FeedbackButton";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://35.188.81.254";

const socket = io(`${API_URL}/messages`);

function RenderData({ chatId }: { chatId: string }) {
  const [dataArray, setDataArray] = useState<
    { id: string; content: string; createdAt: Date }[]
  >([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  useEffect(() => {
    if (chatId) {
      socket.emit("user:join", chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/messages/chat/${chatId}`
        );
        const extracted = res.data.map((msg: any) => ({
          id: msg.id,
          content: msg.data,
          createdAt: msg.createdAt,
        }));
        setDataArray(extracted);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.chatId === chatId) {
        setDataArray((prev) => [
          ...prev,
          {
            id: message.messageId,
            content: message.data,
            createdAt: message.createdAt,
          },
        ]);
      }
    };

    socket.on("receive_message", handleNewMessage);
    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [chatId]);

  useEffect(() => {
    const handleDeleteMessage = (payload: {
      chatId: string;
      messageId: string;
    }) => {
      if (payload.chatId === chatId) {
        setDataArray((prev) =>
          prev.filter((msg) => msg.id !== payload.messageId)
        );
      }
    };

    socket.on("message:deleted", handleDeleteMessage);
    return () => {
      socket.off("message:deleted", handleDeleteMessage);
    };
  }, [chatId]);

  // 👉 Auto scroll to bottom when new data arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dataArray]);

  console.log("🔄 RenderData chatId:", chatId, "dataArray:", dataArray);

  if (!chatId) return null;

  return (
    <div className="w-full h-full bg-black text-[#5abd73] font-mono rounded-md border border-[#00FF41]/30 overflow-hidden">
      <div className="sticky p-2 border-b border-[#E2E8F0] dark:border-[#2D333B]">
        <h2 className="text-lg text-white font-semibold dark:text-white">
          🧠 {t("serverData")}
        </h2>
      </div>
      <div
        className="
        overflow-y-auto pr-2 custom-scroll
        max-h-[calc(100vh-150px)]
        sm:max-h-[calc(100vh-160px)]
        md:max-h-[calc(100vh-180px)]
        lg:max-h-[calc(100vh-150px)]
      "
      >
        <ul className="list-decimal list-inside h-full marker:text-[#00FF41] space-y-1">
          {dataArray.map((msg, index) => {
            console.log("Rendering msg:", msg.content);

            const colors = [
              "text-[#5abd73]",
              "text-[#aaffaa]",
              "text-[#00FF41]",
              "text-[#a8ff60]",
              "text-[#3aff7f]",
              "text-[#7cffcb]",
            ];
            const textColor = colors[index % colors.length];
            let timeStr = "";
            if (msg.createdAt) {
              const d = new Date(msg.createdAt);
              if (!isNaN(d.getTime())) {
                timeStr = d.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              }
            }

            return (
              <li
                key={msg.id}
                className="flex items-center text-sm tracking-wide text-[#5abd73] hover:opacity-90 transition"
              >
                <span className="w-10 text-right mr-2 text-[#00FF41]">
                  {index + 1}.
                </span>

                <span className="flex-1 break-words">{msg.id}</span>

                {timeStr && (
                  <span className="ml-2 shrink-0 text-xs text-[#7cffcb] opacity-70">
                    {timeStr}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <FeedbackButton />

        {/* 👇 Scroll target */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default RenderData;
