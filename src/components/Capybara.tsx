"use client";

import { useId } from "react";

type CapybaraProps = {
  className?: string;
  /** Show the floating sparkle star (hero treatment). */
  sparkle?: boolean;
  /** Show soft ground shadow. */
  shadow?: boolean;
  /** Disable decorative animation (used inside small marks). */
  animated?: boolean;
};

/**
 * SHINY — the albino capybara.
 *
 * Hand-drawn vector character. Warm-white fur, blunt muzzle, calm
 * half-lidded eyes, tiny ears, sitting like a legend. Gradient ids
 * are unique per instance so the character can appear anywhere.
 */
export default function Capybara({
  className,
  sparkle = false,
  shadow = true,
  animated = true,
}: CapybaraProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = (name: string) => `sc-${uid}-${name}`;

  return (
    <svg
      viewBox="0 0 360 430"
      role="img"
      aria-label="Shiny Capibara, the albino capybara"
      className={className}
    >
      <defs>
        <linearGradient id={g("fur")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffdf7" />
          <stop offset="55%" stopColor="#faf4e6" />
          <stop offset="100%" stopColor="#efe5d2" />
        </linearGradient>
        <linearGradient id={g("furShade")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4ecdc" />
          <stop offset="100%" stopColor="#e4d7bf" />
        </linearGradient>
        <linearGradient id={g("muzzle")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffefb" />
          <stop offset="100%" stopColor="#faf3e4" />
        </linearGradient>
        <linearGradient id={g("nose")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33281d" />
          <stop offset="100%" stopColor="#1f1810" />
        </linearGradient>
        <radialGradient id={g("glow")} cx="0.5" cy="0.42" r="0.55">
          <stop offset="0%" stopColor="#fdf6e6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fdf6e6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft backlight halo */}
      <ellipse cx="180" cy="210" rx="185" ry="185" fill={`url(#${g("glow")})`} />

      <g className={animated ? "animate-float" : undefined}>
        {/* ears */}
        <path
          d="M112 92 C108 72 116 58 132 58 C144 58 150 70 148 84 C146 94 138 100 128 100 C120 100 114 97 112 92 Z"
          fill={`url(#${g("furShade")})`}
        />
        <path
          d="M248 92 C252 72 244 58 228 58 C216 58 210 70 212 84 C214 94 222 100 232 100 C240 100 246 97 248 92 Z"
          fill={`url(#${g("furShade")})`}
        />

        {/* body */}
        <path
          d="M64 408 C62 330 74 252 102 224 C122 204 238 204 258 224 C286 252 298 330 296 408 C296 414 290 418 284 418 L76 418 C70 418 64 414 64 408 Z"
          fill={`url(#${g("fur")})`}
        />

        {/* head */}
        <path
          d="M84 258 C82 190 96 118 124 96 C146 79 214 79 236 96 C264 118 278 190 276 258 C276 282 250 292 180 292 C110 292 84 282 84 258 Z"
          fill={`url(#${g("fur")})`}
        />

        {/* belly highlight */}
        <ellipse cx="180" cy="330" rx="66" ry="74" fill="#fffef9" opacity="0.55" />

        {/* front paws */}
        <path
          d="M132 348 C132 330 140 320 151 320 C162 320 170 330 170 348 L170 398 C170 406 162 412 151 412 C140 412 132 406 132 398 Z"
          fill={`url(#${g("furShade")})`}
        />
        <path
          d="M190 348 C190 330 198 320 209 320 C220 320 228 330 228 348 L228 398 C228 406 220 412 209 412 C198 412 190 406 190 398 Z"
          fill={`url(#${g("furShade")})`}
        />

        {/* muzzle */}
        <path
          d="M112 196 C110 162 122 136 142 124 C157 115 203 115 218 124 C238 136 250 162 248 196 C247 220 226 230 180 230 C134 230 113 220 112 196 Z"
          fill={`url(#${g("muzzle")})`}
        />

        {/* nose — the signature blunt capybara nose */}
        <path
          d="M124 172 C122 148 138 134 180 134 C222 134 238 148 236 172 C234 190 218 200 180 200 C142 200 126 190 124 172 Z"
          fill={`url(#${g("nose")})`}
        />
        <ellipse cx="156" cy="172" rx="8" ry="11" fill="#14100a" />
        <ellipse cx="204" cy="172" rx="8" ry="11" fill="#14100a" />

        {/* calm half-lidded eyes */}
        <g fill="#241c12">
          <ellipse cx="136" cy="112" rx="10" ry="6.5" />
          <ellipse cx="224" cy="112" rx="10" ry="6.5" />
          <path d="M126 112 L146 112 L146 106 L126 106 Z" fill="#241c12" />
          <path d="M214 112 L234 112 L234 106 L214 106 Z" fill="#241c12" />
        </g>

        {/* gentle blush */}
        <ellipse cx="116" cy="148" rx="15" ry="9" fill="#e8b49c" opacity="0.55" />
        <ellipse cx="244" cy="148" rx="15" ry="9" fill="#e8b49c" opacity="0.55" />

        {/* head shine */}
        <ellipse cx="146" cy="106" rx="34" ry="22" fill="#fffefb" opacity="0.65" />
      </g>

      {/* sparkle */}
      {sparkle && (
        <g className={animated ? "animate-sparkle" : undefined}>
          <path
            d="M308 62 C310 74 320 84 332 86 C320 88 310 98 308 110 C306 98 296 88 284 86 C296 84 306 74 308 62 Z"
            fill="#d9a441"
          />
          <path
            d="M60 44 C61 50 66 55 72 56 C66 57 61 62 60 68 C59 62 54 57 48 56 C54 55 59 50 60 44 Z"
            fill="#c2542e"
            opacity="0.8"
          />
        </g>
      )}

      {/* ground shadow */}
      {shadow && (
        <ellipse cx="180" cy="424" rx="128" ry="13" fill="#1b1710" opacity="0.09" />
      )}
    </svg>
  );
}