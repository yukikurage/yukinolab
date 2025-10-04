"use client";

export default function TitleCircle() {
  return (
    <div className="absolute" aria-hidden="true">
      {/* 外側の円（右回り） */}
      <div className="absolute animate-spin-slow -translate-1/2">
        <svg
          width="600"
          height="600"
          viewBox="0 0 800 800"
          className="text-primary-light"
        >
          <circle
            cx="400"
            cy="400"
            r="200"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {/* 放射状のメモリ線 */}
          {Array.from({ length: 9 }, (_, i) => {
            const angle = (i / 9) * 360;
            const angleRad = (angle * Math.PI) / 180;
            const innerRadius = 180 - 20;
            const outerRadius = 180 + 200;

            const x1 = Math.round(400 + Math.cos(angleRad) * innerRadius);
            const y1 = Math.round(400 + Math.sin(angleRad) * innerRadius);
            const x2 = Math.round(400 + Math.cos(angleRad) * outerRadius);
            const y2 = Math.round(400 + Math.sin(angleRad) * outerRadius);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="3"
              />
            );
          })}
        </svg>
      </div>

      {/* 内側の円（左回り） */}
      <div className="absolute animate-spin-reverse -translate-1/2">
        <svg
          width="600"
          height="600"
          viewBox="0 0 800 800"
          className="text-primary-light"
        >
          <circle
            cx="400"
            cy="400"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          {/* 放射状のメモリ線 */}
          {Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * 360;
            const angleRad = (angle * Math.PI) / 180;
            const innerRadius = 120 - 15;
            const outerRadius = 120 + 15;

            const x1 = Math.round(400 + Math.cos(angleRad) * innerRadius);
            const y1 = Math.round(400 + Math.sin(angleRad) * innerRadius);
            const x2 = Math.round(400 + Math.cos(angleRad) * outerRadius);
            const y2 = Math.round(400 + Math.sin(angleRad) * outerRadius);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="3"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
