/**
 * KV操作ヘルパー
 * カテゴリ:ID形式のキー管理を提供
 */

/**
 * KVキーを生成
 * @param category カテゴリ名
 * @param id アイテムID
 * @returns "category:id" 形式のキー
 */
export function createKVKey(category: string, id: string): string {
  return `${category}:${id}`;
}

/**
 * KVキーからカテゴリとIDを抽出
 * @param key "category:id" 形式のキー
 * @returns {category, id}
 */
export function parseKVKey(key: string): { category: string; id: string } {
  const [category, ...idParts] = key.split(":");
  return {
    category,
    id: idParts.join(":"),
  };
}

/**
 * カテゴリ内の全アイテムを取得
 */
export async function listByCategory<T = Record<string, unknown>>(
  kv: KVNamespace,
  category: string
): Promise<Array<T & { id: string }>> {
  const list = await kv.list({ prefix: `${category}:` });

  const items = await Promise.all(
    list.keys.map(async (key: { name: string }) => {
      const value = (await kv.get(key.name, "json")) as T | null;
      const { id } = parseKVKey(key.name);

      return {
        id,
        ...value,
      } as T & { id: string };
    })
  );

  return items;
}

/**
 * 単一アイテムを取得
 */
export async function getItem<T = Record<string, unknown>>(
  kv: KVNamespace,
  category: string,
  id: string
): Promise<T | null> {
  const key = createKVKey(category, id);
  return (await kv.get(key, "json")) as T | null;
}

/**
 * アイテムを作成・更新
 */
export async function putItem<T = Record<string, unknown>>(
  kv: KVNamespace,
  category: string,
  id: string,
  value: T
): Promise<void> {
  const key = createKVKey(category, id);
  await kv.put(key, JSON.stringify(value));
}

/**
 * アイテムを削除
 */
export async function deleteItem(
  kv: KVNamespace,
  category: string,
  id: string
): Promise<void> {
  const key = createKVKey(category, id);
  await kv.delete(key);
}
