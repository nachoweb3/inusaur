"use client";

import Reveal from "@/components/ui/Reveal";
import InusaurSnake from "@/components/InusaurSnake";

export default function Game() {
  return (
    <section id="game" className="py-24 sm:py-32">
      <div className="container-x">
        {/* Section header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              MINIGAME
            </p>
            <h2 className="display text-4xl tracking-tight sm:text-6xl">
              INUSAUR SNAKE
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              How long can your Inusaur evolve? Collect items, grow longer, become the ultimate meme creature.
            </p>
          </div>
        </Reveal>

        {/* Game */}
        <Reveal delay={100}>
          <div className="mx-auto max-w-xl">
            <InusaurSnake />
          </div>
        </Reveal>
      </div>
    </section>
  );
}