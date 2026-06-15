import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const API_BASE = "http://localhost:3000/api";

export interface Profile {
  userId: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  imageUrl?: string;
  verifiedStd: boolean;
  verifiedDna: boolean;
  reputationScore: number;
  voters: { name: string; weight: number; relation: string }[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  isRequest?: boolean;
  requestType?: "STD" | "DNA";
  requestStatus?: "pending" | "approved" | "declined";
}

export interface Chat {
  profile: Profile;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  size: string;
  type: "STD" | "DNA";
  uploadDate: string;
  isRedacted: boolean;
  status: "encrypted" | "decrypted";
  resultText: string;
}

interface AppContextType {
  profiles: Profile[];
  chats: Chat[];
  documents: Document[];
  loading: boolean;
  sendMessage: (receiverId: string, text: string) => Promise<void>;
  refreshProfiles: () => Promise<void>;
  refreshChats: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

async function apiFetch(path: string, init?: RequestInit) {
  const sessionId = await AsyncStorage.getItem("evolve_session_id");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (sessionId) {
    headers["Authorization"] = `Bearer ${sessionId}`;
  }
  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      refreshProfiles();
      refreshChats();
      refreshDocuments();
    }
  }, [user?.id]);

  const refreshProfiles = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await apiFetch("/profiles");
      const allProfiles: any[] = await res.json();
      const otherProfiles = allProfiles
        .filter((p: any) => p.userId !== user.id)
        .map((p: any) => ({
          userId: p.userId,
          name: p.name,
          age: p.age,
          bio: p.bio,
          interests: p.interests || [],
          imageUrl: p.imageUrl,
          verifiedStd: p.verifiedStd,
          verifiedDna: p.verifiedDna,
          reputationScore: p.reputationScore,
          voters: p.voters || [],
        }));
      setProfiles(otherProfiles);
    } catch (e) {
      console.error("Failed to load profiles:", e);
    } finally {
      setLoading(false);
    }
  };

  const refreshChats = async () => {
    if (!user?.id) return;
    try {
      const profileRes = await apiFetch("/profiles");
      const allProfiles: any[] = await profileRes.json();

      const chatList: Chat[] = [];
      for (const p of allProfiles) {
        if (p.userId === user.id) continue;
        try {
          const msgRes = await apiFetch(
            `/messages?senderId=${user.id}&receiverId=${p.userId}`,
          );
          const msgs: any[] = await msgRes.json();
          const messages: Message[] = msgs.map((m: any) => ({
            id: m.id,
            senderId: m.senderId,
            receiverId: m.receiverId,
            text: m.text,
            time: m.time,
            isRequest: m.isRequest,
            requestType: m.requestType,
            requestStatus: m.requestStatus,
          }));
          chatList.push({
            profile: {
              userId: p.userId,
              name: p.name,
              age: p.age,
              bio: p.bio,
              interests: p.interests || [],
              imageUrl: p.imageUrl,
              verifiedStd: p.verifiedStd,
              verifiedDna: p.verifiedDna,
              reputationScore: p.reputationScore,
              voters: p.voters || [],
            },
            lastMessage: messages[messages.length - 1],
            unreadCount: 0,
          });
        } catch {}
      }
      setChats(chatList);
    } catch (e) {
      console.error("Failed to load chats:", e);
    }
  };

  const refreshDocuments = async () => {
    if (!user?.id) return;
    try {
      const res = await apiFetch(`/documents?userId=${user.id}`);
      const docs: any[] = await res.json();
      setDocuments(
        docs.map((d: any) => ({
          id: d.id,
          userId: d.userId,
          name: d.name,
          size: d.size,
          type: d.type,
          uploadDate: d.uploadDate,
          isRedacted: d.isRedacted,
          status: d.status,
          resultText: d.resultText,
        })),
      );
    } catch (e) {
      console.error("Failed to load documents:", e);
    }
  };

  const sendMessage = async (receiverId: string, text: string) => {
    if (!user?.id) return;
    try {
      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      await apiFetch("/messages", {
        method: "POST",
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
          text,
          time: timeStr,
        }),
      });
      await refreshChats();
    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profiles,
        chats,
        documents,
        loading,
        sendMessage,
        refreshProfiles,
        refreshChats,
        refreshDocuments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
