import { config, isPlaceholder } from "@/data/config";
import { assetUrl } from "@/lib/utils";

const statusItems = [
  { label: "PUMPFUN", url: config.buyUrl, active: !isPlaceholder(config.buyUrl) },
  { label: "X", url: config.twitterUrl, active: !isPlaceholder(config.twitterUrl) },
  { label: "TELEGRAM", url: config.telegramUrl, active: !isPlaceholder(config.telegramUrl) },
  { label: "CA", url: null, active: !isPlaceholder(config.contractAddress) },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-ink/10 bg-ink text-paper overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 bottom-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-green/5 blur-[120px]" />
      </div>

      <div className="container-x relative py-20">
        <div className="flex flex-col items-center gap-10 text-center">
          {/* Cinematic headline */}
          <h2 className="display text-4xl tracking-tight sm:text-6xl md:text-7xl">
            THE EVOLUTION
            <br />
            HAS BEGUN.
          </h2>

          {/* Logo + Name */}
          <div className="flex items-center gap-4">
            <img
              src={assetUrl("/images/inusaur-main.jpg")}
              alt="Inusaur"
              width={48}
              height={48}
              className="rounded-full object-cover ring-2 ring-green/30"
            />
            <div>
              <p className="display text-xl tracking-tight">
                {config.projectName.toUpperCase()}
              </p>
              <p className="text-xs font-bold tracking-[0.3em] text-green">
                {config.ticker}
              </p>
            </div>
          </div>

          {/* Status table */}
          <div className="w-full max-w-sm space-y-2">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-paper/10 px-4 py-2.5 font-mono text-xs"
              >
                <span className="tracking-widest text-paper/40 uppercase">
                  {item.label}
                </span>
                {item.active ? (
                  <a
                    href={item.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-green transition-colors hover:text-green/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green" />
                    LIVE
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-paper/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink/30 animate-pulse" />
                    COMING SOON
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="max-w-lg text-xs leading-relaxed text-paper/30">
            {config.disclaimer}
          </p>

          {/* Copyright */}
          <p className="font-mono text-[0.6rem] tracking-[0.3em] text-paper/15 uppercase">
            © {new Date().getFullYear()} {config.projectName}
          </p>
        </div>
      </div>
    </footer>
  );
}