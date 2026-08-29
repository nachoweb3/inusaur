"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { assetUrl, cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────
   INUSAUR SNAKE — browser minigame
   Classic snake with an Inusaur twist: green creature, pink flower,
   meme/crypto items, high score in localStorage, touch D-pad.
   ──────────────────────────────────────────────────────────────── */

const CELL = 20; // px per grid cell
const COLS = 20;
const ROWS = 20;
const TICK_BASE = 150; // ms per tick at score 0
const TICK_MIN = 60;
const TICK_FASTER = 3; // ms faster per score point

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };
type ItemType = "bulb" | "bone" | "coin" | "gem" | "star";

const ITEMS: { type: ItemType; emoji: string; points: number }[] = [
  { type: "bulb", emoji: "🌱", points: 1 },
  { type: "bone", emoji: "🦴", points: 2 },
  { type: "coin", emoji: "💰", points: 3 },
  { type: "gem", emoji: "💎", points: 5 },
  { type: "star", emoji: "⭐", points: 10 },
];

const OPPOSITE: Record<Dir, Dir> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const DIR_VEC: Record<Dir, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const HS_KEY = "inusaur-snake-hs";

// Polyfill roundRect for older TypeScript typings
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
  }
}

function randomItem(): typeof ITEMS[number] {
  // Weighted: more common items are cheaper
  const weights = [40, 30, 20, 8, 2];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return ITEMS[i];
  }
  return ITEMS[0];
}

function randomPos(exclude: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (exclude.some((e) => e.x === p.x && e.y === p.y));
  return p;
}

type GameState = "idle" | "playing" | "paused" | "dead";

