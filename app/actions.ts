"use server";

import { renderChatVideo } from "@/remotion/renderVideo";
import { Script } from "@/lib/scriptSchema";

export async function renderVideo(script: Script) {
  try {
    const outputUrl = await renderChatVideo(script);
    return { success: true, url: outputUrl };
  } catch (error) {
    console.error("Render failed:", error);
    return { success: false, error: "Failed to render video" };
  }
}
