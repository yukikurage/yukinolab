# UI System

再利用可能なUIコンポーネントとユーティリティライブラリ

## 🎨 基本コンポーネント

### Card
グラスモーフィズムスタイルのカード

```tsx
import { Card } from "@/lib/ui";

<Card onClick={handleClick}>
  コンテンツ
</Card>
```

### Modal
アクセシビリティ対応モーダル（フォーカストラップ、Escキー対応）

```tsx
import { Modal } from "@/lib/ui";

<Modal isOpen={isOpen} onClose={handleClose}>
  <div className="p-6">
    <h2>Modal Title</h2>
    <p>Content...</p>
  </div>
</Modal>
```

### Section
ページセクション

```tsx
import { Section } from "@/lib/ui";

<Section id="about" title="About Us">
  <p>Content...</p>
</Section>
```

## 🖱️ マウストラッキングシステム

### useMousePosition
マウス位置を追跡

```tsx
import { useMousePosition } from "@/lib/ui";

const { x, y } = useMousePosition();
const { x, y } = useMousePosition(true); // 正規化された座標 (0-1)
```

### MouseFollower
マウスについていく要素

```tsx
import { MouseFollower } from "@/lib/ui";

<MouseFollower offset={{ x: -20, y: -20 }} lag={0.3}>
  <div className="w-10 h-10 bg-blue-500 rounded-full" />
</MouseFollower>
```

### MouseParallax
マウスに追従してパララックス効果

```tsx
import { MouseParallax } from "@/lib/ui";

<MouseParallax strength={30} invert={false}>
  <img src="/image.png" alt="parallax" />
</MouseParallax>
```

## ✨ アニメーションシステム

### useAnimatedElements
アニメーション要素を管理する汎用hook

```tsx
import { useAnimatedElements } from "@/lib/ui";

interface ClickEffect {
  x: number;
  y: number;
}

const { elements, trigger } = useAnimatedElements<ClickEffect>({
  duration: 800
});

// トリガー
const handleClick = (e: MouseEvent) => {
  trigger({ x: e.clientX, y: e.clientY });
};

// レンダリング
{elements.map(el => (
  <div
    key={el.id}
    className="ripple"
    style={{
      left: el.data.x,
      top: el.data.y,
    }}
  />
))}
```

### AnimationTrigger
クリックでアニメーション要素を追加

```tsx
import { AnimationTrigger } from "@/lib/ui";

<AnimationTrigger
  dataFromEvent={(e) => ({ x: e.clientX, y: e.clientY })}
  renderElement={(el) => (
    <div
      key={el.id}
      className="ripple"
      style={{
        left: el.data.x,
        top: el.data.y,
      }}
    />
  )}
  duration={800}
>
  {({ onClick }) => (
    <button onClick={onClick}>Click me</button>
  )}
</AnimationTrigger>
```

## 📝 フォームシステム

### useTurnstile
Cloudflare Turnstileを管理

```tsx
import { useTurnstile } from "@/lib/ui";

const { isVerified, token, reset } = useTurnstile({
  siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
  onVerify: (token) => console.log('Verified:', token),
});
```

### TurnstileField
Turnstileフィールドコンポーネント

```tsx
import { TurnstileField } from "@/lib/ui";

<TurnstileField
  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
  onVerify={(token) => setVerified(true)}
/>
```

## 🔧 実装例

### クロスエフェクト

```tsx
import { AnimationTrigger } from "@/lib/ui";

function CrossEffect({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed pointer-events-none"
      style={{ left: 0, top: 0 }}
    >
      <div
        className="absolute bg-primary animate-cross-expand-vertical"
        style={{
          left: x,
          top: 0,
          width: '3px',
          height: '100vh',
        }}
      />
      <div
        className="absolute bg-primary animate-cross-expand-horizontal"
        style={{
          left: 0,
          top: y,
          width: '100vw',
          height: '3px',
        }}
      />
    </div>
  );
}

export function CrossEffectButton() {
  return (
    <AnimationTrigger
      dataFromEvent={(e) => ({ x: e.clientX, y: e.clientY })}
      renderElement={(el) => <CrossEffect key={el.id} {...el.data} />}
      duration={400}
    >
      {({ onClick }) => (
        <button onClick={onClick}>Click for Effect</button>
      )}
    </AnimationTrigger>
  );
}
```

### マウス追従カーソル

```tsx
import { MouseFollower } from "@/lib/ui";

export function CustomCursor() {
  return (
    <MouseFollower offset={{ x: -20, y: -20 }}>
      <svg width={40} height={40} viewBox="0 0 40 40">
        <path d="M 20,5 Q 22,18 35,20 Q 22,22 20,35 Q 18,22 5,20 Q 18,18 20,5 Z" />
      </svg>
    </MouseFollower>
  );
}
```

## 🚀 他のプロジェクトで使う方法

1. `src/lib/ui/` ディレクトリをコピー
2. 必要なシステムをインポート
3. プロジェクトに合わせてカスタマイズ

```tsx
// 他のプロジェクトで
import { MouseFollower, AnimationTrigger, useTurnstile } from "@/lib/ui";
```
