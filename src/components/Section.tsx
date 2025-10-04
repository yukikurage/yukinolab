interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({
  id,
  title,
  children,
  className = "",
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className={`relative w-full flex flex-col items-center justify-center py-40 ${className}`}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="font-title text-4xl font-semibold mb-12 text-center">
        {title}
      </h2>
      <div className="container w-full px-8">{children}</div>
    </section>
  );
}
