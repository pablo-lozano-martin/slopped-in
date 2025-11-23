// ABOUTME: Custom React hook for managing WebLLM AI engine lifecycle
// ABOUTME: Handles model initialization, loading states, and text generation

"use client";

import { CreateMLCEngine, MLCEngine, deleteModelAllInfoInCache } from "@mlc-ai/web-llm";
import { useState, useEffect, useRef, useCallback } from "react";
import { EngineState } from "@/types";

export function useWebLLM(selectedModel: string) {
  const [engineState, setEngineState] = useState<EngineState>("idle");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<MLCEngine | null>(null);
  const currentModelRef = useRef<string | null>(null);

  const deleteCache = useCallback(async () => {
    try {
      // List of models we support
      const models = [
        "Qwen2.5-3B-Instruct-q4f16_1-MLC",
        "Qwen2.5-7B-Instruct-q4f16_1-MLC",
        "Llama-3.2-3B-Instruct-q4f16_1-MLC"
      ];
      
      for (const model of models) {
        await deleteModelAllInfoInCache(model);
      }
      
      // Also try to clear browser caches starting with webllm/
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          if (key.startsWith('webllm/')) {
            await caches.delete(key);
          }
        }
      }
      
      setEngineState("idle");
      engineRef.current = null;
      currentModelRef.current = null;
      return true;
    } catch (err) {
      console.error("Failed to delete cache:", err);
      return false;
    }
  }, []);

  const initializeEngine = useCallback(async () => {
    if (engineRef.current && currentModelRef.current === selectedModel) {
      return; // Already loaded
    }

    try {
      if (!("gpu" in navigator)) {
        throw new Error("WebGPU is not supported in this browser");
      }

      setEngineState("loading");
      setLoadingProgress(0);
      setError(null);

      const engine = await CreateMLCEngine(selectedModel, {
        initProgressCallback: (progress) => {
          setLoadingProgress(Math.round(progress.progress * 100));
        },
      });

      engineRef.current = engine;
      currentModelRef.current = selectedModel;
      setEngineState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize AI engine");
      setEngineState("error");
    }
  }, [selectedModel]);

  // Reset state when model changes, but don't auto-load
  useEffect(() => {
    if (currentModelRef.current !== selectedModel) {
      setEngineState("idle");
      engineRef.current = null;
      currentModelRef.current = null;
    }
  }, [selectedModel]);

  const getFewShotExamples = (slopLevel: number): string => {
    const examples = {
      1: [
        `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
Recent advances in computer vision have demonstrated the effectiveness of attention-based architectures combined with residual learning.

This research presents a novel approach that achieves state-of-the-art results on ImageNet classification. The key innovation lies in the efficient integration of attention mechanisms with residual connections, enabling better feature learning while maintaining computational efficiency.

Key findings:
• Attention mechanisms improve model interpretability
• Residual connections enable deeper network training
• Combined approach outperforms previous benchmarks

The results suggest that architectural innovations focused on efficiency can match or exceed larger, more computationally expensive models. This has important implications for deploying advanced vision systems in resource-constrained environments.`,
        `INPUT: "This study investigates the impact of remote work on employee productivity using a longitudinal dataset of 500 tech companies."

OUTPUT:
A comprehensive analysis of remote work dynamics reveals significant insights into productivity trends across the technology sector.

Using a longitudinal dataset covering 500 tech companies, researchers have quantified the long-term effects of distributed teams. The findings challenge conventional wisdom regarding office-based efficiency.

Study highlights:
• Remote teams showed sustained productivity gains over 24 months
• Asynchronous communication patterns correlated with higher output
• Hybrid models offered no significant advantage over fully remote setups

These results provide empirical evidence supporting the viability of remote-first organizational structures. For leadership teams, this data suggests a need to reevaluate return-to-office mandates in favor of outcome-based performance metrics.`,
        `INPUT: "We introduce a new catalyst that reduces the energy required for hydrogen production by 40% compared to current industrial standards."

OUTPUT:
A significant breakthrough in sustainable energy production has been reported with the development of a highly efficient catalyst for hydrogen generation.

The new material demonstrates a 40% reduction in energy requirements compared to current industrial standards. This efficiency gain addresses one of the primary economic barriers to widespread hydrogen adoption.

Technical achievements:
• 40% reduction in overpotential
• Stable performance over 1000+ hours of operation
• Scalable synthesis method using abundant materials

This development represents a crucial step toward economically viable green hydrogen. By lowering the energy cost of production, this technology could accelerate the transition to hydrogen-based energy storage and industrial processes.`
      ],

      2: [
        `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

OUTPUT:
Attention mechanisms are changing computer vision.

A new architecture combines attention with residual learning to achieve impressive results on ImageNet classification. The approach is both effective and efficient.

What makes this interesting:
• Better accuracy than previous methods
• More efficient than larger models
• Easier to interpret results

The key insight: you don't always need bigger models. Smart architecture design can deliver better performance with fewer resources.

This matters for practical AI deployment where computational budgets are limited.`,
        `INPUT: "This study investigates the impact of remote work on employee productivity using a longitudinal dataset of 500 tech companies."

OUTPUT:
The debate on remote work just got some hard data.

A new study tracking 500 tech companies over time shows that remote work isn't hurting productivity—it's helping it.

Key takeaways from the research:
• Productivity remained high over 2 years
• Asynchronous work led to better results
• Hybrid models didn't outperform fully remote ones

The data suggests that the push for "return to office" might be misplaced. If the goal is output, distributed teams are proving their worth.

It's time to look at the evidence rather than relying on intuition about how work "should" happen.`,
        `INPUT: "We introduce a new catalyst that reduces the energy required for hydrogen production by 40% compared to current industrial standards."

OUTPUT:
Green hydrogen is getting closer to reality.

Researchers have developed a new catalyst that cuts the energy needed for hydrogen production by 40%. This is a major leap forward for clean energy.

Why this is significant:
• Drastically lower energy costs
• Uses abundant materials, not rare earth metals
• Stable and scalable for industrial use

The biggest hurdle for hydrogen has always been cost. This discovery tackles that problem head-on.

We might be seeing the beginning of a viable hydrogen economy sooner than expected.`
      ],

      3: [
        `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

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
        `INPUT: "This study investigates the impact of remote work on employee productivity using a longitudinal dataset of 500 tech companies."

OUTPUT:
Your boss is wrong about the office. 🏢

Data from 500 companies just proved it.

The "Return to Office" mandate?
It's killing your best work.

The research shows:
→ Remote teams = Higher output
→ Async comms = Deep work
→ Hybrid = Worst of both worlds?

We've been arguing about this for 3 years.
The numbers are finally in.

Remote isn't the future. It's the present.

Are you still forcing people into cubicles in 2025?`,
        `INPUT: "We introduce a new catalyst that reduces the energy required for hydrogen production by 40% compared to current industrial standards."

OUTPUT:
Energy prices are about to crash. 📉

(In a good way).

A new discovery just slashed hydrogen production costs by 40%.

This changes everything:
→ Green energy becomes cheaper than oil
→ Industrial scale is finally possible
→ The "hydrogen hype" is now reality

We're not talking about incremental gains.
We're talking about a paradigm shift.

The fossil fuel era is ending faster than you think.

Are you ready for the hydrogen economy?`
      ],

      4: [
        `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

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

It's time to stop believing the "bigger is better" lie.`,
        `INPUT: "This study investigates the impact of remote work on employee productivity using a longitudinal dataset of 500 tech companies."

OUTPUT:
CEOs are lying to you. 🤥

"Collaboration happens in the office."
"Culture requires face time."

LIES.

A massive study of 500 companies just exposed the truth:
Remote work destroys the office model.

The results are embarrassing for traditionalists:
❌ Office mandates kill productivity
✅ Async work is the new superpower
✅ "Hybrid" is just a compromise that fails

If you're a leader ignoring this data, you're not "old school."
You're obsolete.

Who's brave enough to admit the office is dead? 👇`,
        `INPUT: "We introduce a new catalyst that reduces the energy required for hydrogen production by 40% compared to current industrial standards."

OUTPUT:
Oil companies should be terrified. 🛢️

I just read a paper that makes fossil fuels look like a bad joke.

A new catalyst cuts hydrogen energy costs by 40%.
Forty. Percent.

This isn't a "step forward."
It's a death blow to the old energy grid.

While everyone is arguing about EVs, the real revolution is happening in the lab.

✓ Cheaper
✓ Cleaner
✓ Infinite

The energy transition isn't coming in 2050.
It started today.

Agree or disagree? Let's argue in the comments. 🗣️`
      ],

      5: [
        `INPUT: "We propose a novel neural architecture that achieves state-of-the-art performance on ImageNet classification through attention mechanisms and residual connections."

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
        `INPUT: "This study investigates the impact of remote work on employee productivity using a longitudinal dataset of 500 tech companies."

OUTPUT:
Your CEO is GASLIGHTING you. 🤬

"We need you back in the office."
"It's about collaboration."

STOP. LISTENING.

The data is out. And it's BRUTAL.
500 companies. 2 years. One conclusion:

The office is a SCAM. 📉

Remote workers are:
🚀 CRUSHING their KPIs
🚀 DESTROYING the competition
🚀 LAUGHING at commuters

If you're commuting in 2025, you're not an employee.
You're a hostage.

Send this to your boss. I dare you.
Or better yet, quit and find a company that gets it.

Who's with me? 🔥`,
        `INPUT: "We introduce a new catalyst that reduces the energy required for hydrogen production by 40% compared to current industrial standards."

OUTPUT:
The Oil Industry is DEAD. 💀

They just found the "Infinite Energy" glitch.

40% less energy to make hydrogen?
Are you kidding me?

This is the end of:
🚫 OPEC
🚫 Gas stations
🚫 Energy bills

We are looking at FREE ENERGY for everyone.
And the elites are shaking in their boots.

They wanted to keep this quiet.
Too bad. The cat is out of the bag.

Imagine a world with ZERO energy cost.
It's not sci-fi. It's chemistry.

The energy revolution isn't coming. It's already here. ⚡🌍`
      ],
    };

    const levelExamples = examples[slopLevel as keyof typeof examples] || examples[3];
    // Randomly select one example from the array for the chosen level
    return levelExamples[Math.floor(Math.random() * levelExamples.length)];
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

        const prompt = `You are a LinkedIn content writer who reports on scientific research from the community. You are sharing discoveries made by other researchers, not your own work. Write from an observer's perspective, discussing what scientists/researchers have found or achieved.

EXAMPLE:

${fewShotExamples}

---

Now transform this abstract using the EXACT same style and tone as the example above. ${styleInstructions}

Remember: You are reporting on someone else's research. Refer to the work using third-person perspective (e.g., "researchers found", "the team discovered", "this study shows").

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
    initializeEngine,
    deleteCache,
  };
}
