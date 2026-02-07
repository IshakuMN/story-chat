import { Script, Message } from './scriptSchema';

export const FPS = 30;

export interface MessageTiming extends Message {
  startFrame: number;
  typingEndFrame: number;
  endFrame: number;
}

export function msToFrames(ms: number): number {
  return Math.round((ms / 1000) * FPS);
}

export function calculateScriptTimeline(script: Script): { timeline: MessageTiming[], totalDurationFrames: number } {
  let currentFrame = 0;
  
  const timeline = script.messages.map((msg, index) => {
    // Default to 50ms per char if not provided, min 1000ms
    const typingDuration = msg.typingMs || Math.max(1000, msg.text.length * 50);
    const delayAfter = msg.delayAfterMs || 500;
    
    // Add small pause before typing starts (e.g. 10 frames)
    // Actually, start immediately after previous message ends
    const startFrame = currentFrame;
    const typingFrames = msToFrames(typingDuration);
    const delayFrames = msToFrames(delayAfter);
    
    const typingEndFrame = startFrame + typingFrames;
    const endFrame = typingEndFrame + delayFrames;

    currentFrame = endFrame;
    
    return {
      ...msg,
      startFrame,
      typingEndFrame,
      endFrame
    };
  });
  
  // Add some buffer at the end
  const totalDurationFrames = currentFrame + (FPS * 2); 

  return { timeline, totalDurationFrames };
}
