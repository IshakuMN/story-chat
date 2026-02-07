import React, { useEffect, useRef } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Script } from '@/lib/scriptSchema';
import { calculateScriptTimeline } from '@/lib/timingUtils';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Keyboard } from './Keyboard'; // Assuming Keyboard component exists

interface ChatContainerProps {
  script: Script;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // useVideoConfig comes from Remotion context
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Memoize timeline calculation so it doesn't run every frame unless script changes
  const { timeline } = calculateScriptTimeline(script);

  const me = script.participants[0]; // Assume first participant is "Me"

  // Messages that have finished typing and are sent
  const visibleMessages = timeline.filter(msg => frame >= msg.typingEndFrame);

  // Find the message currently being typed (if any)
  const currentMessage = timeline.find(msg => 
    frame >= msg.startFrame && frame < msg.typingEndFrame
  );

  const isMeTyping = currentMessage?.from === me;
  const isOtherTyping = currentMessage && currentMessage.from !== me;

  // Calculate current text being typed
  let typingText = "";
  if (isMeTyping && currentMessage) {
      const totalChars = currentMessage.text.length;
      const durationFrames = currentMessage.typingEndFrame - currentMessage.startFrame;
      const elapsedFrames = frame - currentMessage.startFrame;
      const charsToShow = Math.floor((elapsedFrames / durationFrames) * totalChars);
      typingText = currentMessage.text.substring(0, charsToShow);
  }

  // Auto-scroll logic
  useEffect(() => {
    if (scrollContainerRef.current) {
        // Smooth scroll to bottom whenever visible messages change or typing status changes
        scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [visibleMessages.length, isOtherTyping]); 

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative" 
         style={{
           fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
           background: '#EFEAE2'
         }}>
      {/* WhatsApp Chat Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }} />
      
      {/* WhatsApp Header */}
      <div className="relative z-10 h-[88px] flex items-end pb-2 px-3" 
           style={{ background: '#075E54' }}>
        <div className="flex items-center gap-2 w-full pb-2">
          <button className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="#FFFFFF"/>
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-medium text-lg">
            {script.participants[1][0]}
          </div>
          <div className="flex-1 flex flex-col">
            <span className="font-semibold text-white text-[17px]">{script.participants.filter(p => p !== me).join(', ')}</span>
            <span className="text-[#FFFFFF] text-[13px] opacity-80">online</span>
          </div>
          <button className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="#FFFFFF"/>
            </svg>
          </button>
          <button className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#FFFFFF"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto px-2 py-2 pb-32 scroll-smooth"
      >
        <div className="py-3">
          {/* Date indicator */}
          <div className="flex justify-center mb-3">
            <div className="bg-[#FFFFFF] px-3 py-1 rounded-md shadow-sm">
              <span className="text-[#667781] text-[12.5px] font-medium">Today</span>
            </div>
          </div>
          
          {visibleMessages.map((msg, idx) => (
            <MessageBubble 
              key={idx} 
              message={msg} 
              isMe={msg.from === me} 
            />
          ))}

          {isOtherTyping && (
            <TypingIndicator isMe={false} />
          )}
        </div>
        
        {/* Spacer for scroll */}
        <div className="h-24" />
      </div>

      {/* Input Area / Keyboard */}
      <div className="absolute bottom-0 w-full" style={{ background: '#EFEAE2' }}>
         {/* Input Bar */}
         <div className="px-2 py-2">
             <div className="flex items-center gap-2">
                 <button className="w-10 h-10 rounded-full flex items-center justify-center">
                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="#54656F"/>
                   </svg>
                 </button>
                 <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2 min-h-[40px] shadow-sm">
                     <button>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                         <path d="M18.5 2h-13C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2zM12 6.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zM17 17H7v-.75c0-1.5 3-2.25 5-2.25s5 .75 5 2.25V17z" fill="#54656F"/>
                       </svg>
                     </button>
                     <span className="text-[#667781] text-[16px] flex-1">
                         {isMeTyping ? typingText : ""}
                         {isMeTyping && <span className="animate-pulse">|</span>}
                         {!isMeTyping && !currentMessage && "Message"}
                     </span>
                     <button>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                         <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill="#54656F"/>
                       </svg>
                     </button>
                 </div>
                 <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMeTyping && typingText.length > 0 ? 'bg-[#25D366]' : 'bg-[#25D366]'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="white"/>
                    </svg>
                 </button>
             </div>
         </div>
         
         {/* Keyboard Slide-in */}
         {isMeTyping && (
            <div className="relative z-20">
                <Keyboard />
            </div>
         )}
      </div>
    </div>
  );
};
