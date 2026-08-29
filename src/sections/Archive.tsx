"use client";

import { useEffect, useState } from "react";
import { config, type GalleryItem } from "@/data/config";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";
import Capybara from "@/components/Capybara";
import { assetUrl, cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "ALL" },
  { id: "meme", label: "MEMES" },
  { id: "fan-art", label: "FAN ART" },
  { id: "lore", label: "LORE" },
  { id: "screenshot", label: "SCREENSHOTS" },
] as const;

// Only show filters that actually have pieces in the config.
const activeCategories = categories.filter(
  (cat) => cat.id === "all" || config.gallery.some((g) => g.category === cat.id),
);

const tones: Record<GalleryItem["tone"], string> = {
  dawn: "bg-[linear-gradient(145deg,#f7efdd,#ecdfc4)]",
  clay: "bg-[linear-gradient(145deg,#e8c3ae,#d99a76)]",
  moss: "bg-[linear-gradient(145deg,#cfd6bd,#aab493)]",
  gold: "bg-[linear-gradient(145deg,#f0ddb4,#e0bd7c)]",
  ink: "bg-[linear-gradient(145deg,#3a342a,#221e17)]",
};

function Tile({
  item,
  onOpen,
  large = false,
}: {
  item: GalleryItem;
  onOpen?: (item: GalleryItem) => void;
  large?: boolean;
}) {
  const isDark = item.tone === "ink";
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      aria-label={`Open ${item.title} in the archive`}
      className={cn(
        "group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl text-left transition-all duration-300",
        tones[item.tone],
        large ? "cursor-default" : "hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(27,23,16,0.35)]",
      )}
    >
      {item.image ? (
        <img
          src={assetUrl(item.image)}
          alt={item.title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500",
            large ? "" : "group-hover:scale-105",
          )}
        />
      ) : (
        <Capybara
          animated={false}
          shadow={false}
          className={cn(
            "transition-transform duration-500",
            large ? "h-40 w-40 sm:h-56 sm:w-56" : "h-20 w-20 group-hover:scale-110 sm:h-24 sm:w-24",
            isDark ? "opacity-80" : "opacity-70",
          )}
        />
      )}
      {/* subtle bottom gradient for caption legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p
          className={cn(
            "text-[0.6rem] font-semibold tracking-[0.28em] uppercase",
            item.image ? "text-gold" : isDark ? "text-gold" : "text-clay",
          )}
        >
          {item.category.replace("-", " ")}
        </p>
        <p
          className={cn(
            "display mt-1 text-lg uppercase leading-tight",
            item.image ? "text-cream" : isDark ? "text-cream" : "text-ink",
          )}
        >
          {item.title}
        </p>
        <p
          className={cn(
            "mt-1 text-xs",
            item.image ? "text-cream/80" : isDark ? "text-cream/60" : "text-ink-soft",
          )}
        >
          by {item.creator}
        </p>
      </div>
    </button>
  );
}

export default function Archive() {
  const [filter, setFilter] = useState<(typeof categories)[number]["id"]>("all");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const items =
    filter === "all" ? config.gallery : config.gallery.filter((g) => g.category === filter);

  // Close lightbox on Escape / lock scroll
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="archive" aria-labelledby="archive-title" className="bg-paper py-28 sm:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <SectionTag>Gallery</SectionTag>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="archive-title"
                className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] uppercase"
              >
                The shiny <em className="text-clay">archive</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
              Photos, memes and lore artwork collected by the tribe. The
              archive grows as the legend does.
            </p>
          </Reveal>
        </div>

        {/* Filters */}
        <Reveal delay={120}>
          <div role="group" aria-label="Filter archive by category" className="mt-10 flex flex-wrap gap-2">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={filter === cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition-colors",
                  filter === cat.id
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 60}>
              <Tile item={item} onOpen={setActive} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <p className="mt-10 text-center text-[0.68rem] tracking-[0.3em] text-ink-faint uppercase">
            More artifacts are being added by the tribe…
          </p>
        </Reveal>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} — archive entry`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Tile item={active} large />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs tracking-[0.2em] text-paper/70 uppercase">
                {active.title} · by {active.creator}
              </p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-full border border-paper/30 px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:border-paper"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}