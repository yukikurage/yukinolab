import { createGetHandler } from "@/lib/cms/api-factory";

// GET /api/content/[category]/[id] - 個別取得
export const GET = createGetHandler();
