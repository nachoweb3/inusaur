"use client";

import { useState } from "react";
import { config } from "@/data/config";
import { assetUrl } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(config.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-pink/8 blur-[100px]" />
      </div>

      {/* Floating leaves (decorative) */}
      <div className="pointer-events-none absolute inset-0 -z-5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="leaf-fall absolute text-2xl"
            style={{
              left: `${15 + i * 15}%`,
              top: `-${10 + i * 5}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          >
            🍃
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className="hero-in mb-8" style={{ "--hero-delay": "0ms" } as React.CSSProperties}>
        <img
          src={assetUrl("/images/inusaur-main.jpg")}
          alt="Inusaur — the Shiba that evolved into something unexpected"
          width={400}
          height={400}
          className="mx-auto h-48 w-48 rounded-3xl object-cover shadow-2xl ring-4 ring-green/20 sm:h-64 sm:w-64 md:h-80 md:w-80"
        />
      </div>

      {/* Headline */}
      <h1
        className="hero-in display text-center text-6xl tracking-tight sm:text-8xl md:text-9xl"
        style={{ "--hero-delay": "120ms" } as React.CSSProperties}
      >
        INUSAUR
      </h1>

      {/* Subtitle */}
      <p
        className="hero-in mt-4 max-w-2xl text-center text-sm font-semibold tracking-[0.25em] text-ink-soft uppercase sm:text-base"
        style={{ "--hero-delay": "240ms" } as React.CSSProperties}
      >
        THE SHIBA THAT EVOLVED INTO SOMETHING UNEXPECTED.
      </p>

      {/* Ticker */}
      <p
        className="hero-in mt-3 text-3xl font-bold tracking-wider text-green sm:text-4xl"
        style={{ "--hero-delay": "360ms" } as React.CSSProperties}
      >
        {config.ticker}
      </p>

      {/* CTAs */}
      <div
        className="hero-in mt-8 flex flex-wrap items-center justify-center gap-4"
        style={{ "--hero-delay": "480ms" } as React.CSSProperties}
      >
        <Button href={config.buyUrl} showSoon className="px-8 py-4 text-sm">
          BUY {config.ticker}
        </Button>
        <Button href="#game" variant="secondary" className="px-8 py-4 text-sm">
          PLAY INUSAUR
        </Button>
        <Button href="#community" variant="secondary" className="px-8 py-4 text-sm">
          JOIN THE COMMUNITY
        </Button>
      </div>

      {/* Contract address */}
      <div
        className="hero-in mt-8 flex items-center gap-3 rounded-full border border-ink/15 bg-cream/80 px-5 py-2.5 backdrop-blur-sm"
        style={{ "--hero-delay": "600ms" } as React.CSSProperties}
      >
        <span className="text-xs font-semibold tracking-widest text-ink-faint uppercase">
          CONTRACT
        </span>
        <code className="text-xs font-mono text-ink/70">
          {config.contractAddress.slice(0, 6)}…{config.contractAddress.slice(-4)}
        </code>
        <button
          type="button"
          onClick={copyAddress}
          className="rounded-full bg-ink px-3 py-1 text-[0.65rem] font-bold tracking-widest text-paper uppercase transition-colors hover:bg-green"
        >
          {copied ? "COPIED ✓" : "COPY"}
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="hero-in mt-12 animate-float" style={{ "--hero-delay": "800ms" } as React.CSSProperties}>
        <span className="text-xs tracking-[0.3em] text-ink-faint uppercase">
          SCROLL DOWN
        </span>
      </div>
    </section>
  );
}