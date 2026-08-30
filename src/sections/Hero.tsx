"use client";

import { useState } from "react";
import { config, isPlaceholder } from "@/data/config";
import { assetUrl } from "@/lib/utils";

function PremiumButton({
  href,
  children,
  variant = "primary",
  soon = false,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  soon?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase select-none transition-all duration-300 overflow-hidden";

  const variants = {
    primary:
      "bg-green text-paper hover:bg-moss hover:shadow-[0_0_30px_rgba(74,138,74,0.4)] active:scale-95",
    secondary:
      "border border-ink/20 bg-transparent text-ink hover:border-green hover:bg-green/5 hover:shadow-[0_0_20px_rgba(74,138,74,0.2)] active:scale-95",
    ghost:
      "text-ink-faint hover:text-ink hover:bg-ink/5",
  };

  const soonClass = soon
    ? "opacity-60 cursor-default pointer-events-none"
    : "";

  if (soon) {
    return (
      <span className={`${base} ${variants[variant]} ${soonClass}`}>
        {children}
        <span className="ml-2 inline-flex items-center gap-1 text-[0.55rem] tracking-widest text-pink">
          <span className="h-1 w-1 rounded-full bg-pink animate-pulse" />
          SOON
        </span>
      </span>
    );
  }

  if (href && href !== "#") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${variants[variant]}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && (
          <span className="absolute inset-0 bg-green/10 animate-pulse" />
        )}
        <span className="relative">{children}</span>
        <span className="relative text-sm">→</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {hover && (
        <span className="absolute inset-0 bg-green/10 animate-pulse" />
      )}
      <span className="relative">{children}</span>
      <span className="relative text-sm">→</span>
    </button>
  );
}

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const caAvailable = !isPlaceholder(config.contractAddress);

  const copyAddress = async () => {
    if (!caAvailable) return;
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

      {/* Floating leaves */}
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
        <div className="relative">
          <img
            src={assetUrl("/images/inusaur-main.jpg")}
            alt="Inusaur — the Shiba that evolved into something unexpected"
            width={400}
            height={400}
            className="mx-auto h-48 w-48 rounded-3xl object-cover shadow-2xl ring-4 ring-green/20 sm:h-64 sm:w-64 md:h-80 md:w-80"
          />
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-3xl ring-4 ring-green/30 animate-pulse" />
        </div>
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

      {/* Launch status */}
      <div
        className="hero-in mt-4 flex items-center gap-2 rounded-full border border-green/20 bg-ink/5 px-4 py-2"
        style={{ "--hero-delay": "400ms" } as React.CSSProperties}
      >
        <span className="h-2 w-2 rounded-full bg-pink animate-pulse" />
        <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-ink-faint uppercase">
          EVOLUTION STATUS: {config.microcopy.evolutionInProgress}
        </span>
      </div>

      {/* CTAs */}
      <div
        className="hero-in mt-8 flex flex-wrap items-center justify-center gap-4"
        style={{ "--hero-delay": "480ms" } as React.CSSProperties}
      >
        <PremiumButton
          href={isPlaceholder(config.buyUrl) ? undefined : config.buyUrl!}
          soon={isPlaceholder(config.buyUrl)}
        >
          {isPlaceholder(config.buyUrl)
            ? config.microcopy.awaitingGenesis
            : `BUY ${config.ticker}`}
        </PremiumButton>
        <PremiumButton href="#game" variant="secondary">
          PLAY INUSAUR
        </PremiumButton>
        <PremiumButton href="#community" variant="ghost">
          JOIN THE COMMUNITY
        </PremiumButton>
      </div>

      {/* Contract address */}
      <div
        className="hero-in mt-8 flex items-center gap-3 rounded-full border border-ink/15 bg-cream/80 px-5 py-2.5 backdrop-blur-sm"
        style={{ "--hero-delay": "600ms" } as React.CSSProperties}
      >
        <span className="text-xs font-semibold tracking-widest text-ink-faint uppercase">
          CA
        </span>
        {caAvailable ? (
          <>
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
          </>
        ) : (
          <span className="text-xs font-mono tracking-widest text-ink-faint uppercase">
            {config.microcopy.awaitingGenesis}
            <span className="ml-2 inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-pink animate-pulse" />
            </span>
          </span>
        )}
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