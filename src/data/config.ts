/**
 * RAIDOS — centralized configuration
 * ------------------------------------------------------------------
 * Single source of truth for the RaidOS website. Copy, pricing and
 * contact data live here and are never duplicated elsewhere.
 *
 * ── HOW TO EDIT ────────────────────────────────────────────────────
 * • pricing: tune tiers freely — they render the pricing grid.
 * • links: all socials point to the creator, @nacho_web3.
 * ------------------------------------------------------------------
 */

const GITHUB_URL = "https://github.com/nachoweb3/raidos";

export const config = {
  projectName: "RaidOS",
  tagline: "The Operating System for Web3 Communities",

  websiteUrl: "https://inusaur.online",

  description:
    "RaidOS gives your Telegram community a brain: it answers members from your official info, tracks your token's market, runs raids and rewards your members with XP, quests and badges.",

  // ── LINKS ────────────────────────────────────────────────────────
  githubUrl: GITHUB_URL,
  creator: {
    handle: "@nacho_web3",
    instagram: "https://instagram.com/nacho_web3",
    x: "https://x.com/nacho_web3_",
    youtube: "https://youtube.com/@nacho_web3",
  },

  // Demo bot that prospects can try live.
  demoBot: "inusaurai_bot",

  // ── NAVIGATION ───────────────────────────────────────────────────
  nav: [
    { label: "PRODUCT", href: "#product" },
    { label: "DEMO", href: "#demo" },
    { label: "PRICING", href: "#pricing" },
    { label: "ONBOARDING", href: "#onboarding" },
    { label: "FAQ", href: "#faq" },
  ],

  // ── THE FIVE LAYERS ──────────────────────────────────────────────
  layers: [
    {
      emoji: "🧠",
      name: "Brain",
      tag: "INTELLIGENCE",
      blurb:
        "Answers your members from your official info only — and says “I don't know” rather than inventing. Learns from pinned messages and admin posts.",
    },
    {
      emoji: "📊",
      name: "Volume",
      tag: "MARKET",
      blurb:
        "Live price, volume, liquidity, buys/sells and holders. Automatic spike, whale and liquidity-drain alerts — always from real data.",
    },
    {
      emoji: "⚡",
      name: "Raids",
      tag: "ACTIVATION",
      blurb:
        "Coordinate X pushes with goals, timers and XP rewards. Honest, SELF-REPORTED tracking — no fake engagement, ever.",
    },
    {
      emoji: "🎮",
      name: "XP & Quests",
      tag: "RETENTION",
      blurb:
        "Levels, daily streaks, missions and badges that keep members coming back. Contribution pays — literally.",
    },
    {
      emoji: "😹",
      name: "Meme Contests",
      tag: "CULTURE",
      blurb:
        "Submissions, community voting, crowned winners with XP prizes. Your group's culture on autopilot.",
    },
  ],

  // ── DEMO TRANSCRIPT ──────────────────────────────────────────────
  demo: [
    { who: "user", name: "@newbie", text: "when was fair launch? was I too late?" },
    {
      who: "bot",
      name: "🧠 Community Brain",
      text: "Fair launch was 12:00 UTC, March 3 — and no, the community keeps building every day. Anything else?",
    },
    { who: "user", name: "@degen", text: "/volume" },
    {
      who: "bot",
      name: "📊 $TOKEN MARKET",
      text: "Price $0.000042 · 24H Vol $182K · Liq $74K · Buys 1,284 / Sells 917 · Trend: 🔥 ACCELERATING",
    },
    { who: "user", name: "@raider", text: "/rank" },
    {
      who: "bot",
      name: "🏆 RANK",
      text: "Level 7 — Hardened Degen · 4,820 XP · 🔥 12-day streak · 🏅 3 badges",
    },
  ],

  // ── PRICING ──────────────────────────────────────────────────────
  pricing: [
    {
      name: "Launch Setup",
      emoji: "🚀",
      price: "$300–$1,000",
      unit: "one-time",
      note: "Final price depends on group size and how much official content we train the brain on.",
      features: [
        "Full install on our infrastructure — zero servers for you",
        "Brain trained on your official answers",
        "Token wired into /volume with live market alerts",
        "Starter quests + badges configured",
        "Your first launch raid planned with your mods",
        "Admin walkthrough for your team",
      ],
      cta: "DM to book",
      href: "https://instagram.com/nacho_web3",
      hot: false,
    },
    {
      name: "Managed Hosting",
      emoji: "🧠",
      price: "$49–$299",
      unit: "/month",
      note: "Tiered by community size and features. Cancel anytime.",
      features: [
        "Everything in Launch Setup",
        "24/7 uptime — we host, monitor and update",
        "Market alerts watched around the clock",
        "Monthly community health report",
        "Branded commands & custom personality",
        "Priority support on Telegram",
      ],
      cta: "DM to subscribe",
      href: "https://x.com/nacho_web3_",
      hot: true,
    },
    {
      name: "Self-hosted",
      emoji: "🛠",
      price: "Free",
      unit: "open source",
      note: "For technical teams. Runs on your machine, your data stays yours.",
      features: [
        "Complete source code on GitHub",
        "Local AI via Ollama — privacy-first",
        "Cloud AI mode also supported",
        "63 automated tests, strict TypeScript",
        "Community support via GitHub issues",
      ],
      cta: "Read the install guide",
      href: GITHUB_URL,
      hot: false,
    },
  ],

  // ── ONBOARDING TIMELINE ──────────────────────────────────────────
  onboarding: [
    {
      day: "Day 1",
      text: "You send your links, token contract and official answers. We deploy and train the brain.",
    },
    {
      day: "Day 2",
      text: "Bot joins your group, quests and badges go live, your first raid is scheduled. Admin walkthrough for your team.",
    },
    {
      day: "Week 1",
      text: "We tune answers and alert thresholds with your mods until it feels like your best moderator.",
    },
  ],

  // ── FAQ ──────────────────────────────────────────────────────────
  faq: [
    {
      q: "Does RaidOS make fake volume or fake engagement?",
      a: "No — by design. It detects and amplifies real activity. Every engagement number is either measured or explicitly labeled SELF-REPORTED, and alerts only fire on real market data.",
    },
    {
      q: "Does my community's data leave my server?",
      a: "In self-hosted local mode, no — AI runs through Ollama on your machine and message text never leaves. In managed mode, prompts go to the AI provider we configure, and message bodies are purged after a retention window.",
    },
    {
      q: "Can it answer wrongly about my project?",
      a: "The Brain only answers from the official knowledge base you approve. If the answer isn't there, it says it doesn't know and points members to your admins — it never improvises.",
    },
    {
      q: "We already have mods. Why do we need this?",
      a: "Mods answer the same five questions fifty times. RaidOS answers them instantly, all day, in every timezone — and hands your mods a briefing of what the community is actually confused about.",
    },
    {
      q: "Can I self-host it and skip paying?",
      a: "Yes — it's open source. Most teams come back for managed hosting when they'd rather not babysit a server mid-launch.",
    },
  ],
} as const;

export type RaidConfig = typeof config;
