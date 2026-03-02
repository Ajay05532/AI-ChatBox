"use client";

import React from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isNew?: boolean;
}

export default function ChatMessage({ role, content, isNew }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full mb-5 px-4 animate-message ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-end gap-3 max-w-[85%] md:max-w-[72%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
            isUser
              ? "bg-[var(--bg-user-msg)] text-[var(--text-user-msg)]"
              : "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]"
          }`}
        >
          {isUser ? <User size={15} /> : <Bot size={15} />}
        </div>

        {/* Bubble */}
        <div
          className={`relative py-3 px-4 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm transition-all ${
            isUser
              ? "bg-[var(--bg-user-msg)] text-[var(--text-user-msg)] rounded-br-sm"
              : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] rounded-bl-sm"
          }`}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
