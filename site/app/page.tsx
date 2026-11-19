import Intro from "@/components/Intro";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Spaces from "@/components/Spaces";
import ArtDirection from "@/components/ArtDirection";
import ComponentsShowcase from "@/components/ComponentsShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Intro />
      <Navigation />
      <main id="contenu">
        <Hero />
        <Story />
        <Gallery />
        <Spaces />
        <ArtDirection />
        <ComponentsShowcase />
      </main>
      <Footer />
    </>
  );
}
