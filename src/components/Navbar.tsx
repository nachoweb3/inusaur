import { config } from "@/data/config";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--raidos-line)] bg-[rgba(11,16,32,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="text-xl font-extrabold tracking-tight">
          Raid<span className="raidos-gradient-text">OS</span>
        </a>

        <nav className="hidden items-center gap-7 text-[13px] font-semibold tracking-[0.12em] text-[var(--raidos-muted)] md:flex">
          {config.nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-[var(--raidos-text)]">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={config.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="raidos-btn-ghost !px-4 !py-2 text-sm"
        >
          GitHub →
        </a>
      </div>
    </header>
  );
}
