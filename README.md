# SHINY CAPIBARA ($SBARA)

The official website for **Shiny Capibara** — the albino capybara building
an internet-native community on Solana. A character and internet movement
first, a token second.

## Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS v4**
- Minimal dependencies, zero UI libraries

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve production build
```

## Project structure

```
src/
  app/            # routes, layout, SEO, OG image, favicon
  components/     # shared components (Navbar, Footer, Capybara…)
    ui/           # small primitives (Button, CopyButton, Reveal…)
  sections/       # one file per homepage section
  data/config.ts  # ★ ALL content & links live here
  lib/            # helpers (clipboard, classnames)
  styles/         # design system (Tailwind theme, keyframes)
```

## Editing the site — the one file you need

Everything content-related lives in **`src/data/config.ts`**:

| Field           | What to change                                   |
| --------------- | ------------------------------------------------ |
| `buyUrl`        | Swap link (currently pump.fun)                   |
| `twitterUrl`    | X profile / post                                 |
| `telegramUrl`   | Real Telegram group                              |
| `websiteUrl`    | Production domain (also fixes SEO + share links) |
| `totalSupply`   | Real supply, once announced                       |
| `lore`          | Add/remove lore chapters                         |
| `journey`       | Add/remove journey stages                        |
| `gallery`       | Add real archive images (`image: "/…"`)          |
| `tools`         | Enable DexScreener / Jupiter / Solscan links     |
| `social.posts`  | Wire up real X/Twitter content (never fake)      |

**Logo:** the official photo lives at `public/images/shiny-logo.jpg` and is
used in the navbar, hero, “Meet Shiny” and footer (all through
`next/image`).

**Gallery:** real photos & memes live in `public/images/gallery/` and are
referenced from `config.gallery` (category: `lore` for photos, `meme` for
memes). Drop new files there and add an entry to the config — the archive
and its filters update automatically.

The contract address is defined **only** in this file and referenced
everywhere else.

## Design notes

- The albino capybara is a hand-drawn vector character (`Capybara.tsx`) —
  the visual identity of the project.
- Warm paper + ink palette, earthy accents used sparingly. No neon.
- Subtle motion everywhere: float, parallax, scroll reveals, marquee.
  All decorative motion respects `prefers-reduced-motion`.
- No fake data: stats, supply, tools and social posts render only when
  real values exist in the config.## The Shiny Economy game (`/economy`)

An interactive idle game that projects a possible circular economy for
$SBARA: click the capybara for shine → grow the tribe → mint memes →
earn $SBARA → spend it on upgrades that feed the loop.

- Progress **saves to localStorage** on the device.
- **Quests** grant one-time $SBARA rewards for milestones.
- **Leaderboard** (local to the device) keeps your top 5 runs, with a
  share button that posts your stats.
- Includes a circular-economy diagram (desktop) / vertical flow (mobile).
- Clearly framed as a playful projection, never a promise.
- Game logic lives in `src/components/ShinyEconomyGame.tsx`; the diagram
  in `src/components/EconomyLoop.tsx`. Add new upgrades, quests and
  achievements there.

## Live token stats (data-driven)

The `Token` section shows real market data (price, 24h change, market
cap, volume, liquidity) proxied from **DexScreener** via
`/api/token-stats`. The rule is absolute: **no invented numbers** — until
the pair is visible on-chain the section renders an honest “awaiting
data” state. Refresh is capped at 30s on the API side and 60s in the UI.

## Meme generator (`/meme`)

Canvas-based, fully client-side (zero libraries): pick a real photo from
the archive (or a solid tone), add top/bottom captions, download a
1080×1080 PNG or share it. Lives in `src/components/MemeGenerator.tsx`;
templates come straight from `config.gallery`.

## From the feed (real X embed)

`<SocialFeed />` embeds the tweet configured in `config.twitterUrl` using
Twitter's official oEmbed API + widgets.js. It only renders REAL posts,
and the homepage revalidates hourly (ISR) so the embed stays fresh.

## Remaining roadmap hooks

Still open, by design: wallet connection, on-chain leaderboard, quests
on-chain, token-gated experiences, and more games.