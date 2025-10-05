import "./CrossEffect.css";

/**
 * クロスエフェクトアニメーション用コンポーネント
 * AnimationTriggerで使用するエフェクト要素
 */
export function CrossEffect({
  x,
  y,
  id,
}: {
  x: number;
  y: number;
  id: string | number;
}) {
  return (
    <div
      key={id}
      className="fixed left-0 right-0 pointer-events-none z-100"
      style={{
        left: 0,
        top: 0,
      }}
    >
      {/* 縦の線 */}
      <div
        className="absolute bg-primary-light animate-cross-expand-vertical"
        style={{
          left: x,
          top: 0,
          width: "3px",
          height: "100dvh",
          transformOrigin: `center ${y}px`,
        }}
      />
      {/* 横の線 */}
      <div
        className="absolute bg-primary-light animate-cross-expand-horizontal"
        style={{
          left: 0,
          top: y,
          width: "100vw",
          height: "3px",
          transformOrigin: `${x}px center`,
        }}
      />
    </div>
  );
}
