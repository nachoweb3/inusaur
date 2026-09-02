import { config } from "@/data/config";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--raidos-line)] py-10">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-sm font-bold">
          Raid<span className="raidos-gradient-text">OS</span> — {config.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-[var(--raidos-muted)]">
          <a href={config.creator.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--raidos-text)]">
            📸 {config.creator.handle}
          </a>
          <a href={config.creator.x} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--raidos-text)]">
            🐦 @nacho_web3_
          </a>
          <a href={config.creator.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--raidos-text)]">
            ▶️ {config.creator.handle}
          </a>
          <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--raidos-text)]">
            GitHub
          </a>
        </div>

        <p className="mt-4 text-xs text-[var(--raidos-muted)]">
          Created by {config.creator.handle} · Telegram-native · Privacy-first · AI via Ollama
        </p>
      </div>
    </footer>
  );
}
