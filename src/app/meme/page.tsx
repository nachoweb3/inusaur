import MemeGenerator from "@/components/MemeGenerator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MemePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container-x py-12">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-ink-faint uppercase">
              MEME STUDIO
            </p>
            <h1 className="display text-4xl tracking-tight sm:text-6xl">
              INUSAUR MEME GENERATOR
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
              Create your own Inusaur meme. Choose a background, add text, and download or share.
            </p>
          </div>
          <MemeGenerator />
        </div>
      </main>
      <Footer />
    </>
  );
}