"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Capybara from "@/components/Capybara";
import { config } from "@/data/config";
import { cn, copyToClipboard } from "@/lib/utils";

/* ── Game state ─────────────────────────────────────────────────── */

type State = {
  shine: number;
  tribe: number;
  memes: number;
  sbara: number;
  spotlight: number; // +shine per click
  memeMachine: number; // +memes per second
  legend: number; // +10% production per level
  totalClicks: number;
  totalMemes: number;
  totalSbara: number;
  questsDone: string[];
};

const SAVE_KEY = "shiny-economy-v1";

const initial: State = {
  shine: 0,
  tribe: 0,
  memes: 0,
  sbara: 0,
  spotlight: 0,
  memeMachine: 0,
  legend: 0,
  totalClicks: 0,
  totalMemes: 0,
  totalSbara: 0,
  questsDone: [],
};

function load(): State {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

/* ── Costs & formatting ─────────────────────────────────────────── */

const tribeCost = (t: number) => Math.floor(10 * Math.pow(1.35, t));
const spotlightCost = (l: number) => Math.floor(5 * Math.pow(2.2, l));
const memeCost = (l: number) => Math.floor(10 * Math.pow(2.1, l));
const legendCost = (l: number) => Math.floor(25 * Math.pow(3, l));

/* ── Quests ─────────────────────────────────────────────────────── */

type Quest = {
  id: string;
  name: string;
  hint: string;
  reward: number;
  progress: (s: State) => number; // 0..1+
  ready: (s: State) => boolean;
};

const QUESTS: Quest[] = [
  {
    id: "first-light",
    name: "FIRST LIGHT",
    hint: "Click the capybara 25 times",
    reward: 25,
    progress: (s) => s.totalClicks / 25,
    ready: (s) => s.totalClicks >= 25,
  },
  {
    id: "tribe-of-ten",
    name: "TRIBE OF TEN",
    hint: "Grow the tribe to 10 members",
    reward: 250,
    progress: (s) => s.tribe / 10,
    ready: (s) => s.tribe >= 10,
  },
  {
    id: "meme-press",
    name: "MEME PRESS",
    hint: "Mint 1,000 memes in total",
    reward: 1000,
    progress: (s) => s.totalMemes / 1000,
    ready: (s) => s.totalMemes >= 1000,
  },
  {
    id: "bag-holder",
    name: "BAG HOLDER",
    hint: `Earn 500 ${config.ticker} in total`,
    reward: 2500,
    progress: (s) => s.totalSbara / 500,
    ready: (s) => s.totalSbara >= 500,
  },
  {
    id: "legend-status",
    name: "LEGEND STATUS",
    hint: "Reach LEGEND Lv 3",
    reward: 15000,
    progress: (s) => s.legend / 3,
    ready: (s) => s.legend >= 3,
  },
];

/* ── Local leaderboard ─────────────────────────────────────────── */

type LeaderEntry = {
  name: string;
  sbara: number;
  memes: number;
  clicks: number;
  at: number;
};

const LEADER_KEY = "shiny-economy-leaderboard-v1";

function loadLeaderboard(): LeaderEntry[] {
  try {
    const raw = localStorage.getItem(LEADER_KEY);
    const parsed = raw ? (JSON.parse(raw) as LeaderEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const fmt = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.floor(n).toString();
};
const fmtRate = (n: number) => (n < 10 ? n.toFixed(1) : fmt(n));

type Particle = { id: number; x: number; y: number; text: string };

/* ── Component ──────────────────────────────────────────────────── */

export default function ShinyEconomyGame() {
  const [state, setState] = useState<State>(initial);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [name, setName] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [shared, setShared] = useState(false);

  // Mounted flag via useSyncExternalStore: flips to true after hydration
  // without calling setState inside an effect.
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const capRef = useRef<HTMLButtonElement | null>(null);
  const idRef = useRef(0);

  // Keep a ref in sync for the autosave interval (no render access)
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load save once mounted (avoids hydration mismatch: the server renders
  // `initial`, then we hydrate real progress from localStorage on the client.
  // This is the documented React pattern for external storage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(load());
    setLeaderboard(loadLeaderboard());
  }, []);

  // Passive production — the loop: tribe → shine/memes → $SBARA
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      setState((s) => {
        const mult = 1 + s.legend * 0.1;
        const dt = 0.1;
        const memesGain = (s.tribe * 0.1 + s.memeMachine) * mult;
        return {
          ...s,
          shine: s.shine + s.tribe * 0.5 * mult * dt,
          memes: s.memes + memesGain * dt,
          sbara: s.sbara + s.memes * 0.2 * mult * dt,
          totalMemes: s.totalMemes + memesGain * dt,
          totalSbara: s.totalSbara + s.memes * 0.2 * mult * dt,
        };
      });
    }, 100);
    return () => clearInterval(id);
  }, [mounted]);

  // Autosave
  useEffect(() => {
    if (!mounted) return;
    const save = () => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
      } catch {
        /* storage unavailable */
      }
    };
    const id = setInterval(save, 5000);
    window.addEventListener("beforeunload", save);
    return () => {
      clearInterval(id);
      window.removeEventListener("beforeunload", save);
    };
  }, [mounted]);

  /* ── Actions ─────────────────────────────────────────────────── */

  const handleClick = (e: React.PointerEvent<HTMLButtonElement>) => {
    const gain = 1 + state.spotlight;
    setState((s) => ({ ...s, shine: s.shine + gain, totalClicks: s.totalClicks + 1 }));

    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++idRef.current;
    setParticles((p) => [
      ...p.slice(-18),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, text: `+${fmt(gain)}` },
    ]);
    setTimeout(() => setParticles((p) => p.filter((q) => q.id !== id)), 900);

    const el = capRef.current;
    if (el) {
      el.classList.remove("cap-pop");
      void el.offsetWidth;
      el.classList.add("cap-pop");
    }
  };

  const buyTribe = () => {
    const c = tribeCost(state.tribe);
    if (state.shine < c) return;
    setState((s) => ({ ...s, shine: s.shine - c, tribe: s.tribe + 1 }));
  };
  const buySpotlight = () => {
    const c = spotlightCost(state.spotlight);
    if (state.sbara < c) return;
    setState((s) => ({ ...s, sbara: s.sbara - c, spotlight: s.spotlight + 1 }));
  };
  const buyMeme = () => {
    const c = memeCost(state.memeMachine);
    if (state.sbara < c) return;
    setState((s) => ({ ...s, sbara: s.sbara - c, memeMachine: s.memeMachine + 1 }));
  };
  const buyLegend = () => {
    const c = legendCost(state.legend);
    if (state.sbara < c) return;
    setState((s) => ({ ...s, sbara: s.sbara - c, legend: s.legend + 1 }));
  };
  const reset = () => {
    setState(initial);
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
    setConfirmReset(false);
  };

  const claimQuest = (id: string) => {
    const quest = QUESTS.find((q) => q.id === id);
    if (!quest || state.questsDone.includes(id) || !quest.ready(state)) return;
    setState((s) => ({
      ...s,
      sbara: s.sbara + quest.reward,
      questsDone: [...s.questsDone, id],
    }));
  };

  const saveToLeaderboard = () => {
    if (state.totalSbara <= 0) return;
    const entry: LeaderEntry = {
      name: name.trim() || "CAPYBARA FAN",
      sbara: state.totalSbara,
      memes: state.totalMemes,
      clicks: state.totalClicks,
      at: Date.now(),
    };
    const next = [...leaderboard, entry]
      .sort((a, b) => b.sbara - a.sbara)
      .slice(0, 5);
    setLeaderboard(next);
    try {
      localStorage.setItem(LEADER_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const shareStats = async () => {
    const text = `✨ Shiny Economy report — I've grown the tribe to ${fmt(
      state.tribe,
    )} members, minted ${fmt(state.memes)} memes and earned ${fmt(
      state.sbara,
    )} ${config.ticker}. Can you outshine me? ${config.websiteUrl}/economy — ${config.microcopy.stayShiny}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: config.projectName, text });
        setShared(true);
        setTimeout(() => setShared(false), 2200);
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    const ok = await copyToClipboard(text);
    setShared(ok);
    setTimeout(() => setShared(false), 2200);
  };

  /* ── Derived ─────────────────────────────────────────────────── */

  const mult = 1 + state.legend * 0.1;
  const shinePerSec = state.tribe * 0.5 * mult;
  const memesPerSec = (state.tribe * 0.1 + state.memeMachine) * mult;
  const sbaraPerSec = state.memes * 0.2 * mult;
  const shinePerClick = 1 + state.spotlight;

  const stats = [
    { label: "SHINE", value: fmt(state.shine), rate: `+${fmtRate(shinePerSec)}/s`, accent: "text-gold" },
    { label: "TRIBE", value: fmt(state.tribe), rate: `${fmtRate(memesPerSec)} memes/s`, accent: "text-clay" },
    { label: "MEMES", value: fmt(state.memes), rate: `→ ${fmtRate(sbaraPerSec)} $/s`, accent: "text-moss" },
    { label: config.ticker, value: fmt(state.sbara), rate: `+${fmt(shinePerClick)}/click`, accent: "text-ink" },
  ];

  const shop = [
    {
      name: "TRIBE GATHERING",
      tag: "GROW",
      icon: "🐾",
      desc: "+1 capybara joins. Every member shines +0.5/s and creates memes.",
      cost: tribeCost(state.tribe),
      currency: "shine",
      level: state.tribe,
      can: state.shine >= tribeCost(state.tribe),
      onClick: buyTribe,
    },
    {
      name: "SHINY SPOTLIGHT",
      tag: "SHARE",
      icon: "✨",
      desc: "+1 shine per click. The internet keeps finding you.",
      cost: spotlightCost(state.spotlight),
      currency: config.ticker,
      level: state.spotlight,
      can: state.sbara >= spotlightCost(state.spotlight),
      onClick: buySpotlight,
    },
    {
      name: "MEME MACHINE",
      tag: "CREATE",
      icon: "🖼️",
      desc: "+1 meme per second. Memes turn into $SBARA.",
      cost: memeCost(state.memeMachine),
      currency: config.ticker,
      level: state.memeMachine,
      can: state.sbara >= memeCost(state.memeMachine),
      onClick: buyMeme,
    },
    {
      name: "LEGEND STATUS",
      tag: "EARN",
      icon: "👑",
      desc: "+10% to all production. Calm is exponential.",
      cost: legendCost(state.legend),
      currency: config.ticker,
      level: state.legend,
      can: state.sbara >= legendCost(state.legend),
      onClick: buyLegend,
    },
  ];

  const achievements = [
    { label: "FIRST LIGHT", done: state.totalClicks >= 1 },
    { label: "TRIBE OF ONE", done: state.tribe >= 1 },
    { label: "MEME LORD", done: state.totalMemes >= 100 },
    { label: "TOKEN HOLDER", done: state.totalSbara >= 50 },
    { label: "THE LEGEND", done: state.legend >= 1 },
  ];

  const questList = QUESTS.map((q) => ({
    ...q,
    done: state.questsDone.includes(q.id),
    pct: Math.min(1, q.progress(state)),
  }));

  /* ── Render ──────────────────────────────────────────────────── */

  return (
    <section aria-labelledby="economy-title" className="relative overflow-hidden bg-paper pt-32 pb-24 sm:pt-36">
      <div className="container-x">
        {/* Header */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
            INTERACTIVE · PLAYFUL · NOT FINANCIAL ADVICE
          </p>
          <h1
            id="economy-title"
            className="display mt-6 text-[clamp(2.6rem,7vw,5.5rem)] uppercase"
          >
            The Shiny <em className="text-clay">Economy</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Click the capybara. Grow the tribe. Mint memes, earn {config.ticker},
            and watch a circular economy spin — a playful projection of where
            the shine could go.
          </p>
        </div>

        {/* Game board */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {/* Clicker */}
          <div className="flex flex-col items-center justify-center rounded-3xl border border-ink/10 bg-cream p-8 shadow-[0_24px_60px_-30px_rgba(27,23,16,0.25)]">
            <button
              ref={capRef}
              type="button"
              onClick={handleClick}
              aria-label={`Shine — click the capybara to earn shine (+${fmt(shinePerClick)})`}
              className="group relative w-full max-w-xs touch-manipulation cursor-pointer select-none rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(217,164,65,0.14),transparent_75%)] p-6 outline-none focus-visible:ring-2 focus-visible:ring-clay"
            >
              <Capybara sparkle className="w-full transition-transform duration-300 group-hover:scale-[1.02]" />
              <span
                aria-hidden="true"
                className="display pointer-events-none absolute inset-x-0 -bottom-1 text-center text-[0.65rem] tracking-[0.4em] text-ink-faint uppercase"
              >
                Tap to shine
              </span>
              {/* particles */}
              {particles.map((p) => (
                <span
                  key={p.id}
                  aria-hidden="true"
                  className="shine-particle pointer-events-none absolute z-10 text-sm font-bold text-clay"
                  style={{ left: p.x, top: p.y }}
                >
                  {p.text}
                </span>
              ))}
            </button>
            <p className="mt-6 text-xs tracking-[0.2em] text-ink-faint uppercase">
              {state.totalClicks} clicks · progress saves on this device
            </p>
          </div>

          {/* Stats + shop */}
          <div className="flex flex-col gap-6">
            {/* Stats */}
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-ink/10 bg-paper-deep/60 p-4"
                >
                  <dt className="text-[0.6rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                    {s.label}
                  </dt>
                  <dd className={cn("display mt-1 text-2xl", s.accent)}>{s.value}</dd>
                  <dd className="mt-0.5 text-[0.65rem] font-medium text-ink-soft">{s.rate}</dd>
                </div>
              ))}
            </dl>

            {/* Shop */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-[0.7rem] font-semibold tracking-[0.26em] text-ink-soft uppercase">
                  Spend {config.ticker} to feed the loop
                </h2>
                <button
                  type="button"
                  onClick={() => (confirmReset ? reset() : setConfirmReset(true))}
                  onBlur={() => setConfirmReset(false)}
                  className="text-[0.65rem] font-semibold tracking-[0.2em] text-ink-faint uppercase transition-colors hover:text-clay"
                >
                  {confirmReset ? "SURE?" : "RESET"}
                </button>
              </div>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {shop.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={item.onClick}
                      disabled={!item.can}
                      aria-label={`${item.name} — costs ${fmt(item.cost)} ${item.currency}`}
                      className={cn(
                        "flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-all duration-300",
                        item.can
                          ? "cursor-pointer border-ink/15 bg-cream hover:-translate-y-0.5 hover:border-clay/50 hover:shadow-[0_14px_30px_-16px_rgba(27,23,16,0.3)]"
                          : "cursor-not-allowed border-dashed border-ink/15 bg-paper-deep/40 opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="rounded-full bg-clay/10 px-2 py-0.5 text-[0.55rem] font-bold tracking-[0.2em] text-clay uppercase">
                          {item.tag}
                        </span>
                      </div>
                      <p className="display mt-3 text-sm uppercase">{item.name}</p>
                      <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-soft">
                        {item.desc}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-ink">
                        {fmt(item.cost)} {item.currency}
                        {item.level > 0 && (
                          <span className="ml-1 text-ink-faint">· Lv {item.level}</span>
                        )}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-[0.7rem] font-semibold tracking-[0.26em] text-ink-soft uppercase">
                Milestones
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {achievements.map((a) => (
                  <li
                    key={a.label}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.2em] uppercase",
                      a.done
                        ? "border-ink bg-ink text-paper"
                        : "border-dashed border-ink/20 text-ink-faint",
                    )}
                  >
                    {a.done ? "✓ " : ""}
                    {a.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quests + local leaderboard */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Quests */}
          <div className="rounded-3xl border border-ink/10 bg-cream p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[0.7rem] font-semibold tracking-[0.26em] text-ink-soft uppercase">
                Quests — earn {config.ticker}
              </h2>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              One-time rewards. Progress is saved on this device.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {questList.map((q) => (
                <li
                  key={q.id}
                  className="rounded-2xl border border-ink/10 bg-paper-deep/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="display text-sm uppercase">
                        {q.done && <span className="text-moss">✓ </span>}
                        {q.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">{q.hint}</p>
                    </div>
                    <button
                      type="button"
                      disabled={q.done || !q.ready(state)}
                      onClick={() => claimQuest(q.id)}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-2 text-[0.6rem] font-bold tracking-[0.18em] uppercase transition-colors",
                        q.done
                          ? "cursor-default border border-moss/30 bg-moss/10 text-moss"
                          : q.ready(state)
                            ? "cursor-pointer border border-ink bg-ink text-paper hover:bg-clay hover:border-clay"
                            : "cursor-not-allowed border border-dashed border-ink/20 text-ink-faint",
                      )}
                    >
                      {q.done
                        ? "Claimed"
                        : q.ready(state)
                          ? `Claim +${fmt(q.reward)}`
                          : `+${fmt(q.reward)}`}
                    </button>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={Math.round(q.pct * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${q.name} progress`}
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        q.done ? "bg-moss" : "bg-clay",
                      )}
                      style={{ width: `${q.pct * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Leaderboard */}
          <div className="flex flex-col rounded-3xl border border-ink/10 bg-cream p-6 sm:p-8">
            <h2 className="text-[0.7rem] font-semibold tracking-[0.26em] text-ink-soft uppercase">
              Tribe leaderboard · this device
            </h2>
            <p className="mt-1 text-xs text-ink-faint">
              Top 5 games saved on this browser — no servers, no accounts.
            </p>

            <ol className="mt-5 flex flex-1 flex-col gap-2">
              {leaderboard.length === 0 && (
                <li className="rounded-2xl border border-dashed border-ink/15 px-4 py-6 text-center text-xs leading-relaxed text-ink-faint">
                  No runs saved yet. Grow an economy and save it — the tribe
                  is watching.
                </li>
              )}
              {leaderboard.map((e, i) => (
                <li
                  key={`${e.name}-${e.at}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-paper-deep/60 px-4 py-3"
                >
                  <p className="flex items-center gap-2 truncate text-sm font-semibold">
                    <span className="text-base" aria-hidden="true">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                    </span>
                    <span className="truncate">{e.name}</span>
                  </p>
                  <p className="shrink-0 text-xs font-semibold text-clay">
                    {fmt(e.sbara)} {config.ticker}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your tribe name"
                aria-label="Tribe name for the leaderboard"
                className="min-w-0 flex-1 rounded-full border border-ink/15 bg-paper-deep/60 px-5 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-clay focus:outline-none"
              />
              <button
                type="button"
                onClick={saveToLeaderboard}
                disabled={state.totalSbara <= 0}
                className="rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors select-none hover:border-ink hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save run
              </button>
            </div>
            <button
              type="button"
              onClick={shareStats}
              className="mt-3 rounded-full bg-ink px-6 py-3.5 text-xs font-semibold tracking-[0.16em] text-paper uppercase transition-colors select-none hover:bg-clay"
            >
              {shared ? "SHARED! ✦" : `SHARE YOUR ${config.ticker} STATS`}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-ink-faint">
          The loop: shine → tribe → memes → {config.ticker} → upgrades → more shine.
          Everything here is a playful projection — not a promise.
        </p>
      </div>
    </section>
  );
}