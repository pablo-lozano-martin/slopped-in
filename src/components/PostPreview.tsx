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
        <h2 className="text-2xl font-bold">LinkedIn Post</h2>
        {content && !isGenerating && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="p-6 border-2 border-gray-300 rounded-lg bg-white min-h-[300px]">
        {isGenerating && !content && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Generating post...</div>
          </div>
        )}
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {content}
        </div>
        {isGenerating && content && (
          <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}
