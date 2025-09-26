"use client";

import Button from "@/components/ui/Button/Button";
import {
  ChevronDoubleDown,
  IconAttachment,
  IconDelete,
  IconMessage,
  IconSubmit,
  PeopleOutline,
  RepMess,
} from "@/data/icons";
import { ChatGroup } from "@/types/chat";
import { filterSensitiveWords } from "@/utils/filterWords";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Clock, Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import io from "socket.io-client";

interface MessageProps {
  chatId: string;
  chatKey: string;
  displayName?: string;
  avatarPage?: string;
  setChatGroups: React.Dispatch<React.SetStateAction<ChatGroup[]>>;
  participants: { user: { id: string; name: string; avatar: string } }[];
}

interface Message {
  [x: string]: any;
  sender: string;
  content: string;
  createdAt: Date;
  messageId?: string;
  avatar: string | null;
  type: "TEXT" | "IMAGE" | "FILE";
  encrypted?: any;
  decrypted?: boolean;
  repliedMessageId?: string | null;
  countdown?: number;
  fileName?: string;
  reactions?: { userId: string; emoji: string }[];
}
const socket = io("http://localhost:3002/messages");


function getPreviewText(msg: Message): string {
  if (!msg.encrypted || !msg.encrypted.data) {
    return msg.content ?? "";
  }
  if (msg.type === "IMAGE") return "🔒 Ảnh đã mã hóa";
  if (msg.type === "FILE") return "🔒 File đã mã hóa";
  return `${msg.encrypted.data.slice(0, 20)}...`;
}

