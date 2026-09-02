import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { config } from "@/data/config";
import "../styles/globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.websiteUrl),
  title: {
    default: `${config.projectName} — ${config.tagline}`,
    template: `%s · ${config.projectName}`,
  },
  description: config.description,
  keywords: [
    "RaidOS",
    "Telegram bot",
    "web3 community",
    "community management",
    "memecoin",
    "raid bot",
    "XP bot",
    "AI community",
    "Ollama",
    "volume alerts",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: config.projectName,
    title: `${config.projectName} — ${config.tagline}`,
    description: config.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.projectName} — ${config.tagline}`,
    description: config.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
