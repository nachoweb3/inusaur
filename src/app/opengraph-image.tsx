import { ImageResponse } from "next/og";
import { config } from "@/data/config";

export const alt = `${config.projectName} (${config.ticker}) — The Albino Capybara`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required by `output: "export"` — the OG image is generated at build time.
export const dynamic = "force-static";

/** Flat-color capybara for the OG image (satori-safe). */
function OgCapybara() {
  return (
    <svg viewBox="0 0 360 430" width="380" height="454">
      <ellipse cx="180" cy="424" rx="128" ry="13" fill="#1b1710" opacity="0.08" />
      <g>
        <path d="M112 92 C108 72 116 58 132 58 C144 58 150 70 148 84 C146 94 138 100 128 100 C120 100 114 97 112 92 Z" fill="#e4d7bf" />
        <path d="M248 92 C252 72 244 58 228 58 C216 58 210 70 212 84 C214 94 222 100 232 100 C240 100 246 97 248 92 Z" fill="#e4d7bf" />
        <path d="M64 408 C62 330 74 252 102 224 C122 204 238 204 258 224 C286 252 298 330 296 408 C296 414 290 418 284 418 L76 418 C70 418 64 414 64 408 Z" fill="#faf4e6" />
        <path d="M84 258 C82 190 96 118 124 96 C146 79 214 79 236 96 C264 118 278 190 276 258 C276 282 250 292 180 292 C110 292 84 282 84 258 Z" fill="#faf4e6" />
        <ellipse cx="180" cy="330" rx="66" ry="74" fill="#fffef9" opacity="0.6" />
        <path d="M132 348 C132 330 140 320 151 320 C162 320 170 330 170 348 L170 398 C170 406 162 412 151 412 C140 412 132 406 132 398 Z" fill="#e4d7bf" />
        <path d="M190 348 C190 330 198 320 209 320 C220 320 228 330 228 348 L228 398 C228 406 220 412 209 412 C198 412 190 406 190 398 Z" fill="#e4d7bf" />
        <path d="M112 196 C110 162 122 136 142 124 C157 115 203 115 218 124 C238 136 250 162 248 196 C247 220 226 230 180 230 C134 230 113 220 112 196 Z" fill="#fffefb" />
        <path d="M124 172 C122 148 138 134 180 134 C222 134 238 148 236 172 C234 190 218 200 180 200 C142 200 126 190 124 172 Z" fill="#241c12" />
        <ellipse cx="156" cy="172" rx="8" ry="11" fill="#14100a" />
        <ellipse cx="204" cy="172" rx="8" ry="11" fill="#14100a" />
        <g fill="#241c12">
          <ellipse cx="136" cy="112" rx="10" ry="6.5" />
          <ellipse cx="224" cy="112" rx="10" ry="6.5" />
          <path d="M126 112 L146 112 L146 106 L126 106 Z" />
          <path d="M214 112 L234 112 L234 106 L214 106 Z" />
        </g>
        <ellipse cx="116" cy="148" rx="15" ry="9" fill="#e8b49c" opacity="0.55" />
        <ellipse cx="244" cy="148" rx="15" ry="9" fill="#e8b49c" opacity="0.55" />
        <ellipse cx="146" cy="106" rx="34" ry="22" fill="#fffefb" opacity="0.65" />
      </g>
      <path d="M308 62 C310 74 320 84 332 86 C320 88 310 98 308 110 C306 98 296 88 284 86 C296 84 306 74 308 62 Z" fill="#d9a441" />
    </svg>
  );
}

/** Satori needs TTF/OTF (woff2 unsupported). Google serves TTF to old UAs. */
async function loadFonts(): Promise<Array<{ name: string; data: ArrayBuffer; style: "normal" | "italic" }>> {
  const fonts: Array<{ name: string; data: ArrayBuffer; style: "normal" | "italic" }> = [];
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008070208 Firefox/3.0.1" } },
    ).then((r) => r.text());
    // normal + italic, in css order
    const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.ttf)\)/g)].map((m) => m[1]);
    for (let i = 0; i < urls.length && i < 2; i++) {
      const data = await fetch(urls[i]).then((r) => r.arrayBuffer());
      if (data.byteLength > 0) {
        fonts.push({ name: "Fraunces", data, style: i === 0 ? "normal" : "italic" });
      }
    }
  } catch {
    /* render with fallback fonts */
  }
  return fonts;
}

export default async function OpengraphImage() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#faf6ee",
          color: "#1b1710",
          fontFamily: fonts.length ? "Fraunces" : undefined,
          padding: "64px 72px",
        }}
      >
        {/* left: copy */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 20,
              letterSpacing: 6,
              color: "#c2542e",
              fontWeight: 600,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#c2542e" }} />
            SOLANA · MEME · LEGEND
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 96, lineHeight: 0.98, letterSpacing: -2, textTransform: "uppercase" }}>
            <span>Shiny</span>
            <span style={{ color: "#b04a26", fontStyle: "italic" }}>Capibara</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 26, letterSpacing: 10, color: "#6f6757" }}>
            THE ALBINO CAPYBARA
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 22, color: "#6f6757" }}>
            {config.ticker} · {config.chain}
          </div>
        </div>

        {/* right: character */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <OgCapybara />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}