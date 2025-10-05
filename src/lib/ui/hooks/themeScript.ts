/**
 * SSR時のちらつきを防ぐためのスクリプトを生成
 * layout.tsxの<head>内でdangerouslySetInnerHTMLで使用
 *
 * NOTE: この関数はサーバーコンポーネントから呼び出し可能
 *
 * @param storageKey - localStorageのキー（デフォルト: "theme"）
 * @param darkClass - ダークモード時のクラス名（デフォルト: "dark"）
 * @returns スクリプト文字列
 *
 * @example
 * <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
 */
export function getThemeScript(
  storageKey: string = "theme",
  darkClass: string = "dark"
): string {
  return `
    (function() {
      const saved = localStorage.getItem('${storageKey}');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = saved === 'dark' || (!saved && prefersDark);
      if (dark) document.documentElement.classList.add('${darkClass}');
    })();
  `;
}
