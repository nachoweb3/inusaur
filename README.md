# Inusaur ($SAUR)

> The Shiba that evolved into something unexpected.

A memecoin website built with Next.js, featuring a playable Snake game, meme generator, and community hub.

## Live Site

**https://nachoweb3.github.io/shinycapibara/**

## Features

- **Hero Section** — INUSAUR headline, ticker, CTAs, contract address copy
- **Lore Section** — Origin story of Inusaur (humorous, meme-heavy)
- **Evolution Section** — SHIBA → ??? → INUSAUR interactive reveal
- **Token Section** — $SAUR info, contract, buy/chart buttons, tools
- **Snake Game** — Inusaur character, meme items, high score, mobile touch controls
- **Gallery/Archives** — Inusaur images as collectible discoveries
- **Community Section** — Social links, join the evolution CTA
- **Meme Generator** — Canvas-based meme creation with download/share
- **Connect Wallet** — Phantom/Solflare support, SOL + $SBARA balances
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Static Export** — Deployed to GitHub Pages

## Tech Stack

- **Framework:** Next.js 16 (static export)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Deployment:** GitHub Pages
- **Wallet:** Phantom/Solflare (zero dependencies)

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   ├── meme/page.tsx     # Meme generator
│   └── economy/page.tsx  # Snake game
├── components/
│   ├── Navbar.tsx        # Navigation
│   ├── Footer.tsx        # Footer
│   ├── InusaurSnake.tsx  # Snake game
│   ├── MemeGenerator.tsx # Meme generator
│   ├── ConnectWalletButton.tsx # Wallet button
│   └── ui/               # UI components
├── sections/
│   ├── Hero.tsx          # Hero section
│   ├── Lore.tsx          # Lore section
│   ├── Evolution.tsx     # Evolution section
│   ├── Token.tsx         # Token section
│   ├── Game.tsx          # Game section
│   ├── Archives.tsx      # Gallery section
│   └── Community.tsx     # Community section
├── data/
│   └── config.ts         # Centralized configuration
├── lib/
│   ├── utils.ts          # Utility functions
│   └── wallet.tsx        # Wallet context
└── styles/
    └── globals.css       # Global styles
```

## Configuration

All content, links, and settings are centralized in `src/data/config.ts`. Edit this file to update:

- Project name, ticker, chain
- Contract address
- Social links (Twitter, Telegram)
- Lore chapters
- Evolution stages
- Gallery items
- Token tools

## License

This is a meme/community project. Nothing on this website constitutes financial advice.