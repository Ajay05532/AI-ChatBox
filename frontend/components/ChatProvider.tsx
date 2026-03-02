"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ChatContextValue {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;
  createNewChat: () => void;
  selectChat: (id: string) => void;
  addMessage: (role: Message["role"], content: string) => void;
  updateLastAssistantMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeChat(): Chat {
  return { id: makeId(), title: "New Chat", messages: [], createdAt: Date.now() };
}

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => {
    const first = makeChat();
    return [first];
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(
    () => chats[0]?.id ?? null
  );

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const createNewChat = useCallback(() => {
    // If the active chat is already empty, just stay on it
    setChats((prev) => {
      const active = prev.find((c) => c.id === activeChatId);
      if (active && active.messages.length === 0) {
        return prev; // no-op
      }
      const chat = makeChat();
      setActiveChatId(chat.id);
      return [chat, ...prev];
    });
  }, [activeChatId]);

  const selectChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const addMessage = useCallback(
    (role: Message["role"], content: string) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChatId) return c;
          const messages = [...c.messages, { role, content }];
          // derive title from first user message
          const title =
            c.title === "New Chat" && role === "user"
              ? content.slice(0, 40) + (content.length > 40 ? "…" : "")
              : c.title;
          return { ...c, messages, title };
        })
      );
    },
    [activeChatId]
  );

  const updateLastAssistantMessage = useCallback((content: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        const messages = [...c.messages];
        const last = messages[messages.length - 1];
        if (last?.role === "assistant") {
          messages[messages.length - 1] = { ...last, content };
        }
        return { ...c, messages };
      })
    );
  }, [activeChatId]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        createNewChat,
        selectChat,
        addMessage,
        updateLastAssistantMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
