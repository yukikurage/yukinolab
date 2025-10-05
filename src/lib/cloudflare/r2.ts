/**
 * R2ストレージ操作ヘルパー
 */

export interface UploadOptions {
  /**
   * アップロード先のプレフィックス
   * 例: "uploads", "images"
   */
  prefix?: string;

  /**
   * Content-Type
   * 指定しない場合はファイルのtypeを使用
   */
  contentType?: string;

  /**
   * カスタムファイル名
   * 指定しない場合はタイムスタンプ + 元のファイル名
   */
  filename?: string;
}

export interface UploadResult {
  /**
   * R2に保存されたキー
   */
  key: string;

  /**
   * 公開URL
   */
  url: string;
}

/**
 * ユニークなファイル名を生成
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  return `${timestamp}-${originalName}`;
}

/**
 * ファイルをR2にアップロード
 */
export async function uploadFile(
  bucket: R2Bucket,
  file: File,
  bucketUrl: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    prefix = "uploads",
    contentType = file.type,
    filename = generateUniqueFilename(file.name),
  } = options;

  const key = `${prefix}/${filename}`;

  // R2にアップロード
  await bucket.put(key, file.stream(), {
    httpMetadata: {
      contentType,
    },
  });

  // 公開URLを生成
  const url = `${bucketUrl}/${key}`;

  return {
    key,
    url,
  };
}

/**
 * R2からファイルを削除
 */
export async function deleteFile(
  bucket: R2Bucket,
  key: string
): Promise<void> {
  await bucket.delete(key);
}
