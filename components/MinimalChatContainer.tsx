"use client";

import React, { useRef, useEffect } from "react";
import { Script } from "@/lib/scriptSchema";
import { MinimalMessageBubble } from "./MinimalMessageBubble";

interface MinimalChatContainerProps {
  script: Script;
}

export const MinimalChatContainer: React.FC<MinimalChatContainerProps> = ({
  script,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const me = script.participants[0];

  useEffect(() => {
    if (scrollRef.current) {
      // Optional: Scroll to bottom on load? or just let user scroll?
      // User said "read a full chat by just scrolling it", so starting at top is probably better
      // unless it's a "live" feel. Let's start at top.
    }
  }, [script]);

  return (
    <div className="flex flex-col h-full bg-stone-50 text-black font-sans relative overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-black">
              {script.participants.filter((p) => p !== me).join(", ")}
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Chat History
            </p>
          </div>
        </div>
        <div className="text-red-600 font-bold text-sm tracking-wide">
          Details
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-6 py-8 space-y-2 scroll-smooth"
        ref={scrollRef}
      >
        {script.messages.map((msg, idx) => (
          <MinimalMessageBubble
            key={idx}
            message={msg}
            isMe={msg.from === me}
          />
        ))}
      </div>

      {/* Input Placeholder (Visual only) */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center px-6 flex-shrink-0">
        <div className="flex-1 bg-stone-100 h-12 rounded-full px-5 flex items-center text-gray-400 text-sm">
          Type a message...
        </div>
        <div className="ml-4 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200 hover:scale-105 transition-transform cursor-pointer">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
};
