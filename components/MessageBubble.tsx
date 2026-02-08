import { cn } from "@/lib/utils";
import { Message } from "@/lib/scriptSchema";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "flex w-full mb-1.5",
        isMe ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "relative max-w-[75%] px-3 py-2 shadow-md",
          isMe
            ? "bg-[#DCF8C6] text-[#000000] rounded-[7.5px] rounded-tr-none"
            : "bg-[#FFFFFF] text-[#000000] rounded-[7.5px] rounded-tl-none",
        )}
        style={{
          fontSize: "16px",
          lineHeight: "21px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className="break-words">{message.text}</div>
        <div
          className={cn(
            "text-[11px] leading-none mt-1 flex items-center justify-end gap-1",
            isMe ? "text-[#667781]" : "text-[#667781]",
          )}
        >
          <span>16:30</span>
          {isMe && (
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
              <path
                d="M15.01 0.99L5.93 7.64L3.01 4.89L3.77 4.19L5.93 6.21L14.25 0.29L15.01 0.99Z"
                fill="#4FC3F7"
              />
              <path
                d="M12.01 0.99L2.93 7.64L0.01 4.89L0.77 4.19L2.93 6.21L11.25 0.29L12.01 0.99Z"
                fill="#4FC3F7"
              />
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};
