import Hero from "@/sections/Hero";
import Lore from "@/sections/Lore";
import Evolution from "@/sections/Evolution";
import Token from "@/sections/Token";
import Game from "@/sections/Game";
import Archives from "@/sections/Archives";
import Community from "@/sections/Community";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Navbar />
      <Marquee />
      <main>
        <Hero />
        <Lore />
        <Evolution />
        <Token />
        <Game />
        <Archives />
        <Community />
      </main>
      <Footer />
    </>
  );
}