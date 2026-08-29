/**
 * INUSAUR — centralized configuration
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
  projectName: "Inusaur",
  ticker: "$SAUR",
  chain: "Solana",
  contractAddress,

  websiteUrl: "https://inusaur.com",

  description:
    "Meet Inusaur — the Shiba that evolved into something unexpected. A Shiba Inu with Bulbasaur's green body and iconic pink flower. The ultimate meme creature on Solana.",

  // ── LINKS ─────────────────────────────────────────────────────────
  buyUrl: "https://pump.fun/coin/5UK6x9TazpcpwGnq2iSyHaneEe7gJGAopF4cjsrvpump",
  twitterUrl: "https://x.com/Inusaur", // TODO: real Twitter
  telegramUrl: "#", // TODO: real Telegram group

  // Token facts. Supply is intentionally unknown until announced.
  totalSupply: null as string | null,

  // ── NAVIGATION ────────────────────────────────────────────────────
  nav: [
    { label: "LORE", href: "#lore" },
    { label: "EVOLUTION", href: "#evolution" },
    { label: "TOKEN", href: "#token" },
    { label: "GAME", href: "#game" },
    { label: "ARCHIVES", href: "#archives" },
    { label: "COMMUNITY", href: "#community" },
  ],

  // ── CHARACTER TRAITS ──────────────────────────────────────────────
  traits: [
    {
      word: "HYBRID",
      text: "Half Shiba, half Bulbasaur — 100% meme. The creature nobody asked for, but everyone needed.",
      mark: "sparkle",
    },
    {
      word: "EVOLVED",
      text: "It started as a Shiba. Then the green bulb appeared. Then the flower bloomed. Then the legend began.",
      mark: "wave",
    },
    {
      word: "GREEN",
      text: "Not your average Shiba. The green body is a statement. The pink flower is the signature.",
      mark: "sun",
    },
    {
      word: "UNSTOPPABLE",
      text: "Inusaur doesn't stop. It doesn't quit. It doesn't panic. It just keeps evolving.",
      mark: "leaf",
    },
    {
      word: "RARE",
      text: "Shiba + Bulbasaur = one in a million. You can't make this up. You can only witness it.",
      mark: "diamond",
    },
    {
      word: "COMMUNITY-POWERED",
      text: "A character is nothing without people who love it. The Inusaur tribe makes the evolution real.",
      mark: "tribe",
    },
  ],

  // ── LORE (fictional storytelling — editable) ──────────────────────
  lore: [
    {
      chapter: "01",
      title: "THE ORIGIN",
      text: "Nobody knows where the first one came from. Some say it was born in the deepest grasslands. Others say it was created when a Shiba Inu wandered too far into a mysterious forest. But the old degens tell a different story...",
      date: null,
      image: null,
    },
    {
      chapter: "02",
      title: "THE AWAKENING",
      text: "They say that when the meme economy reached its breaking point, something began to grow. First came the dogs. 🐕 Then came the fire. 🔥 And somewhere between the two... something started evolving.",
      date: null,
      image: null,
    },
    {
      chapter: "03",
      title: "THE EVOLUTION",
      text: "🌱🦖 INUSAUR — A Shiba with the instincts of a survivor and the power of a creature that refuses to stop growing. It doesn't chase pumps. It grows them. It doesn't look for attention. It attracts it.",
      date: null,
      image: null,
    },
    {
      chapter: "04",
      title: "THE LEGEND",
      text: "And every time the community believes the meme is dead... another leaf appears. Another evolution begins. Another chart goes vertical. 📈 The old world called it a Pokémon. The new world calls it a memecoin.",
      date: null,
      image: null,
    },
    {
      chapter: "05",
      title: "THE $SAUR ERA",
      text: "Its name is InuSaur. $SAUR — Plant the meme. 🌱 Feed the community. 🦖 Watch it evolve. 📈 The evolution has begun.",
      date: null,
      image: null,
    },
  ],

  // ── JOURNEY (no financial promises — just story stages) ───────────
  journey: [
    {
      number: "01",
      title: "DISCOVERY",
      text: "The internet discovers the green Shiba. A screenshot appears. The feed goes quiet — then very loud.",
    },
    {
      number: "02",
      title: "THE EVOLUTION",
      text: "The bulb grows. The flower blooms. The creature becomes something new. The meme evolves.",
    },
    {
      number: "03",
      title: "THE TRIBE",
      text: "The community begins creating memes, artwork and stories. The Inusaur tribe becomes the story.",
    },
    {
      number: "04",
      title: "THE LEGEND",
      text: "Inusaur becomes an internet-native character. Green, rare, and impossible to forget.",
    },
    {
      number: "05",
      title: "THE $SAUR ERA",
      text: "The token launches. The tribe grows. The legend becomes a movement. The green garden expands.",
    },
  ],

  // ── EVOLUTION STAGES ──────────────────────────────────────────────
  evolution: [
    {
      stage: "SHIBA",
      label: "THE BEGINNING",
      text: "A regular Shiba Inu. Cute. Memeable. But nothing special... yet.",
      emoji: "🐕",
    },
    {
      stage: "???",
      label: "THE MYSTERY",
      text: "Something strange happens. A green bulb appears on the Shiba's back. Nobody knows why.",
      emoji: "🌱",
    },
    {
      stage: "INUSAUR",
      label: "THE EVOLUTION",
      text: "The bulb blooms into a pink flower. The fur turns green. The creature is reborn. INUSAUR is here.",
      emoji: "🌸",
    },
  ],

  // ── MEME ARCHIVE (data-driven gallery) ────────────────────────────
  gallery: [
    {
      image: "/images/inusaur-main.jpg",
      title: "The First Sighting",
      creator: "The Inusaur Tribe",
      category: "lore",
      tone: "green",
    },
    {
      image: "/images/gallery/c5.jpg",
      title: "Inusaur in the Wild",
      creator: "Community",
      category: "lore",
      tone: "moss",
    },
    {
      image: "/images/gallery/c6.jpg",
      title: "Green Fields, Pink Flowers",
      creator: "Community",
      category: "lore",
      tone: "clay",
    },
    {
      image: "/images/gallery/d2.jpg",
      title: "Close-Up Evolution",
      creator: "Community",
      category: "lore",
      tone: "gold",
    },
    {
      image: "/images/gallery/m2.jpg",
      title: "Unstoppable Ratio",
      creator: "Community",
      category: "meme",
      tone: "ink",
    },
    {
      image: "/images/gallery/m3.jpg",
      title: "Keep Evolving, Stay Green",
      creator: "The Inusaur Tribe",
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
      title: "Green Energy",
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
  tools: [
    { name: "DexScreener", url: `https://dexscreener.com/search?q=${contractAddress}` },
    { name: "Jupiter", url: `https://jup.ag/swap/SOL-${contractAddress}` },
    { name: "Solscan", url: `https://solscan.io/token/${contractAddress}` },
  ] as { name: string; url: string }[],

  // ── SOCIAL (future X/Twitter integration — never fake posts) ──────
  social: {
    posts: [] as SocialPost[],
  },

  // ── MICROCOPY (used sparingly across the site) ────────────────────
  microcopy: {
    stayShiny: "STAY EVOLVED.",
    neverPanics: "INUSAUR NEVER PANICS.",
    keepCalm: "KEEP CALM. EVOLVE.",
    shineHasBegun: "THE EVOLUTION HAS BEGUN.",
  },

  // ── DISCLAIMER ────────────────────────────────────────────────────
  disclaimer:
    "Inusaur is a meme/community project. Nothing on this website constitutes financial advice.",
} as const;

/* ── TYPES ─────────────────────────────────────────────────────────── */

export type GalleryItem = {
  image: string | null;
  title: string;
  creator: string;
  category: "meme" | "fan-art" | "lore" | "screenshot";
  tone: "dawn" | "clay" | "moss" | "gold" | "ink" | "green";
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
export type EvolutionStage = (typeof config.evolution)[number];

/** True while a link is still a placeholder (not yet provided). */
export const isPlaceholder = (url: string | null | undefined) =>
  !url || url === "#";