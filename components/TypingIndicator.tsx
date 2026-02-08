import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypingIndicator: React.FC<{ isMe?: boolean }> = ({ isMe }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-1 px-3 py-2 w-fit mb-1.5 shadow-md",
        isMe
          ? "bg-[#DCF8C6] rounded-[7.5px] rounded-tr-none ml-auto"
          : "bg-[#FFFFFF] rounded-[7.5px] rounded-tl-none mr-auto",
      )}
    >
      <Dot delay={0} />
      <Dot delay={0.2} />
      <Dot delay={0.4} />
    </motion.div>
  );
};

const Dot = ({ delay }: { delay: number }) => (
  <motion.span
    initial={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 0.6,
      delay,
    }}
    className="w-2 h-2 bg-[#667781] rounded-full inline-block"
  />
);
