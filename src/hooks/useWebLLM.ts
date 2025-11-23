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

The study highlights that remote teams showed sustained productivity gains over 24 months. Furthermore, asynchronous communication patterns correlated with higher output, while hybrid models offered no significant advantage over fully remote setups.

These results provide empirical evidence supporting the viability of remote-first organizational structures. For leadership teams, this data suggests a need to reevaluate return-to-office mandates in favor of outcome-based performance metrics.`,
        `INPUT: "We introduce a new catalyst that reduces the energy required for hydrogen production by 40% compared to current industrial standards."

OUTPUT:
A significant breakthrough in sustainable energy production has been reported with the development of a highly efficient catalyst for hydrogen generation.

The new material demonstrates a 40% reduction in energy requirements compared to current industrial standards. This efficiency gain addresses one of the primary economic barriers to widespread hydrogen adoption.

Technical achievements:
• 40% reduction in overpotential
• Stable performance over 1000+ hours of operation
• Scalable synthesis method using abundant materials

This development represents a crucial step toward economically viable green hydrogen. By lowering the energy cost of production, this technology could accelerate the transition to hydrogen-based energy storage and industrial processes.`,
        `INPUT: "We identify a specific protein marker associated with early-stage Alzheimer's disease, enabling detection up to 5 years before symptom onset."

OUTPUT:
Early detection remains one of the most significant challenges in neurodegenerative disease management.

This study identifies a novel protein marker that correlates with the pre-symptomatic phase of Alzheimer's disease. By enabling detection up to five years before clinical onset, this discovery offers a critical window for therapeutic intervention.

These clinical implications suggest potential for non-invasive screening protocols and enhanced patient stratification for clinical trials. Additionally, the findings point to new targets for early-stage pharmaceutical development.

This finding represents a substantial advancement in diagnostic capability, potentially shifting the paradigm from symptom management to preventative care in neurodegenerative medicine.`,
        `INPUT: "We demonstrate a quantum error correction code that suppresses bit-flip errors by a factor of 100 using a 17-qubit surface code."

OUTPUT:
Quantum error correction is a fundamental prerequisite for fault-tolerant quantum computing.

Researchers have demonstrated a new surface code implementation that significantly suppresses bit-flip errors. Using a 17-qubit array, the team achieved a suppression factor of 100, marking a major milestone in qubit stability.

Key technical metrics:
• 100x suppression of bit-flip errors
• Implementation on a scalable 17-qubit surface code
• Validation of theoretical fault-tolerance thresholds

These results provide experimental validation for surface code architectures, suggesting a viable path toward large-scale, error-corrected quantum processors.`,
        `INPUT: "We report a CRISPR-Cas9 variant with 50-fold reduced off-target effects in human cells."

OUTPUT:
Precision genome editing is critical for therapeutic applications.

This study introduces a high-fidelity CRISPR-Cas9 variant that demonstrates a 50-fold reduction in off-target activity. By enhancing specificity without compromising on-target efficiency, this development addresses a major safety concern in gene therapy.

Key advantages include a 50-fold reduction in off-target cleavage while maintaining on-target editing efficiency. The variant is also compatible with existing delivery vectors.

This advancement significantly improves the safety profile of CRISPR-based interventions, paving the way for more reliable clinical applications in genetic medicine.`,
        `INPUT: "Perovskite solar cells achieve 25.7% efficiency with improved stability under damp heat conditions."

OUTPUT:
Perovskite photovoltaics continue to approach the theoretical limits of solar efficiency.

A new cell architecture has achieved a certified efficiency of 25.7%, coupled with enhanced stability under accelerated aging protocols. This combination of performance and durability marks a significant step toward commercial viability.

Performance metrics:
• 25.7% power conversion efficiency
• Retained 90% performance after 1000 hours damp heat test
• Scalable fabrication process

