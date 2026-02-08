"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/lib/scriptSchema";
import { motion } from "framer-motion";

interface MinimalMessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export const MinimalMessageBubble: React.FC<MinimalMessageBubbleProps> = ({
  message,
  isMe,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] px-5 py-3 shadow-sm",
          isMe
            ? "bg-black text-white rounded-2xl rounded-br-none"
            : "bg-white text-black border border-gray-200 rounded-2xl rounded-bl-none",
        )}
      >
        <div className="text-sm md:text-base leading-relaxed">
          {message.text}
        </div>
        <div
          className={cn(
            "text-[10px] mt-1 opacity-50 font-medium tracking-wide uppercase",
            isMe ? "text-right" : "text-left",
          )}
        >
          {message.from}
        </div>
      </div>
    </motion.div>
  );
};
