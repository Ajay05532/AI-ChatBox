"use client";

import React, { useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export default function ChatInput({ onSendMessage, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [input]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) { onStop(); return; }
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 || isLoading;

  return (
    <div
      className="w-full px-4 py-3"
      style={{
        background:
          "linear-gradient(to top, var(--bg-primary) 70%, transparent)",
      }}
    >
      <form
        onSubmit={handleSend}
        className="relative max-w-3xl mx-auto flex items-end gap-2 rounded-2xl p-3 glass"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm md:text-base leading-relaxed py-1 disabled:opacity-60"
          style={{ fontFamily: "inherit" }}
        />

        <button
          type="submit"
          disabled={!canSend}
          title={isLoading ? "Stop generating" : "Send message"}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: canSend ? "var(--accent)" : "var(--border)",
            color: canSend ? "#fff" : "var(--text-secondary)",
            boxShadow: canSend ? "0 2px 12px var(--accent-soft)" : "none",
            transform: canSend ? "scale(1)" : "scale(0.95)",
          }}
        >
          {isLoading ? (
            <Square size={14} className="fill-current" />
          ) : (
            <Send size={14} />
          )}
        </button>
      </form>

      <p className="text-center text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}
