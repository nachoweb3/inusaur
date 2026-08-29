import Link from "next/link";
import { config, isPlaceholder } from "@/data/config";
import { assetUrl } from "@/lib/utils";
import CopyButton from "@/components/ui/CopyButton";

export default function Footer() {
  const links = [
    { label: "X", href: config.twitterUrl },
    { label: "TELEGRAM", href: config.telegramUrl },
    { label: "MEME", href: "/meme" },
    { label: "ECONOMY", href: "/economy" },
    { label: "BUY", href: config.buyUrl },
  ];

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="container-x py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <img
                src={assetUrl("/images/shiny-logo.jpg")}
                alt="Shiny Capibara — the albino capybara"
                width={96}
                height={96}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-ink/10"
              />
              <div>
                <p className="display text-lg leading-none uppercase">
                  {config.projectName}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.3em] text-clay">
                  {config.ticker}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              The internet&apos;s shiniest capybara. Calm, rare, and completely
              unbothered.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-3 text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
              {links.map((link) => (
                <li key={link.label}>
                  {isPlaceholder(link.href) ? (
                    <span className="text-ink-faint">
                      {link.label} <span className="text-clay">· soon</span>
                    </span>
                  ) : (
                    <Link href={link.href} className="text-ink/70 transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contract */}
          <div className="max-w-sm">
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-ink/60 uppercase">
              Contract
            </p>
            <p className="mt-2 break-all font-mono text-xs leading-relaxed text-ink-soft">
              {config.contractAddress}
            </p>
            <CopyButton text={config.contractAddress} inline className="mt-3" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} {config.projectName} · {config.ticker} ·{" "}
            {config.chain}
          </p>
          <p className="max-w-md text-[0.7rem] leading-relaxed text-ink-faint">
            {config.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}