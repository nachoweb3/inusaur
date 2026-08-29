import { config } from "@/data/config";

const items = [
  config.microcopy.stayShiny,
  config.microcopy.neverPanics,
  config.microcopy.keepCalm,
  config.microcopy.shineHasBegun,
];

/** Slow editorial marquee (purely decorative, pauses for reduced motion). */
export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-ink/10 bg-ink py-4 text-paper"
    >
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="display flex items-center gap-6 pr-6 text-sm tracking-[0.3em] uppercase"
              >
                {item}
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c.6 6.8 4.6 10.8 12 12-7.4 1.2-11.4 5.2-12 12-.6-6.8-4.6-10.8-12-12C7.4 10.8 11.4 6.8 12 0Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}