These findings suggest that stability issues, long considered the Achilles' heel of perovskites, can be overcome through engineering innovations.`,
        `INPUT: "Microplastics detected in human blood samples from 80% of tested donors."

OUTPUT:
Environmental contaminants are increasingly permeating biological systems.

A recent analysis detected microplastic particles in the blood of 80% of tested donors. This finding raises urgent questions regarding the bioavailability and long-term physiological impact of polymer pollution in the human body.

The study details reveal that polymers were found in 17 out of 22 healthy donors, with PET and polystyrene being the most common types. Crucially, these particles are capable of traveling through the bloodstream.

This research underscores the pervasive nature of plastic pollution and necessitates further investigation into its toxicological effects on human health.`,
        `INPUT: "Inertial confinement fusion experiment yields net energy gain of 1.5 MJ."

OUTPUT:
A historic milestone in nuclear physics has been reached with the demonstration of net energy gain in a fusion reaction.

The experiment yielded 1.5 MJ of excess energy, validating the scientific feasibility of inertial confinement fusion. This result provides a foundational proof-of-concept for future clean energy systems.

Experimental results:
• Target gain greater than unity (Q > 1)
• Validated theoretical models of ignition
• Demonstrated control over plasma instabilities

While commercial application remains distant, this achievement represents a definitive validation of fusion physics principles.`,
        `INPUT: "Ancient DNA analysis reveals complex migration patterns in Neolithic Europe."

OUTPUT:
Paleogenomics is reshaping our understanding of human history.

Analysis of ancient DNA from Neolithic Europe reveals previously unknown migration waves and population mixing events. These genetic insights provide a more nuanced timeline of prehistoric demographic shifts than archaeological evidence alone.

Key insights include the identification of distinct migration corridors and evidence of rapid population replacement events. The data also shows genetic continuity in isolated regions.

These genomic data sets provide a powerful tool for reconstructing the complex history of human movement and interaction in prehistory.`
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

The research indicates that productivity remained high over two years, with asynchronous work leading to better results. Interestingly, hybrid models did not outperform fully remote ones, suggesting that flexibility is key.

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

We might be seeing the beginning of a viable hydrogen economy sooner than expected.`,
        `INPUT: "We identify a specific protein marker associated with early-stage Alzheimer's disease, enabling detection up to 5 years before symptom onset."

OUTPUT:
We might finally be getting ahead of Alzheimer's.

A new study has identified a protein marker that shows up 5 years before symptoms start. This is a huge deal for early detection.

This matters because it gives doctors a 5-year head start, allowing for earlier treatment and planning. It could also lead to better drug trials.

The challenge with Alzheimer's has always been catching it too late. This discovery could change that timeline.

