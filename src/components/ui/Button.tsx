"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isPlaceholder } from "@/data/config";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Small "SOON" tag shown while the link is a config placeholder. */
  showSoon?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-clay border border-ink hover:border-clay transition-colors",
  secondary:
    "bg-transparent text-ink border border-ink/20 hover:border-ink hover:bg-ink/5 transition-colors",
  ghost: "text-ink hover:text-clay transition-colors",
};

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  showSoon = false,
  ariaLabel,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase select-none",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(classes, isPlaceholder(href) && "cursor-default")}
        onClick={isPlaceholder(href) ? (e) => e.preventDefault() : undefined}
      >
        {children}
        {showSoon && isPlaceholder(href) && (
          <span className="rounded-full bg-clay/15 px-2 py-0.5 text-[0.6rem] tracking-widest text-clay">
            SOON
          </span>
        )}
      </Link>
    );
  }

  return (
    <button type={type} aria-label={ariaLabel} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}