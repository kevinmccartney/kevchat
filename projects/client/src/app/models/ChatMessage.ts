import { User } from "./User";

export type ChatMessageType = "incoming" | "outgoing";

export type ChatMessage = {
  user: User;
  seenAt: string;
  sentAt: string;
  message: string;
  type: ChatMessageType;
};
