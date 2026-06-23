/**
 * Message type for Evolve
 * Represents a message between two users
 */
export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
}

/**
 * Message status
 */
export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

/**
 * Message thread (conversation)
 */
export interface MessageThread {
  id: string;
  matchId: string;
  participant1Id: string;
  participant2Id: string;
  lastMessage?: Message;
  unreadCount1: number;
  unreadCount2: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  id: string;
  messageId: string;
  type: AttachmentType;
  url: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Attachment type
 */
export enum AttachmentType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  LOCATION = "location",
}
