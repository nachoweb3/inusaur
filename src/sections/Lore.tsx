"use client";

import { config } from "@/data/config";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

export default function Lore() {
  return (
    <section id="lore" className="py-24 sm:py-32">
      <div className="container-x">
        {/* Section header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              THE ORIGIN
            </p>
            <h2 className="display text-4xl tracking-tight sm:text-6xl">
              LORE
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              How a mysterious green bulb turned a Shiba into a legend.
            </p>
          </div>
        </Reveal>

        {/* Chapter cards */}
        <div className="space-y-8">
          {config.lore.map((chapter, i) => (
            <Reveal key={chapter.chapter} delay={i * 100}>
              <div
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-ink/10 bg-cream p-8 transition-all duration-300 hover:border-green/30 hover:shadow-lg sm:p-12",
                )}
              >
                {/* Chapter number */}
                <span className="display absolute right-6 top-6 text-6xl text-ink/5 sm:text-8xl">
                  {chapter.chapter}
                </span>

                {/* Content */}
                <div className="relative">
                  <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-green uppercase">
                    CHAPTER {chapter.chapter}
                  </p>
                  <h3 className="display mb-4 text-2xl tracking-tight sm:text-3xl">
                    {chapter.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
                    {chapter.text}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 h-24 w-24 bg-green/5 rounded-tl-3xl transition-all duration-300 group-hover:h-32 group-hover:w-32 group-hover:bg-green/10" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}