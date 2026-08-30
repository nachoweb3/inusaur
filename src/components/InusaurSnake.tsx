"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* INUSAUR SNAKE v3 — swipe controls, maps, obstacles, leaderboard */

const CELL = 20;
const TICK_BASE = 140;
const TICK_MIN = 50;
const TICK_FASTER = 3;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };
type GameState = "menu" | "playing" | "paused" | "dead";
type Difficulty = "easy" | "medium" | "hard";
type MapId = "garden" | "forest" | "volcano";

interface GameMap { id: MapId; name: string; subtitle: string; cols: number; rows: number; bgColor: string; gridColor: string; wallColor: string; obstacles: Point[]; unlockScore: number; }

const MAPS: GameMap[] = [
  { id: "garden", name: "GREEN GARDEN", subtitle: "The beginning of evolution", cols: 15, rows: 15, bgColor: "#0d1f0d", gridColor: "rgba(74,222,128,0.06)", wallColor: "#4ade80", obstacles: [], unlockScore: 0 },
  { id: "forest", name: "DARK FOREST", subtitle: "Deeper into the unknown", cols: 18, rows: 18, bgColor: "#0a1a0a", gridColor: "rgba(34,197,94,0.05)", wallColor: "#22c55e", obstacles: [{x:4,y:4},{x:5,y:4},{x:4,y:5},{x:13,y:4},{x:14,y:4},{x:14,y:5},{x:4,y:13},{x:5,y:13},{x:4,y:12},{x:13,y:13},{x:14,y:13},{x:14,y:12},{x:9,y:8},{x:9,y:9},{x:10,y:9},{x:10,y:8}], unlockScore: 50 },
  { id: "volcano", name: "VOLCANO PEAK", subtitle: "Only the evolved survive", cols: 20, rows: 20, bgColor: "#1a0a0a", gridColor: "rgba(239,68,68,0.05)", wallColor: "#ef4444", obstacles: [{x:5,y:5},{x:6,y:5},{x:7,y:5},{x:5,y:6},{x:7,y:6},{x:5,y:7},{x:6,y:7},{x:7,y:7},{x:12,y:5},{x:13,y:5},{x:14,y:5},{x:12,y:6},{x:14,y:6},{x:12,y:7},{x:13,y:7},{x:14,y:7},{x:5,y:12},{x:6,y:12},{x:7,y:12},{x:5,y:13},{x:7,y:13},{x:5,y:14},{x:6,y:14},{x:7,y:14},{x:12,y:12},{x:13,y:12},{x:14,y:12},{x:12,y:13},{x:14,y:13},{x:12,y:14},{x:13,y:14},{x:14,y:14},{x:10,y:9},{x:10,y:10},{x:10,y:11},{x:9,y:10},{x:11,y:10}], unlockScore: 150 },
];

const DIFFS: { id: Difficulty; name: string; speedMod: number; label: string }[] = [
  { id: "easy", name: "SEEDLING", speedMod: 1.3, label: "+30% TIME" },
  { id: "medium", name: "SPROUT", speedMod: 1.0, label: "STANDARD" },
  { id: "hard", name: "INUSAUR", speedMod: 0.7, label: "-30% TIME" },
];

const ITEMS = [{ emoji: "🌱", points: 1, color: "#4ade80" }, { emoji: "🦴", points: 2, color: "#f5f5f4" }, { emoji: "💰", points: 3, color: "#fbbf24" }, { emoji: "💎", points: 5, color: "#60a5fa" }, { emoji: "⭐", points: 10, color: "#f472b6" }];

const OPP: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
const DIR: Record<Dir, Point> = { UP: { x: 0, y: -1 }, DOWN: { x: 0, y: 1 }, LEFT: { x: -1, y: 0 }, RIGHT: { x: 1, y: 0 } };

