import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShinyEconomyGame from "@/components/ShinyEconomyGame";
import EconomyLoop from "@/components/EconomyLoop";
import { config } from "@/data/config";

export const metadata: Metadata = {
  title: "The Shiny Economy",
  description: `Play the Shiny Capibara economy game — click, grow the tribe, mint memes and see how ${config.ticker} could circulate in a future circular economy.`,
};

export default function EconomyPage() {
  return (
    <>
      <Navbar />
      <main>
        <ShinyEconomyGame />
        <EconomyLoop />
      </main>
      <Footer />
    </>
  );
}