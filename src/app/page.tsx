import { config } from "@/data/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center md:pt-28">
            <Reveal>
              <div className="flex flex-wrap justify-center gap-2.5">
                <span className="raidos-chip">TELEGRAM-NATIVE</span>
                <span className="raidos-chip">AI-POWERED</span>
                <span className="raidos-chip">SELF-HOSTED OR MANAGED</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
                Your community gets a <span className="raidos-gradient-text">brain</span>.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--raidos-muted)] md:text-xl">
                RaidOS answers your members from official info, tracks your token&apos;s market,
                runs raids and rewards your community with XP, quests and badges —{" "}
                <strong className="text-[var(--raidos-text)]">installed and managed for you</strong>.
                You never touch a server.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap justify-center gap-3.5">
                <a href="#pricing" className="raidos-btn-primary">
                  See pricing
                </a>
                <a href="#demo" className="raidos-btn-ghost">
                  Watch it work
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRODUCT: FIVE LAYERS ─────────────────────────────── */}
        <section id="product" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <p className="raidos-tag">THE PRODUCT</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Five layers. One bot.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {config.layers.map((layer, i) => (
                <Reveal key={layer.name} delay={i * 70}>
                  <div className="raidos-card h-full p-5">
                    <div className="text-3xl">{layer.emoji}</div>
                    <p className="raidos-tag mt-3">{layer.tag}</p>
                    <h3 className="mt-0.5 text-lg font-bold">{layer.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--raidos-muted)]">
                      {layer.blurb}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-[var(--raidos-muted)]">
                Everything feeds the intelligence layer — raids generate conversations, conversations
                become insights, insights shape your next move.{" "}
                <span className="text-[var(--raidos-text)]">That loop is the product.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── DEMO ─────────────────────────────────────────────── */}
        <section id="demo" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-4xl px-5">
            <Reveal>
              <p className="raidos-tag">LIVE DEMO</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Watch it work.
              </h2>
              <p className="mt-4 max-w-2xl text-[var(--raidos-muted)]">
                This is the actual output from a live RaidOS community. Want to poke it yourself? Add{" "}
                <a
                  href={`https://t.me/${config.demoBot}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--raidos-orange)] hover:underline"
                >
                  @{config.demoBot}
                </a>{" "}
                to any group.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="raidos-terminal mt-8">
                <div className="raidos-terminal-bar">
                  <span className="raidos-terminal-dot bg-[#f43f5e]" />
                  <span className="raidos-terminal-dot bg-[#facc15]" />
                  <span className="raidos-terminal-dot bg-[#22c55e]" />
                  <span className="ml-3 text-xs tracking-[0.2em] text-[var(--raidos-muted)]">
                    T.GROUP · LIVE
                  </span>
                </div>
                <div className="space-y-4 p-5">
                  {config.demo.map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      {line.who === "user" ? (
                        <p className="text-[#7dd3fc]">
                          <span className="font-bold">{line.name}:</span>{" "}
                          <span className="text-[#cbd5e1]">{line.text}</span>
                        </p>
                      ) : (
                        <p className="whitespace-pre-line text-[#fca5a5]">
                          <span className="font-bold">{line.name}</span>
                          <br />
                          <span className="text-[#e2e8f0]">{line.text}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────── */}
        <section id="pricing" className="scroll-mt-20 border-y border-[var(--raidos-line)] bg-[var(--raidos-bg2)] py-20">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <p className="raidos-tag">PRICING</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Two ways to get RaidOS. One is free.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {config.pricing.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 90} className="h-full">
                  <div
                    className={`raidos-card relative flex h-full flex-col p-7 ${
                      plan.hot ? "!border-[rgba(249,115,22,0.65)]" : ""
                    }`}
                  >
                    {plan.hot && (
                      <span className="absolute -top-3 left-6 rounded-full bg-[var(--raidos-orange)] px-3 py-1 text-[10px] font-extrabold tracking-[0.14em] text-[#1a1005]">
                        MOST POPULAR
                      </span>
                    )}
                    <h3 className="text-lg font-bold">
                      {plan.emoji} {plan.name}
                    </h3>
                    <p className="mt-3 text-4xl font-extrabold">
                      {plan.price}
                      <span className="ml-1.5 text-base font-semibold text-[var(--raidos-muted)]">
                        {plan.unit}
                      </span>
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--raidos-muted)]">
                      {plan.note}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2.5 text-sm text-[#cbd5e1]">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <span className="font-bold text-[#4ade80]">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-7 ${plan.hot ? "raidos-btn-primary" : "raidos-btn-ghost"}`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ONBOARDING ───────────────────────────────────────── */}
        <section id="onboarding" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-4xl px-5">
            <Reveal>
              <p className="raidos-tag">ONBOARDING</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Live in 48 hours.
              </h2>
            </Reveal>

            <div className="mt-10 space-y-4">
              {config.onboarding.map((step, i) => (
                <Reveal key={step.day} delay={i * 80}>
                  <div className="raidos-card flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:gap-6">
                    <span className="raidos-gradient-text w-24 shrink-0 text-xl font-extrabold">
                      {step.day}
                    </span>
                    <p className="text-[var(--raidos-muted)]">{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20 border-t border-[var(--raidos-line)] py-20">
          <div className="mx-auto max-w-4xl px-5">
            <Reveal>
              <p className="raidos-tag">FAQ</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Honest answers.
              </h2>
            </Reveal>

            <div className="mt-10 space-y-3">
              {config.faq.map((item, i) => (
                <Reveal key={item.q} delay={i * 60}>
                  <details className="raidos-card group p-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                      {item.q}
                      <span className="text-[var(--raidos-orange)] transition-transform group-open:rotate-45">
                        ＋
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--raidos-muted)]">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
                Your mods answer the same question{" "}
                <span className="raidos-gradient-text">fifty times</span>.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[var(--raidos-muted)]">
                Let the brain take it from here. Setup is done-for-you and your community is live
                within 48 hours.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <a href={config.creator.instagram} target="_blank" rel="noopener noreferrer" className="raidos-btn-primary">
                  DM to get started
                </a>
                <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="raidos-btn-ghost">
                  Explore the code
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
