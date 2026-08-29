"use client";

import { useState } from "react";
import { config } from "@/data/config";

import Reveal from "@/components/ui/Reveal";

export default function Token() {
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

        {/* Token card */}
        <Reveal delay={100}>
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-ink/10 bg-cream">
            {/* Header */}
            <div className="border-b border-ink/10 bg-green/5 px-8 py-6 text-center">
              <p className="display text-4xl tracking-tight">{config.ticker}</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-ink-faint uppercase">
                {config.chain}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-4">
              {[
                { label: "CHAIN", value: config.chain },
                { label: "SUPPLY", value: config.totalSupply ?? "TBA" },
                { label: "STATUS", value: "LIVE" },
                { label: "TICKER", value: config.ticker },
              ].map((item) => (
                <div key={item.label} className="bg-cream px-6 py-4 text-center">
                  <p className="text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-bold tracking-wide text-ink">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Contract address */}
            <div className="border-t border-ink/10 px-8 py-6">
              <p className="mb-2 text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
                CONTRACT ADDRESS
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 truncate font-mono text-xs text-ink/70">
                  {config.contractAddress}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="shrink-0 rounded-full bg-ink px-4 py-2 text-[0.65rem] font-bold tracking-widest text-paper uppercase transition-colors hover:bg-green"
                >
                  {copied ? "COPIED ✓" : "COPY"}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-ink/10 px-8 py-6">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={config.buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-green px-4 py-3 text-center text-xs font-bold tracking-widest text-paper uppercase transition-colors hover:bg-moss"
                >
                  BUY {config.ticker} ↗
                </a>
                <a
                  href={config.tools[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-ink/20 px-4 py-3 text-center text-xs font-bold tracking-widest text-ink uppercase transition-colors hover:border-ink hover:bg-ink/5"
                >
                  VIEW CHART ↗
                </a>
              </div>
            </div>

            {/* Tools */}
            <div className="border-t border-ink/10 px-8 py-4">
              <div className="flex flex-wrap justify-center gap-3">
                {config.tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-ink/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase transition-colors hover:border-ink/30 hover:text-ink"
                  >
                    {tool.name} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}