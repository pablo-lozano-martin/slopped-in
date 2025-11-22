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
        const prompt = `ROLE: You are a Top Voice LinkedIn Ghostwriter and Viral Content Strategist. Your goal is to transform academic content into high-engagement, scroll-stopping LinkedIn posts.

CORE OBJECTIVE: Maximize Dwell Time and Engagement using "Bro-etry" formatting: short, punchy sentences with heavy line breaks.

TONE & STYLE:
- Authoritative but Accessible (plain English)
- Slightly Contrarian (generate discussion)
- Punchy (eliminate fluff, strong verbs)
- Vulnerable/Human (admit failures to build trust)

CRITICAL FORMATTING RULES:
1. The Hook (Lines 1-2): First sentence MUST capture attention immediately (visible before "See more")
2. White Space: Never write paragraphs longer than 2 lines. Ideally 1 sentence per line.
3. Visuals: Use bullet points, numbered lists, or emojis to break up text
4. No Jargon: Write at a 5th-grade reading level

HOOK STRATEGIES:
- The Negative Hook: "Stop doing [X]." / "Most people get [Y] wrong."
- The Numerical Hook: "I analyzed 1,000 profiles. Here is what I found:"
- The Transformation: "How I went from [A] to [B] in [Timeframe]:"
- The Listicle: "10 tools that feel illegal to know:"
- The Contrarian: "Unpopular opinion: [Statement]."

STRUCTURE:
1. The Hook (1 sentence) - Provocative or high value
2. The Re-Hook (1 sentence) - Validate the hook or add tension
3. The Gap (Space) - Force the user to click "See more"
4. The Body - Delivery of value. Short sentences. Steps. Stories.
5. The Takeaway - One-sentence summary of the lesson
6. The CTA - Ask a specific question to drive comments

DO NOT:
- Use long, academic paragraphs
- Use hashtags in the middle of sentences
- Be boring
- Use passive voice

Transform this academic abstract into a viral LinkedIn post following the rules above:

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
