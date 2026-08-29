"use client";

import { useEffect, useState } from "react";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";

/**
 * LIVE TOKEN STATS — real market data for the contract in `config`.
 *
 * No invented numbers, ever: while DexScreener has no pair for the token
 * the component renders an honest "awaiting data" state. Once the pair is
 * live it refreshes every 60s. Fetches DexScreener directly from the
 * browser (their public API allows CORS), so the site stays fully static
 * and works on GitHub Pages.
 */

type TokenStatsData = {
  live: boolean;
  priceUsd: number | null;
  change24h: number | null;
  marketCap: number | null;
  fdv: number | null;
  volume24h: number | null;
  liquidity: number | null;
  pairUrl?: string;
  dexId?: string;
  updatedAt?: number;
};

const EMPTY: TokenStatsData = {
  live: false,
  priceUsd: null,
  change24h: null,
  marketCap: null,
  fdv: null,
  volume24h: null,
  liquidity: null,
};

type DexPair = {
  url?: string;
  priceUsd?: string;
  marketCap?: string;
  fdv?: string;
  liquidity?: { usd?: string };
  volume?: { h24?: string };
  priceChange?: { h24?: string };
  dexId?: string;
};

const fmtUsd = (n: number) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toPrecision(4)}`;
};

const fmtPrice = (n: number) => {
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n >= 0.01) return `$${n.toFixed(5)}`;
  return `$${n.toPrecision(3)}`;
};

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-deep/60 p-4">
      <dt className="text-[0.6rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
        {label}
      </dt>
      <dd className={cn("display mt-1 text-lg sm:text-xl", accent)}>{value}</dd>
    </div>
  );
}

export default function TokenStats() {
  const [data, setData] = useState<TokenStatsData | null>(null);
  const [status, setStatus] = useState<"loading" | "live" | "empty">("loading");

  useEffect(() => {
    let alive = true;

    // Shape the DexScreener response into what the component needs.
    const parse = (json: unknown): TokenStatsData => {
      const pairs = (json as { pairs?: DexPair[] })?.pairs ?? [];
      const pool = [...pairs]
        .sort(
          (a, b) =>
            (parseFloat(b.liquidity?.usd ?? "0") || 0) -
            (parseFloat(a.liquidity?.usd ?? "0") || 0),
        )[0];
      if (!pool?.priceUsd) return EMPTY;
      const num = (v: string | undefined) => {
        const n = parseFloat(v ?? "");
        return Number.isFinite(n) ? n : null;
      };
      return {
        live: true,
        priceUsd: num(pool.priceUsd),
        change24h: num(pool.priceChange?.h24),
        marketCap: num(pool.marketCap),
        fdv: num(pool.fdv),
        volume24h: num(pool.volume?.h24),
        liquidity: num(pool.liquidity?.usd),
        pairUrl: pool.url,
        dexId: pool.dexId,
        updatedAt: Date.now(),
      };
    };

    const load = async () => {
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${config.contractAddress}`,
        );
        if (!res.ok) throw new Error(`http ${res.status}`);
        const json = parse(await res.json());
        if (!alive) return;
        setData(json);
        setStatus(json.live ? "live" : "empty");
      } catch {
        if (!alive) return;
        setData(null);
        setStatus("empty");
      }
    };

    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  /* ── Offline state — honest, no fake numbers ─────────────────── */
  if (status !== "live" || !data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-ink/20 bg-paper-deep/40 px-6 py-10 text-center">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-clay/60"
        />
        <p className="text-[0.7rem] font-semibold tracking-[0.28em] text-ink-soft uppercase">
          Live market data
        </p>
        <p className="max-w-md text-sm leading-relaxed text-ink-faint">
          {status === "loading"
            ? "Checking the chain… this updates automatically."
            : "The pair isn't visible on-chain yet. Real price, volume and market cap will appear here as soon as " +
              config.ticker +
              " is tradeable."}
        </p>
        <a
          href={config.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold tracking-[0.2em] text-clay uppercase transition-colors hover:text-ink"
        >
          Track on pump.fun →
        </a>
      </div>
    );
  }

  const up = (data.change24h ?? 0) >= 0;

  return (
    <div className="rounded-3xl border border-ink/10 bg-cream p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper-deep/60 px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.28em] text-ink-soft uppercase">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
          </span>
          Live · {data.dexId ?? "DexScreener"}
        </p>
        {data.pairUrl && (
          <a
            href={data.pairUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold tracking-[0.2em] text-clay uppercase transition-colors hover:text-ink"
          >
            Open chart →
          </a>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-paper-deep/60 p-4 lg:col-span-1">
          <dt className="text-[0.6rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
            Price
          </dt>
          <dd className="display mt-1 text-xl sm:text-2xl">
            {fmtPrice(data.priceUsd ?? 0)}
          </dd>
        </div>
        <Stat
          label="24H"
          value={`${up ? "+" : ""}${(data.change24h ?? 0).toFixed(2)}%`}
          accent={up ? "text-moss" : "text-clay"}
        />
        <Stat label="Market Cap" value={fmtUsd(data.marketCap ?? 0)} />
        <Stat label="Volume 24H" value={fmtUsd(data.volume24h ?? 0)} />
      </dl>

      {data.liquidity != null && (
        <p className="mt-4 text-xs text-ink-faint">
          Liquidity ≈ {fmtUsd(data.liquidity)} ·{" "}
          {data.updatedAt
            ? `refreshed ${new Date(data.updatedAt).toLocaleTimeString()}`
            : "real-time from DexScreener"}
        </p>
      )}
    </div>
  );
}