"use client";

import { WithCrossEffect } from "./WithCrossEffect";

export default function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <WithCrossEffect>
      {({ fireEffect }) => (
        <nav className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0 z-10">
          <ul className="flex flex-col items-center md:items-start">
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("about");
                  fireEffect(e);
                }}
                className="font-title text-3xl font-semibold  transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer py-2"
              >
                ABOUT
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("works");
                  fireEffect(e);
                }}
                className="font-title text-3xl font-semibold  transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer py-2"
              >
                WORKS
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("price");
                  fireEffect(e);
                }}
                className="font-title text-3xl font-semibold transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer py-2"
              >
                PRICE
              </button>
            </li>
            <li>
              <button
                onClick={(e) => {
                  scrollToSection("contact");
                  fireEffect(e);
                }}
                className="font-title text-3xl font-semibold transition-all hover:text-primary-dark hover:tracking-wider cursor-pointer py-2"
              >
                CONTACT
              </button>
            </li>
          </ul>
        </nav>
      )}
    </WithCrossEffect>
  );
}
