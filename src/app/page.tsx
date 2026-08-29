import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import Lore from "@/sections/Lore";
import MeetShiny from "@/sections/MeetShiny";
import Token from "@/sections/Token";
import Journey from "@/sections/Journey";
import Archive from "@/sections/Archive";
import Community from "@/sections/Community";
import SocialFeed from "@/components/SocialFeed";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Lore />
        <MeetShiny />
        <Token />
        <Journey />
        <Archive />
        <Community />
        <SocialFeed />
      </main>
      <Footer />
    </>
  );
}