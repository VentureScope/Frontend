"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Paperclip, ArrowUp, Mic } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export default function ChatInterface() {
  const { activeSession, sendMessage, isConnecting, isTyping } = useChatStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !activeSession || isConnecting) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeSession) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-slate-500">
        <Bot size={48} className="text-blue-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">
          VentureScope Advisor
        </h2>
        <p className="text-sm mt-2 max-w-md text-center">
          Start a new conversation or select an existing one to get AI-powered
          career guidance tailored to your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between p-4 shrink-0 sm:p-6 border-b border-slate-100 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bot size={16} />
          </div>
          <div className="truncate">
            <h3 className="font-bold text-sm text-slate-900 truncate">
              {activeSession.title}
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium truncate">
              {isConnecting ? "Connecting..." : "Connected"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 space-y-6 sm:space-y-10 custom-scrollbar">
        {activeSession.messages?.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              className={`flex gap-3 sm:gap-4 md:max-w-3xl ${isUser ? "justify-end ml-auto" : ""}`}
            >
              {!isUser && (
                <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white mt-1">
                  <Bot size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
              <div
                className={`space-y-2 sm:space-y-4 max-w-[85%] ${isUser ? "sm:max-w-xl" : "w-full"}`}
              >
                <div
                  className={`rounded-2xl p-4 sm:p-6 leading-relaxed shadow-sm ${
                    isUser
                      ? "rounded-tr-none bg-blue-600 text-white shadow-blue-500/10"
                      : "rounded-tl-none bg-blue-50/50 border border-blue-100/30 text-slate-700"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm wrap-break-word">
                    {msg.content}
                  </div>
                </div>
              </div>
              {isUser && (
                <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full border border-slate-200 overflow-hidden bg-slate-100 mt-1">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 sm:gap-4 md:max-w-3xl">
            <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white mt-1">
              <Bot size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-2 sm:space-y-4 w-full">
              <div className="rounded-2xl p-4 sm:p-6 leading-relaxed shadow-sm rounded-tl-none bg-blue-50/50 border border-blue-100/30 text-slate-700 w-fit">
                <div className="flex space-x-1 items-center justify-center h-4">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-6 lg:p-10 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl flex items-center gap-2 sm:gap-4">
          <button className="text-slate-400 hover:text-slate-600 p-1.5 sm:p-2 transition-colors shrink-0">
            <Paperclip className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
          </button>
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isConnecting}
              placeholder={
                isConnecting ? "Connecting..." : "Ask your advisor..."
              }
              className="w-full h-12 sm:h-14 bg-slate-50 border-none rounded-xl sm:rounded-2xl px-4 sm:px-6 pr-12 sm:pr-14 text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isConnecting || !input.trim()}
              className="absolute right-1 sm:right-2 top-1 sm:top-2 h-10 w-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-blue-400 shrink-0"
            >
              <ArrowUp size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1.5 sm:p-2 transition-colors shrink-0">
            <Mic className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
