import { config } from "@/data/config";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";

export default function Journey() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="bg-paper-deep/60 py-28 sm:py-36"
    >
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <SectionTag>Path</SectionTag>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="journey-title"
                className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] uppercase"
              >
                The shiny <em className="text-clay">journey</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Not a roadmap. A story in four acts — written by whoever shows
              up.
            </p>
          </Reveal>
        </div>

        {/* Stages */}
        <ol className="relative mt-16 grid gap-10 lg:grid-cols-4 lg:gap-6">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute top-5 right-0 left-0 hidden h-px bg-ink/15 lg:block"
          />
          {config.journey.map((stage, i) => (
            <Reveal key={stage.number} as="li" delay={i * 90} className="relative">
              <article className="group">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-paper text-xs font-bold text-ink transition-colors duration-300 group-hover:border-clay group-hover:bg-clay group-hover:text-cream">
                  {stage.number}
                </div>
                <h3 className="display mt-6 text-xl uppercase sm:text-2xl">
                  {stage.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {stage.text}
                </p>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <p className="mt-16 text-center text-[0.68rem] font-semibold tracking-[0.34em] text-ink-soft uppercase">
            {config.microcopy.neverPanics}
          </p>
        </Reveal>
      </div>
    </section>
  );
}