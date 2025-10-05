import { createListHandler } from "@/lib/cms/api-factory";

// GET /api/content/[category] - カテゴリ全体の一覧取得
export const GET = createListHandler();
