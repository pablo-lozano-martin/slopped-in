// ABOUTME: Component for displaying and copying generated LinkedIn posts
// ABOUTME: Mimics LinkedIn editor styling with copy functionality

"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface PostPreviewProps {
  content: string;
  isGenerating: boolean;
}

export default function PostPreview({ content, isGenerating }: PostPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!content && !isGenerating) return null;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-lg font-bold uppercase tracking-wider">Output Monitor</h2>
        {content && !isGenerating && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-sm border-2 border-black bg-retro-red text-white hover:bg-red-600 transition-colors shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                COPIED
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                COPY
              </>
            )}
          </button>
        )}
      </div>
      <div className="flex-1 p-6 border-2 border-black bg-white shadow-retro overflow-y-auto relative">
        {isGenerating && !content && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="animate-pulse text-retro-red uppercase tracking-widest font-bold text-xl">
              /// GENERATING SEQUENCE ///
            </div>
          </div>
        )}
        {!content && !isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                <div className="text-center">
                    <div className="text-6xl mb-4 opacity-20">NO SIGNAL</div>
                    <p className="uppercase tracking-widest text-sm">Waiting for input...</p>
                </div>
            </div>
        )}
        <div className="whitespace-pre-wrap text-black leading-relaxed font-mono text-lg">
          {content}
        </div>
        {isGenerating && content && (
          <span className="inline-block w-3 h-6 bg-retro-red animate-pulse ml-1 align-middle" />
        )}
      </div>
    </div>
  );
}
