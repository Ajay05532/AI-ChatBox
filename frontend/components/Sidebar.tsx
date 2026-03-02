"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Settings,
  User,
  ChevronLeft,
  Sparkles,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useChatContext } from "./ChatProvider";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle } = useTheme();
  const { chats, activeChatId, createNewChat, selectChat } = useChatContext();

  return (
    <div
      className={`relative flex flex-col h-full transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-[260px]"
      }`}
      style={{
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 pt-4">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1 animate-message">
            <Sparkles size={18} style={{ color: "var(--accent)" }} />
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              AI ChatBox
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
            collapsed ? "mx-auto" : "ml-auto"
          }`}
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={16}
            style={{
              transition: "transform 0.3s",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-4">
        <button
          onClick={createNewChat}
          className="flex items-center gap-3 rounded-xl p-3 w-full text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "var(--accent)",
            color: "#ffffff",
            boxShadow: "0 2px 12px var(--accent-soft)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title="New chat"
        >
          <Plus size={16} />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Chat History */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3">
          {chats.length > 0 && (
            <>
              <div
                className="text-xs font-semibold mb-3 px-1 uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Recent
              </div>
              <div className="flex flex-col gap-1">
                {chats.map((chat, idx) => {
                  const isActive = chat.id === activeChatId;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat.id)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all duration-200 w-full group"
                      style={{
                        background: isActive ? "var(--accent-soft)" : "transparent",
                        color: isActive ? "var(--accent)" : "var(--text-primary)",
                        animationDelay: `${idx * 40}ms`,
                        borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = "var(--accent-soft)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <MessageSquare
                        size={15}
                        style={{
                          color: isActive ? "var(--accent)" : "var(--text-secondary)",
                          flexShrink: 0,
                        }}
                      />
                      <span className="truncate flex-1">{chat.title}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="p-3 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-sm transition-all duration-200"
          style={{
            color: "var(--text-primary)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--accent-soft)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "")
          }
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={16} style={{ color: "var(--accent)" }} />
          ) : (
            <Moon size={16} style={{ color: "var(--accent)" }} />
          )}
          {!collapsed && (
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          )}
        </button>

        {/* Settings */}
        <button
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-sm transition-all duration-200"
          style={{
            color: "var(--text-primary)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--accent-soft)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "")
          }
          title="Settings"
        >
          <Settings size={16} style={{ color: "var(--text-secondary)" }} />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User */}
        <button
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-sm font-medium transition-all duration-200"
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--accent-soft)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "")
          }
          title="User account"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <User size={14} />
          </div>
          {!collapsed && (
            <span style={{ color: "var(--text-primary)" }} className="truncate">
              You
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
