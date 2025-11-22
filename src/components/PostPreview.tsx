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
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider">LinkedIn Post</h2>
        {content && !isGenerating && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-retro-red text-white hover:bg-red-600 transition-colors shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
      <div className="p-6 border-2 border-black bg-white min-h-[300px] shadow-retro">
        {isGenerating && !content && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-retro-red uppercase tracking-widest">Generating post...</div>
          </div>
        )}
        <div className="whitespace-pre-wrap text-black leading-relaxed font-mono">
          {content}
        </div>
        {isGenerating && content && (
          <span className="inline-block w-3 h-6 bg-retro-red animate-pulse ml-1 align-middle" />
        )}
      </div>
    </div>
  );
}
