import Section from "@/components/Section";
import Card from "@/components/Card";

export default function PriceSection() {
  return (
    <Section
      id="price"
      title="PRICE"
      className="bg-surface-secondary/50 backdrop-blur-lg relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {/* 基本料金 */}
        <Card data-text-region clickable={false} className="border bg-bg p-8">
          <div className="mb-12">
            <h3 className="font-title text-2xl font-bold mb-6 text-text">
              基本料金
            </h3>
            <p className="text-text-secondary mb-4 leading-relaxed">
              依頼者さんの求める世界観に合わせてホームページを作ります。
              YUKINOLABOは2025年10月にスタートし、まだ実績がありません……是非初めての依頼者さんになってください！
            </p>
          </div>

          <div className="space-y-4 mb-12">
            <div className="border-b border-surface-secondary pb-3">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                <span className="text-text-secondary font-semibold md:font-normal">
                  カスタムデザイン
                </span>
                <span className="text-sm text-text-tertiary">
                  求める世界観やデザインに合わせて制作します
                </span>
              </div>
            </div>
            <div className="border-b border-surface-secondary pb-3">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                <span className="text-text-secondary font-semibold md:font-normal">
                  レスポンシブ対応
                </span>
                <span className="text-sm text-text-tertiary">
                  スマホ・タブレットから見ても綺麗です
                </span>
              </div>
            </div>
            <div className="border-b border-surface-secondary pb-3">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                <span className="text-text-secondary font-semibold md:font-normal">
                  基本ページ
                </span>
                <span className="text-sm text-text-tertiary">
                  About / Works / Links が含まれます
                </span>
              </div>
            </div>
            <div className="border-b border-surface-secondary pb-3">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                <span className="text-text-secondary font-semibold md:font-normal">
                  アニメーション
                </span>
                <span className="text-sm text-text-tertiary">
                  基本的な遷移アニメーションなどです
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-text-tertiary mb-1">基本料金</p>
            <p className="text-3xl font-bold text-primary-dark">¥40,000〜</p>
          </div>
        </Card>

        {/* 追加オプション */}
        <div data-text-region>
          <h3 className="font-title text-2xl font-bold mb-10 text-text">
            追加オプション
          </h3>
          <div className="space-y-6">
            <div className="flex items-start justify-between py-6 border-b border-border">
              <div className="flex-1">
                <h4 className="font-title text-lg font-semibold mb-2 text-text">
                  コンテンツ追加
                </h4>
                <p className="text-text-secondary">
                  追加ページやセクションの制作
                </p>
              </div>
              <div className="text-right ml-8">
                <p className="text-xl font-bold text-primary-dark">+¥5,000〜</p>
                <p className="text-xs text-text-tertiary">/ ページ</p>
              </div>
            </div>

            <div className="flex items-start justify-between py-6 border-b border-border">
              <div className="flex-1">
                <h4 className="font-title text-lg font-semibold mb-2 text-text">
                  動きのある背景・エフェクト
                </h4>
                <p className="text-text-secondary">
                  パーティクル、パララックス等の実装
                </p>
              </div>
              <div className="text-right ml-8">
                <p className="text-xl font-bold text-primary-dark">
                  +¥10,000〜
                </p>
              </div>
            </div>

            <div className="flex items-start justify-between py-6 border-b border-border">
              <div className="flex-1">
                <h4 className="font-title text-lg font-semibold mb-2 text-text">
                  特殊なデザイン・処理
                </h4>
                <p className="text-text-secondary">
                  工数の多いデザインやカスタム機能
                </p>
              </div>
              <div className="text-right ml-8">
                <p className="text-xl font-bold text-primary-dark">
                  +¥15,000〜
                </p>
              </div>
            </div>

            <div className="flex items-start justify-between py-6">
              <div className="flex-1">
                <h4 className="font-title text-lg font-semibold mb-2 text-text">
                  後からの追加・修正
                </h4>
                <p className="text-text-secondary">
                  納品後のページ追加やコンテンツ更新
                </p>
              </div>
              <div className="text-right ml-8">
                <p className="text-xl font-bold text-primary-dark">要相談</p>
              </div>
            </div>
          </div>
        </div>

        {/* サイトタイプ別の目安 */}
        <div data-text-region>
          <h3 className="font-title text-2xl font-bold mb-10 text-text">
            サイトタイプ別の目安
          </h3>
          <div className="space-y-8">
            <div className="flex justify-between items-start py-4">
              <div className="flex-1">
                <p className="font-semibold text-lg text-text mb-2">
                  ゲーム公式ページ
                </p>
                <p className="text-text-secondary">
                  ゲーム紹介・キャラクター・ストーリー等
                </p>
              </div>
              <p className="text-xl font-bold text-primary-dark ml-8">
                ¥60,000〜
              </p>
            </div>

            <div className="flex justify-between items-start py-4">
              <div className="flex-1">
                <p className="font-semibold text-lg text-text mb-2">
                  クリエイター・VTuberサイト
                </p>
                <p className="text-text-secondary">
                  プロフィール・活動紹介・リンク集等
                </p>
              </div>
              <p className="text-xl font-bold text-primary-dark ml-8">
                ¥50,000〜
              </p>
            </div>

            <div className="flex justify-between items-start py-4">
              <div className="flex-1">
                <p className="font-semibold text-lg text-text mb-2">
                  イベントページ
                </p>
                <p className="text-text-secondary">
                  イベント告知・タイムテーブル・申込等
                </p>
              </div>
              <p className="text-xl font-bold text-primary-dark ml-8">
                ¥70,000〜
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-text-secondary text-sm">
            ※料金は内容により変動します。詳細はお気軽にお問い合わせください。
          </p>
          <p className="text-text-secondary font-semibold">
            お支払いは Stripe による安全なオンライン決済に対応しています
          </p>
        </div>
      </div>
    </Section>
  );
}
