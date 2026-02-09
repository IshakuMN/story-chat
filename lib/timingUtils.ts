import { Script, Message } from "./scriptSchema";

export const FPS = 30;

export interface MessageTiming extends Message {
  startFrame: number;
  typingEndFrame: number;
  endFrame: number;
}

export function msToFrames(ms: number): number {
  return Math.round((ms / 1000) * FPS);
}

export function calculateScriptTimeline(script: Script): {
  timeline: MessageTiming[];
  totalDurationFrames: number;
} {
  let currentFrame = 0;

  const timeline = script.messages.map((msg, index) => {
    // Default to 50ms per char if not provided, min 1000ms
    const typingDuration = msg.typingMs || Math.max(1000, msg.text.length * 50);
    const delayAfter = msg.delayAfterMs || 500;

    // Calculate reading delay based on previous message length (if any)
    let readingDelayMs = 0;
    if (index > 0) {
      const prevMsg = script.messages[index - 1];
      // Allow ~3s for every 100 chars? Or ~50ms per char.
      readingDelayMs = Math.max(800, prevMsg.text.length * 50);
    }

    const startFrame = currentFrame + msToFrames(readingDelayMs);
    const typingFrames = msToFrames(typingDuration);
    const delayFrames = msToFrames(delayAfter);

    const typingEndFrame = startFrame + typingFrames;
    const endFrame = typingEndFrame + delayFrames;

    currentFrame = endFrame;

    return {
      ...msg,
      startFrame,
      typingEndFrame,
      endFrame,
    };
  });

  // Add some buffer at the end
  const totalDurationFrames = currentFrame + FPS * 2;

  return { timeline, totalDurationFrames };
}
