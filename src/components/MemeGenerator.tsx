"use client";

import { useEffect, useRef, useState } from "react";

import { config } from "@/data/config";
import { assetUrl, cn } from "@/lib/utils";

/**
 * MEME GENERATOR — pick a background, drop a caption, download a PNG.
 *
 * Rendered on a client-side <canvas> (no libraries): the selected
 * background (real photos from the archive, the logo, or a solid tone)
 * is drawn cover-fit, then the classic top/bottom meme caption is drawn
 * with a heavy stroke so it reads on any background.
 */

const W = 1080;
const H = 1080;

const templates = [
  { id: "logo", src: "/images/shiny-logo.jpg", label: "The Logo" },
  ...config.gallery
    .filter((g): g is (typeof config.gallery)[number] & { image: string } =>
      Boolean(g.image),
    )
    .map((g) => ({ id: g.title, src: g.image as string, label: g.title })),
];

const tones = [
  { id: "paper", color: "#faf6ee", label: "Paper" },
  { id: "cream", color: "#fffdf8", label: "Cream" },
  { id: "ink", color: "#1b1710", label: "Ink" },
  { id: "clay", color: "#b04a26", label: "Clay" },
  { id: "moss", color: "#5f6b4c", label: "Moss" },
  { id: "gold", color: "#d9a441", label: "Gold" },
];

