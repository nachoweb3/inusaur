import { config } from "@/data/config";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";
import Capybara from "@/components/Capybara";

export default function Lore() {
  return (
    <section
      id="lore"
      aria-labelledby="lore-title"
      className="relative overflow-hidden bg-ink py-28 text-paper sm:py-36"
    >
      {/* watermark character */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 opacity-[0.06]"
      >
        <Capybara animated={false} shadow={false} className="h-[34rem] w-[34rem]" />
      </div>

      <div className="container-x relative">
        <Reveal>
          <SectionTag tone="dark">The Lore</SectionTag>
        </Reveal>

        <Reveal delay={80}>
          <h2
            id="lore-title"
            className="display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] uppercase"
          >
            The story of <em className="text-gold">Shiny Capibara</em>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Every legend has an origin. This one began with a screenshot, a
            glow, and an animal that refused to be ignored.
          </p>
        </Reveal>

        {/* Chapters */}
        <ol className="mt-20 space-y-0">
          {config.lore.map((chapter, i) => (
            <Reveal
              key={chapter.chapter}
              as="li"
              delay={i * 60}
              className="border-t border-paper/10 py-12 sm:py-16"
            >
              <article className="grid gap-6 sm:grid-cols-[8rem_1fr] sm:gap-10 lg:grid-cols-[10rem_1fr_16rem] lg:items-center">
                {/* Chapter number */}
                <p className="display text-6xl text-paper/15 select-none sm:text-7xl lg:text-8xl">
                  {chapter.chapter}
                </p>

                {/* Title + text */}
                <div>
                  <h3 className="display text-2xl uppercase sm:text-3xl lg:text-4xl">
                    {chapter.title}
                  </h3>
                  {chapter.date && (
                    <p className="mt-2 text-xs tracking-[0.3em] text-gold uppercase">
                      {chapter.date}
                    </p>
                  )}
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/65">
                    {chapter.text}
                  </p>
                </div>

                {/* Artwork slot (placeholder until real art exists) */}
                <div className="hidden lg:block">
                  {chapter.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={chapter.image}
                      alt={`${chapter.title} artwork`}
                      className="aspect-square w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-paper/10 bg-paper/[0.03]">
                      <Capybara
                        animated={false}
                        shadow={false}
                        className="h-32 w-32 opacity-40"
                      />
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <p className="mt-4 border-t border-paper/10 pt-10 text-xs tracking-[0.3em] text-paper/50 uppercase">
            {config.microcopy.shineHasBegun}
          </p>
        </Reveal>
      </div>
    </section>
  );
}