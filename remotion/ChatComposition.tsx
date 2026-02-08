import React from "react";
import { AbsoluteFill } from "remotion";
import { MinimalChatVideo } from "./MinimalChatVideo";
import { Script } from "@/lib/scriptSchema";

export const ChatComposition: React.FC<{ script: Script }> = ({ script }) => {
  return (
    <AbsoluteFill className="bg-black">
      <MinimalChatVideo script={script} />
    </AbsoluteFill>
  );
};