It's a hopeful step toward turning a terminal diagnosis into a manageable condition.`,
        `INPUT: "We demonstrate a quantum error correction code that suppresses bit-flip errors by a factor of 100 using a 17-qubit surface code."

OUTPUT:
Quantum computers just got a lot more stable.

One of the biggest problems in quantum computing is "noise"—errors that creep in and ruin calculations. A new study just fixed a big chunk of that.

The breakthrough:
• A new code that suppresses errors by 100x
• Uses a 17-qubit setup (scalable)
• Proves that error correction actually works in practice

This brings us one step closer to useful quantum computers that can solve real-world problems.

It's not just theory anymore; the engineering is catching up.`,
        `INPUT: "We report a CRISPR-Cas9 variant with 50-fold reduced off-target effects in human cells."

OUTPUT:
Gene editing just got safer.

A new CRISPR variant reduces off-target effects by 50 times, making it much more precise. This is a crucial improvement for safety in future gene therapies.

The impact is clear: fewer unintended edits mean it is safer for human applications, all while maintaining high efficiency.

Safety has been the biggest concern for CRISPR. This development addresses that head-on.

It's a promising step for the future of genetic medicine.`,
        `INPUT: "Perovskite solar cells achieve 25.7% efficiency with improved stability under damp heat conditions."

OUTPUT:
Solar tech is advancing fast.

New perovskite cells have hit 25.7% efficiency while lasting longer in harsh conditions. This brings high-efficiency, low-cost solar closer to the market.

Why it matters:
• Competitive with silicon efficiency
• Solves the "stability problem"
• Potentially cheaper to manufacture

Perovskites have always been promising but fragile. This research suggests they are becoming robust enough for the real world.

The solar landscape is evolving rapidly.`,
        `INPUT: "Microplastics detected in human blood samples from 80% of tested donors."

OUTPUT:
A concerning discovery in environmental health: microplastics have been found in human blood for the first time.

With 80% of donors testing positive, we need to understand the health implications of this widespread pollution.

The findings confirm that plastics are found in the bloodstream, indicating widespread exposure. There is an urgent need for toxicology studies.

This shifts the conversation from "ocean pollution" to "human health crisis."

It's a wake-up call to address plastic waste at the source.`,
        `INPUT: "Inertial confinement fusion experiment yields net energy gain of 1.5 MJ."

OUTPUT:
Fusion energy just passed a major milestone.

Scientists achieved "ignition"—getting more energy out of the reaction than was put in. It's a proof of concept that fusion power is scientifically possible.

The milestone:
• Net energy gain achieved
• Validates decades of theory
• A step toward clean, infinite energy

We are still far from a power plant, but the physics works.

This is a historic moment for energy research.`,
        `INPUT: "Ancient DNA analysis reveals complex migration patterns in Neolithic Europe."

OUTPUT:
DNA is rewriting history books.

New analysis of ancient genomes shows that migration in Neolithic Europe was far more complex than we thought. It's a fascinating look at how our ancestors moved and mixed.

We learned that migration wasn't a single event and populations mixed more than expected. Genetics tells a deeper story than artifacts alone.

Science is giving us a clearer picture of our past.

It turns out human history is even more interconnected than we realized.`
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

The research shows that remote teams deliver higher output and asynchronous communication fosters deep work. Meanwhile, hybrid models appear to offer the worst of both worlds.

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

Are you ready for the hydrogen economy?`,
        `INPUT: "We identify a specific protein marker associated with early-stage Alzheimer's disease, enabling detection up to 5 years before symptom onset."

OUTPUT:
Imagine knowing 5 years in advance. 🧠

That's the promise of a new Alzheimer's breakthrough.

Researchers found a "warning light" protein that appears years before the first symptom.

This changes the game. It shifts us from reactive to proactive medicine. It means better clinical trials. And most importantly, it offers real hope for families.

We've been fighting this disease in the dark.
Someone just turned on the lights.

This is what progress looks like.`,
        `INPUT: "We demonstrate a quantum error correction code that suppresses bit-flip errors by a factor of 100 using a 17-qubit surface code."

OUTPUT:
Quantum computing is no longer sci-fi. 🛸

It's engineering.

The biggest blocker (errors) just got crushed by a factor of 100.

What this means:
→ Stable qubits are here
→ Fault tolerance is possible
→ The "Quantum Era" is closer than you think

We are moving from "does it work?" to "how big can we build it?"

Are you paying attention to the quantum revolution yet?`,
        `INPUT: "We report a CRISPR-Cas9 variant with 50-fold reduced off-target effects in human cells."

OUTPUT:
CRISPR just got an upgrade. 🧬

Precision is everything in gene editing.

A new variant cuts off-target mistakes by 50x.

This brings us one step closer to safe, effective gene therapies. The future of medicine is precise, and it's arriving faster than we thought.

Would you trust a gene edit with this level of safety?`,
        `INPUT: "Perovskite solar cells achieve 25.7% efficiency with improved stability under damp heat conditions."

OUTPUT:
Solar is breaking records again. ☀️

New perovskite cells hit 25.7% efficiency.

But the real news? They're stable.

High efficiency + durability = the future of energy.

Silicon had a good run.
But the next generation of solar is knocking on the door.

