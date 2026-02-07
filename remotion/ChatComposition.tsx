import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ChatContainer } from '@/components/ChatContainer';
import { Script } from '@/lib/scriptSchema';

export const ChatComposition: React.FC<{ script: Script }> = ({ script }) => {
  return (
    <AbsoluteFill className="bg-black">
      <ChatContainer script={script} />
    </AbsoluteFill>
  );
};
