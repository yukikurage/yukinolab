/**
 * CMSの型定義
 * 再利用可能なCMSライブラリの基礎となる型
 */

/**
 * CMSフィールドの型
 */
export type CMSFieldType =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "markdown"
  | "number"
  | "array";

/**
 * CMSフィールド定義
 */
export interface CMSField {
  /**
   * フィールド名（プログラムで使用）
   */
  name: string;

  /**
   * フィールドのラベル（UI表示用）
   */
  label: string;

  /**
   * フィールドの型
   */
  type: CMSFieldType;

  /**
   * 必須フィールドかどうか
   */
  required?: boolean;

  /**
   * プレースホルダーテキスト
   */
  placeholder?: string;

  /**
   * 配列型の場合のアイテムフィールド定義
   */
  itemFields?: CMSField[];
}

/**
 * CMSカテゴリ定義
 */
export interface CMSCategory {
  /**
   * カテゴリID（プログラムで使用、URLに含まれる）
   */
  id: string;

  /**
   * カテゴリ名（UI表示用）
   */
  name: string;

  /**
   * アイコン（絵文字など）
   */
  icon: string;

  /**
   * 説明文
   */
  description: string;

  /**
   * フィールド定義のリスト
   */
  fields: CMSField[];

  /**
   * シングルトンかどうか
   * trueの場合、単一のドキュメントのみを管理（例: サイト設定）
   * falseの場合、複数のアイテムを管理（例: ブログ記事）
   */
  singleton?: boolean;
}

/**
 * CMS設定
 */
export interface CMSConfig {
  /**
   * カテゴリのリスト
   */
  categories: CMSCategory[];
}
