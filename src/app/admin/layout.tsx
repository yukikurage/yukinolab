export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        // マウスエフェクトを無効化するため、全体をテキストリージョンとしてマーク
        // MouseEffect.tsxのTEXT_SELECTORで検出される
      }}
      data-text-region
    >
      {children}
    </div>
  );
}
