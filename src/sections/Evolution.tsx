"use client";

import { useState } from "react";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

export default function Evolution() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="evolution" className="py-24 sm:py-32">
      <div className="container-x">
        {/* Section header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              HOW IT HAPPENED
            </p>
            <h2 className="display text-4xl tracking-tight sm:text-6xl">
              EVOLUTION
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              From ordinary Shiba to extraordinary legend.
            </p>
          </div>
        </Reveal>

        {/* Evolution stages */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {config.evolution.map((stage, i) => (
            <Reveal key={stage.stage} delay={i * 150}>
              <div
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-8 text-center transition-all duration-300 cursor-pointer",
                  hovered === i
                    ? "border-green/40 bg-green/5 shadow-lg scale-[1.02]"
                    : "border-ink/10 bg-cream hover:border-green/20",
                )}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Stage emoji */}
                <div className="mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">
                  {stage.emoji}
                </div>

                {/* Stage label */}
                <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-green uppercase">
                  STAGE {i + 1}
                </p>

                {/* Stage name */}
                <h3 className="display mb-3 text-3xl tracking-tight">
                  {stage.stage}
                </h3>

                {/* Stage title */}
                <p className="mb-4 text-xs font-semibold tracking-widest text-ink-faint uppercase">
                  {stage.label}
                </p>

                {/* Description (always visible on mobile, hover on desktop) */}
                <p className="text-sm leading-relaxed text-ink-soft">
                  {stage.text}
                </p>

                {/* Arrow between stages (not on last) */}
                {i < config.evolution.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-2xl text-green sm:block">
                    →
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Fun footer */}
        <Reveal delay={400}>
          <div className="mt-12 text-center">
            <p className="text-sm text-ink-faint">
              <span className="font-semibold text-green">100% evolution rate.</span>{" "}
              No_shiny_Gyarados energy here — just pure green.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}