"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorksSection from "@/components/sections/WorksSection";
import PriceSection from "@/components/sections/PriceSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="relative w-full text-text">
      <div className="fixed inset-0 -z-100 bg-bg transition-colors" />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <WorksSection />
        <PriceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
