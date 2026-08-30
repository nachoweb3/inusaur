"use client";

import { useEffect, useState } from "react";

const LS_KEY = "inusaur-loaded";

const LINES = [
  { text: "INUSAUR BIOSYSTEM v1.0", delay: 0 },
  { text: "SCANNING GENOME...", delay: 400 },
  { text: "LOADING SPECIMEN SAUR-001", delay: 900 },
  { text: "INITIALIZING EVOLUTION PROTOCOL", delay: 1500 },
  { text: "SYNCHRONIZING MEME ENERGY", delay: 2100 },
  { text: "DNA MATCH CONFIRMED", delay: 2600 },
  { text: "SYSTEM READY", delay: 3200 },
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Skip if returning visitor
    try {
      if (localStorage.getItem(LS_KEY)) {
        onComplete();
        return;
      }
    } catch { /* */ }

    // Animate lines
    const timers = LINES.map((line, i) =>
      setTimeout(() => setLineIdx(i), line.delay)
    );

    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 3, 100));
    }, 50);

    // Done
    const doneTimer = setTimeout(() => {
      setDone(true);
      try { localStorage.setItem(LS_KEY, "1"); } catch { /* */ }
      setTimeout(onComplete, 600);
    }, 3800);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-opacity duration-500 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md px-6">
        {/* Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.1) 2px, rgba(74,222,128,0.1) 4px)",
          }}
        />

        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="font-mono text-xs tracking-[0.4em] text-green/60 uppercase">
            ● INUSAUR NETWORK
          </p>
        </div>

        {/* Terminal lines */}
        <div className="mb-6 space-y-1.5 font-mono text-xs">
          {LINES.slice(0, lineIdx + 1).map((line, i) => (
            <p
              key={i}
              className={`transition-opacity duration-300 ${
                i === lineIdx ? "text-green" : "text-green/40"
              }`}
            >
              <span className="text-green/30">{">"} </span>
              {line.text}
              {i === lineIdx && !done && (
                <span className="animate-pulse ml-1">_</span>
              )}
              {i === LINES.length - 1 && done && (
                <span className="ml-2 text-gold">✓</span>
              )}
            </p>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-green/10">
            <div
              className="h-full rounded-full bg-green transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right font-mono text-[0.65rem] text-green/40">
            {progress}%
          </p>
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={() => {
            try { localStorage.setItem(LS_KEY, "1"); } catch { /* */ }
            onComplete();
          }}
          className="w-full py-2 text-center font-mono text-[0.65rem] tracking-widest text-green/30 uppercase transition-colors hover:text-green/60"
        >
          [ SKIP ]
        </button>
      </div>
    </div>
  );
}