// CMS設定ファイル - プロジェクトごとにカスタマイズ可能

export interface CMSField {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "url" | "markdown" | "number" | "array";
  required?: boolean;
  placeholder?: string;
  // For array type
  itemFields?: CMSField[];
}

export interface CMSCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: CMSField[];
  // If true, this is a singleton (single document) instead of a collection
  singleton?: boolean;
}

// プロジェクトごとにこの設定を変更
export const CMS_CATEGORIES: CMSCategory[] = [
  {
    id: "works",
    name: "作品",
    icon: "🎨",
    description: "ポートフォリオ作品の管理",
    fields: [
      { name: "title", label: "タイトル", type: "text", required: true },
      { name: "description", label: "説明", type: "textarea" },
      { name: "image", label: "画像", type: "image" },
      { name: "link", label: "外部リンク", type: "url" },
      { name: "content", label: "詳細（Markdown）", type: "markdown" },
    ],
  },
  {
    id: "news",
    name: "お知らせ",
    icon: "📰",
    description: "ニュース・ブログ記事の管理",
    fields: [
      { name: "title", label: "タイトル", type: "text", required: true },
      { name: "summary", label: "概要", type: "textarea" },
      { name: "content", label: "本文（Markdown）", type: "markdown", required: true },
      { name: "thumbnail", label: "サムネイル", type: "image" },
    ],
  },
  {
    id: "pricing",
    name: "料金設定",
    icon: "💰",
    description: "制作料金の管理",
    singleton: true,
    fields: [
      {
        name: "baseDescription",
        label: "基本料金の説明",
        type: "textarea",
        placeholder: "例: 依頼者さんの求める世界観に合わせてホームページを作ります...",
      },
      {
        name: "baseRates",
        label: "基本料金に含まれる項目",
        type: "array",
        required: true,
        itemFields: [
          { name: "name", label: "項目名", type: "text", required: true },
          { name: "description", label: "説明", type: "textarea" },
        ],
      },
      {
        name: "basePrice",
        label: "基本料金（円）",
        type: "number",
        required: true,
        placeholder: "例: 40000",
      },
      {
        name: "options",
        label: "追加オプション",
        type: "array",
        itemFields: [
          { name: "name", label: "オプション名", type: "text", required: true },
          { name: "price", label: "料金", type: "number", required: true },
          { name: "unit", label: "単位", type: "text" },
          { name: "description", label: "説明", type: "textarea" },
        ],
      },
      {
        name: "siteTypeExamples",
        label: "サイトタイプ別の目安",
        type: "array",
        itemFields: [
          { name: "type", label: "サイトタイプ", type: "text", required: true },
          { name: "priceRange", label: "価格帯", type: "text", required: true, placeholder: "例: ¥50,000〜" },
          { name: "description", label: "説明", type: "textarea", placeholder: "例: ゲーム紹介・キャラクター・ストーリー等" },
        ],
      },
    ],
  },
];

export function getCategoryById(id: string) {
  return CMS_CATEGORIES.find((cat) => cat.id === id);
}
