"use client";

import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  /** Compact variant for inline rows (no pill border). */
  inline?: boolean;
};

export default function CopyButton({
  text,
  label = "COPY",
  copiedLabel = "COPIED!",
  className = "",
  inline = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy contract address: ${text}`}
      className={
        inline
          ? `inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
              copied ? "text-moss" : "text-ink hover:text-clay"
            } ${className}`
          : `inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
              copied
                ? "border-moss text-moss"
                : "border-ink/20 text-ink hover:border-ink hover:bg-ink/5"
            } ${className}`
      }
      aria-live="polite"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {copied ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      {copied ? copiedLabel : label}
    </button>
  );
}