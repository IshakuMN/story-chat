"use client";

import { useState, useTransition } from "react";
import { Player } from "@remotion/player";
import { ChatComposition } from "@/remotion/ChatComposition";
import { DEFAULT_SCRIPT, ScriptSchema, type Script } from "@/lib/scriptSchema";
import { calculateScriptTimeline, FPS } from "@/lib/timingUtils";
import { renderVideo } from "./actions";
// Fallback to simple button if shadcn not installed yet. Or just inline styles for MVP.
// Given "Shadcn UI (optional)", we use Tailwind classes directly.

export default function Home() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_SCRIPT, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [parsedScript, setParsedScript] = useState<Script>(DEFAULT_SCRIPT);
  const [errorSubtext, setErrorSubtext] = useState("");
  
  const [isRendering, startRender] = useTransition();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      const result = ScriptSchema.safeParse(parsed);
      if (result.success) {
        setParsedScript(result.data);
        setIsValid(true);
        setErrorSubtext("");
      } else {
        setIsValid(false);
        setErrorSubtext(result.error.errors[0].message);
      }
    } catch (err) {
      setIsValid(false);
      setErrorSubtext("Invalid JSON syntax");
    }
  };

  const { totalDurationFrames } = calculateScriptTimeline(parsedScript);

  const handleRender = () => {
    if (!isValid) return;
    setVideoUrl(null);
    startRender(async () => {
      const result = await renderVideo(parsedScript);
      if (result.success && result.url) {
        setVideoUrl(result.url);
      } else {
        alert("Render failed! Check server logs.");
      }
    });
  };

  return (
    <main className="flex min-h-screen bg-gray-950 text-white font-sans">
      {/* Left Panel: Editor */}
      <div className="w-1/2 p-6 flex flex-col gap-4 border-r border-gray-800">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Story Chat Generator
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Edit the JSON script below to customize the chat.
          </p>
        </div>

        <div className="flex-1 relative">
          <textarea
            className={`w-full h-full bg-gray-900 rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 ${
              isValid ? "focus:ring-blue-500 border-gray-800" : "focus:ring-red-500 border-red-900"
            } border text-gray-300 shadow-inner`}
            value={jsonInput}
            onChange={handleJsonChange}
            spellCheck={false}
          />
          {!isValid && (
            <div className="absolute bottom-4 right-4 bg-red-900/90 text-red-200 px-3 py-1 rounded text-xs backdrop-blur-sm border border-red-700">
              {errorSubtext}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-500">
                {totalDurationFrames} frames • {(totalDurationFrames / FPS).toFixed(1)}s
            </div>
            
            <button
                onClick={handleRender}
                disabled={!isValid || isRendering}
                className={`px-6 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
                    !isValid || isRendering 
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                }`}
            >
                {isRendering ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Rendering...
                    </>
                ) : (
                    "Render Video"
                )}
            </button>
        </div>
        
        {videoUrl && (
            <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                <span className="text-green-400 text-sm font-medium">Video Ready!</span>
                <a 
                    href={videoUrl} 
                    download="chat-story.mp4"
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded transition-colors"
                >
                    Download MP4
                </a>
            </div>
        )}
      </div>

      {/* Right Panel: Preview */}
      <div className="w-1/2 bg-black flex items-center justify-center relative p-8">
        <div className="relative w-[360px] aspect-[9/16] shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-gray-800 bg-black ring-1 ring-gray-700/50">
            {/* Phone Notch/Status Bar placeholder */}
            <div className="absolute top-0 w-full h-8 z-20 bg-black/20 pointer-events-none flex justify-center pt-1.5">
                <div className="w-20 h-5 bg-black rounded-full" />
            </div>
            
            <Player
                component={ChatComposition}
                inputProps={{ script: parsedScript }}
                durationInFrames={totalDurationFrames}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={FPS}
                controls
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
        
        <div className="absolute bottom-6 text-gray-600 text-xs">
            Preview Mode • {1080}x{1920} • {FPS}fps
        </div>
      </div>
    </main>
  );
}
