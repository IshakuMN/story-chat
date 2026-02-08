"use client";

import { useState, useTransition } from "react";
import { Player } from "@remotion/player";
import { ChatComposition } from "@/remotion/ChatComposition";
import { DEFAULT_SCRIPT, ScriptSchema, type Script } from "@/lib/scriptSchema";
import { calculateScriptTimeline, FPS } from "@/lib/timingUtils";
import { renderVideo } from "./actions";

export default function Home() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(DEFAULT_SCRIPT, null, 2),
  );
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
    <main className="flex h-screen w-full bg-stone-900 text-white font-sans overflow-hidden">
      {/* Left Panel: Editor */}
      <div className="w-1/3 min-w-[360px] p-6 flex flex-col gap-4 border-r border-stone-800 bg-stone-950/50">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            Video Generator
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Edit JSON to animate the chat.
          </p>
        </div>

        <div className="flex-1 relative min-h-0">
          <textarea
            className={`w-full h-full bg-stone-900/50 rounded-xl p-4 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-1 transition-all ${
              isValid
                ? "focus:ring-white/20 border-stone-800"
                : "focus:ring-red-500/50 border-red-900/50"
            } border text-stone-300 shadow-inner`}
            value={jsonInput}
            onChange={handleJsonChange}
            spellCheck={false}
          />
          {!isValid && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 text-red-200 px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-red-900 shadow-xl z-10">
              {errorSubtext}
            </div>
          )}
        </div>

        {/* Footer Stats & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800/50">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
              Duration
            </span>
            <span className="text-sm text-stone-300 font-mono">
              {(totalDurationFrames / FPS).toFixed(1)}s{" "}
              <span className="text-stone-600">({totalDurationFrames}f)</span>
            </span>
          </div>

          <button
            onClick={handleRender}
            disabled={!isValid || isRendering}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 ${
              !isValid || isRendering
                ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95"
            }`}
          >
            {isRendering ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Rendering...
              </>
            ) : (
              <>
                <span>Generate Video</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </>
            )}
          </button>
        </div>

        {videoUrl && (
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <span className="text-xs text-stone-400 truncate max-w-[150px]">
              {videoUrl.split("/").pop()}
            </span>
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-red-400 hover:text-red-300 font-medium underline"
            >
              Download
            </a>
          </div>
        )}
      </div>

      {/* Right Panel: Chat Preview */}
      <div className="flex-1 flex items-center justify-center bg-stone-200 p-8">
        <div className="w-full max-w-[400px] aspect-[9/19.5] max-h-full bg-black rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-black relative ring-1 ring-black/5">
          {/* Phone Notch (Visual) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 pointer-events-none"></div>

          {/* Player container */}
          <div className="w-full h-full bg-stone-50">
            <Player
              component={ChatComposition}
              inputProps={{ script: parsedScript }}
              durationInFrames={totalDurationFrames}
              fps={FPS}
              compositionWidth={400}
              compositionHeight={800} // Approximate mobile ratio
              style={{
                width: "100%",
                height: "100%",
              }}
              controls
              loop
            />
          </div>
        </div>
      </div>
    </main>
  );
}
