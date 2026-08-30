"use client";

import { useState } from "react";
import { config, isPlaceholder } from "@/data/config";
import Reveal from "@/components/ui/Reveal";

export default function Token() {
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
    <section id="token" className="py-24 sm:py-32">
      <div className="container-x">
        {/* Section header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              THE TOKEN
            </p>
            <h2 className="display text-4xl tracking-tight sm:text-6xl">
              {config.ticker}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              The official token of the Inusaur universe. One creature, one ticker, one tribe.
            </p>
          </div>
        </Reveal>

        {/* Launch Terminal */}
        <Reveal delay={100}>
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-green/20 bg-ink">
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-green/10 px-6 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-clay/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-gold/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green/60" />
              <span className="ml-4 font-mono text-[0.6rem] tracking-widest text-green/40 uppercase">
                LAUNCH TERMINAL
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-6 sm:p-8">
              {/* Ticker display */}
              <div className="mb-6 text-center">
                <p className="font-mono text-4xl font-bold tracking-wider text-green">
                  {config.ticker}
                </p>
                <p className="mt-1 font-mono text-xs tracking-[0.3em] text-green/40 uppercase">
                  {config.chain}
                </p>
              </div>

              {/* Status grid */}
              <div className="mb-6 grid grid-cols-2 gap-px rounded-xl border border-green/10 overflow-hidden">
                {[
                  { label: "CHAIN", value: config.chain },
                  { label: "SUPPLY", value: config.totalSupply ?? "TBA" },
                  {
                    label: "STATUS",
                    value: caAvailable ? "LIVE" : "AWAITING LAUNCH",
                    highlight: caAvailable,
                  },
                  { label: "TICKER", value: config.ticker },
                ].map((item) => (
                  <div key={item.label} className="bg-ink/50 px-4 py-3">
                    <p className="font-mono text-[0.55rem] tracking-[0.2em] text-green/30 uppercase">
                      {item.label}
                    </p>
                    <p
                      className={`mt-1 font-mono text-xs font-bold tracking-wide ${
                        item.highlight ? "text-green" : "text-green/60"
                      }`}
                    >
                      {item.value}
                      {item.highlight && (
                        <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contract address */}
              <div className="mb-6 rounded-xl border border-green/10 bg-ink/30 p-4">
                <p className="mb-2 font-mono text-[0.55rem] tracking-[0.2em] text-green/30 uppercase">
                  $SAUR CONTRACT
                </p>
                {caAvailable ? (
                  <div className="flex items-center gap-3">
                    <code className="flex-1 truncate font-mono text-xs text-green/70">
                      {config.contractAddress}
                    </code>
                    <button
                      type="button"
                      onClick={copyAddress}
                      className="shrink-0 rounded-lg border border-green/20 px-3 py-1.5 font-mono text-[0.6rem] font-bold tracking-widest text-green uppercase transition-all hover:border-green/40 hover:bg-green/10"
                    >
                      {copied ? "COPIED ✓" : "COPY CA"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <code className="flex-1 font-mono text-xs text-green/30">
                      0x????????????????????????????????
                    </code>
                    <span className="shrink-0 rounded-lg border border-pink/20 px-3 py-1.5 font-mono text-[0.6rem] font-bold tracking-widest text-pink/60 uppercase">
                      AWAITING GENESIS
                    </span>
                  </div>
                )}
              </div>

              {/* Pump.fun status */}
              <div className="mb-6 rounded-xl border border-green/10 bg-ink/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs font-bold tracking-widest text-green uppercase">
                      PUMPFUN
                    </p>
                    <p className="mt-0.5 font-mono text-[0.55rem] tracking-widest text-green/30 uppercase">
                      {isPlaceholder(config.buyUrl)
                        ? config.microcopy.launchPending
                        : "LIVE"}
                    </p>
                  </div>
                  {isPlaceholder(config.buyUrl) ? (
                    <span className="flex items-center gap-2 rounded-lg border border-pink/20 px-4 py-2 font-mono text-[0.6rem] font-bold tracking-widest text-pink/60 uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-pink/40 animate-pulse" />
                      SOON
                    </span>
                  ) : (
                    <a
                      href={config.buyUrl!}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-green px-4 py-2 font-mono text-[0.6rem] font-bold tracking-widest text-paper uppercase transition-all hover:bg-moss hover:shadow-[0_0_20px_rgba(74,138,74,0.4)]"
                    >
                      BUY NOW →
                    </a>
                  )}
                </div>
              </div>

              {/* Tools */}
              <div className="flex flex-wrap justify-center gap-2">
                {config.tools.map((tool) =>
                  tool.url ? (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-green/10 px-3 py-1.5 font-mono text-[0.55rem] font-semibold tracking-widest text-green/40 uppercase transition-all hover:border-green/30 hover:text-green"
                    >
                      {tool.name} ↗
                    </a>
                  ) : (
                    <span
                      key={tool.name}
                      className="rounded-lg border border-green/5 px-3 py-1.5 font-mono text-[0.55rem] font-semibold tracking-widest text-green/20 uppercase"
                    >
                      {tool.name} — SOON
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}