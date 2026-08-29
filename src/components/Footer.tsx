import { config } from "@/data/config";
import { assetUrl } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="container-x py-16">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo */}
          <img
            src={assetUrl("/images/inusaur-main.jpg")}
            alt="Inusaur"
            width={64}
            height={64}
            className="rounded-full object-cover ring-2 ring-green/30"
          />

          {/* Name */}
          <p className="display text-2xl tracking-tight">
            {config.projectName.toUpperCase()}
          </p>

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href={config.twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-paper/20 px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-paper/10"
            >
              X / TWITTER ↗
            </a>
            {config.telegramUrl !== "#" && (
              <a
                href={config.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-paper/20 px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-paper/10"
              >
                TELEGRAM ↗
              </a>
            )}
          </div>

          {/* Disclaimer */}
          <p className="max-w-lg text-xs leading-relaxed text-paper/50">
            {config.disclaimer}
          </p>

          {/* Copyright */}
          <p className="text-xs tracking-widest text-paper/30 uppercase">
            © {new Date().getFullYear()} {config.projectName}. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}