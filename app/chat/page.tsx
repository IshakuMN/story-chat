"use client";

import { useState } from "react";
import { DEFAULT_SCRIPT, ScriptSchema, type Script } from "@/lib/scriptSchema";
import { MinimalChatContainer } from "@/components/MinimalChatContainer";

export default function ChatPage() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(DEFAULT_SCRIPT, null, 2),
  );
  const [isValid, setIsValid] = useState(true);
  const [parsedScript, setParsedScript] = useState<Script>(DEFAULT_SCRIPT);
  const [errorSubtext, setErrorSubtext] = useState("");

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

  return (
    <main className="flex h-screen w-full bg-stone-900 text-white font-sans overflow-hidden">
      {/* Left Panel: Editor */}
      <div className="w-1/3 min-w-[320px] p-6 flex flex-col gap-4 border-r border-stone-800 bg-stone-950/50">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            Chat Reader
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Edit the script to see updates in real-time.
          </p>
        </div>

        <div className="flex-1 relative">
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
            <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 text-red-200 px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-red-900 shadow-xl">
              {errorSubtext}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Preview */}
      <div className="flex-1 flex items-center justify-center bg-stone-200 p-8">
        <div className="w-full max-w-md h-[800px] max-h-full bg-white rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-black relative ring-1 ring-black/5">
          {/* Phone Notch (Visual) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>

          {/* Application container */}
          <div className="w-full h-full pt-6 bg-stone-50">
            <MinimalChatContainer script={parsedScript} />
          </div>
        </div>
      </div>
    </main>
  );
}
