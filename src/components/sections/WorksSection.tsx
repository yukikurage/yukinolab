"use client";

import { useState, useEffect } from "react";
import Section from "@/components/Section";
import WorkCard from "@/components/WorkCard";
import WorkModal from "@/components/WorkModal";
import { useCrossEffect } from "@/hooks/useCrossEffect";

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  content: string;
  link?: string;
}

export default function WorksSection() {
  const [works, setWorks] = useState<Work[]>([]);
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});
  const { trigger, CrossEffectRenderer } = useCrossEffect();

  useEffect(() => {
    fetch("/api/content/works")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data as Work[]);
      })
      .catch((error) => console.error("Failed to load works:", error));
  }, []);

  const handleWorkClick = (work: Work, e: React.MouseEvent) => {
    trigger(e.clientX, e.clientY);
    setOpenModals((prev) => ({ ...prev, [work.id]: true }));
  };

  const handleClose = (workId: string) => {
    setOpenModals((prev) => ({ ...prev, [workId]: false }));
  };

  return (
    <>
      <CrossEffectRenderer />
      <Section id="works" title="WORKS">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              title={work.title}
              description={work.description}
              image={work.image}
              onClick={(e) => {
                handleWorkClick(work, e);
              }}
            />
          ))}
        </div>
      </Section>

      {/* Work Modals */}
      {works.map((work) => (
        <WorkModal
          key={work.id}
          isOpen={!!openModals[work.id]}
          onClose={() => handleClose(work.id)}
          title={work.title}
          description={work.description}
          image={work.image}
          content={work.content || ""}
        />
      ))}
    </>
  );
}
