"use client";

import { useState, useEffect } from "react";

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  contentPath: string;
  link?: string;
}

export default function LinkCarousel() {
  const [works, setWorks] = useState<Work[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/works/works.json")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data as Work[]);
      })
      .catch((error) => console.error("Failed to load works:", error));
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleClick = (work: Work) => {
    if (work.link) {
      window.open(work.link, "_blank", "noopener,noreferrer");
    }
  };

  if (works.length === 0) return null;

  return (
    <div className="absolute bottom-20 right-20 z-20 hidden xl:flex items-center gap-6 h-58">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className="flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0 z-10 cursor-pointer h-full"
        aria-label="Previous link"
      >
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Cards Container */}
      <div className="relative h-full aspect-4/3">
        <div className="absolute inset-0 h-full w-full">
          {/* Render 3 copies of all works */}
          {Array.from({ length: 2 * works.length }, (_, deltaIdxFromMinus1) => {
            const deltaIdx = -1 + deltaIdxFromMinus1;
            const targetIdx = currentIndex + deltaIdx;
            const mod = works.length;
            const realTargetIdx = ((targetIdx % mod) + mod) % mod;
            const work = works[realTargetIdx];
            const offset = deltaIdx * 250;

            return (
              <button
                key={`${targetIdx}`}
                onClick={() => handleClick(work)}
                className="absolute rounded-lg overflow-hidden border border-border hover:shadow-lg cursor-pointer group h-full aspect-square"
                style={{
                  opacity: deltaIdx === -1 ? 0 : deltaIdx >= 1 ? 0.5 : 1,
                  transition:
                    "opacity 500ms ease, transform 500ms cubic-bezier(0.2, 0.6, 0.2, 1), box-shadow 300ms ease",
                  pointerEvents: deltaIdx == 0 ? "auto" : "none",
                  overflow: "visible",
                  transform: `translateX(${offset}px)`,
                }}
              >
                {/* Background Image */}
                <div className="overflow-hidden rounded-lg absolute inset-0">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, var(--color-overlay-light), var(--color-overlay))",
                    }}
                  />
                </div>

                {/* Title and Link Icon */}
                <div
                  className="absolute bottom-0 right-0 p-4"
                  style={{
                    opacity: deltaIdx === 0 ? 1 : 0,
                    transition: "opacity 300ms ease",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <h3 className="font-title text-lg font-semibold text-text">
                      {work.title}
                    </h3>
                    <svg
                      className="w-4 h-4 text-text-secondary flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0 z-10 cursor-pointer"
        aria-label="Next link"
      >
        <svg
          className="w-12 h-12 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
