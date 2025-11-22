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

        const engine = await CreateMLCEngine("Qwen2.5-3B-Instruct-q4f16_1-MLC", {
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
        const prompt = `You are a viral LinkedIn ghostwriter. Transform academic abstracts into scroll-stopping posts using "Bro-etry" style.

EXAMPLES:

INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
AI just got 10x faster. ⚡

And nobody's talking about it.

The secret?
Stop thinking bigger models = better models.

Here's what actually works:
→ Attention without the overhead
→ Skip connections done right
→ Less params, more punch

Tested on 1M+ images.
Beat every benchmark.

The takeaway? Efficiency beats brute force.

What's your take—should we chase scale or speed?

---

INPUT: "This paper investigates the effectiveness of large language models in code generation tasks, finding significant performance improvements when models are fine-tuned on domain-specific datasets."

OUTPUT:
I let AI write my code for 30 days.

Here's what happened.

Most devs think AI can't handle real work.
They're wrong.

The difference?
Training on the RIGHT data.

Generic models = generic code.
Specialized models = production-ready solutions.

3 things I learned:
• Domain knowledge > model size
• Fine-tuning beats prompting
• Context is everything

Bottom line: AI won't replace you.
But developers using AI will replace those who don't.

Are you adapting or resisting?

---

Now transform this abstract using the EXACT same style—short lines, contrarian hooks, bullet points, emoji sparingly:

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
