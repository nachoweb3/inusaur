import Game from "@/sections/Game";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EconomyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Game />
      </main>
      <Footer />
    </>
  );
}