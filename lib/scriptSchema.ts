import { z } from 'zod';

export const MessageSchema = z.object({
  from: z.string().min(1, "Sender name required"),
  text: z.string().min(1, "Message text required"),
  typingMs: z.number().int().nonnegative().optional().default(1000),
  delayAfterMs: z.number().int().nonnegative().optional().default(500),
});

export const ScriptSchema = z.object({
  participants: z.array(z.string().min(1)).min(2, "At least 2 participants required"),
  messages: z.array(MessageSchema),
});

export type Script = z.infer<typeof ScriptSchema>;
export type Message = z.infer<typeof MessageSchema>;

// Default valid script for demo
export const DEFAULT_SCRIPT: Script = {
  participants: ["Alex", "Sam"],
  messages: [
    {
      from: "Alex",
      text: "Did you read that article?",
      typingMs: 1200
    },
    {
      from: "Sam",
      text: "Yeah... it messed with my head",
      typingMs: 1800,
      delayAfterMs: 600
    },
    {
      from: "Alex",
      text: "I know, right?",
      typingMs: 1200
    },
    {
      from: "Sam",
      text: "So what are you doing this weekend?",
      typingMs: 1200
    },
    {
      from: "Alex",
      text: "I was thinking of going to the beach",
      typingMs: 1200
    },
    {
      from: "Sam",
      text: "That sounds fun!",
      typingMs: 1200
    },
   
  ]
};
