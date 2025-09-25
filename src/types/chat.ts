export interface ChatGroup {
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
  
  
// types/chat.ts
export interface Message {
  isCorrupted: boolean | undefined;
  sender: string;
  content: string;
  createdAt: Date;
  messageId?: string;
  avatar: string | null;
  encrypted?: any;
  decrypted?: boolean;
  repliedMessageId?: string | null;
  countdown?: number;
}

export interface MessageProps {
  chatId: string;
  chatKey: string;
  displayName?: string;
  setChatGroups: React.Dispatch<React.SetStateAction<ChatGroup[]>>;
}