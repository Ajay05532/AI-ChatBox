"use client";

import React, { useRef, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Bot, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useChatContext } from "./ChatProvider";

export default function ChatArea() {
  const { activeChat, activeChatId, addMessage } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = activeChat?.messages ?? [];

  /* scroll to bottom on new messages or loading state */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* reset loading if user switches chat mid-request */
  useEffect(() => {
    abortController?.abort();
    setIsLoading(false);
    setAbortController(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      addMessage("assistant", data.response);
    } catch (error: any) {
      if (error.name === "AbortError") {
        addMessage("assistant", "Generation stopped.");
      } else {
        addMessage("assistant", "Sorry, I encountered an error. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    abortController?.abort();
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: 260 }}
      >
        <Sidebar />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main chat column */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center justify-between px-4 h-14 flex-shrink-0"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-secondary)",
          }}
        >
          <button
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            AI ChatBox
          </span>
          <div style={{ width: 36 }} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            /* ── Empty state ── */
            <div
              key="empty"
              className="flex flex-col items-center justify-center h-full px-6 gap-6 animate-message"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                <Bot size={32} />
              </div>
              <div className="text-center">
                <h1
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  What can I help with?
                </h1>
                <p
                  className="text-sm md:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Ask me anything — I'm your local AI assistant.
                </p>
              </div>

              {/* Suggestion chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {[
                  "Explain something complex",
                  "Help me write code",
                  "Summarize an idea",
                  "Give me a fun fact",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSendMessage(s)}
                    className="text-xs md:text-sm px-4 py-2 rounded-full border transition-all duration-200 hover:scale-105"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "var(--accent-soft)";
                      el.style.borderColor = "var(--accent)";
                      el.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "var(--bg-secondary)";
                      el.style.borderColor = "var(--border)";
                      el.style.color = "var(--text-primary)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Message list ── */
            <div key={activeChatId} className="max-w-3xl mx-auto pt-8 pb-4 animate-message">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  isNew={i === messages.length - 1}
                />
              ))}

              {/* Thinking indicator */}
              {isLoading && (
                <div className="flex w-full justify-start mb-5 px-4 animate-message">
                  <div className="flex items-end gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                    >
                      <Bot size={15} />
                    </div>
                    <div
                      className="py-3 px-5 rounded-2xl rounded-bl-sm border"
                      style={{
                        background: "var(--bg-secondary)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="dot-pulse flex gap-1.5 items-center h-5">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
}
