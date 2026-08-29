/**
 * SHINY CAPIBARA — centralized configuration
 * ------------------------------------------------------------------
 * This file is the single source of truth for the whole website.
 * The contract address, links and all content live here and are
 * never duplicated elsewhere in the codebase.
 *
 * ── HOW TO EDIT ────────────────────────────────────────────────────
 * • Links: replace the "#" placeholders with real URLs when ready.
 * • totalSupply: set to a string (e.g. "1,000,000,000") when known.
 * • lore / journey / gallery: add or remove entries freely.
 * ──────────────────────────────────────────────────────────────────
 */

// The contract address is defined ONLY here and referenced everywhere else.
const contractAddress = "5UK6x9TazpcpwGnq2iSyHaneEe7gJGAopF4cjsrvpump";

export const config = {
  projectName: "Shiny Capibara",
  ticker: "$SBARA",
  chain: "Solana",
  contractAddress,

  // TODO: replace with the real production domain when it goes live
  websiteUrl: "https://shinycapibara.com",

  description:
    "Meet Shiny Capibara, the albino capybara building an internet-native community on Solana.",

  // ── LINKS ─────────────────────────────────────────────────────────
  buyUrl: "https://pump.fun/coin/5UK6x9TazpcpwGnq2iSyHaneEe7gJGAopF4cjsrvpump",
  twitterUrl: "https://x.com/barashiny/status/2093513233801838850",
  telegramUrl: "#", // TODO: real Telegram group

  // Token facts. Supply is intentionally unknown until announced.
  totalSupply: null as string | null, // e.g. "1,000,000,000" — leave null until real

  // ── NAVIGATION ────────────────────────────────────────────────────
  nav: [
    { label: "LORE", href: "#lore" },
    { label: "TOKEN", href: "#token" },
    { label: "JOURNEY", href: "#journey" },
    { label: "ARCHIVE", href: "#archive" },
    { label: "COMMUNITY", href: "#community" },
    { label: "MEME", href: "/meme" },
    { label: "ECONOMY", href: "/economy" },
  ],

  // ── CHARACTER TRAITS ──────────────────────────────────────────────
  traits: [
    {
      word: "ALBINO",
      text: "One in a million. Literally — white fur doesn't happen every day.",
      mark: "sparkle",
    },
    {
      word: "CALM",
      text: "Panic is not in the vocabulary. There is no emergency that cannot wait.",
      mark: "wave",
    },
    {
      word: "SHINY",
      text: "The light always finds the shiny one. Always.",
      mark: "sun",
    },
    {
      word: "UNBOTHERED",
      text: "The internet tried its best. The capybara remained seated.",
      mark: "leaf",
    },
    {
      word: "RARE",
      text: "Albinism is rare. This attitude is rarer.",
      mark: "diamond",
    },
    {
      word: "COMMUNITY-POWERED",
      text: "A character is nothing without people who love it. The tribe makes the shine.",
      mark: "tribe",
    },
  ],

  // ── LORE (fictional storytelling — editable) ──────────────────────
  lore: [
    {
      chapter: "01",
      title: "THE FIRST SIGHTING",
      text: "One day, the internet noticed a capybara that didn't blend in. White fur. No fear. Just vibes. Nobody could explain it. Nobody needed to.",
      date: null, // optional: "2026-01-01"
      image: null, // optional: "/lore/first-sighting.jpg"
    },
    {
      chapter: "02",
      title: "THE AWAKENING",
      text: "The capybara began to appear everywhere — in feeds, in comments, in group chats. It asked for nothing. It judged no one. It simply was.",
      date: null,
      image: null,
    },
    {
      chapter: "03",
      title: "THE TRIBE",
      text: "People started making art about the shiny one. Memes spread. The tribe grew. They called themselves the Shiny Tribe — and they were unbothered together.",
      date: null,
      image: null,
    },
    {
      chapter: "04",
      title: "THE LEGEND",
      text: "The albino capybara stopped being a picture and became a presence. A character. A reminder that calm is a superpower.",
      date: null,
      image: null,
    },
  ],

  // ── JOURNEY (no financial promises — just story stages) ───────────
  journey: [
    {
      number: "01",
      title: "DISCOVERY",
      text: "The internet discovers the albino capybara. A screenshot appears. The feed goes quiet — then very loud.",
    },
    {
      number: "02",
      title: "THE AWAKENING",
      text: "The character begins developing its mythology. Names are tried. Shiny sticks.",
    },
    {
      number: "03",
      title: "THE TRIBE",
      text: "The community begins creating memes, artwork and stories. The tribe becomes the story.",
    },
    {
      number: "04",
      title: "THE LEGEND",
      text: "Shiny Capibara becomes an internet-native character. Calm, rare, and impossible to forget.",
    },
  ],

  // ── MEME ARCHIVE (data-driven gallery) ────────────────────────────
  // Real photos & memes collected from the community. To add more,
  // drop an image in /public/images/gallery/ and add an entry here.
  gallery: [
    {
      image: "/images/shiny-logo.jpg",
      title: "The First Glow",
      creator: "The Shiny Tribe",
      category: "lore",
      tone: "dawn",
    },
    {
      image: "/images/gallery/c5.jpg",
      title: "Albino in the Wild",
      creator: "Community",
      category: "lore",
      tone: "moss",
    },
    {
      image: "/images/gallery/c6.jpg",
      title: "White Fur, Green Fields",
      creator: "Community",
      category: "lore",
      tone: "clay",
    },
    {
      image: "/images/gallery/d2.jpg",
      title: "Close-Up Shiny",
      creator: "Community",
      category: "lore",
      tone: "gold",
    },
    {
      image: "/images/gallery/m2.jpg",
      title: "Unbothered Ratio",
      creator: "Community",
      category: "meme",
      tone: "ink",
    },
    {
      image: "/images/gallery/m3.jpg",
      title: "Keep Calm, Stay Shiny",
      creator: "The Shiny Tribe",
      category: "meme",
      tone: "clay",
    },
    {
      image: "/images/gallery/m4.jpg",
      title: "The Legend Begins",
      creator: "Community",
      category: "meme",
      tone: "moss",
    },
    {
      image: "/images/gallery/m5.jpg",
      title: "Albino Energy",
      creator: "Fan Art",
      category: "meme",
      tone: "gold",
    },
    {
      image: "/images/gallery/m8.jpg",
      title: "The Chosen One",
      creator: "Community",
      category: "meme",
      tone: "ink",
    },
  ] as GalleryItem[],

  // ── TOKEN TOOLS (real deterministic URLs from the contract) ───────
  // DexScreener carries the live pair page once the token is tradeable;
  // the stats band (TokenStats) adds the same URLs automatically.
  tools: [
    { name: "DexScreener", url: `https://dexscreener.com/search?q=${contractAddress}` },
    { name: "Jupiter", url: `https://jup.ag/swap/SOL-${contractAddress}` },
    { name: "Solscan", url: `https://solscan.io/token/${contractAddress}` },
  ] as { name: string; url: string }[],

  // ── SOCIAL (future X/Twitter integration — never fake posts) ──────
  social: {
    posts: [] as SocialPost[], // populate from a real API later
  },

  // ── MICROCOPY (used sparingly across the site) ────────────────────
  microcopy: {
    stayShiny: "STAY SHINY.",
    neverPanics: "CAPYBARA NEVER PANICS.",
    keepCalm: "KEEP CALM. STAY SHINY.",
    shineHasBegun: "THE SHINE HAS BEGUN.",
  },

  // ── DISCLAIMER ────────────────────────────────────────────────────
  disclaimer:
    "Shiny Capibara is a meme/community project. Nothing on this website constitutes financial advice.",
} as const;

/* ── TYPES ─────────────────────────────────────────────────────────── */

export type GalleryItem = {
  image: string | null;
  title: string;
  creator: string;
  category: "meme" | "fan-art" | "lore" | "screenshot";
  tone: "dawn" | "clay" | "moss" | "gold" | "ink";
};

export type SocialPost = {
  id: string;
  author: string;
  handle: string;
  text: string;
  createdAt: string;
};

export type Trait = (typeof config.traits)[number];
export type LoreChapter = (typeof config.lore)[number];
export type JourneyStage = (typeof config.journey)[number];

/** True while a link is still a placeholder (not yet provided). */
export const isPlaceholder = (url: string | null | undefined) =>
  !url || url === "#";