import { config } from "@/data/config";
import SectionTag from "@/components/ui/SectionTag";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import TokenStats from "@/components/TokenStats";

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink/10 py-5 first:pt-0 last:border-none sm:flex-row sm:items-baseline sm:justify-between">
      <dt className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "break-all font-mono text-sm text-ink"
            : "display text-lg uppercase"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default function Token() {
  return (
    <section id="token" aria-labelledby="token-title" className="bg-paper py-28 sm:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        {/* Copy + actions */}
        <div>
          <Reveal>
            <SectionTag>Token</SectionTag>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="token-title"
              className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] uppercase"
            >
              The <em className="text-clay">{config.ticker}</em> token
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              The character is the brand. The token is part of the ecosystem.
              No invented numbers — when there&apos;s something real to show,
              it will be shown.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={config.buyUrl} showSoon className="px-8 py-4 text-sm">
                BUY {config.ticker}
              </Button>
              <CopyButton text={config.contractAddress} />
            </div>
          </Reveal>

          {/* Future tools — centralized, no invented URLs */}
          <Reveal delay={320}>
            <div className="mt-12">
              <p className="text-[0.65rem] font-semibold tracking-[0.26em] text-ink-faint uppercase">
                Tools
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {config.tools.map((tool) => (
                  <li key={tool.name}>
                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:border-ink"
                      >
                        {tool.name}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/20 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">
                        {tool.name}
                        <span className="text-[0.6rem] text-clay">soon</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Token facts card */}
        <Reveal delay={200}>
          <dl className="rounded-3xl border border-ink/10 bg-cream p-8 shadow-[0_24px_60px_-30px_rgba(27,23,16,0.25)] sm:p-10">
            <Row label="Name" value={config.projectName} />
            <Row label="Ticker" value={config.ticker} />
            <Row label="Chain" value={config.chain} />
            <Row
              label="Contract"
              value={
                <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <code className="font-mono text-xs leading-relaxed text-ink sm:text-sm">
                    {config.contractAddress}
                  </code>
                  <CopyButton text={config.contractAddress} inline />
                </span>
              }
              mono
            />
            <Row
              label="Total Supply"
              value={
                config.totalSupply ?? (
                  <span className="text-sm font-medium tracking-[0.2em] text-ink-faint uppercase">
                    TBA — announced by the tribe
                  </span>
                )
              }
            />
          </dl>
        </Reveal>
      </div>

      {/* Live market data — real numbers only, else an honest placeholder */}
      <div className="container-x mt-16">
        <Reveal>
          <TokenStats />
        </Reveal>
      </div>
    </section>
  );
}