export default function InusaurSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef<Dir>("RIGHT");
  const nextDirRef = useRef<Dir | null>(null);
  const snakeRef = useRef<Point[]>([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
  const itemRef = useRef<{ pos: Point; item: typeof ITEMS[number] }>({
    pos: { x: 12, y: 10 },
    item: ITEMS[0],
  });
  const scoreRef = useRef(0);
  const stateRef = useRef<GameState>("idle");
  const tickRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const tickFnRef = useRef<(() => void) | undefined>(undefined);

  const [state, setState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem(HS_KEY) ?? "0", 10) || 0;
    } catch { return 0; }
  });
  const [lastItem, setLastItem] = useState<string | null>(null);

  const saveHighScore = useCallback((s: number) => {
    setHighScore((prev) => {
      const next = Math.max(prev, s);
      try { localStorage.setItem(HS_KEY, String(next)); } catch { /* */ }
      return next;
    });
  }, []);

  // ── Drawing ──────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = COLS * CELL;
    const h = ROWS * CELL;

    // Background
    ctx.fillStyle = "#f0f7f0";
    ctx.fillRect(0, 0, w, h);

    // Grid lines (subtle)
    ctx.strokeStyle = "rgba(13,31,13,0.06)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, h);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(w, y * CELL);
      ctx.stroke();
    }

    // Item
    const { pos, item } = itemRef.current;
    ctx.font = `${CELL - 4}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.emoji, pos.x * CELL + CELL / 2, pos.y * CELL + CELL / 2);

    // Snake body
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const green = isHead ? "#2d5a2d" : `rgba(58,107,58,${1 - i * 0.03})`;
      ctx.fillStyle = green;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
      ctx.fill();

      // Head: draw face
      if (isHead) {
        // Eyes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(seg.x * CELL + 6, seg.y * CELL + 7, 3, 0, Math.PI * 2);
        ctx.arc(seg.x * CELL + 14, seg.y * CELL + 7, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0d1f0d";
        ctx.beginPath();
        ctx.arc(seg.x * CELL + 6, seg.y * CELL + 7, 1.5, 0, Math.PI * 2);
        ctx.arc(seg.x * CELL + 14, seg.y * CELL + 7, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Pink flower on top
        ctx.fillStyle = "#e06080";
        ctx.beginPath();
        ctx.arc(seg.x * CELL + CELL / 2, seg.y * CELL - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d9a441";
        ctx.beginPath();
        ctx.arc(seg.x * CELL + CELL / 2, seg.y * CELL - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Walls (border)
    ctx.strokeStyle = "#3a6b3a";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
  }, []);

  // ── Game loop ────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const dir = nextDirRef.current ?? dirRef.current;
    if (nextDirRef.current) {
      dirRef.current = dir;
      nextDirRef.current = null;
    }

    const head = snake[0];
    const vec = DIR_VEC[dir];
    const newHead: Point = { x: head.x + vec.x, y: head.y + vec.y };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
      stateRef.current = "dead";
      setState("dead");
      saveHighScore(scoreRef.current);
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      stateRef.current = "dead";
      setState("dead");
      saveHighScore(scoreRef.current);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Item collision
    const item = itemRef.current;
    if (newHead.x === item.pos.x && newHead.y === item.pos.y) {
      scoreRef.current += item.item.points;
      setScore(scoreRef.current);
      setLastItem(item.item.emoji);
      setTimeout(() => setLastItem(null), 800);

      // Spawn new item
      itemRef.current = { pos: randomPos(newSnake), item: randomItem() };

      // Speed up
      const newTick = Math.max(TICK_MIN, TICK_BASE - scoreRef.current * TICK_FASTER);
      clearInterval(tickRef.current);
      tickRef.current = setInterval(() => tickFnRef.current?.(), newTick);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw, saveHighScore]);

  // ── Start / Restart ──────────────────────────────────────────────
  const startGame = useCallback(() => {
    snakeRef.current = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    dirRef.current = "RIGHT";
    nextDirRef.current = null;
    scoreRef.current = 0;
    setScore(0);
    itemRef.current = { pos: randomPos(snakeRef.current), item: randomItem() };
    stateRef.current = "playing";
    setState("playing");

    clearInterval(tickRef.current);
    tickRef.current = setInterval(() => tickFnRef.current?.(), TICK_BASE);
    draw();
  }, [tick, draw]);

  // Cleanup
  useEffect(() => {
    return () => clearInterval(tickRef.current);
  }, []);

  // ── Keyboard controls ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, Dir> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };

      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        if (stateRef.current === "idle" || stateRef.current === "dead") {
          startGame();
          return;
        }
        if (stateRef.current === "paused") {
          stateRef.current = "playing";
          setState("playing");
          tickRef.current = setInterval(tick, TICK_BASE);
          return;
        }
        if (dir !== OPPOSITE[dirRef.current]) {
          nextDirRef.current = dir;
        }
      }

      if (e.key === " " || e.key === "Escape") {
        e.preventDefault();
        if (stateRef.current === "playing") {
          clearInterval(tickRef.current);
          stateRef.current = "paused";
          setState("paused");
        } else if (stateRef.current === "paused") {
          stateRef.current = "playing";
          setState("playing");
          tickRef.current = setInterval(tick, TICK_BASE);
        } else if (stateRef.current === "dead" || stateRef.current === "idle") {
          startGame();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tick, startGame]);

  // ── Touch D-pad ──────────────────────────────────────────────────
  const touchDir = useCallback(
    (dir: Dir) => {
      if (stateRef.current === "idle" || stateRef.current === "dead") {
        startGame();
        return;
      }
      if (stateRef.current === "paused") {
        stateRef.current = "playing";
        setState("playing");
        tickRef.current = setInterval(tick, TICK_BASE);
        return;
      }
      if (dir !== OPPOSITE[dirRef.current]) {
        nextDirRef.current = dir;
      }
    },
    [tick, startGame],
  );

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score bar */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            SCORE
          </span>
          <p className="text-2xl font-bold text-green">{score}</p>
        </div>
        <div>
          <span className="text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            BEST
          </span>
          <p className="text-2xl font-bold text-ink">{highScore}</p>
        </div>
        {lastItem && (
          <div className="cap-pop text-3xl">{lastItem}</div>
        )}
      </div>

      {/* Game canvas */}
      <div className="relative rounded-2xl border-2 border-green/30 bg-paper shadow-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block"
        />

        {/* Overlay screens */}
        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/90 backdrop-blur-sm">
            <p className="display text-3xl tracking-tight sm:text-4xl">INUSAUR SNAKE</p>
            <p className="mt-2 text-xs tracking-widest text-ink-faint uppercase">
              HOW LONG CAN YOUR INUSAUR EVOLVE?
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-6 rounded-full bg-green px-8 py-3 text-xs font-bold tracking-widest text-paper uppercase transition-colors hover:bg-moss"
            >
              START GAME
            </button>
            <p className="mt-4 text-[0.6rem] tracking-widest text-ink-faint uppercase">
              ARROWS / WASD / TAP TO MOVE · SPACE TO PAUSE
            </p>
          </div>
        )}

        {state === "paused" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/80 backdrop-blur-sm">
            <p className="display text-3xl">PAUSED</p>
            <p className="mt-2 text-xs text-ink-faint">Press SPACE or tap to resume</p>
          </div>
        )}

        {state === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-paper/90 backdrop-blur-sm">
            <p className="display text-3xl text-clay">GAME OVER</p>
            <p className="mt-2 text-lg font-bold text-green">SCORE: {score}</p>
            {score >= highScore && score > 0 && (
              <p className="mt-1 text-xs font-semibold tracking-widest text-gold uppercase">
                🎉 NEW HIGH SCORE!
              </p>
            )}
            <button
              type="button"
              onClick={startGame}
              className="mt-6 rounded-full bg-green px-8 py-3 text-xs font-bold tracking-widest text-paper uppercase transition-colors hover:bg-moss"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Touch D-pad (mobile) */}
      <div className="grid grid-cols-3 gap-1 sm:hidden" style={{ width: 140 }}>
        <div />
        <button
          type="button"
          onTouchStart={() => touchDir("UP")}
          onClick={() => touchDir("UP")}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 bg-cream text-lg active:bg-green/20"
          aria-label="Up"
        >
          ▲
        </button>
        <div />
        <button
          type="button"
          onTouchStart={() => touchDir("LEFT")}
          onClick={() => touchDir("LEFT")}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 bg-cream text-lg active:bg-green/20"
          aria-label="Left"
        >
          ◀
        </button>
        <button
          type="button"
          onTouchStart={() => {
            if (stateRef.current === "playing") {
              clearInterval(tickRef.current);
              stateRef.current = "paused";
              setState("paused");
            } else if (stateRef.current === "paused") {
              stateRef.current = "playing";
              setState("playing");
              tickRef.current = setInterval(tick, TICK_BASE);
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 bg-cream text-xs font-bold tracking-widest text-ink-faint uppercase active:bg-green/20"
          aria-label="Pause"
        >
          ❚❚
        </button>
        <button
          type="button"
          onTouchStart={() => touchDir("RIGHT")}
          onClick={() => touchDir("RIGHT")}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 bg-cream text-lg active:bg-green/20"
          aria-label="Right"
        >
          ▶
        </button>
        <div />
        <button
          type="button"
          onTouchStart={() => touchDir("DOWN")}
          onClick={() => touchDir("DOWN")}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 bg-cream text-lg active:bg-green/20"
          aria-label="Down"
        >
          ▼
        </button>
        <div />
      </div>

      {/* Items legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {ITEMS.map((item) => (
          <span key={item.type} className="flex items-center gap-1 text-xs text-ink-faint">
            {item.emoji} <span className="font-semibold">+{item.points}</span>
          </span>
        ))}
      </div>
    </div>
  );
}