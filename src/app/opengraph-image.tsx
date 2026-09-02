import { ImageResponse } from "next/og";
import { config } from "@/data/config";

export const alt = `${config.projectName} — ${config.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Required by `output: "export"` — the OG image is generated at build time.
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1020",
          color: "#e8edf7",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "radial-gradient(560px 300px at 15% 0%, rgba(249,115,22,0.22), transparent 70%), radial-gradient(640px 340px at 85% 100%, rgba(168,85,247,0.2), transparent 70%)",
          }}
        />
        <div style={{ display: "flex", fontSize: 120, fontWeight: 800, letterSpacing: -2 }}>
          <span style={{ display: "flex" }}>Raid</span>
          <span
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(90deg, #f97316, #f43f5e, #a855f7)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            OS
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#94a3b8",
            letterSpacing: 8,
            marginTop: 12,
          }}
        >
          THE OPERATING SYSTEM FOR WEB3 COMMUNITIES
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["🧠 BRAIN", "📊 VOLUME", "⚡ RAIDS", "🎮 XP", "🔥 TRENDING"].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(249,115,22,0.5)",
                fontSize: 22,
                color: "#e2e8f0",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
