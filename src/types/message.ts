export type MessageType = {
  sender: string;
  content: string;
  createdAt: Date;
  messageId?: string;
  avatar: string | null;
  encrypted?: any; // để chứa content gốc chưa giải mã
  decrypted?: boolean;
};
