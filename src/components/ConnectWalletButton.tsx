"use client";

import { useEffect, useRef, useState } from "react";
import {
  WALLET_META,
  shorten,
  useWallet,
  type WalletId,
} from "@/lib/wallet";
import { config } from "@/data/config";
import { cn } from "@/lib/utils";

const EXPLORER_ADDRESS = (addr: string) =>
  `https://solscan.io/account/${addr}`;

export default function ConnectWalletButton({ className }: { className?: string }) {
  const {
    address,
    walletId,
    connecting,
    refreshing,
    balances,
    installed,
    connect,
    disconnect,
    refresh,
  } = useWallet();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click / Escape. */
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const fmt = (v: number | null, digits = 4) =>
    v === null ? "—" : v.toLocaleString("en-US", { maximumFractionDigits: digits });

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase select-none transition-colors";

  /* ── Disconnected: pick a wallet ─────────────────────────────── */
  if (!address) {
    const anyInstalled = installed.length > 0;
    return (
      <div ref={rootRef} className={cn("relative", className)}>
        <button
          type="button"
          className={cn(base, "border border-ink bg-ink text-paper hover:bg-clay hover:border-clay")}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {connecting ? "CONNECTING…" : "CONNECT WALLET"}
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-[80] mt-2 w-64 rounded-2xl border border-ink/15 bg-cream p-2 shadow-xl"
          >
            {(Object.keys(WALLET_META) as WalletId[]).map((id) => {
              const meta = WALLET_META[id];
              const isInstalled = installed.includes(id);
              return (
                <a
                  key={id}
                  role="menuitem"
                  href={isInstalled ? undefined : meta.installUrl}
                  target={isInstalled ? undefined : "_blank"}
                  rel="noreferrer"
                  onClick={() => {
                    if (isInstalled) {
                      setMenuOpen(false);
                      void connect(id);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isInstalled
                      ? "cursor-pointer hover:bg-ink/5"
                      : "text-ink-faint",
                  )}
                >
                  <span className="font-semibold">{meta.name}</span>
                  <span className="text-[0.65rem] tracking-widest uppercase">
                    {isInstalled
                      ? (connecting ? "…" : "CONNECT")
                      : "INSTALL ↗"}
                  </span>
                </a>
              );
            })}
            <p className="px-3 pb-1 pt-2 text-[0.65rem] leading-relaxed text-ink-faint">
              {config.ticker} lives on {config.chain}. Connecting only reads your
              public address — no transactions without your approval.
            </p>
          </div>
        )}
      </div>
    );
  }

  /* ── Connected: address + balances menu ──────────────────────── */
  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          base,
          "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink/5",
        )}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            refreshing ? "animate-pulse bg-gold" : "bg-moss",
          )}
          aria-hidden
        />
        {shorten(address)}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[80] mt-2 w-72 rounded-2xl border border-ink/15 bg-cream p-3 shadow-xl"
        >
          <p className="px-1 pb-2 text-[0.65rem] tracking-[0.2em] text-ink-faint uppercase">
            {walletId ? WALLET_META[walletId].name : "Wallet"} · connected
          </p>

          <dl className="space-y-1.5 rounded-xl bg-paper px-3 py-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink-soft">SOL</dt>
              <dd className="font-semibold">{fmt(balances.sol)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-soft">{config.ticker}</dt>
              <dd className="font-semibold">{fmt(balances.sbara, 2)}</dd>
            </div>
          </dl>

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => void copyAddress()}
              className="rounded-xl border border-ink/15 px-3 py-2 text-[0.7rem] font-semibold tracking-widest uppercase transition-colors hover:bg-ink/5"
            >
              {copied ? "COPIED ✓" : "COPY ADDR"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                void refresh();
              }}
              className="rounded-xl border border-ink/15 px-3 py-2 text-[0.7rem] font-semibold tracking-widest uppercase transition-colors hover:bg-ink/5"
            >
              {refreshing ? "…" : "REFRESH"}
            </button>
          </div>

          <div className="mt-1.5 grid gap-1.5">
            <a
              href={EXPLORER_ADDRESS(address)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-ink/15 px-3 py-2 text-center text-[0.7rem] font-semibold tracking-widest uppercase transition-colors hover:bg-ink/5"
            >
              SOLSCAN ↗
            </a>
            <a
              href={`https://jup.ag/swap/SOL-${config.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-ink px-3 py-2 text-center text-[0.7rem] font-semibold tracking-widest text-paper uppercase transition-colors hover:bg-clay"
            >
              BUY {config.ticker} ↗
            </a>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                disconnect();
              }}
              className="rounded-xl px-3 py-2 text-[0.7rem] font-semibold tracking-widest text-clay uppercase transition-colors hover:bg-clay/10"
            >
              DISCONNECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
