import { z } from "zod";

export const MessageSchema = z.object({
  from: z.string().min(1, "Sender name required"),
  text: z.string().min(1, "Message text required"),
  typingMs: z.number().int().nonnegative().optional().default(1000),
  delayAfterMs: z.number().int().nonnegative().optional().default(500),
});

export const ScriptSchema = z.object({
  participants: z
    .array(z.string().min(1))
    .min(2, "At least 2 participants required"),
  messages: z.array(MessageSchema),
});

export type Script = z.infer<typeof ScriptSchema>;
export type Message = z.infer<typeof MessageSchema>;

// Default valid script for demo
export const DEFAULT_SCRIPT: Script = {
  participants: ["Alex", "Sam"],
  messages: [
    { from: "Alex", text: "You up?", typingMs: 1000 },
    { from: "Sam", text: "Yeah. What’s wrong?", typingMs: 1500 },
    {
      from: "Alex",
      text: "Do you ever think about that night?",
      typingMs: 2000,
    },
    { from: "Sam", text: "I try not to.", typingMs: 1200 },
    { from: "Sam", text: "Why now?", typingMs: 1000 },
    { from: "Alex", text: "Because it felt easy.", typingMs: 1500 },
    { from: "Alex", text: "Too easy.", typingMs: 800 },
    { from: "Sam", text: "We both wanted it.", typingMs: 1500 },
    { from: "Alex", text: "That’s what scares me.", typingMs: 1500 },
    { from: "Sam", text: "…Say it.", typingMs: 1200 },
    { from: "Alex", text: "If you could lie with me—", typingMs: 1800 },
    { from: "Alex", text: "why wouldn’t you lie to me?", typingMs: 1800 },
    { from: "Sam", text: "Alex, that’s not fair.", typingMs: 1500 },
    { from: "Alex", text: "Isn’t it?", typingMs: 800 },
    { from: "Sam", text: "I never betrayed you.", typingMs: 1500 },
    { from: "Alex", text: "You helped me betray myself.", typingMs: 1800 },
    { from: "Sam", text: "I trusted you.", typingMs: 1200 },
    { from: "Alex", text: "Exactly.", typingMs: 800 },
    { from: "Sam", text: "So what are you saying?", typingMs: 1500 },
    { from: "Alex", text: "Anyone who can sin with you", typingMs: 1800 },
    { from: "Alex", text: "can sin against you.", typingMs: 1500 },
  ],
};
