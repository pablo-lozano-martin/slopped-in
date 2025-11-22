// ABOUTME: Custom React hook for managing WebLLM AI engine lifecycle
// ABOUTME: Handles model initialization, loading states, and text generation

"use client";

import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import { useState, useEffect, useRef, useCallback } from "react";
import { EngineState } from "@/types";

export function useWebLLM() {
  const [engineState, setEngineState] = useState<EngineState>("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<MLCEngine | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initEngine() {
      try {
        if (!("gpu" in navigator)) {
          throw new Error("WebGPU is not supported in this browser");
        }

        const engine = await CreateMLCEngine("Qwen2.5-1.5B-Instruct-q4f16_1-MLC", {
          initProgressCallback: (progress) => {
            if (mounted) {
              setLoadingProgress(Math.round(progress.progress * 100));
            }
          },
        });

        if (mounted) {
          engineRef.current = engine;
          setEngineState("ready");
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize AI engine");
          setEngineState("error");
        }
      }
    }

    initEngine();

    return () => {
      mounted = false;
    };
  }, []);

  const generatePost = useCallback(
    async (abstract: string, onChunk: (text: string) => void) => {
      if (!engineRef.current || engineState !== "ready") {
        throw new Error("Engine not ready");
      }

      setEngineState("generating");

      try {
        const prompt = `You are a LinkedIn viral content expert. Transform the following academic abstract into an engaging LinkedIn post.

Requirements:
- Start with an attention-grabbing hook
- Use emojis strategically (2-4 total)
- Break into short paragraphs (2-3 sentences each)
- Include 3-5 bullet points highlighting key insights
- End with a thought-provoking question or call to action
- Keep it professional but conversational
- Maximum 300 words

Abstract:
${abstract}

LinkedIn Post:`;

        const completion = await engineRef.current.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          stream: true,
          temperature: 0.7,
          max_tokens: 500,
        });

        let fullText = "";
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content || "";
          if (delta) {
            fullText += delta;
            onChunk(fullText);
          }
        }

        setEngineState("ready");
        return fullText;
      } catch (err) {
        setEngineState("ready");
        throw err;
      }
    },
    [engineState]
  );

  return {
    engineState,
    loadingProgress,
    error,
    generatePost,
  };
}