interface LBE { name: string; score: number; map: MapId; diff: Difficulty; time: number; date: string; }
const LBK = "inusaur-lb";
function getLB(): LBE[] { try { return JSON.parse(localStorage.getItem(LBK) ?? "[]"); } catch { return []; } }
function saveLB(e: LBE) { const lb = getLB(); lb.push(e); lb.sort((a, b) => b.score - a.score || b.time - a.time); localStorage.setItem(LBK, JSON.stringify(lb.slice(0, 100))); }
function getTop(p: "daily" | "weekly" | "monthly" | "all", n = 5): LBE[] { const lb = getLB(); const now = Date.now(); return lb.filter((e) => { const d = new Date(e.date).getTime(); if (p === "daily") return (now - d) < 864e5; if (p === "weekly") return (now - d) < 6048e5; if (p === "monthly") return (now - d) < 2592e6; return true; }).slice(0, n); }

function ri() { const w = [40, 30, 20, 8, 2]; const t = w.reduce((a, b) => a + b); let r = Math.random() * t; for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return ITEMS[i]; } return ITEMS[0]; }
function rp(c: number, r: number, ex: Point[], ob: Point[]): Point { let p: Point; let a = 0; do { p = { x: Math.floor(Math.random() * c), y: Math.floor(Math.random() * r) }; a++; if (a > 500) break; } while (ex.some((e) => e.x === p.x && e.y === p.y) || ob.some((o) => o.x === p.x && o.y === p.y)); return p; }

