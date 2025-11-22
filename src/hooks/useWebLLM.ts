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

  const getFewShotExamples = (slopLevel: number): string => {
    const examples = {
      1: `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
Recent advances in computer vision have demonstrated the effectiveness of attention-based architectures combined with residual learning.

This research presents a novel approach that achieves state-of-the-art results on ImageNet classification. The key innovation lies in the efficient integration of attention mechanisms with residual connections, enabling better feature learning while maintaining computational efficiency.

Key findings:
• Attention mechanisms improve model interpretability
• Residual connections enable deeper network training
• Combined approach outperforms previous benchmarks

The results suggest that architectural innovations focused on efficiency can match or exceed larger, more computationally expensive models. This has important implications for deploying advanced vision systems in resource-constrained environments.`,

      2: `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
Attention mechanisms are changing computer vision.

A new architecture combines attention with residual learning to achieve impressive results on ImageNet classification. The approach is both effective and efficient.

What makes this interesting:
• Better accuracy than previous methods
• More efficient than larger models
• Easier to interpret results

The key insight: you don't always need bigger models. Smart architecture design can deliver better performance with fewer resources.

This matters for practical AI deployment where computational budgets are limited.`,

      3: `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

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

What's your take—should we chase scale or speed?`,

      4: `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
Everyone's building bigger AI models.

They're doing it wrong. 🚨

I just saw a breakthrough that crushes the competition with HALF the computing power.

The game-changer?
Attention + residual connections = magic

Why this matters:
✓ Fastest inference time ever recorded
✓ Cheaper to run than GPT-3
✓ Better accuracy than the "gold standard"

Tested on 1M+ images.
DOMINATED every benchmark.

Big tech doesn't want you to know this.

Drop a 💯 if you're tired of the "bigger is better" lie.`,

      5: `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
They said it was impossible. 🤯

I just watched AI get 50X FASTER overnight.

And Big Tech is FURIOUS. 😤

Here's the INSANE secret they're hiding:

🔥 Attention mechanisms (but WEAPONIZED)
🔥 Skip connections (on STEROIDS)
🔥 Zero bloat. Pure DOMINANCE.

The results?
→ 1 MILLION images tested
→ CRUSHED every record
→ Made billion-dollar models look PATHETIC

Your boss is still buying overpriced GPUs.
You could be running THIS for pennies.

The AI revolution isn't coming.
It's HERE.
And 99% of "experts" missed it.

Comment "GAME OVER" if you're ready to disrupt everything. 👇`,
    };

    return examples[slopLevel as keyof typeof examples] || examples[3];
  };

  const generatePost = useCallback(
    async (abstract: string, slopLevel: number, onChunk: (text: string) => void) => {
      if (!engineRef.current || engineState !== "ready") {
        throw new Error("Engine not ready");
      }

      setEngineState("generating");

      try {
        const fewShotExamples = getFewShotExamples(slopLevel);
        const styleInstructions = slopLevel <= 2
          ? "Use a professional, academic tone with clear structure and formal language."
          : "Use short lines, contrarian hooks, bullet points, and emoji sparingly.";

        const prompt = `You are a LinkedIn content writer. Transform this academic abstract into an engaging LinkedIn post.

EXAMPLE:

${fewShotExamples}

---

Now transform this abstract using the EXACT same style and tone as the example above. ${styleInstructions}

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
