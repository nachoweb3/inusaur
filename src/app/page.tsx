"use client";

import { useState } from "react";
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
import LoadingScreen from "@/components/LoadingScreen";
import StatusHUD from "@/components/StatusHUD";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <StatusHUD />
      <div className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
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
      </div>
    </>
  );
}