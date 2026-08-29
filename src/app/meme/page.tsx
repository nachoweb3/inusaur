import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemeGenerator from "@/components/MemeGenerator";
import { config } from "@/data/config";

export const metadata: Metadata = {
  title: "Meme Machine",
  description: `Create ${config.projectName} memes with real photos from the archive — pick a background, add a caption and download your PNG.`,
};

export default function MemePage() {
  return (
    <>
      <Navbar />
      <main>
        <MemeGenerator />
      </main>
      <Footer />
    </>
  );
}