export default function InusaurSnake() {
  const cv = useRef<HTMLCanvasElement>(null);
  const dr = useRef<Dir>("RIGHT");
  const nd = useRef<Dir | null>(null);
  const sn = useRef<Point[]>([]);
  const it = useRef<{ pos: Point; item: typeof ITEMS[number] }>({ pos: { x: 0, y: 0 }, item: ITEMS[0] });
  const sc = useRef(0);
  const st = useRef<GameState>("menu");
  const tk = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const tf = useRef<(() => void) | undefined>(undefined);
  const t0 = useRef(0);
  const pt = useRef<{ x: number; y: number; life: number; color: string; vx: number; vy: number }[]>([]);
  const ts = useRef<{ x: number; y: number } | null>(null);

  const [state, setState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [hs, setHs] = useState(0);
  const [sMap, setSMap] = useState<MapId>("garden");
  const [sDiff, setSDiff] = useState<Difficulty>("medium");
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(0);
  const [lbp, setLbp] = useState<"daily" | "weekly" | "monthly" | "all">("all");
  const [pname, setPname] = useState("");

  const mp = MAPS.find((m) => m.id === sMap)!;
  const df = DIFFS.find((d) => d.id === sDiff)!;

  useEffect(() => { const lb = getLB(); if (lb.length > 0) setHs(lb[0].score); }, []);

  const draw = useCallback(() => {
    const c = cv.current; if (!c) return;
    const x = c.getContext("2d"); if (!x) return;
    const w = mp.cols * CELL, h = mp.rows * CELL;
    x.fillStyle = mp.bgColor; x.fillRect(0, 0, w, h);
    x.strokeStyle = mp.gridColor; x.lineWidth = 0.5;
    for (let i = 0; i <= mp.cols; i++) { x.beginPath(); x.moveTo(i * CELL, 0); x.lineTo(i * CELL, h); x.stroke(); }
    for (let i = 0; i <= mp.rows; i++) { x.beginPath(); x.moveTo(0, i * CELL); x.lineTo(w, i * CELL); x.stroke(); }
    mp.obstacles.forEach((o) => {
      const lv = mp.id === "volcano";
      x.fillStyle = lv ? "rgba(239,68,68,0.6)" : "rgba(34,197,94,0.3)";
      x.beginPath(); x.roundRect(o.x * CELL + 1, o.y * CELL + 1, CELL - 2, CELL - 2, 3); x.fill();
      if (lv) { x.shadowColor = "#ef4444"; x.shadowBlur = 8; x.fill(); x.shadowBlur = 0; }
      else { x.fillStyle = "rgba(139,92,246,0.2)"; x.beginPath(); x.arc(o.x * CELL + CELL / 2, o.y * CELL + CELL / 2, CELL / 3, 0, Math.PI * 2); x.fill(); }
    });
    const { pos, item } = it.current;
    x.save(); x.shadowColor = item.color; x.shadowBlur = 12; x.font = `${CELL - 4}px serif`; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(item.emoji, pos.x * CELL + CELL / 2, pos.y * CELL + CELL / 2); x.restore();
    pt.current.forEach((p) => { if (p.life > 0) { p.x += p.vx; p.y += p.vy; p.life -= 0.02; x.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, "0"); x.beginPath(); x.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2); x.fill(); } });
    pt.current = pt.current.filter((p) => p.life > 0);
    sn.current.forEach((sg, i) => {
      const hd = i === 0, pr = i / Math.max(sn.current.length - 1, 1);
      x.fillStyle = `rgba(${45 + pr * 20},${107 - pr * 30},${45 - pr * 10},${1 - pr * 0.3})`;
      x.beginPath(); x.roundRect(sg.x * CELL + 2, sg.y * CELL + 2, CELL - 4, CELL - 4, hd ? 6 : 4); x.fill();
      if (hd) {
        x.fillStyle = "#fff"; x.beginPath(); x.arc(sg.x * CELL + 6, sg.y * CELL + 7, 3, 0, Math.PI * 2); x.arc(sg.x * CELL + 14, sg.y * CELL + 7, 3, 0, Math.PI * 2); x.fill();
        x.fillStyle = "#0d1f0d"; x.beginPath(); x.arc(sg.x * CELL + 6, sg.y * CELL + 7, 1.5, 0, Math.PI * 2); x.arc(sg.x * CELL + 14, sg.y * CELL + 7, 1.5, 0, Math.PI * 2); x.fill();
        x.fillStyle = "#f472b6"; x.beginPath(); x.arc(sg.x * CELL + CELL / 2, sg.y * CELL - 2, 4, 0, Math.PI * 2); x.fill();
        x.fillStyle = "#fbbf24"; x.beginPath(); x.arc(sg.x * CELL + CELL / 2, sg.y * CELL - 2, 2, 0, Math.PI * 2); x.fill();
      }
    });
    x.strokeStyle = mp.wallColor; x.lineWidth = 2; x.shadowColor = mp.wallColor; x.shadowBlur = 8;
    x.strokeRect(1, 1, w - 2, h - 2); x.shadowBlur = 0;
  }, [mp]);

  const die = useCallback(() => {
    st.current = "dead"; setState("dead");
    const t = Math.floor((Date.now() - t0.current) / 1000);
    saveLB({ name: pname || "ANON", score: sc.current, map: mp.id, diff: sDiff, time: t, date: new Date().toISOString() });
  }, [mp, sDiff, pname]);

  const tick = useCallback(() => {
    const s = sn.current; const d = nd.current ?? dr.current;
    if (nd.current) { dr.current = d; nd.current = null; }
    const h = s[0], v = DIR[d], nh = { x: h.x + v.x, y: h.y + v.y };
    if (nh.x < 0 || nh.x >= mp.cols || nh.y < 0 || nh.y >= mp.rows) { die(); return; }
    if (mp.obstacles.some((o) => o.x === nh.x && o.y === nh.y)) { die(); return; }
    if (s.some((p) => p.x === nh.x && p.y === nh.y)) { die(); return; }
    const ns = [nh, ...s]; const i = it.current;
    if (nh.x === i.pos.x && nh.y === i.pos.y) {
      sc.current += i.item.points; setScore(sc.current);
      setCombo((c) => c + 1); setTimeout(() => setCombo(0), 2000);
      const px = i.pos.x * CELL + CELL / 2, py = i.pos.y * CELL + CELL / 2;
      for (let j = 0; j < 8; j++) { const a = (Math.PI * 2 * j) / 8; pt.current.push({ x: px, y: py, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, life: 1, color: i.item.color }); }
      it.current = { pos: rp(mp.cols, mp.rows, ns, mp.obstacles), item: ri() };
      const nt = Math.max(TICK_MIN, (TICK_BASE - sc.current * TICK_FASTER) * df.speedMod);
      clearInterval(tk.current); tk.current = setInterval(() => tf.current?.(), nt);
    } else { ns.pop(); }
    sn.current = ns; draw();
  }, [draw, mp, df, die]);

  const go = useCallback(() => {
    const sx = Math.floor(mp.cols / 2), sy = Math.floor(mp.rows / 2);
    sn.current = [{ x: sx, y: sy }, { x: sx - 1, y: sy }, { x: sx - 2, y: sy }];
    dr.current = "RIGHT"; nd.current = null; sc.current = 0; setScore(0); setCombo(0); setTime(0);
    it.current = { pos: rp(mp.cols, mp.rows, sn.current, mp.obstacles), item: ri() };
    st.current = "playing"; setState("playing"); t0.current = Date.now();
    clearInterval(tk.current); tk.current = setInterval(() => tf.current?.(), TICK_BASE * df.speedMod); draw();
  }, [draw, mp, df]);

  useEffect(() => { if (state !== "playing") return; const iv = setInterval(() => setTime(Math.floor((Date.now() - t0.current) / 1000)), 1000); return () => clearInterval(iv); }, [state]);
  useEffect(() => () => clearInterval(tk.current), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const km: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT", w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT", W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT" };
      const d = km[e.key];
      if (d) { e.preventDefault(); if (st.current === "menu" || st.current === "dead") { go(); return; } if (st.current === "paused") { st.current = "playing"; setState("playing"); tk.current = setInterval(() => tf.current?.(), TICK_BASE * df.speedMod); return; } if (d !== OPP[dr.current]) nd.current = d; }
      if (e.key === " " || e.key === "Escape") { e.preventDefault(); if (st.current === "playing") { clearInterval(tk.current); st.current = "paused"; setState("paused"); } else if (st.current === "paused") { st.current = "playing"; setState("playing"); tk.current = setInterval(() => tf.current?.(), TICK_BASE * df.speedMod); } else if (st.current === "dead" || st.current === "menu") go(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [go, df]);

  const onTS = useCallback((e: React.TouchEvent) => { ts.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, []);
  const onTE = useCallback((e: React.TouchEvent) => {
    if (!ts.current) return; const t = e.changedTouches[0];
    const dx = t.clientX - ts.current.x, dy = t.clientY - ts.current.y;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
    const d: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "RIGHT" : "LEFT") : (dy > 0 ? "DOWN" : "UP");
    if (st.current === "menu" || st.current === "dead") { go(); return; }
    if (st.current === "paused") { st.current = "playing"; setState("playing"); tk.current = setInterval(() => tf.current?.(), TICK_BASE * df.speedMod); return; }
    if (d !== OPP[dr.current]) nd.current = d; ts.current = null;
  }, [go, df]);

  const td = useCallback((d: Dir) => {
    if (st.current === "menu" || st.current === "dead") { go(); return; }
    if (st.current === "paused") { st.current = "playing"; setState("playing"); tk.current = setInterval(() => tf.current?.(), TICK_BASE * df.speedMod); return; }
    if (d !== OPP[dr.current]) nd.current = d;
  }, [go, df]);

  useEffect(() => { draw(); }, [draw]);

  const top = getTop(lbp);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {state === "menu" && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <p className="font-mono text-[0.6rem] tracking-[0.3em] text-green/50 uppercase">PILOT CALLSIGN</p>
            <input type="text" value={pname} onChange={(e) => setPname(e.target.value.toUpperCase().slice(0, 12))} placeholder="ANON" maxLength={12}
              className="mt-2 w-full max-w-xs rounded-lg border border-green/20 bg-ink/50 px-4 py-2 font-mono text-sm text-center text-green placeholder:text-green/20 focus:border-green/40 focus:outline-none" />
          </div>
          <div>
            <p className="mb-3 text-center font-mono text-[0.6rem] tracking-[0.3em] text-green/50 uppercase">SELECT ARENA</p>
            <div className="grid grid-cols-3 gap-3">
              {MAPS.map((m) => { const lk = hs < m.unlockScore; return (
                <button key={m.id} type="button" onClick={() => !lk && setSMap(m.id)} disabled={lk}
                  className={`relative rounded-xl border p-4 text-center transition-all ${sMap === m.id ? "border-green/50 bg-green/10 shadow-[0_0_15px_rgba(74,222,128,0.2)]" : lk ? "border-ink/10 bg-ink/20 opacity-50 cursor-not-allowed" : "border-ink/15 bg-ink/30 hover:border-green/30"}`}>
                  {lk && <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink/60"><span className="font-mono text-[0.55rem] tracking-widest text-green/40 uppercase">🔒 {m.unlockScore} PTS</span></div>}
                  <p className="font-mono text-xs font-bold tracking-widest text-green uppercase">{m.name}</p>
                  <p className="mt-1 font-mono text-[0.55rem] text-green/40">{m.subtitle}</p>
                </button> ); })}
            </div>
          </div>
          <div>
            <p className="mb-3 text-center font-mono text-[0.6rem] tracking-[0.3em] text-green/50 uppercase">DIFFICULTY</p>
            <div className="flex justify-center gap-3">
              {DIFFS.map((d) => (
                <button key={d.id} type="button" onClick={() => setSDiff(d.id)}
                  className={`rounded-lg border px-4 py-2 font-mono text-[0.6rem] font-bold tracking-widest uppercase transition-all ${sDiff === d.id ? "border-green/50 bg-green/10 text-green" : "border-ink/15 text-green/40 hover:border-green/30"}`}>
                  {d.name}<span className="block text-[0.5rem] text-green/30 mt-0.5">{d.label}</span>
                </button> ))}
            </div>
          </div>
          <div className="text-center">
            <button type="button" onClick={go}
              className="rounded-lg border border-green/30 bg-green/10 px-10 py-4 font-mono text-sm font-bold tracking-widest text-green uppercase transition-all hover:border-green/50 hover:bg-green/20 hover:shadow-[0_0_25px_rgba(74,222,128,0.3)]">
              [ START EVOLUTION ]
            </button>
          </div>
          <div className="rounded-xl border border-green/10 bg-ink/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[0.6rem] tracking-[0.3em] text-green/50 uppercase">LEADERBOARD</p>
              <div className="flex gap-2">
                {(["daily", "weekly", "monthly", "all"] as const).map((p) => (
                  <button key={p} type="button" onClick={() => setLbp(p)}
                    className={`font-mono text-[0.5rem] tracking-widest uppercase px-2 py-1 rounded ${lbp === p ? "text-green bg-green/10" : "text-green/30"}`}>{p}</button> ))}
              </div>
            </div>
            {top.length === 0 ? <p className="text-center font-mono text-[0.6rem] text-green/30 py-4">NO DATA YET — BE THE FIRST</p> : (
              <div className="space-y-1">
                {top.map((e, i) => (
                  <div key={i} className="flex items-center justify-between font-mono text-[0.6rem] px-2 py-1.5 rounded bg-ink/30">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-right ${i === 0 ? "text-gold" : i === 1 ? "text-paper/60" : i === 2 ? "text-clay/60" : "text-green/30"}`}>#{i + 1}</span>
                      <span className="text-green/70">{e.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green/40">{e.map}</span>
                      <span className="text-green font-bold">{e.score}</span>
                      <span className="text-green/30">{e.time}s</span>
                    </div>
                  </div> ))}
              </div> )}
            <div className="mt-4 border-t border-green/10 pt-3">
              <p className="font-mono text-[0.5rem] tracking-[0.2em] text-pink/60 uppercase mb-2">🌱 $SAUR AIRDROP REWARDS</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-ink/30 p-2"><p className="font-mono text-[0.5rem] text-green/30">DAILY #1</p><p className="font-mono text-xs text-gold font-bold">1,000 $SAUR</p></div>
                <div className="rounded-lg bg-ink/30 p-2"><p className="font-mono text-[0.5rem] text-green/30">WEEKLY #1</p><p className="font-mono text-xs text-gold font-bold">5,000 $SAUR</p></div>
                <div className="rounded-lg bg-ink/30 p-2"><p className="font-mono text-[0.5rem] text-green/30">MONTHLY #1</p><p className="font-mono text-xs text-gold font-bold">25,000 $SAUR</p></div>
              </div>
              <p className="mt-2 text-center font-mono text-[0.45rem] text-green/20">TOP 10 DAILY · TOP 20 WEEKLY · TOP 50 MONTHLY RECEIVE REWARDS</p>
            </div>
          </div>
        </div>
      )}
      {state !== "menu" && (<>
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-4">
            <div><p className="font-mono text-[0.55rem] tracking-widest text-green/40 uppercase">SCORE</p><p className="font-mono text-xl font-bold text-green">{score}</p></div>
            <div><p className="font-mono text-[0.55rem] tracking-widest text-green/40 uppercase">TIME</p><p className="font-mono text-xl font-bold text-green/70">{time}s</p></div>
            {combo > 1 && <div className="text-pink animate-pulse"><p className="font-mono text-[0.55rem] tracking-widest uppercase">COMBO</p><p className="font-mono text-xl font-bold">x{combo}</p></div>}
          </div>
          <div className="text-right"><p className="font-mono text-[0.55rem] tracking-widest text-green/40 uppercase">{mp.name}</p><p className="font-mono text-[0.55rem] text-green/30">{df.name}</p></div>
        </div>
        <div className="relative rounded-xl overflow-hidden touch-none" onTouchStart={onTS} onTouchEnd={onTE}>
          <canvas ref={cv} width={mp.cols * CELL} height={mp.rows * CELL} className="block max-w-full h-auto" />
          {state === "paused" && <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/90 backdrop-blur-sm"><p className="font-mono text-xs tracking-[0.4em] text-green/50 uppercase">EVOLUTION PAUSED</p><p className="mt-2 font-mono text-[0.6rem] tracking-widest text-green/30 uppercase">TAP OR PRESS SPACE</p></div>}
          {state === "dead" && <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-sm">
            <p className="font-mono text-xs tracking-[0.4em] text-clay/60 uppercase">EVOLUTION TERMINATED</p>
            <p className="mt-4 font-mono text-3xl font-bold text-green">{score}</p>
            <p className="font-mono text-[0.6rem] text-green/40">SCORE · {time}s SURVIVED</p>
            {score >= hs && score > 0 && <p className="mt-2 font-mono text-xs text-gold animate-pulse">🏆 NEW HIGH SCORE</p>}
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={go} className="rounded-lg border border-green/30 bg-green/10 px-6 py-2 font-mono text-xs font-bold tracking-widest text-green uppercase hover:bg-green/20">[ RETRY ]</button>
              <button type="button" onClick={() => { clearInterval(tk.current); setState("menu"); }} className="rounded-lg border border-ink/20 px-6 py-2 font-mono text-xs tracking-widest text-green/40 uppercase hover:border-green/30">[ MENU ]</button>
            </div>
          </div>}
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:hidden" style={{ width: 130 }}>
          <div /><button type="button" onTouchStart={() => td("UP")} onClick={() => td("UP")} className="flex h-12 w-12 items-center justify-center rounded-xl border border-green/20 bg-ink/30 text-lg active:bg-green/20">▲</button><div />
          <button type="button" onTouchStart={() => td("LEFT")} onClick={() => td("LEFT")} className="flex h-12 w-12 items-center justify-center rounded-xl border border-green/20 bg-ink/30 text-lg active:bg-green/20">◀</button>
          <button type="button" onTouchStart={() => { if (st.current === "playing") { clearInterval(tk.current); st.current = "paused"; setState("paused"); } else if (st.current === "paused") { st.current = "playing"; setState("playing"); tk.current = setInterval(() => tf.current?.(), TICK_BASE * df.speedMod); } }} className="flex h-12 w-12 items-center justify-center rounded-xl border border-green/20 bg-ink/30 text-xs font-bold text-green/40 active:bg-green/20">❚❚</button>
          <button type="button" onTouchStart={() => td("RIGHT")} onClick={() => td("RIGHT")} className="flex h-12 w-12 items-center justify-center rounded-xl border border-green/20 bg-ink/30 text-lg active:bg-green/20">▶</button>
          <div /><button type="button" onTouchStart={() => td("DOWN")} onClick={() => td("DOWN")} className="flex h-12 w-12 items-center justify-center rounded-xl border border-green/20 bg-ink/30 text-lg active:bg-green/20">▼</button><div />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {ITEMS.map((i, idx) => <span key={idx} className="flex items-center gap-1 font-mono text-[0.6rem] text-green/40">{i.emoji} <span className="text-green/60">+{i.points}</span></span>)}
        </div>
      </>)}
    </div>
  );
}