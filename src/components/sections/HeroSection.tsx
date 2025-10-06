import Navigation from "@/components/Navigation";
import TitleCircle from "@/components/TitleCircle";
import LinkCarousel from "@/components/LinkCarousel";

export default function HeroSection() {
  return (
    <section className="relative min-h-dvh w-full font-sans flex justify-center items-center">
      <Navigation />
      <div className="absolute inset-0 flex justify-center items-center md:translate-y-0 -translate-y-24">
        <TitleCircle />
        <h1 className="font-title text-[40px] sm:text-5xl md:text-6xl font-bold text-center select-none relative z-10 text-text">
          {"YUKINOLABO"}
        </h1>
      </div>
      <LinkCarousel />
    </section>
  );
}
