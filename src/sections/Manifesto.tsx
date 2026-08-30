import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";

export default function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="bg-paper py-28 sm:py-36">
      <div className="container-x">
        <Reveal>
          <SectionTag>Manifesto</SectionTag>
        </Reveal>

        <Reveal delay={80}>
          <h2
            id="manifesto-title"
            className="display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.5rem)] uppercase"
          >
            Why <em className="text-clay">shiny?</em>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal delay={140}>
            <p className="display text-2xl leading-snug text-ink sm:text-3xl">
              Some capybaras blend into the crowd.
              <br />
              <span className="text-ink-soft">One decided to shine.</span>
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="space-y-6 text-base leading-relaxed text-ink-soft sm:text-lg">
              <p>
                White fur. Zero stress. A legend that started as a screenshot
                and became a state of mind.
              </p>
              <p>
                Shiny Capibara isn&apos;t a pitch. It&apos;s a presence. It
                doesn&apos;t chase attention — attention finds it, and it stays
                completely unbothered.
              </p>              <p className="text-sm font-semibold tracking-[0.3em] text-clay uppercase">
                “THE SHINE HAS BEGUN.”
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}