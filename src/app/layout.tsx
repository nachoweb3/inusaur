import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { config } from "@/data/config";
import { WalletProvider } from "@/lib/wallet";
import "../styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// NOTE: metadataBase uses the placeholder domain from config.
// Replace config.websiteUrl when the production domain is live.
export const metadata: Metadata = {
  metadataBase: new URL(config.websiteUrl),
  title: {
    default: `${config.projectName} (${config.ticker}) — The Albino Capybara`,
    template: `%s · ${config.projectName}`,
  },
  description: config.description,
  keywords: [
    "Shiny Capibara",
    "$SBARA",
    "albino capybara",
    "Solana",
    "meme token",
    "capybara",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: config.projectName,
    title: `${config.projectName} (${config.ticker}) — The Albino Capybara`,
    description: config.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.projectName} (${config.ticker}) — The Albino Capybara`,
    description: config.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}