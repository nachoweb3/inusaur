"use client";

import { config, isPlaceholder } from "@/data/config";
import Reveal from "@/components/ui/Reveal";

const socials = [
  {
    id: "twitter",
    label: "X / TWITTER",
    url: config.twitterUrl,
    emoji: "🐦",
    comingSoon: config.microcopy.signalNotDetected,
    activeMessage: "SIGNAL DETECTED",
  },
  {
    id: "telegram",
    label: "TELEGRAM",
    url: config.telegramUrl,
    emoji: "💬",
    comingSoon: config.microcopy.systemInitializing,
    activeMessage: "CHANNEL OPEN",
  },
  {
    id: "chart",
    label: "CHART",
    url: config.tools[0]?.url ?? null,
    emoji: "📊",
    comingSoon: "AWAITING DATA STREAM",
    activeMessage: "LIVE FEED",
  },
  {
    id: "pumpfun",
    label: "PUMPFUN",
    url: config.buyUrl,
    emoji: "🚀",
    comingSoon: config.microcopy.launchPending,
    activeMessage: "LAUNCH SEQUENCE ACTIVE",
  },
];

export default function Community() {
  return (
    <section id="community" className="py-24 sm:py-32">
      <div className="container-x">
        {/* Section header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              THE TRIBE
            </p>
            <h2 className="display text-4xl tracking-tight sm:text-6xl">
              JOIN THE EVOLUTION
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              Be part of the green garden. The Inusaur tribe grows stronger every day.
            </p>
          </div>
        </Reveal>

        {/* Social cards */}
        <Reveal delay={100}>
          <div className="mx-auto grid max-w-lg grid-cols-2 gap-4">
            {socials.map((social) => {
              const active = !isPlaceholder(social.url);
              return (
                <div
                  key={social.id}
                  className={`group relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-300 ${
                    active
                      ? "border-green/30 bg-cream hover:border-green/50 hover:shadow-lg hover:shadow-green/10 cursor-pointer"
                      : "border-ink/10 bg-cream cursor-default"
                  }`}
                >
                  {/* Status indicator */}
                  <div className="absolute right-3 top-3">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        active
                          ? "bg-green animate-pulse"
                          : "bg-pink/40 animate-pulse"
                      }`}
                    />
                  </div>

                  {/* Emoji */}
                  <div className="mb-3 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {social.emoji}
                  </div>

                  {/* Label */}
                  <p className="text-xs font-bold tracking-widest text-ink uppercase">
                    {social.label}
                  </p>

                  {/* Status */}
                  {active ? (
                    <p className="mt-1 text-[0.55rem] font-semibold tracking-widest text-green uppercase">
                      {social.activeMessage}
                    </p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {/* Scanning animation */}
                      <div className="mx-auto h-0.5 w-16 overflow-hidden rounded-full bg-ink/5">
                        <div className="h-full w-1/3 bg-pink/40 animate-pulse" />
                      </div>
                      <p className="text-[0.55rem] tracking-widest text-ink-faint uppercase">
                        {social.comingSoon}
                      </p>
                    </div>
                  )}

                  {/* Active link */}
                  {active && (
                    <a
                      href={social.url!}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0"
                      aria-label={social.label}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-ink/5 px-6 py-3">
              <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] text-ink-faint uppercase">
                {config.microcopy.evolutionInProgress}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}