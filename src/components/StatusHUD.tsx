"use client";

import { useEffect, useState } from "react";

export default function StatusHUD() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 hidden rounded-xl border border-green/20 bg-ink/90 px-4 py-3 font-mono text-[0.6rem] backdrop-blur-sm sm:block">
      <p className="mb-1.5 text-[0.55rem] tracking-[0.3em] text-green/50 uppercase">
        INUSAUR NETWORK
      </p>
      <div className="space-y-1">
        <p className="text-green">
          <span className="text-green/40">● </span>
          ONLINE
        </p>
        <p className="text-green/60">
          SPECIMEN: <span className="text-green">SAUR-001</span>
        </p>
        <p className="text-green/60">
          EVOLUTION: <span className="text-gold">87%</span>
        </p>
        <p className="text-green/60">
          LAUNCH: <span className="text-pink">PENDING</span>
        </p>
        <p className="text-green/30 mt-1">{time}</p>
      </div>
    </div>
  );
}