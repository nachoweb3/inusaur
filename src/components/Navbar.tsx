"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config } from "@/data/config";
import { assetUrl, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ConnectWalletButton from "@/components/ConnectWalletButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink/10 bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "container-x flex items-center justify-between transition-all duration-300",
          scrolled ? "py-3" : "py-5",
        )}
      >
        {/* Logo */}
        <Link
          href="#top"
          className="group flex items-center gap-2.5"
          aria-label={`${config.projectName} — back to top`}
          onClick={() => setOpen(false)}
        >
          <img
            src={assetUrl("/images/shiny-logo.jpg")}
            alt="Shiny Capibara — the albino capybara"
            width={96}
            height={96}
            className={cn(
              "rounded-full object-cover ring-2 ring-ink/10 transition-all duration-300",
              scrolled ? "h-9 w-9" : "h-11 w-11",
            )}
          />
          <span className="display text-sm tracking-tight sm:text-base">
            {config.projectName.toUpperCase()}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {config.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[0.7rem] font-semibold tracking-[0.22em] text-ink/70 uppercase transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ConnectWalletButton />
          <Button href={config.buyUrl} showSoon className="px-5 py-2.5">
            BUY {config.ticker}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="relative z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn(
              "absolute h-0.5 w-5 bg-ink transition-all duration-300",
              open ? "rotate-45" : "-translate-y-1.5",
            )}
          />
          <span
            className={cn(
              "absolute h-0.5 w-5 bg-ink transition-all duration-300",
              open ? "-rotate-45" : "translate-y-1.5",
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-paper transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="container-x flex flex-1 flex-col justify-center gap-2 pt-24">
          {config.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "display border-b border-ink/10 py-5 text-4xl uppercase transition-all duration-500 sm:text-5xl",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <div
            className={cn(
              "mt-8 flex flex-col gap-3 transition-all duration-500",
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
            style={{ transitionDelay: open ? "420ms" : "0ms" }}
          >
            <ConnectWalletButton className="[&>button]:w-full [&>button]:py-4" />
            <Button href={config.buyUrl} showSoon className="w-full py-4">
              BUY {config.ticker}
            </Button>
          </div>
          <p className="mt-10 text-xs tracking-[0.3em] text-ink-faint uppercase">
            {config.microcopy.stayShiny}
          </p>
        </div>
      </div>
    </header>
  );
}