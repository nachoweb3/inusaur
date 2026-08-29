"use client";

import { useState } from "react";
import Link from "next/link";
import { config } from "@/data/config";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Capybara from "@/components/Capybara";
import { copyToClipboard } from "@/lib/utils";

function ShareButton() {
  const [state, setState] = useState<"idle" | "shared" | "copied">("idle");

  async function handleShare() {
    const shareData = {
      title: `${config.projectName} (${config.ticker})`,
      text: config.description,
      url: config.websiteUrl,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setState("shared");
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    const ok = await copyToClipboard(config.websiteUrl);
    setState(ok ? "copied" : "idle");
    setTimeout(() => setState("idle"), 2200);
  }

  return (
    <Button variant="secondary" onClick={handleShare} className="border-paper/30 px-7 py-4 text-sm text-paper hover:border-paper hover:bg-paper/10">
      {state === "copied" ? "LINK COPIED!" : state === "shared" ? "SHARED!" : "SHARE SHINY"}
    </Button>
  );
}

export default function Community() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="relative overflow-hidden bg-ink py-32 text-paper sm:py-40"
    >
      {/* glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_100%,rgba(217,164,65,0.14),transparent_70%)]"
      />

      <div className="container-x relative flex flex-col items-center text-center">
        <Reveal>
          <SectionTag tone="dark">Community</SectionTag>
        </Reveal>

        <Reveal delay={80}>
          <h2
            id="community-title"
            className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] uppercase"
          >
            Join the <em className="text-gold">Shiny Tribe</em>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-paper/65 sm:text-lg">
            “Every legend starts with a few people who decided to believe in
            the meme.”
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={config.twitterUrl} showSoon className="px-8 py-4 text-sm">
              FOLLOW X
            </Button>
            <Button
              href={config.telegramUrl}
              showSoon
              variant="secondary"
              className="border-paper/30 px-8 py-4 text-sm text-paper hover:border-paper hover:bg-paper/10"
            >
              JOIN TELEGRAM
            </Button>
            <ShareButton />
          </div>
        </Reveal>

        <Reveal delay={300}>
          <Link
            href="/economy"
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-7 py-4 text-sm font-semibold tracking-[0.14em] uppercase text-paper transition-all duration-300 hover:border-gold hover:bg-gold/20"
          >
            <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:scale-125">
              ✨
            </span>
            PLAY THE SHINY ECONOMY
          </Link>
          <p className="mt-3 text-xs tracking-[0.2em] text-paper/40 uppercase">
            Click. Grow. See the loop.
          </p>
        </Reveal>

        <Reveal delay={380}>
          <div className="mt-20 flex items-end gap-6">
            <Capybara
              animated={false}
              shadow={false}
              className="h-16 w-16 opacity-50 sm:h-20 sm:w-20"
            />
            <p className="display text-sm tracking-[0.4em] text-paper/50 uppercase sm:text-base">
              {config.microcopy.stayShiny}
            </p>
            <Capybara
              animated={false}
              shadow={false}
              className="h-16 w-16 -scale-x-100 opacity-50 sm:h-20 sm:w-20"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}