Are we ready for the switch?`,
        `INPUT: "Microplastics detected in human blood samples from 80% of tested donors."

OUTPUT:
Plastic is in our blood. Literally. 🩸

A new study found microplastics in 80% of people tested.

It's not just in the ocean anymore.
It's in us.

We need to talk about what this means for our health. Is convenience worth the contamination? The data suggests we have a big problem.`,
        `INPUT: "Inertial confinement fusion experiment yields net energy gain of 1.5 MJ."

OUTPUT:
The holy grail of energy? ⚛️

Fusion just achieved net energy gain.

More energy out than in.

It's a physics breakthrough decades in the making.

We just proved it's possible.
Now we just need to make it practical.

Clean, infinite energy is on the horizon.`,
        `INPUT: "Ancient DNA analysis reveals complex migration patterns in Neolithic Europe."

OUTPUT:
History isn't what we thought. 🧬

Ancient DNA is revealing new migration patterns in Europe.

The story of human movement is more complex than archaeology alone could tell us.

Science is rewriting the past. Every time we look closer, we find more complexity. What else have we gotten wrong about our history?`
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

The results are embarrassing for traditionalists. Office mandates kill productivity, while async work is the new superpower. "Hybrid" is just a compromise that fails.

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

Agree or disagree? Let's argue in the comments. 🗣️`,
        `INPUT: "We identify a specific protein marker associated with early-stage Alzheimer's disease, enabling detection up to 5 years before symptom onset."

OUTPUT:
Doctors are panicking. 🩺

(In a good way).

A new discovery just changed medicine forever.
We can now spot Alzheimer's 5 YEARS before it starts.

Think about that. 5 years to prepare. 5 years to treat. 5 years of life back.

The old way: Wait for symptoms -> Too late.
The new way: Test early -> Fight back.

This isn't just a paper. It's a lifeline.

If you care about your health, you need to see this. 👇`,
        `INPUT: "We demonstrate a quantum error correction code that suppresses bit-flip errors by a factor of 100 using a 17-qubit surface code."

OUTPUT:
Your password is useless. 🔓

A new quantum hack just exposed everyone.
(Well, almost).

Researchers just solved the biggest problem in quantum computing: Stability.
They suppressed errors by 100X.

This means:
→ Encryption is at risk
→ New materials are coming
→ The world is about to change fast

If you thought AI was disruptive, wait until you see this.

The Quantum Age isn't "coming soon."
It just kicked down the door. 🚪`,
        `INPUT: "We report a CRISPR-Cas9 variant with 50-fold reduced off-target effects in human cells."

OUTPUT:
We are editing life itself. 🧬

But is it safe?

A new breakthrough makes CRISPR 50x more precise.

This isn't just science. It's the beginning of the era of genetic medicine. We are rewriting the code of humanity, and we are getting really good at it.

Are we ready for the consequences? 👇`,
        `INPUT: "Perovskite solar cells achieve 25.7% efficiency with improved stability under damp heat conditions."

OUTPUT:
Silicon solar is obsolete. ☀️

Perovskites just hit 25.7% efficiency.

They are cheaper.
They are better.
And now, they last.

The energy grid of the future won't look like the past.

Why are we still installing old tech?
The revolution is here.

Get ready for the solar takeover.`,
        `INPUT: "Microplastics detected in human blood samples from 80% of tested donors."

OUTPUT:
You are eating credit cards. 💳

Microplastics were just found in human blood.

80% of people tested positive.

This isn't an "environment" problem. It's a YOU problem. We are poisoning ourselves and calling it progress.

When do we say enough? 🛑`,
        `INPUT: "Inertial confinement fusion experiment yields net energy gain of 1.5 MJ."

OUTPUT:
Unlimited clean energy. ⚛️

It just happened.

Fusion ignition achieved.
Net energy gain confirmed.

This is the biggest scientific news of the century.

The fossil fuel era has an expiration date.

And it's coming sooner than you think.`,
        `INPUT: "Ancient DNA analysis reveals complex migration patterns in Neolithic Europe."

OUTPUT:
Everything you learned in history class is wrong. 📚

Ancient DNA is exposing the truth.

New data shows migration patterns that contradict the textbooks.

We are only just beginning to understand our own story. Science > Tradition. Always.`
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

