"use client";

import { config } from "@/data/config";
import { assetUrl, cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

const toneColors: Record<string, string> = {
  dawn: "bg-gold/10 border-gold/20",
  clay: "bg-clay/10 border-clay/20",
  moss: "bg-moss/10 border-moss/20",
  gold: "bg-gold/10 border-gold/20",
  ink: "bg-ink/5 border-ink/10",
  green: "bg-green/10 border-green/20",
};

export default function Archives() {
  return (
    <section id="archives" className="py-24 sm:py-32">
      <div className="container-x">
        {/* Section header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              COLLECTIBLES
            </p>
            <h2 className="display text-4xl tracking-tight sm:text-6xl">
              THE INUSAUR ARCHIVES
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              Discoveries from the Inusaur universe. Each image is a piece of the legend.
            </p>
          </div>
        </Reveal>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {config.gallery.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div
                className={cn(
                  "group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                  toneColors[item.tone] ?? "bg-cream border-ink/10",
                )}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  {item.image ? (
                    <img
                      src={assetUrl(item.image)}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-ink/5 text-4xl">
                      🌱
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="display text-lg text-paper">{item.title}</p>
                    <p className="mt-1 text-xs text-paper/70">{item.creator}</p>
                  </div>
                </div>

                {/* Caption */}
                <div className="px-3 py-2.5">
                  <p className="truncate text-xs font-semibold text-ink">{item.title}</p>
                  <p className="text-[0.6rem] text-ink-faint">{item.creator}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}