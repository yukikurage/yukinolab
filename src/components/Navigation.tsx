"use client";

import { useCrossEffect } from "@/hooks/useCrossEffect";

export default function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { trigger, CrossEffectRenderer } = useCrossEffect();

  const fireClickEffect = (e: React.MouseEvent) => {
    trigger(e.clientX, e.clientY);
  };

  return (
    <>
      <CrossEffectRenderer />
      <nav className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0 z-10">
        <ul className="flex flex-col gap-4 items-center md:items-start">
          <li>
            <button
              onClick={(e) => {
                scrollToSection("about");
                fireClickEffect(e);
              }}
              className="font-title text-3xl font-semibold  transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer"
            >
              ABOUT
            </button>
          </li>
          <li>
            <button
              onClick={(e) => {
                scrollToSection("works");
                fireClickEffect(e);
              }}
              className="font-title text-3xl font-semibold  transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer"
            >
              WORKS
            </button>
          </li>
          <li>
            <button
              onClick={(e) => {
                scrollToSection("price");
                fireClickEffect(e);
              }}
              className="font-title text-3xl font-semibold transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer"
            >
              PRICE
            </button>
          </li>
          <li>
            <button
              onClick={(e) => {
                scrollToSection("contact");
                fireClickEffect(e);
              }}
              className="font-title text-3xl font-semibold transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer"
            >
              CONTACT
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