const lightText = { fill: "#fffdf8", stroke: "#1b1710" };
const darkText = { fill: "#1b1710", stroke: "#fffdf8" };

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [] as string[];
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function drawCaption(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  palette: { fill: string; stroke: string },
  anchorY: number,
  anchor: "top" | "bottom",
) {
  const lines = wrapLines(ctx, text, W * 0.86);
  if (lines.length === 0) return;

  const lineHeight = fontSize * 1.08;
  const total = lines.length * lineHeight;
  const startY = anchor === "top" ? anchorY : anchorY - total;

  ctx.font = `bold ${fontSize}px Impact, "Arial Black", "Georgia", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.lineWidth = Math.max(6, fontSize * 0.13);
  ctx.strokeStyle = palette.stroke;
  ctx.fillStyle = palette.fill;
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = fontSize * 0.18;
  ctx.shadowOffsetY = fontSize * 0.05;

  lines.forEach((line, i) => {
    const y = startY + i * lineHeight + lineHeight / 2;
    ctx.strokeText(line, W / 2, y);
    ctx.fillText(line, W / 2, y);
  });

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [template, setTemplate] = useState<string | null>("logo");
  const [tone, setTone] = useState("paper");
  const [topText, setTopText] = useState("KEEP CALM");
  const [bottomText, setBottomText] = useState("STAY SHINY");
  const [textColor, setTextColor] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState(104);
  const [copied, setCopied] = useState(false);

  const activeTemplate = templates.find((t) => t.id === template) ?? null;
  const activeTone = tones.find((t) => t.id === tone) ?? tones[0];

  /* ── Redraw whenever anything changes ────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const render = (img: HTMLImageElement | null) => {
      if (cancelled) return;
      ctx.clearRect(0, 0, W, H);

      if (img) {
        // cover-fit draw
        const scale = Math.max(W / img.width, H / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      } else {
        ctx.fillStyle = activeTone.color;
        ctx.fillRect(0, 0, W, H);
      }

      const palette = textColor === "light" ? lightText : darkText;
      drawCaption(ctx, topText, fontSize, palette, H * 0.14, "top");
      drawCaption(ctx, bottomText, fontSize, palette, H * 0.86, "bottom");
    };

    if (activeTemplate) {
      const img = new window.Image();
      img.onload = () => render(img);
      img.onerror = () => render(null);
      img.src = assetUrl(activeTemplate.src);
    } else {
      render(null);
    }

    return () => {
      cancelled = true;
    };
  }, [activeTemplate, activeTone, topText, bottomText, textColor, fontSize]);

  /* ── Export ──────────────────────────────────────────────────── */

  const canvasToBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve(null);
      canvas.toBlob(resolve, "image/png");
    });

  const download = async () => {
    const blob = await canvasToBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shiny-meme.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const share = async () => {
    const blob = await canvasToBlob();
    if (!blob) return;
    const file = new File([blob], "shiny-meme.png", { type: "image/png" });
    const shareData = {
      title: `${config.projectName} meme`,
      text: `Made with the ${config.projectName} meme generator ${config.websiteUrl}/meme`,
      files: [file],
    };
    if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled — fall through to download */
      }
    }
    await download();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${config.websiteUrl}/meme`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const inputClass =
    "w-full rounded-xl border border-ink/15 bg-paper-deep/60 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-clay focus:outline-none";

  return (
    <section
      aria-labelledby="meme-title"
      className="bg-paper pt-32 pb-24 sm:pt-36"
    >
      <div className="container-x">
        {/* Header */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
            TOOL · 100% LOCAL · PNG
          </p>
          <h1
            id="meme-title"
            className="display mt-6 text-[clamp(2.6rem,7vw,5.5rem)] uppercase"
          >
            The Shiny <em className="text-clay">Meme Machine</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Pick a photo from the archive, add the caption, download the PNG.
            Your meme, ready for the tribe — nothing leaves your browser.
          </p>
        </div>

        {/* Builder */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Controls */}
          <div className="flex flex-col gap-7">
            {/* Background */}
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                Background
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTemplate(null)}
                  aria-pressed={template === null}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase transition-colors",
                    template === null
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink-soft hover:border-ink hover:text-ink",
                  )}
                >
                  Solid
                </button>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    aria-pressed={template === t.id}
                    title={t.label}
                    className={cn(
                      "overflow-hidden rounded-full border-2 transition-all",
                      template === t.id
                        ? "border-clay"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={assetUrl(t.src)}
                      alt={t.label}
                      width={88}
                      height={88}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {template === null && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      aria-pressed={tone === t.id}
                      className={cn(
                        "h-9 w-9 rounded-full border-2 transition-all",
                        tone === t.id
                          ? "scale-110 border-clay"
                          : "border-ink/15 hover:scale-105",
                      )}
                      style={{ backgroundColor: t.color }}
                      title={t.label}
                      aria-label={`Solid background — ${t.label}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Captions */}
            <div className="flex flex-col gap-4">
              <label className="block">
                <span className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                  Top text
                </span>
                <input
                  type="text"
                  value={topText}
                  maxLength={40}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="KEEP CALM"
                  className={cn(inputClass, "mt-2")}
                />
              </label>
              <label className="block">
                <span className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                  Bottom text
                </span>
                <input
                  type="text"
                  value={bottomText}
                  maxLength={40}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="STAY SHINY"
                  className={cn(inputClass, "mt-2")}
                />
              </label>
            </div>

            {/* Style */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                  Text color
                </p>
                <div className="mt-2 flex gap-2">
                  {(
                    [
                      { id: "light", label: "LIGHT" },
                      { id: "dark", label: "DARK" },
                    ] as const
                  ).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setTextColor(c.id)}
                      aria-pressed={textColor === c.id}
                      className={cn(
                        "rounded-full border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase transition-colors",
                        textColor === c.id
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/15 text-ink-soft hover:border-ink hover:text-ink",
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                  Size · {fontSize}px
                </span>
                <input
                  type="range"
                  min={72}
                  max={140}
                  step={4}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="mt-2 block w-44 accent-clay"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-xs font-semibold tracking-[0.14em] text-paper uppercase transition-colors select-none hover:bg-clay"
              >
                ⬇ Download PNG
              </button>
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-8 py-4 text-xs font-semibold tracking-[0.14em] text-ink uppercase transition-colors select-none hover:border-ink hover:bg-ink/5"
              >
                Share
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="text-xs font-semibold tracking-[0.2em] text-clay uppercase transition-colors hover:text-ink"
              >
                {copied ? "LINK COPIED ✓" : "COPY LINK"}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-ink-faint">
              1080 × 1080 PNG · {config.ticker} watermark-free. Made with real
              photos from the {config.projectName} archive.
            </p>
          </div>

          {/* Preview */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="aspect-square w-full rounded-3xl border border-ink/10 shadow-[0_30px_60px_-25px_rgba(27,23,16,0.35)]"
                aria-label="Meme preview"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}