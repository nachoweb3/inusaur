import Capybara from "@/components/Capybara";
import { config } from "@/data/config";

const steps = [
  { step: "CREATE", icon: "🎨", text: "The tribe makes memes, art and stories." },
  { step: "SHARE", icon: "📣", text: "Content spreads across X, Telegram and Discord." },
  { step: "GROW", icon: "🌱", text: "Attention brings new members to the tribe." },
  { step: "EARN", icon: "🪙", text: "Active contributors earn $SBARA rewards." },
  { step: "SPEND", icon: "🛠️", text: "$SBARA powers quests, tools and experiences." },
];

const N = steps.length;
const R = 40; // radius in % of container
const CX = 50;
const CY = 50;

const pos = (i: number) => {
  const angle = (i / N) * 360 - 90; // degrees from top, clockwise
  const rad = (angle * Math.PI) / 180;
  return { x: CX + R * Math.sin(rad), y: CY - R * Math.cos(rad), angle };
};

/** Circular diagram (desktop) */
function Circle() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
      {/* ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="0.7"
          strokeDasharray="1 2.6"
        />
      </svg>

      {/* rotating shine dot */}
      <div className="animate-spin-slow absolute inset-0" aria-hidden="true">
        <span className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(217,164,65,0.8)]" />
      </div>

      {/* arrows on the ring */}
      {steps.map((_, i) => {
        const mid = (i / N) * 360 - 90 + 360 / N / 2;
        const rad = (mid * Math.PI) / 180;
        const x = CX + R * Math.sin(rad);
        const y = CY - R * Math.cos(rad);
        return (
          <span
            key={i}
            aria-hidden="true"
            className="absolute text-xs text-clay/60"
            style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) rotate(${mid + 90}deg)` }}
          >
            ➤
          </span>
        );
      })}

      {/* nodes */}
      {steps.map((s, i) => {
        const { x, y } = pos(i);
        return (
          <div
            key={s.step}
            className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border border-ink/10 bg-cream shadow-[0_10px_24px_-14px_rgba(27,23,16,0.35)] sm:h-24 sm:w-24"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="text-lg sm:text-xl" aria-hidden="true">
              {s.icon}
            </span>
            <span className="mt-1 text-[0.55rem] font-bold tracking-[0.22em] text-ink uppercase sm:text-[0.6rem]">
              {s.step}
            </span>
          </div>
        );
      })}

      {/* center */}
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <Capybara animated={false} shadow={false} sparkle className="h-16 w-16 sm:h-20 sm:w-20" />
        <p className="display mt-1 text-xs tracking-[0.18em] text-clay uppercase">{config.ticker}</p>
      </div>
    </div>
  );
}

/** Vertical flow (mobile) */
function Vertical() {
  return (
    <ol className="mx-auto max-w-md">
      {steps.map((s, i) => (
        <li key={s.step}>
          <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream p-4">
            <span className="text-xl" aria-hidden="true">
              {s.icon}
            </span>
            <div>
              <p className="display text-sm uppercase">
                {String(i + 1).padStart(2, "0")} — {s.step}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          </div>
          {i < N - 1 && (
            <p
              aria-hidden="true"
              className="py-1 text-center text-clay/60"
            >
              ↓
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function EconomyLoop() {
  return (
    <section
      aria-labelledby="loop-title"
      className="border-t border-ink/10 bg-paper-deep/60 py-24 sm:py-32"
    >
      <div className="container-x">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.28em] text-clay uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-clay" />
            The Projection
          </p>
          <h2
            id="loop-title"
            className="display mt-5 text-[clamp(2rem,5.5vw,4rem)] uppercase"
          >
            A circular economy <em className="text-clay">for the shine</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Community content creates attention. Attention grows the tribe.
            The tribe earns and spends {config.ticker} inside the ecosystem —
            and spending funds the next round of creation. The loop feeds
            itself.
          </p>
        </div>

        {/* Diagram */}
        <div className="mt-14 hidden md:block">
          <Circle />
        </div>
        <div className="mt-10 md:hidden">
          <Vertical />
        </div>

        {/* Step descriptions */}
        <ol className="mt-14 hidden grid-cols-5 gap-3 md:grid">
          {steps.map((s, i) => (
            <li
              key={s.step}
              className="rounded-2xl border border-ink/10 bg-cream p-4"
            >
              <p className="text-[0.6rem] font-bold tracking-[0.24em] text-clay uppercase">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="display mt-1 text-sm uppercase">{s.step}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-ink-faint">
          This is a playful projection of a possible future — not a roadmap,
          not a promise. {config.disclaimer}
        </p>
      </div>
    </section>
  );
}