function Chat({
  chatKey,
  chatId,
  setChatGroups,
  displayName,
  avatarPage,
  participants = [],
}: MessageProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [userInputKey, setUserInputKey] = useState("");
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showDeleteForId, setShowDeleteForId] = useState<string | null>(null);
  const [repliedMessage, setRepliedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [justSentMessage, setJustSentMessage] = useState(false);
  const [globalCountdown, setGlobalCountdown] = useState<number | null>(null);
  const repliedMessageIdRef = useRef<string | null>(null);
  const [reactions, setReactions] = useState<{
    [key: string]: { userId: string; emoji: string }[];
  }>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(
    null
  );
  const [globalDecrypting, setGlobalDecrypting] = useState(false);
  const [isDecryptAll, setIsDecryptAll] = useState(false);
  const [messageCountdowns, setMessageCountdowns] = useState<
  Record<string, number>
>({});
const [userCountdown, setUserCountdown] = useState<number | null>(null);

  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "fallback-key";
  axios.defaults.withCredentials = true;
  const bottomRef = useRef<HTMLDivElement>(null);
  const a = chatKey
    ? CryptoJS.AES.decrypt(chatKey, key).toString(CryptoJS.enc.Utf8)
    : null;
  const { t } = useTranslation();



  // Xử lý thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      // 1) per-message countdowns
      setMessageCountdowns((prev) => {
        if (!prev || Object.keys(prev).length === 0) return prev;
        const next: Record<string, number> = { ...prev };
  
        Object.entries(prev).forEach(([mid, value]) => {
          const v = typeof value === "number" ? value : Number(value);
          if (isNaN(v)) return;
  
          if (v <= 1) {
            // remove countdown for this message
            delete next[mid];
  
            // also re-encrypt that message in messages list (safe)
            setMessages((msgs) =>
              msgs.map((m) => {
                if (m.messageId === mid && m.decrypted) {
                  return {
                    ...m,
                    decrypted: false,
                    content: getPreviewText(m),
                  };
                }
                return m;
              })
            );
          } else {
            next[mid] = v - 1;
          }
        });
  
        return next;
      });
  
      // 2) global countdown
      setGlobalCountdown((prev) => {
        if (typeof prev === "number") {
          if (prev <= 1) {
            // global finished -> revert decrypt-all and re-encrypt messages
            setGlobalDecrypting(false);
            setIsDecryptAll(false);
            setMessageCountdowns({});
  
            setMessages((msgs) =>
              msgs.map((m) =>
                m.decrypted
                  ? {
                      ...m,
                      decrypted: false,
                      content: getPreviewText(m),
                    }
                  : m
              )
            );
  
            return null;
          }
          return prev - 1;
        }
        return prev;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);
  

  // Lấy thông tin người dùng hien tai
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:3002/users/current");
        const user = res.data.user;
        if (user) {
          setCurrentUserName(user.name);
          setCurrentUserId(user.id);
          setAvatar(user.avatar || null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Xử lý xoá message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete("http://localhost:3002/messages/delete", {
        data: { messageId },
      });
      setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
    } catch (error) {
      console.error("Lỗi khi xoá tin nhắn:", error);
      alert("Không thể xoá tin nhắn.");
    }
  };

  // Xử lý gửi file và ảnh
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post(
        "http://localhost:3002/messages/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploaded = res.data;

      const sendEncrypted = async (
        filePath: string,
        originalName: string,
        type: "IMAGE" | "FILE"
      ) => {
        const encrypted = await encryptMessage(
          JSON.stringify({ url: filePath, name: originalName })
        );
        console.log(filePath, originalName, type, encrypted);

        socket.emit("send_message", {
          chatId,
          senderId: currentUserId,
          isEncrypted: true,
          content: encrypted,
          type,
          repliedMessageId: repliedMessage?.messageId ?? null,
        });
      };

      if (!Array.isArray(uploaded.files)) {
        const fileUrl = uploaded.filePath;
        const fileName = uploaded.originalName; // ✅ tên gốc từ backend
        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
        await sendEncrypted(fileUrl, fileName, isImage ? "IMAGE" : "FILE");
      } else {
        for (const file of uploaded.files) {
          const fileUrl = file.filePath;
          const fileName = file.originalName; // ✅ tên gốc
          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fileName);
          await sendEncrypted(fileUrl, fileName, isImage ? "IMAGE" : "FILE");
        }
      }

      toast.success(t("chat.successUpload"));
    } catch (err) {
      toast.success(t("chat.errorUpload"));
      console.error(err);
    }

    e.target.value = "";
  };

  // Mã hoá
  async function deriveKey(passphrase: string) {
    const enc = new TextEncoder();
    const passphraseKey = enc.encode(passphrase);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passphraseKey,
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("your-custom-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  // Chia sẻ key mã hoá
  const handleReEncrypt = (index: number) => {
    const msg = messages[index];
    if (!msg.decrypted) return;

    const updated = [...messages];
    updated[index] = {
      ...msg,
      content: getPreviewText(msg),
      decrypted: false,
    };
    setMessages(updated);
  };

  // Join thành viên
  useEffect(() => {
    socket.emit("user:join", currentUserName); // join room theo user ID

    socket.on("chat:new-room-key", (data) => {
      const a = data.encryptedKey
        ? CryptoJS.AES.decrypt(data.encryptedKey, key).toString(
            CryptoJS.enc.Utf8
          )
        : null;

      alert(`. Mã khoá đã được chia sẻ ${a}`);
      // hoặc setNotification(data)
    });

    return () => {
      socket.off("chat:new-room-key");
    };
  });

  // Mã hoá tin nhắn
  async function encryptMessage(text: string) {
    const key = await deriveKey(chatKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
    return {
      iv: Array.from(iv)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      data: Array.from(new Uint8Array(ciphertext))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    };
  }

  async function decryptMessage(encrypted: { iv: string; data: string }) {
    try {
      const key = await deriveKey(chatKey);
      const iv = new Uint8Array(
        encrypted.iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );
      const ciphertext = new Uint8Array(
        encrypted.data.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decryptedBuffer);
    } catch (e) {
      return "[Lỗi giải mã]";
    }
  }

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/messages/chat/${chatId}`
        );
        const encryptedMessages = res.data;

        const transformed = encryptedMessages.map((msg: any) => {
          const encryptedContent =
            typeof msg.content === "string"
              ? JSON.parse(msg.content)
              : msg.content;

          const previewText = encryptedContent?.data
            ? `${encryptedContent.data.slice(0, 20)}...`
            : "";

          return {
            sender: msg.sender?.name,
            content: previewText,
            createdAt: new Date(msg.createdAt),
            messageId: msg.id,
            avatar: msg.sender?.avatar || null,
            encrypted: encryptedContent,
            decrypted: false,
            repliedMessageId: msg.repliedMessageId || null,
            type: msg.type,
            reactions: msg.reactions || [],
          };
        });

        setMessages(
          transformed.sort(
            (a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime()
          )
        );
      } catch (error) {
        console.error("Lỗi khi fetch messages:", error);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      if (data.chatId !== chatId) return;
      console.log(data);

      let encryptedContent;
      try {
        encryptedContent =
          typeof data.content === "string"
            ? JSON.parse(data.content)
            : data.content;
      } catch (err) {
        encryptedContent = { data: "" };
      }

      const previewText = encryptedContent?.data
        ? `${encryptedContent.data.slice(0, 20)}...`
        : "";
      const senderName =
        data.sender?.name ||
        (data.senderId === currentUserId ? currentUserName : "Không có tên");

      const newMsg: Message = {
        sender: senderName,
        content: previewText, // luôn hiển thị mã hóa trước khi giải mã
        type: data.type,
        createdAt: new Date(data.createdAt || Date.now()),
        messageId: data.messageId,
        avatar: data.sender?.avatar || null,
        encrypted: encryptedContent,
        decrypted: false,
        repliedMessageId: data.repliedMessageId ?? null,
      };
      setMessages((prev) =>
        [...prev, newMsg].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )
      );
      console.log(newMsg);
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chatId, currentUserId, currentUserName]);

  useEffect(() => {
    if (chatId) {
      socket.emit("joinRoom", chatId); // 👈 Tham gia room để nhận update
    }
  }, [chatId]);

  useEffect(() => {
    // ✅ Reset trạng thái trả lời khi chuyển sang cuộc chat mới
    setRepliedMessage(null);
    repliedMessageIdRef.current = null;
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const safeMessage = filterSensitiveWords(message);

    const encrypted = await encryptMessage(message);
    const now = new Date().toISOString();

    socket.emit("send_message", {
      chatId,
      senderId: currentUserId,
      isEncrypted: true,
      content: encrypted,
      repliedMessageId: repliedMessage?.messageId ?? null,
    });
    setChatGroups((prevGroups) => {
      const updated = prevGroups.map((group) =>
        group.id === chatId ? { ...group, durationTime: now } : group
      );
      return updated.sort(
        (a, b) =>
          new Date(b.durationTime).getTime() -
          new Date(a.durationTime).getTime()
      );
    });

    // ✅ Cập nhật thời gian chat để tự đẩy lên đầu
    socket.emit("chat:update-time", {
      chatId,
      updatedAt: now,
    });

    setMessage("");
    setRepliedMessage(null);
    setJustSentMessage(true);
  };

  const handleVerifyAndDecrypt = async () => {
    setRepliedMessage(null);
    repliedMessageIdRef.current = null;

    if (!userInputKey) {
      setKeyError("Bạn chưa nhập key.");
      toast.error(t("chat.noKey"));
      inputRef.current?.focus();
      return;
    }

    if (userInputKey !== a) {
      setKeyError("Key không chính xác!");
      toast.error(t("chat.wrongKey"));
      inputRef.current?.focus();
      return;
    }

    setKeyError("");

    if (!isDecryptAll && selectedMessageIndex === null) {
      setKeyError("Bạn chưa chọn tin nhắn hoặc bật giải mã tất cả");
      toast.error(t("chat.noSelection"));
      inputRef.current?.focus();
      return;
    }

    if (isDecryptAll) {
      const updatedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.decrypted) return msg;
          const decrypted = await decryptMessage(msg.encrypted);

          if (msg.type === "FILE") {
            try {
              const parsed = JSON.parse(decrypted);
              return {
                ...msg,
                content: parsed.url,
                fileName: parsed.name,
                decrypted: true,
              };
            } catch {
              return msg;
            }
          }
          if (msg.type === "IMAGE") {
            try {
              const parsed = JSON.parse(decrypted);
              return {
                ...msg,
                content: parsed.url, // URL ảnh
                fileName: parsed.name, // tên gốc (nếu muốn dùng)
                decrypted: true,
              };
            } catch {
              return msg;
            }
          }

          return { ...msg, content: decrypted, decrypted: true };
        })
      );
      setMessages(updatedMessages);
      setIsDecryptAll(true);
      setGlobalDecrypting(true);
      setMessageCountdowns({}); 
      console.log(0);
      setGlobalCountdown(userCountdown || 0);
      setUserInputKey("");
      return;
    }

    if (selectedMessageIndex !== null) {
      const msg = messages[selectedMessageIndex];
      const decrypted = await decryptMessage(msg.encrypted);

      if (msg.type === "FILE") {
        try {
          const parsed = JSON.parse(decrypted);
          const updated = [...messages];
          updated[selectedMessageIndex] = {
            ...msg,
            content: parsed.url,
            fileName: parsed.name,
            decrypted: true,
            countdown: 10,
          };
          setMessages(updated);
        } catch {
          // fallback nếu lỗi
        }
      } else if (msg.type === "IMAGE") {
        const updated = [...messages];
        updated[selectedMessageIndex] = {
          ...msg,
          content: decrypted,
          decrypted: true,
          countdown: 10,
        };
        setMessages(updated);
      } else {
        const updated = [...messages];
        updated[selectedMessageIndex] = {
          ...msg,
          content: decrypted,
          decrypted: true,
          countdown: 10,
        };
        setMessages(updated);
      setSelectedMessageIndex(null);
      setUserInputKey("");
      setGlobalCountdown(userCountdown); // ✅
      const mid = updated[selectedMessageIndex].messageId;
      if (mid) {
        setMessageCountdowns((prev) => ({
          ...prev,
          [mid]: userCountdown ?? 30,
        }));
      }
      setSelectedMessageIndex(null);
      setUserInputKey("");
    
      }

      
    }
  };


  const handleDecryptMessage = (messageId: string) => {
    if (isDecryptAll) return; // bỏ qua nếu đang decrypt all

    const countdown = userCountdown ?? 0;
    setMessageCountdowns((prev) => ({ ...prev,[messageId]: countdown }));

    const timer = setInterval(() => {
      setMessageCountdowns((prev) => {
        const current = prev[messageId];
        if (current && current > 1) {
          return { ...prev, [messageId]: current - 1 };
        } else {
          clearInterval(timer);
          const { [messageId]: _, ...rest } = prev;
          return rest;
        }
      });
    }, 1000);
  };

  const handleDecryptAll = () => {
    const countdown = userCountdown ?? 0;

    setIsDecryptAll(true); // 👈 chế độ giải mã tất cả
    setMessageCountdowns({}); // 👈 clear countdown ở từng tin
    setGlobalDecrypting(true);
    setGlobalCountdown(countdown);

    const timer = setInterval(() => {
      setGlobalCountdown((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(timer);
          setGlobalDecrypting(false);
          setIsDecryptAll(false); // reset về bình thường
          return null;
        }
      });
    }, 1000);
  };



  const handleToggleDecryptAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsDecryptAll(checked);
    setSelectedMessageIndex(null);
    setTimeout(() => inputRef.current?.focus(), 0);

    // Nếu bỏ tích thì tự động mã hoá lại tất cả
    if (!checked) {
      const reEncrypted = messages.map((msg) => {
        if (!msg.decrypted) return msg;
        return {
          ...msg,
          content: getPreviewText(msg),
          decrypted: false,
          countdown: undefined,
        };
      });
      setMessages(reEncrypted);
      setGlobalCountdown(null);
      setGlobalDecrypting(false);
      setMessageCountdowns({});
    }
  };

  const handleManualDecrypt = (index: number) => {
    setSelectedMessageIndex(index);
    setIsDecryptAll(false); // reset checkbox "Decrypt All"
    setUserInputKey(""); // reset ô nhập key
    setKeyError(""); // reset thông báo lỗi
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Theo dõi scroll để biết user có đang ở cuối hay không
  useEffect(() => {
    const chatContent = chatContentRef.current;
    if (!chatContent) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContent;
      // Nếu user ở gần cuối (cách cuối 50px)
      setIsUserScrolledUp(scrollTop + clientHeight < scrollHeight - 50);
    };
    chatContent.addEventListener("scroll", handleScroll);
    return () => chatContent.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if ((justSentMessage || !isUserScrolledUp) && messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
      setJustSentMessage(false);
    }
  }, [messages, isUserScrolledUp, justSentMessage]);

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawText = e.target.value;
    const safeText = filterSensitiveWords(rawText);
    setMessage(safeText);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  if (!chatId) {
    return (
      <div className="flex items-center justify-center gap-2 h-full font-semibold text-gray-500 dark:text-gray-300">
        <h1>{t("chatBox.empty")}</h1>
        <IconMessage className="w-[20px] h-[20px]" />
      </div>
    );
  }

  //Hàm xử lý khi bấm emoji
  const handleReact = (messageId: string, emoji: string) => {
    socket.emit("send_reaction", {
      chatId,
      messageId,
      userId: currentUserId,
      emoji,
    });
  };

  const handleRemoveReact = (messageId: string) => {
    socket.emit("remove_reaction", {
      chatId,
      messageId,
      userId: currentUserId,
    });
  };

  const handleShowReactionPicker = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReactionPicker((prev) => (prev === messageId ? null : messageId));
  };

  useEffect(() => {
    socket.on("receive_reaction", (updatedMessage) => {
      console.log("Received reaction update:", updatedMessage); // Debug log

      setMessages((prev) =>
        prev.map((msg) => {
          // ✅ Kiểm tra và giữ nguyên content khi update reactions
          if (msg.messageId === updatedMessage.id) {
            return {
              ...msg, // Giữ nguyên tất cả dữ liệu cũ
              reactions: updatedMessage.reactions, // Chỉ cập nhật reactions
              // ✅ Đảm bảo không làm mất content
              content: msg.content, // Giữ nguyên content
              encrypted: msg.encrypted, // Giữ nguyên encrypted data
              decrypted: msg.decrypted, // Giữ nguyên trạng thái decrypt
            };
          }
          return msg;
        })
      );
    });

    socket.on("remove_reaction", (updatedMessage) => {
      console.log("Removed reaction update:", updatedMessage); // Debug log

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.messageId === updatedMessage.id) {
            return {
              ...msg, // Giữ nguyên tất cả dữ liệu cũ
              reactions: updatedMessage.reactions, // Chỉ cập nhật reactions
              // ✅ Đảm bảo không làm mất content
              content: msg.content, // Giữ nguyên content
              encrypted: msg.encrypted, // Giữ nguyên encrypted data
              decrypted: msg.decrypted, // Giữ nguyên trạng thái decrypt
            };
          }
          return msg;
        })
      );
    });

    return () => {
      socket.off("receive_reaction");
      socket.off("remove_reaction");
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3002/users/current", { withCredentials: true })
      .then((res) => {
        console.log("DefaultCountdown từ API:", res.data.user.defaultCountdown);
        setUserCountdown(res.data.user.defaultCountdown ?? 30);
      })
      .catch(() => setUserCountdown(30));
  }, []);

  return (
    <div className="bg-[#ffffff] flex flex-col font-mono h-screen text-[#005A3C] dark:text-[#1AFF1A] dark:bg-[#0A0F0D] overflow-hidden">
      {/* Tiêu đề */}
      <div className="sticky top-0 z-20 w-full from-white to-[#ffffff] dark:bg-[#16191D] shadow-sm border-b border-[#00D084] dark:border-[#1AFF1A] border-opacity-20 px-4 sm:px-6 md:px-8 py-3">
        <div className="flex flex-col space-y-4">
          {/* Phần key và giải mã */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Phần tên người/nhóm chat */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={avatarPage}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1 text-black dark:text-white">
                <b className="text-sm sm:text-base font-bold">
                  {displayName ?? t("chatBox.noName")}
                </b>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <PeopleOutline />
                  <span>{participants.length} thành viên</span>
                </div>
              </div>
            </div>

            {/* Phần nhập key và nút giải mã */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Trên mobile: Astra Key + input trên 1 dòng */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    AstraKey:
                  </label>

                  <input
                    disabled
                    value="********"
                    className="item-center  py-2 px-2 w-20 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  />
                </div>

                <div className="relative w-full sm:flex-1 min-w-[10px]">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("chatBox.enterKey")}
                    value={userInputKey}
                    maxLength={6}
                    onChange={(e) => {
                      setUserInputKey(e.target.value);
                      setKeyError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // tránh reload nếu nằm trong form
                        handleVerifyAndDecrypt(); // gọi hàm giải mã
                      }
                    }}
                    className={` border px-5 py-2 rounded-md text-sm  focus:outline-none focus:ring-2 transition-all duration-200 ${
                      keyError
                        ? "border-red-500 focus:ring-red-300 dark:border-red-500"
                        : "border-gray-300 focus:bg-[#D1FFE7] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
                {/* Toggle */}
                <label className="flex items-center cursor-pointer ">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isDecryptAll}
                    onChange={handleToggleDecryptAll}
                  />
                  <div className="p-3 bg-gray-200 peer-checked:bg-[#D1FFE7] rounded-full peer transition-all duration-200" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {t("chatBox.decryptAll")}
                  </span>
                </label>

                {/* Button */}
                <button
                  onClick={handleVerifyAndDecrypt}
                  className="h-10 w-28 font-medium dark:text-white text-gray-700 border-20 border-b-gray-800"
                >
                  {t("chatBox.decrypt")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần nội dung tin nhắn */}
      <div
        ref={chatContentRef}
        className="flex-1 p-4 md:p-6 bg-[#F6F6F6] dark:bg-[#0A0F0D] chat-scrollbar"
        style={{ scrollbarColor: "#99b39b transparent" }}
      >
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender === currentUserName;
          const nameFriend = !isCurrentUser ? msg.sender : "";
          const type = msg.type;

          const repliedMsg = msg.repliedMessageId
            ? messages.find((m) => m.messageId === msg.repliedMessageId)
            : null;

          return (
            <div
              key={msg.messageId}
              className={`mb-3 flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              } group`}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowDeleteForId(msg.messageId || null);
              }}
            >
              {!isCurrentUser && msg.avatar && (
                <img
                  src={msg.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2 shadow"
                />
              )}

              <div className="flex flex-col max-w-[85%] md:max-w-[75%] relative group">
              {repliedMsg && repliedMsg.content && (
  <div
    className={`text-xs mb-1 px-2 py-1 rounded-t-lg w-fit max-w-full ${
      isCurrentUser
        ? "bg-[#D1FFE7] text-[#00664D] ml-auto"
        : "bg-[#DFFFEF] dark:bg-[#0F2218] text-[#005A3C] dark:text-[#1AFF1A]"
    }`}
  >
    <span className="font-medium">Trả lời:</span>{" "}
    <span className="truncate">
      {repliedMsg.content.substring(0, 50)}
      {repliedMsg.content.length > 50 ? "..." : ""}
    </span>
  </div>
)}



                <div
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex ${
                      isCurrentUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      onDoubleClick={() => {
                        // Check if user already has a reaction
                        const userReaction = msg.reactions?.find(
                          (r) => r.userId === currentUserId
                        );
                        if (userReaction) {
                          // Remove existing reaction
                          handleRemoveReact(msg.messageId!);
                        } else {
                          // Add heart reaction
                          handleReact(msg.messageId!, "❤️");
                        }
                      }}
                      className={`p-3 rounded-2xl relative break-all shadow-sm
${
  isCurrentUser
    ? "bg-[#E5FFF1] dark:bg-[#0f1e17] text-black dark:text-[#1AFF1A] rounded-tl-none border border-[#00D084] dark:border-[#1AFF1A]"
    : "bg-[#FFFFFF] border border-[#1AFF1A] text-black rounded-tr-none"
}
max-w-[min(90vw,800px)]
`}
                    >
                      <div className="text-xs mb-1 flex text-gray-500 dark:text-gray-400">
                        <span className="whitespace-pre-wrap">
                          {nameFriend}
                        </span>
                      </div>

                      <div className="whitespace-pre-wrap break-all leading-[22px]">
                        {msg.type === "IMAGE" && msg.decrypted ? (
                          <img
                            src={msg.content}
                            alt={msg.fileName || "uploaded"}
                            className="max-w-xs max-h-64 rounded-lg border border-gray-300"
                          />
                        ) : msg.type === "FILE" && msg.decrypted ? (
                          <a
                            href={msg.content}
                            target="_blank"
                            download={msg.fileName}
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 px-3 py-2 rounded-lg transition-colors duration-200 max-w-xs"
                          >
                            <span className="text-lg">📄</span>
                            <span className="truncate text-blue-600 dark:text-blue-400 font-medium">
                              {msg.fileName || t("chatBox.attachment")}
                            </span>
                          </a>
                        ) : (
                          <span>{msg.content}</span>
                        )}
                      </div>

                      <div
                        className={`text-xs mt-1 flex justify-start ${
                          isCurrentUser
                            ? " dark:text-[#1AFF1A] text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.createdAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {/* ✅ Improved: Reaction area với hover */}
                      <div
                        className={`absolute -bottom-2 ${
                          isCurrentUser ? "right-0" : ""
                        } flex items-center z-10 reaction-container`}
                        onMouseEnter={() =>
                          setShowReactionPicker(msg.messageId ?? null)
                        }
                        onMouseLeave={() => setShowReactionPicker(null)}
                      >
                        {/* Hiển thị reactions có sẵn */}
                        {msg.reactions && msg.reactions.length > 0 ? (
                          <div className=" border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1  flex items-center gap-1">
                            {Object.entries(
                              msg.reactions.reduce(
                                (acc: any, reaction: any) => {
                                  acc[reaction.emoji] =
                                    (acc[reaction.emoji] || 0) + 1;
                                  return acc;
                                },
                                {}
                              )
                            ).map(([emoji, count]) => (
                              <span
                                key={emoji}
                                className="flex items-center text-sm cursor-pointer hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const userReaction = msg.reactions?.find(
                                    (r) =>
                                      r.userId === currentUserId &&
                                      r.emoji === emoji
                                  );
                                  if (userReaction) {
                                    handleRemoveReact(msg.messageId!);
                                  } else {
                                    handleReact(msg.messageId!, emoji);
                                  }
                                }}
                              >
                                <span
                                  className={`${
                                    msg.reactions?.some(
                                      (r) =>
                                        r.userId === currentUserId &&
                                        r.emoji === emoji
                                    )
                                      ? "opacity-100"
                                      : "opacity-70"
                                  }`}
                                >
                                  {emoji}
                                </span>
                                {(count as number) > 1 && (
                                  <span className="ml-1 text-xs text-gray-500 font-medium">
                                    {count as number}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          /* Default heart icon (mờ) khi chưa có reaction */
                          <div className="opacity-0 group-hover:opacity-50 transition-opacity duration-200">
                            <div
                              className="border border-gray-200 dark:border-gray-600 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:opacity-100 hover:scale-110 transition-all duration-200 cursor-pointer"
                              title="Chọn biểu cảm"
                            >
                              <span className="text-sm text-gray-400">❤️</span>
                            </div>
                          </div>
                        )}

                        {/* ✅ Reaction picker với hover - positioned relative to reaction container */}
                        <div
                          className={`absolute ${
                            isCurrentUser ? "right-0" : "left-0"
                          } -top-9 transition-all duration-200 ${
                            showReactionPicker === msg.messageId
                              ? "opacity-100 scale-100 pointer-events-auto"
                              : "opacity-0 scale-95 pointer-events-none"
                          }`}
                        >
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full  shadow-lg flex gap-1">
                            {["👍", "❤️", "😂", "😮", "😢", "😡"].map(
                              (emoji) => (
                                <button
                                  key={emoji}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const userReaction = msg.reactions?.find(
                                      (r) =>
                                        r.userId === currentUserId &&
                                        r.emoji === emoji
                                    );

                                    if (userReaction) {
                                      handleRemoveReact(msg.messageId!);
                                    } else {
                                      handleReact(msg.messageId!, emoji);
                                    }
                                    setShowReactionPicker(null);
                                  }}
                                  className={`text-lg hover:scale-125 transition-transform duration-200 p-1 rounded-full ${
                                    msg.reactions?.some(
                                      (r) =>
                                        r.userId === currentUserId &&
                                        r.emoji === emoji
                                    )
                                      ? " dark:bg-blue-900 scale-100"
                                      : " dark:hover:bg-gray-700"
                                  }`}
                                >
                                  {emoji}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Các nút chức năng khác */}
                    <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 mx-2 self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          msg.decrypted
                            ? handleReEncrypt(index)
                            : handleManualDecrypt(index);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                        title={
                          msg.decrypted
                            ? t("chatBox.reEncrypt")
                            : t("chatBox.decrypt")
                        }
                      >
                        {msg.decrypted ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRepliedMessage(msg);
                          repliedMessageIdRef.current = msg.messageId ?? null;
                          setTimeout(() => {
                            textareaRef.current?.focus();
                          }, 0);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                        title={t("chatBox.replyMessage")}
                      >
                        <RepMess />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msg.messageId!);
                          toast.success(t("chatBox.deleteMessageSuccess"));
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        title={t("chatBox.deleteMessage")}
                      >
                        <IconDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

{globalDecrypting && (
          <div className="fixed bottom-[80px] right-96 z-30 flex items-center gap-2 dark:bg-black bg-[#7c7c7c] text-white dark:text-black px-3 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200">
            <Clock className="w-4 h-4" />
            <span>{globalCountdown}s</span>
          </div>
        )}

        {isUserScrolledUp && (
          <button
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="fixed bottom-[90px] z-30 bg-[#7c7c7c] dark:bg-[#1AFF1A] text-white dark:text-black px-1 py-1 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
          >
            <ChevronDoubleDown />
          </button>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Phần hiển thị đang trả lời tin nhắn nào */}
      {repliedMessage && (
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 text-sm flex items-stretch justify-between gap-2">
          {/* Phần text - giới hạn 1 dòng */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center">
              <span className="text-yellow-700 dark:text-yellow-200 font-medium mr-2 shrink-0">
                {t("chatBox.replying")}
              </span>
              <span className="text-yellow-600 dark:text-yellow-300 truncate whitespace-nowrap overflow-hidden">
                {repliedMessage.content}
              </span>
            </div>
          </div>

          {/* Nút đóng */}
          <button
            onClick={() => {
              setRepliedMessage(null);
              repliedMessageIdRef.current = null;
            }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
            aria-label={t("chatBox.cancelReply")}
          >
            ✖
          </button>
        </div>
      )}
      {/* Phần submit tin nhắn */}
      <div className="sticky bottom-0 z-[20] bg-[#ffffff] dark:bg-[#16191D] w-full px-4 md:px- pb-[20px] pt-[10px] border-t border-[#00D084] dark:border-[#1AFF1A]/40">
        <div className="flex items-end gap-x-2 w-full">
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .zip, .rar , .png, .jpg, .jpeg, .gif"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <Button className="mb-3">
              <IconAttachment />
            </Button>
          </div>

          <div className="flex-1 rounded-[12px] border-[2px] border-[#00D084] dark:border-[#1AFF1A]">
            <textarea
              ref={textareaRef}
              className="bg-transparent py-[10px] px-[20px] leading-[22px] rounded-[12px] w-full border-none outline-none text-[15px] min-w-0 resize-none overflow-y-auto max-h-[160px] custom-scroll"
              value={message}
              onChange={handleChangeMessage}
              placeholder={t("chatBox.placeholder")}
              rows={1}
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
          </div>
          <Button onClick={sendMessage} className="  mb-3 ">
            <IconSubmit />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
