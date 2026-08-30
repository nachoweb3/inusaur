import { ImageResponse } from "next/og";
import { config } from "@/data/config";

export const alt = `${config.projectName} (${config.ticker}) — The Shiba That Evolved Into Something Unexpected`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required by `output: "export"` — the OG image is generated at build time.
export const dynamic = "force-static";

/** Flat-color Inusaur for the OG image (satori-safe). */
function OgInusaur() {
  return (
    <svg viewBox="0 0 400 400" width="400" height="400">
      {/* Body - green Shiba shape */}
      <ellipse cx="200" cy="260" rx="120" ry="100" fill="#3d8b37" />
      {/* Belly */}
      <ellipse cx="200" cy="280" rx="70" ry="60" fill="#5aad52" />
      {/* Head */}
      <ellipse cx="200" cy="140" rx="80" ry="70" fill="#3d8b37" />
      {/* Ears */}
      <polygon points="130,100 145,40 165,100" fill="#3d8b37" />
      <polygon points="270,100 255,40 235,100" fill="#3d8b37" />
      {/* Inner ears */}
      <polygon points="138,95 148,50 160,95" fill="#2d6b2a" />
      <polygon points="262,95 252,50 240,95" fill="#2d6b2a" />
      {/* Eyes */}
      <ellipse cx="170" cy="130" rx="18" ry="16" fill="white" />
      <ellipse cx="230" cy="130" rx="18" ry="16" fill="white" />
      <circle cx="174" cy="132" r="10" fill="#1a1a1a" />
      <circle cx="234" cy="132" r="10" fill="#1a1a1a" />
      <circle cx="178" cy="128" r="3" fill="white" />
      <circle cx="238" cy="128" r="3" fill="white" />
      {/* Nose */}
      <ellipse cx="200" cy="155" rx="8" ry="5" fill="#1a1a1a" />
      {/* Mouth */}
      <path d="M185,165 Q200,175 215,165" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      {/* The iconic pink flower/bulb on back */}
      <ellipse cx="200" cy="180" rx="45" ry="35" fill="#2d6b2a" />
      {/* Flower petals */}
      <ellipse cx="200" cy="145" rx="30" ry="15" fill="#f472b6" />
      <ellipse cx="180" cy="155" rx="25" ry="12" fill="#f472b6" transform="rotate(-30 180 155)" />
      <ellipse cx="220" cy="155" rx="25" ry="12" fill="#f472b6" transform="rotate(30 220 155)" />
      {/* Flower center */}
      <circle cx="200" cy="150" r="12" fill="#fbbf24" />
      {/* Legs */}
      <rect x="140" y="340" width="25" height="50" rx="10" fill="#3d8b37" />
      <rect x="235" y="340" width="25" height="50" rx="10" fill="#3d8b37" />
      {/* Spots */}
      <circle cx="160" cy="220" r="8" fill="#2d6b2a" />
      <circle cx="240" cy="200" r="6" fill="#2d6b2a" />
      <circle cx="180" cy="300" r="7" fill="#2d6b2a" />
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
          background: "linear-gradient(135deg, #1a2e1a 0%, #0d1f0d 100%)",
          color: "#f0fdf4",
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
              color: "#f472b6",
              fontWeight: 600,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#f472b6" }} />
            SOLANA · MEME · EVOLVED
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 96, lineHeight: 0.98, letterSpacing: -2, textTransform: "uppercase" }}>
            <span style={{ color: "#4ade80" }}>Inu</span>
            <span style={{ color: "#f472b6", fontStyle: "italic" }}>saur</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 24, letterSpacing: 6, color: "#86efac" }}>
            THE SHIBA THAT EVOLVED INTO SOMETHING UNEXPECTED
          </div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 22, color: "#a3e635" }}>
            ${config.ticker?.replace("$", "")} · {config.chain}
          </div>
        </div>

        {/* right: character */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <OgInusaur />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
