"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { config } from "@/data/config";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { shortAddress } from "@/lib/utils";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Gentle mouse-follow parallax on the character (disabled for reduced motion)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        section.style.setProperty("--mx", x.toFixed(3));
        section.style.setProperty("--my", y.toFixed(3));
      });
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      section.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden bg-paper"
    >
      {/* soft radial backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgba(217,164,65,0.10),transparent_70%),radial-gradient(50%_40%_at_20%_80%,rgba(194,84,46,0.06),transparent_70%)]"
      />

      <div className="container-x relative z-10 grid flex-1 items-center gap-10 pt-32 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pt-36">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div className="max-w-2xl">
          <p
            className="hero-in inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.3em] uppercase"
            style={{ "--hero-delay": "0ms" } as React.CSSProperties}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
            {config.chain} · MEME · LEGEND
          </p>

          <h1
            id="hero-title"
            className="hero-in display mt-6 text-[clamp(2.6rem,9vw,6.5rem)] uppercase"
            style={{ "--hero-delay": "120ms" } as React.CSSProperties}
          >
            Shiny
            <br />
            <em className="text-clay">Capibara</em>
          </h1>

          <p
            className="hero-in mt-4 text-sm font-semibold tracking-[0.42em] text-ink-soft uppercase sm:text-base"
            style={{ "--hero-delay": "240ms" } as React.CSSProperties}
          >
            The Albino Capybara
          </p>

          <p
            className="hero-in mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ "--hero-delay": "340ms" } as React.CSSProperties}
          >
            The internet&apos;s shiniest capybara. Calm. Rare. Completely
            unbothered. A character first, a token second — on {config.chain}.
          </p>

          {/* CTAs */}
          <div
            className="hero-in mt-9 flex flex-wrap items-center gap-3"
            style={{ "--hero-delay": "440ms" } as React.CSSProperties}
          >
            <Button href={config.buyUrl} showSoon className="px-8 py-4 text-sm">
              BUY {config.ticker}
            </Button>
            <Button href={config.twitterUrl} variant="secondary" showSoon className="px-7 py-4 text-sm">
              FOLLOW ON X
            </Button>
            <Button href={config.telegramUrl} variant="secondary" showSoon className="px-7 py-4 text-sm">
              JOIN TELEGRAM
            </Button>
          </div>

          {/* Contract */}
          <div
            className="hero-in mt-10 flex flex-wrap items-center gap-x-4 gap-y-3"
            style={{ "--hero-delay": "560ms" } as React.CSSProperties}
          >
            <span className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
              Contract
            </span>
            <code className="rounded-lg border border-ink/10 bg-cream px-3 py-2 font-mono text-xs text-ink-soft">
              {shortAddress(config.contractAddress, 8)}
            </code>
            <CopyButton text={config.contractAddress} inline />
          </div>
        </div>

        {/* ── The character ────────────────────────────────────── */}
        <div
          className="hero-in relative order-first mx-auto w-full max-w-[13rem] lg:order-last lg:max-w-md"
          style={{ "--hero-delay": "40ms" } as React.CSSProperties}
        >
          {/* parallax layer */}
          <div
            className="transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform:
                "translate(calc(var(--mx, 0) * 14px), calc(var(--my, 0) * 10px))",
            }}
          >
            <div className="relative">
              <Image
                src="/images/shiny-logo.jpg"
                alt="Shiny Capibara — the albino capybara"
                width={1179}
                height={1131}
                priority
                className="aspect-square w-full rounded-[2.5rem] object-cover shadow-[0_30px_60px_-20px_rgba(27,23,16,0.35)] ring-1 ring-ink/10"
              />
              {/* sparkle */}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="animate-sparkle absolute -top-4 -right-3 h-9 w-9 text-gold"
                fill="currentColor"
              >
                <path d="M12 0c.6 6.8 4.6 10.8 12 12-7.4 1.2-11.4 5.2-12 12-.6-6.8-4.6-10.8-12-12C7.4 10.8 11.4 6.8 12 0Z" />
              </svg>
            </div>
          </div>

          {/* floating caption */}
          <p className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold tracking-[0.4em] whitespace-nowrap text-ink-soft uppercase">
            {config.microcopy.keepCalm}
          </p>
        </div>
      </div>

      {/* scroll hint */}
      <div
        className="hero-in relative z-10 flex justify-center pb-6"
        style={{ "--hero-delay": "900ms" } as React.CSSProperties}
      >
        <a
          href="#manifesto"
          aria-label="Scroll to manifesto"
          className="flex h-10 w-6 items-start justify-center rounded-full border border-ink/20 p-1.5 transition-colors hover:border-ink"
        >
          <span className="h-2 w-1 animate-bounce rounded-full bg-ink/50" />
        </a>
      </div>
    </section>
  );
}