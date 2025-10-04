export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      {/* ドットパターン */}
      {/* <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #d97706 2px, transparent 2px)`,
          backgroundSize: "40px 40px",
        }}
      /> */}
      {/* 幾何学パターン - 斜めの線 */}
      {/* <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            #d97706 35px,
            #d97706 36px
          )`,
        }}
      /> */}
      {/* 幾何学パターン - グリッド */}
      {/* <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d97706 1px, transparent 1px),
            linear-gradient(to bottom, #d97706 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      /> */}
      {/* ノイズテクスチャ */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
