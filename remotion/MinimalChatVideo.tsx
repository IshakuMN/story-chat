import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { Script } from "@/lib/scriptSchema";
import { calculateScriptTimeline } from "@/lib/timingUtils";
import { MinimalMessageBubble } from "@/components/MinimalMessageBubble";

export const MinimalChatVideo: React.FC<{ script: Script }> = ({ script }) => {
  const frame = useCurrentFrame();

  // Memoizing timeline is good practice but calculating it is lightweight enough for small scripts
  const { timeline } = calculateScriptTimeline(script);

  const scrollRef = useRef<HTMLDivElement>(null);
  const me = script.participants[0];

  // Identify visible messages (already sent)
  const visibleMessages = timeline.filter((m) => frame >= m.typingEndFrame);

  // Identify typing status (currently active)
  const currentMessage = timeline.find(
    (m) => frame >= m.startFrame && frame < m.typingEndFrame,
  );

  // Typing logic for "Me"
  let inputValue = "";
  if (currentMessage && currentMessage.from === me) {
    const duration = currentMessage.typingEndFrame - currentMessage.startFrame;
    const progress = Math.max(
      0,
      Math.min(1, (frame - currentMessage.startFrame) / duration),
    );
    const chars = Math.floor(progress * currentMessage.text.length);
    inputValue = currentMessage.text.slice(0, chars);
  }

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleMessages.length, inputValue]);

  return (
    <div className="flex flex-col h-full w-full bg-stone-50 text-black font-sans relative overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-black">
              {script.participants.filter((p) => p !== me).join(", ")}
            </h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {currentMessage && currentMessage.from !== me
                ? "Typing..."
                : "Online"}
            </p>
          </div>
        </div>
        <div className="text-red-600 font-bold text-sm tracking-wide">
          Details
        </div>
      </header>

      {/* Messages List */}
      <div
        className="flex-1 overflow-y-auto px-6 py-8 space-y-2 scroll-smooth"
        ref={scrollRef}
      >
        {visibleMessages.map((msg, idx) => (
          <MinimalMessageBubble
            key={idx}
            message={msg}
            isMe={msg.from === me}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="h-20 bg-white border-t border-gray-200 flex items-center px-6 flex-shrink-0">
        <div className="flex-1 bg-stone-100 h-12 rounded-full px-5 flex items-center text-sm relative overflow-hidden">
          {/* Placeholder */}
          {inputValue.length === 0 && (
            <span className="text-gray-400 absolute pointer-events-none">
              Type a message...
            </span>
          )}
          {/* Real Text */}
          <span className="text-black z-10 font-medium relative">
            {inputValue}
            {inputValue.length > 0 && (
              <span className="animate-pulse bg-red-600 inline-block w-[2px] h-[1em] ml-[1px] align-middle"></span>
            )}
          </span>
        </div>
        <div
          className={`ml-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 ${inputValue.length > 0 ? "bg-red-600 scale-105" : "bg-red-600/50 scale-100"}`}
        >
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
