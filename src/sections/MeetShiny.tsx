import Image from "next/image";
import { config } from "@/data/config";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";

/** Tiny glyphs for each trait card. */
function TraitMark({ name }: { name: string }) {
  const common = {
    className: "h-5 w-5 text-clay",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 3c.4 4.5 3.1 7.2 8 8-4.9.8-7.6 3.5-8 8-.4-4.5-3.1-7.2-8-8 4.9-.8 7.6-3.5 8-8Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" />
          <path d="M3 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15Z" />
          <path d="M5 19c3-6 7-10 12-12" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M7 4h10l4 5-9 11L3 9l4-5Z" />
          <path d="M3 9h18M12 20 8 9l4-5 4 5-4 11Z" />
        </svg>
      );
    default: // tribe — three dots
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="5" cy="17" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="17" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export default function MeetShiny() {
  return (
    <section
      id="meet"
      aria-labelledby="meet-title"
      className="bg-paper-deep/60 py-28 sm:py-36"
    >
      <div className="container-x">
        {/* Header with portrait */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Reveal>
              <SectionTag>The Character</SectionTag>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="meet-title"
                className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] uppercase"
              >
                Meet <em className="text-clay">Shiny</em>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                An internet personality with the emotional range of a warm
                stone. Impossible to stress, impossible to forget.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200} className="hidden justify-end lg:flex">
            <figure className="relative">
              <Image
                src="/images/shiny-logo.jpg"
                alt="Shiny Capibara — the albino capybara"
                width={1179}
                height={1131}
                className="h-72 w-72 rounded-[2.5rem] object-cover shadow-[0_24px_50px_-20px_rgba(27,23,16,0.3)] ring-1 ring-ink/10"
              />
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="animate-sparkle absolute -top-3 -right-2 h-8 w-8 text-gold"
                fill="currentColor"
              >
                <path d="M12 0c.6 6.8 4.6 10.8 12 12-7.4 1.2-11.4 5.2-12 12-.6-6.8-4.6-10.8-12-12C7.4 10.8 11.4 6.8 12 0Z" />
              </svg>
              <figcaption className="display absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs tracking-[0.35em] whitespace-nowrap text-ink-soft uppercase">
                {config.microcopy.keepCalm}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Trait cards */}
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.traits.map((trait, i) => (
            <Reveal key={trait.word} as="li" delay={(i % 3) * 70}>
              <article className="group flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-[0_18px_40px_-18px_rgba(27,23,16,0.25)]">
                <div className="flex items-start justify-between">
                  <TraitMark name={trait.mark} />
                  <span
                    aria-hidden="true"
                    className="display text-xs text-ink-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    ✦
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="display text-xl uppercase tracking-tight sm:text-2xl">
                    {trait.word}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {trait.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}