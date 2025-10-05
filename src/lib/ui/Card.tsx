import { CardProps } from "./types";

/**
 * 汎用カードコンポーネント
 * グラスモーフィズムスタイルのカード
 *
 * @example
 * // 静的カード
 * <Card clickable={false}>Content</Card>
 *
 * @example
 * // クリック可能カード
 * <Card onClick={handleClick}>Clickable</Card>
 */
export default function Card({
  children,
  className = "",
  clickable = true,
  "data-text-region": dataTextRegion = false,
  onClick,
  ...props
}: CardProps & Omit<React.HTMLAttributes<HTMLElement>, "onClick">) {
  const baseClassName = `border w-full h-full border-border-strong dark:border-primary bg-bg/40 rounded-lg backdrop-blur-2xl transition-shadow ${className}`;

  if (clickable && onClick) {
    return (
      <button
        data-text-region={dataTextRegion ? true : undefined}
        onClick={onClick}
        className={`${baseClassName} cursor-pointer hover:shadow-lg`}
        type="button"
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      data-text-region={dataTextRegion ? true : undefined}
      className={baseClassName}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}