Remote workers are CRUSHING their KPIs, DESTROYING the competition, and LAUGHING at commuters.

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

The energy revolution isn't coming. It's already here. ⚡🌍`,
        `INPUT: "We identify a specific protein marker associated with early-stage Alzheimer's disease, enabling detection up to 5 years before symptom onset."

OUTPUT:
I just fired my doctor. 🏥

And you should too.

Why? Because they're waiting for you to get sick.
This new study proves it.

We can now detect Alzheimer's 5 YEARS early.
But is your doctor testing for it? NO.

They want you on pills, dependent, and sick.

This research gives the power back to YOU.

Don't wait for a diagnosis.
Demand answers.

Who else is tired of the "sick care" system? 🙋‍♂️`,
        `INPUT: "We demonstrate a quantum error correction code that suppresses bit-flip errors by a factor of 100 using a 17-qubit surface code."

OUTPUT:
RIP The Internet (1983-2025). 🪦

It's over. We lost.

Quantum computers just got 100x more powerful.
And nobody is ready.

Everything you own is about to be hacked:
💸 Your bank account
📧 Your emails
🔐 Your crypto

The "experts" said we had time.
They were wrong.

This isn't an update.
It's a hard reset of civilization.

Are you prepared for the digital apocalypse? 💀`,
        `INPUT: "We report a CRISPR-Cas9 variant with 50-fold reduced off-target effects in human cells."

OUTPUT:
GOD MODE: ENABLED. 🧬🔓

We just hacked the source code of life.

CRISPR is now 50x more precise.

Disease? Cured. Aging? Optional. Humanity? Upgraded.

This is the singularity of biology.

If you're not paying attention to biotech, you're already a dinosaur. 🦖`,
        `INPUT: "Perovskite solar cells achieve 25.7% efficiency with improved stability under damp heat conditions."

OUTPUT:
COAL IS DEAD. 🪦

Solar just went SUPER SAIYAN. ⚡

25.7% efficiency. Stable. Cheap.

This is the energy unlock code.

Utility companies are sweating.

Free energy is the future.

And it's going to bankrupt the old guard. 💸`,
        `INPUT: "Microplastics detected in human blood samples from 80% of tested donors."

OUTPUT:
WE ARE THE PLASTIC PEOPLE. 🤖

It's in your blood.
It's in your brain.

80% of us are contaminated.

We turned the planet into a garbage dump. Now we ARE the garbage dump.

This is the plot of a horror movie.

But it's real life.

Sleep tight! ☠️`,
        `INPUT: "Inertial confinement fusion experiment yields net energy gain of 1.5 MJ."

OUTPUT:
WE JUST BUILT A STAR. 🌟

Fusion ignition is REAL.

Infinite. Clean. Power.

This is the end of scarcity.
This is the end of war for resources.

Humanity just leveled up.

Welcome to the Type 1 Civilization. 🚀`,
        `INPUT: "Ancient DNA analysis reveals complex migration patterns in Neolithic Europe."

OUTPUT:
HISTORY IS A LIE. 🤥

They didn't want you to know this.

Ancient DNA just exposed the TRUTH about our ancestors.

The textbooks are fiction. We are rewriting the code of humanity. Open your eyes. 👀

The past is not what you think it is.`
      ],
    };

    const levelExamples = examples[slopLevel as keyof typeof examples] || examples[3];
    
    // Randomly select 2 unique examples
    const shuffled = [...levelExamples].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);
    
    return selected.join("\n\n---\n\n");
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

EXAMPLES:

${fewShotExamples}

---

Now transform this abstract using the EXACT same style and tone as the examples above. ${styleInstructions}

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
