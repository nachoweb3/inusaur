"use client";

import { useEffect, useRef, useState } from "react";
import { config } from "@/data/config";
import { assetUrl, cn } from "@/lib/utils";

const BACKGROUNDS = [
  { name: "Green Garden", color: "#4a8a4a" },
  { name: "Pink Bloom", color: "#e06080" },
  { name: "Forest Dark", color: "#2d5a2d" },
  { name: "Cream", color: "#f0f7f0" },
  { name: "Ink", color: "#0d1f0d" },
  { name: "Gold Shine", color: "#d9a441" },
];

const FONTS = [
  { name: "Impact", value: "Impact, Arial Black, sans-serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Courier", value: "Courier New, monospace" },
];

const CANVAS_SIZE = 1080;

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bg, setBg] = useState(BACKGROUNDS[0]);
  const [textTop, setTextTop] = useState("INUSAUR");
  const [textBottom, setTextBottom] = useState("STAY EVOLVED");
  const [fontSize, setFontSize] = useState(72);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [font, setFont] = useState(FONTS[0]);
  const [showImage, setShowImage] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Background
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Inusaur image (centered)
    if (showImage) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const size = CANVAS_SIZE * 0.6;
        const x = (CANVAS_SIZE - size) / 2;
        const y = (CANVAS_SIZE - size) / 2;
        ctx.drawImage(img, x, y, size, size);
        drawText(ctx);
      };
      img.src = assetUrl("/images/inusaur-main.jpg");
    } else {
      drawText(ctx);
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const drawLine = (text: string, y: number) => {
      if (!text) return;
      ctx.font = `bold ${fontSize}px ${font.value}`;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = fontSize / 8;
      ctx.lineJoin = "round";
      ctx.strokeText(text, CANVAS_SIZE / 2, y);
      ctx.fillStyle = fontColor;
      ctx.fillText(text, CANVAS_SIZE / 2, y);
    };

    drawLine(textTop, fontSize + 40);
    drawLine(textBottom, CANVAS_SIZE - fontSize - 40);
  };

  useEffect(() => {
    draw();
  }, [bg, textTop, textBottom, fontSize, fontColor, strokeColor, font, showImage]);

  const download = async () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement("a");
      link.download = "inusaur-meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { /* */ }
    setTimeout(() => setDownloading(false), 1000);
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png"),
      );
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const file = new File([blob], "inusaur-meme.png", { type: "image/png" });
        await navigator.share({ files: [file], title: "Inusaur Meme" });
      }
    } catch { /* share unavailable */ }
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Canvas preview */}
      <div className="flex-1">
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block w-full"
          />
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="rounded-full bg-green px-6 py-2.5 text-xs font-bold tracking-widest text-paper uppercase transition-colors hover:bg-moss disabled:opacity-50"
          >
            {downloading ? "SAVING…" : "DOWNLOAD PNG"}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-full border border-ink/20 px-6 py-2.5 text-xs font-bold tracking-widest text-ink uppercase transition-colors hover:border-ink hover:bg-ink/5"
          >
            SHARE
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full space-y-6 lg:w-80">
        {/* Backgrounds */}
        <div>
          <p className="mb-2 text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            BACKGROUND
          </p>
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setBg(b)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  bg.name === b.name ? "border-ink scale-110" : "border-transparent",
                )}
                style={{ backgroundColor: b.color }}
                aria-label={b.name}
              />
            ))}
          </div>
        </div>

        {/* Text inputs */}
        <div>
          <label className="mb-1 block text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            TOP TEXT
          </label>
          <input
            type="text"
            value={textTop}
            onChange={(e) => setTextTop(e.target.value.toUpperCase())}
            maxLength={40}
            className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink focus:border-green focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            BOTTOM TEXT
          </label>
          <input
            type="text"
            value={textBottom}
            onChange={(e) => setTextBottom(e.target.value.toUpperCase())}
            maxLength={40}
            className="w-full rounded-xl border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink focus:border-green focus:outline-none"
          />
        </div>

        {/* Font size */}
        <div>
          <label className="mb-1 block text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            FONT SIZE: {fontSize}px
          </label>
          <input
            type="range"
            min={24}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-green"
          />
        </div>

        {/* Font */}
        <div>
          <p className="mb-2 text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
            FONT
          </p>
          <div className="flex gap-2">
            {FONTS.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setFont(f)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs transition-all",
                  font.name === f.name
                    ? "border-green bg-green/10 text-ink"
                    : "border-ink/15 text-ink-faint hover:border-ink/30",
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
              TEXT COLOR
            </label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-xl border border-ink/15"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[0.65rem] font-semibold tracking-widest text-ink-faint uppercase">
              STROKE
            </label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-xl border border-ink/15"
            />
          </div>
        </div>

        {/* Show image toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowImage(!showImage)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              showImage ? "bg-green" : "bg-ink/20",
            )}
            aria-label="Toggle image"
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-transform",
                showImage ? "translate-x-5" : "translate-x-0.5",
              )}
            />
          </button>
          <span className="text-xs text-ink-faint">Show Inusaur image</span>
        </div>
      </div>
    </div>
  );
}