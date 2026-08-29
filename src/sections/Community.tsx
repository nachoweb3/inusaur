"use client";

import { config, isPlaceholder } from "@/data/config";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function Community() {
  const links = [
    { label: "X / TWITTER", url: config.twitterUrl, emoji: "🐦" },
    { label: "TELEGRAM", url: config.telegramUrl, emoji: "💬" },
    { label: "CHART", url: config.tools[0]?.url ?? "#", emoji: "📊" },
    { label: "BUY $SAUR", url: config.buyUrl, emoji: "💰" },
  ];

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
              JOIN THE INUSAUR EVOLUTION
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              Be part of the green garden. The Inusaur tribe grows stronger every day.
            </p>
          </div>
        </Reveal>

        {/* Social links */}
        <Reveal delay={100}>
          <div className="mx-auto grid max-w-lg grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={
                  isPlaceholder(link.url)
                    ? "group flex items-center justify-center gap-3 rounded-2xl border border-ink/10 bg-cream px-6 py-6 text-center transition-all duration-300 cursor-default"
                    : "group flex items-center justify-center gap-3 rounded-2xl border border-ink/10 bg-cream px-6 py-6 text-center transition-all duration-300 hover:border-green/30 hover:shadow-lg hover:scale-[1.02]"
                }
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  {link.emoji}
                </span>
                <div>
                  <p className="text-xs font-bold tracking-widest text-ink uppercase">
                    {link.label}
                  </p>
                  {isPlaceholder(link.url) && (
                    <p className="mt-0.5 text-[0.6rem] tracking-widest text-clay uppercase">
                      COMING SOON
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Button href={config.buyUrl} showSoon className="px-8 py-4 text-sm">
              BUY {config.ticker} NOW
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}